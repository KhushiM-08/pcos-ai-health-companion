import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, Plus, Trash2, TrendingUp, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import {
  useGetPeriods, useCreatePeriod, useDeletePeriod, useGetPeriodAnalysis,
  getGetPeriodsQueryKey, getGetPeriodAnalysisQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  notes: z.string().optional(),
});

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function Periods() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data: periods, isLoading } = useGetPeriods();
  const { data: analysis, isLoading: analysisLoading } = useGetPeriodAnalysis();
  const createPeriod = useCreatePeriod();
  const deletePeriod = useDeletePeriod();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { startDate: new Date().toISOString().split("T")[0], endDate: "", notes: "" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createPeriod.mutate(
      { data: { startDate: values.startDate, endDate: values.endDate || null, notes: values.notes || null } },
      {
        onSuccess: () => {
          toast({ title: "Period logged!", description: "Your cycle data has been saved." });
          queryClient.invalidateQueries({ queryKey: getGetPeriodsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetPeriodAnalysisQueryKey() });
          form.reset();
          setShowForm(false);
        },
        onError: () => toast({ title: "Error", description: "Could not log period.", variant: "destructive" }),
      }
    );
  }

  function handleDelete(id: number) {
    deletePeriod.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetPeriodsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetPeriodAnalysisQueryKey() });
        toast({ title: "Entry deleted" });
      },
    });
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
        <motion.div variants={item} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Period Tracker</h1>
            <p className="text-muted-foreground text-sm mt-1">Track your menstrual cycle and detect irregularities</p>
          </div>
          <Button className="rounded-2xl" size="sm" onClick={() => setShowForm(s => !s)} data-testid="button-log-period">
            <Plus className="h-4 w-4 mr-1" /> Log Period
          </Button>
        </motion.div>

        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} variants={item}>
            <Card className="rounded-2xl shadow-sm border-primary/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Log New Period</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="startDate" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="rounded-xl" data-testid="input-start-date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="endDate" render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date (optional)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="rounded-xl" data-testid="input-end-date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="flex gap-3">
                      <Button type="button" variant="outline" className="flex-1 rounded-2xl" onClick={() => setShowForm(false)}>Cancel</Button>
                      <Button type="submit" className="flex-1 rounded-2xl" disabled={createPeriod.isPending} data-testid="button-save-period">
                        {createPeriod.isPending ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Cycle Analysis */}
        <motion.div variants={item}>
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" /> Cycle Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysisLoading ? (
                <div className="space-y-2">{[1,2,3].map(i => <Skeleton key={i} className="h-10 w-full rounded-xl" />)}</div>
              ) : analysis ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/40 rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-primary">{analysis.averageCycleLength ?? "—"}</p>
                      <p className="text-xs text-muted-foreground">Avg cycle (days)</p>
                    </div>
                    <div className="bg-muted/40 rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-foreground">{analysis.totalCycles}</p>
                      <p className="text-xs text-muted-foreground">Cycles tracked</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 p-3 rounded-xl ${analysis.isRegular ? "bg-success/10" : "bg-warning/10"}`}>
                    {analysis.isRegular
                      ? <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                      : <AlertCircle className="h-4 w-4 text-warning flex-shrink-0" />}
                    <p className="text-sm font-medium">
                      {analysis.isRegular ? "Your cycle appears regular" : analysis.irregularityNote ?? "Irregular cycle detected"}
                    </p>
                  </div>
                  {analysis.predictedNextDate && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-accent/30">
                      <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                      <p className="text-sm">Predicted next period: <span className="font-semibold">{new Date(analysis.predictedNextDate).toLocaleDateString("en-US", { month: "long", day: "numeric" })}</span></p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No cycle data available yet. Start logging your periods.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Period History */}
        <motion.div variants={item}>
          <p className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Cycle History</p>
          {isLoading ? (
            <div className="space-y-2">{[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}</div>
          ) : periods && periods.length > 0 ? (
            <div className="space-y-2">
              {periods.map(p => (
                <motion.div key={p.id} layout className="flex items-center justify-between p-4 rounded-2xl bg-card border shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{new Date(p.startDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {p.endDate && <span className="text-xs text-muted-foreground">to {new Date(p.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>}
                        {p.cycleLength && <Badge variant="outline" className="text-xs h-4">{p.cycleLength}d cycle</Badge>}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    data-testid={`button-delete-period-${p.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-muted" />
              <p className="text-sm">No periods logged yet. Start tracking your cycle.</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
