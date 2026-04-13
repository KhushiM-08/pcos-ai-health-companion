import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Droplets, Activity, Smile, Meh, Frown, Plus, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import {
  useGetTrackerEntries, useCreateTrackerEntry, getGetTrackerEntriesQueryKey, getGetTrackerSummaryQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  waterIntakeLiters: z.number().min(0).max(10),
  exerciseMinutes: z.number().min(0).max(300),
  mood: z.enum(["happy", "neutral", "sad"]),
  symptoms: z.array(z.string()),
  notes: z.string().optional(),
});

const COMMON_SYMPTOMS = ["Acne", "Fatigue", "Bloating", "Mood swings", "Hair loss", "Cramps", "Headache", "Weight gain", "Excess hair", "Irregular period"];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function Tracker() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const today = new Date().toISOString().split("T")[0];
  const [submitted, setSubmitted] = useState(false);

  const { data: entries, isLoading } = useGetTrackerEntries({ startDate: today, endDate: today }, {
    query: { queryKey: getGetTrackerEntriesQueryKey({ startDate: today, endDate: today }) }
  });

  const createEntry = useCreateTrackerEntry();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      waterIntakeLiters: 2.0,
      exerciseMinutes: 30,
      mood: "neutral",
      symptoms: [],
      notes: "",
    },
  });

  const todayEntry = entries?.[0];

  function onSubmit(values: z.infer<typeof formSchema>) {
    createEntry.mutate(
      {
        data: {
          date: today,
          waterIntakeLiters: values.waterIntakeLiters,
          exerciseMinutes: values.exerciseMinutes,
          mood: values.mood,
          symptoms: values.symptoms,
          notes: values.notes ?? null,
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Logged successfully!", description: "Your daily health data has been saved." });
          queryClient.invalidateQueries({ queryKey: getGetTrackerEntriesQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetTrackerSummaryQueryKey() });
          setSubmitted(true);
        },
        onError: () => {
          toast({ title: "Error", description: "Could not save your entry. Try again.", variant: "destructive" });
        },
      }
    );
  }

  const watchedMood = form.watch("mood");
  const watchedWater = form.watch("waterIntakeLiters");
  const watchedExercise = form.watch("exerciseMinutes");
  const watchedSymptoms = form.watch("symptoms");

  if (submitted || todayEntry) {
    const entry = submitted ? null : todayEntry;
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-success/30 to-emerald-300/20 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-success/20">
            <CheckCircle2 className="h-12 w-12 text-success" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Today logged! 🎉</h2>
          <p className="text-muted-foreground text-sm mb-8">Your health data for today has been recorded.</p>
          {entry && (
            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-8">
              <div className="rounded-2xl p-4 text-center bg-gradient-to-br from-blue-400/20 to-cyan-300/15 border border-blue-200/50">
                <Droplets className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                <p className="text-xl font-bold text-blue-600">{entry.waterIntakeLiters}L</p>
                <p className="text-xs text-muted-foreground">Water</p>
              </div>
              <div className="rounded-2xl p-4 text-center bg-gradient-to-br from-emerald-400/20 to-green-300/15 border border-emerald-200/50">
                <Activity className="h-6 w-6 text-emerald-500 mx-auto mb-1" />
                <p className="text-xl font-bold text-emerald-600">{entry.exerciseMinutes}m</p>
                <p className="text-xs text-muted-foreground">Exercise</p>
              </div>
              <div className="rounded-2xl p-4 text-center bg-gradient-to-br from-primary/20 to-purple-300/15 border border-primary/25">
                <Smile className="h-6 w-6 text-primary mx-auto mb-1" />
                <p className="text-xl font-bold text-primary capitalize">{entry.mood}</p>
                <p className="text-xs text-muted-foreground">Mood</p>
              </div>
            </div>
          )}
          <Button onClick={() => setSubmitted(false)} variant="outline" className="rounded-2xl px-8">
            Update Log
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
        <motion.div variants={item}>
          <h1 className="text-2xl font-bold tracking-tight">Daily Tracker</h1>
          <p className="text-muted-foreground text-sm mt-1">Log today's health data — {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
        </motion.div>

        {isLoading ? (
          <Skeleton className="h-64 w-full rounded-2xl" />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Water Intake */}
              <motion.div variants={item}>
                <Card className="rounded-2xl shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-blue-500" /> Water Intake
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField control={form.control} name="waterIntakeLiters" render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-3xl font-bold text-blue-500">{watchedWater.toFixed(1)}L</span>
                              <span className="text-sm text-muted-foreground">Goal: 2.5L</span>
                            </div>
                            <Slider
                              min={0} max={5} step={0.1}
                              value={[field.value]}
                              onValueChange={([v]) => field.onChange(v)}
                              className="w-full"
                              data-testid="slider-water"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>0L</span><span>2.5L</span><span>5L</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Exercise */}
              <motion.div variants={item}>
                <Card className="rounded-2xl shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Activity className="h-4 w-4 text-green-500" /> Exercise
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField control={form.control} name="exerciseMinutes" render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-3xl font-bold text-green-500">{watchedExercise} min</span>
                              <span className="text-sm text-muted-foreground">Goal: 30 min</span>
                            </div>
                            <Slider
                              min={0} max={180} step={5}
                              value={[field.value]}
                              onValueChange={([v]) => field.onChange(v)}
                              data-testid="slider-exercise"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>0</span><span>30</span><span>60</span><span>90+</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Mood */}
              <motion.div variants={item}>
                <Card className="rounded-2xl shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Mood</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField control={form.control} name="mood" render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex gap-3">
                            {[
                              { value: "happy", label: "Happy", icon: <Smile className="h-6 w-6" />, color: "border-success bg-success/10 text-success" },
                              { value: "neutral", label: "Neutral", icon: <Meh className="h-6 w-6" />, color: "border-warning bg-warning/10 text-warning" },
                              { value: "sad", label: "Sad", icon: <Frown className="h-6 w-6" />, color: "border-destructive bg-destructive/10 text-destructive" },
                            ].map((mood) => (
                              <button
                                key={mood.value}
                                type="button"
                                data-testid={`button-mood-${mood.value}`}
                                onClick={() => field.onChange(mood.value)}
                                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                                  watchedMood === mood.value ? mood.color : "border-border bg-muted/30 text-muted-foreground"
                                }`}
                              >
                                {mood.icon}
                                <span className="text-sm font-medium">{mood.label}</span>
                              </button>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Symptoms */}
              <motion.div variants={item}>
                <Card className="rounded-2xl shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Plus className="h-4 w-4 text-primary" /> Symptoms Today
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField control={form.control} name="symptoms" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-muted-foreground">Tap to select any symptoms you experienced</FormLabel>
                        <FormControl>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {COMMON_SYMPTOMS.map((symptom) => {
                              const selected = watchedSymptoms.includes(symptom);
                              return (
                                <button
                                  key={symptom}
                                  type="button"
                                  data-testid={`button-symptom-${symptom}`}
                                  onClick={() => {
                                    field.onChange(
                                      selected ? watchedSymptoms.filter(s => s !== symptom) : [...watchedSymptoms, symptom]
                                    );
                                  }}
                                >
                                  <Badge variant={selected ? "default" : "outline"} className="cursor-pointer rounded-full text-xs px-3 py-1">
                                    {symptom}
                                  </Badge>
                                </button>
                              );
                            })}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Notes */}
              <motion.div variants={item}>
                <Card className="rounded-2xl shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Notes (optional)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField control={form.control} name="notes" render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="How are you feeling? Any observations about your body today?"
                            className="rounded-xl resize-none"
                            rows={3}
                            {...field}
                            data-testid="input-notes"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={item}>
                <Button
                  type="submit"
                  className="w-full rounded-2xl py-6 text-base font-semibold"
                  disabled={createEntry.isPending}
                  data-testid="button-submit"
                >
                  {createEntry.isPending ? "Saving..." : "Save Today's Log"}
                </Button>
              </motion.div>
            </form>
          </Form>
        )}
      </motion.div>
    </div>
  );
}
