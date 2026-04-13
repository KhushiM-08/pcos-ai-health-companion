import { useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Save, LogOut, Mail } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import {
  useGetUserProfile, useUpdateUserProfile, getGetUserProfileQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.coerce.number().min(10).max(100),
  weight: z.coerce.number().min(20).max(300),
  height: z.coerce.number().min(100).max(250),
  cycleRegularity: z.enum(["regular", "irregular", "unknown"]),
  diagnosedWithPcos: z.boolean(),
  symptoms: z.array(z.string()),
});

const SYMPTOM_OPTIONS = ["Irregular periods", "Acne", "Excess hair growth", "Weight gain", "Hair loss", "Fatigue", "Mood swings", "Pelvic pain", "Fertility issues", "Insulin resistance"];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function Profile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useGetUserProfile();
  const updateProfile = useUpdateUserProfile();
  const { user, logout } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name ?? "",
      age: 27,
      weight: 65,
      height: 165,
      cycleRegularity: "irregular",
      diagnosedWithPcos: true,
      symptoms: [],
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name,
        age: profile.age,
        weight: profile.weight,
        height: profile.height,
        cycleRegularity: profile.cycleRegularity as "regular" | "irregular" | "unknown",
        diagnosedWithPcos: profile.diagnosedWithPcos,
        symptoms: profile.symptoms,
      });
    }
  }, [profile, form]);

  const watchedSymptoms = form.watch("symptoms");

  function toggleSymptom(symptom: string) {
    const current = form.getValues("symptoms");
    form.setValue("symptoms", current.includes(symptom) ? current.filter(s => s !== symptom) : [...current, symptom]);
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateProfile.mutate({ data: values }, {
      onSuccess: () => {
        toast({ title: "Profile updated!", description: "Your health profile has been saved." });
        queryClient.invalidateQueries({ queryKey: getGetUserProfileQueryKey() });
      },
      onError: () => toast({ title: "Error", description: "Could not update profile.", variant: "destructive" }),
    });
  }

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
        <motion.div variants={item} className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-300/30">
            <span className="text-white text-2xl font-bold">{(user?.name ?? "U").charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{user?.name ?? profile?.name ?? "Your Profile"}</h1>
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-0.5">
              <Mail className="h-3.5 w-3.5" />
              <span>{user?.email}</span>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50 text-sm font-medium transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </motion.div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Basic Info */}
            <motion.div variants={item}>
              <Card className="rounded-2xl shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Your name" className="rounded-xl" data-testid="input-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-3 gap-3">
                    <FormField control={form.control} name="age" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" placeholder="25" className="rounded-xl" data-testid="input-age" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="weight" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" placeholder="60" className="rounded-xl" data-testid="input-weight" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="height" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height (cm)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" placeholder="165" className="rounded-xl" data-testid="input-height" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Cycle & Diagnosis */}
            <motion.div variants={item}>
              <Card className="rounded-2xl shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Cycle & Diagnosis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="cycleRegularity" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cycle Regularity</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl" data-testid="select-cycle">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="regular">Regular</SelectItem>
                          <SelectItem value="irregular">Irregular</SelectItem>
                          <SelectItem value="unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="diagnosedWithPcos" render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-xl bg-muted/40 p-4">
                      <div>
                        <FormLabel className="cursor-pointer">Diagnosed with PCOS/PCOD</FormLabel>
                        <FormDescription className="text-xs">Have you been formally diagnosed?</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-pcos" />
                      </FormControl>
                    </FormItem>
                  )} />
                </CardContent>
              </Card>
            </motion.div>

            {/* Symptoms */}
            <motion.div variants={item}>
              <Card className="rounded-2xl shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Known Symptoms</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-3">Select all symptoms you experience</p>
                  <div className="flex flex-wrap gap-2">
                    {SYMPTOM_OPTIONS.map(symptom => {
                      const selected = watchedSymptoms.includes(symptom);
                      return (
                        <button
                          key={symptom}
                          type="button"
                          onClick={() => toggleSymptom(symptom)}
                          data-testid={`button-symptom-${symptom}`}
                        >
                          <Badge variant={selected ? "default" : "outline"} className="cursor-pointer rounded-full px-3 py-1 text-xs">
                            {symptom}
                          </Badge>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Button
                type="submit"
                className="w-full rounded-2xl py-6 text-base font-semibold"
                disabled={updateProfile.isPending}
                data-testid="button-save-profile"
              >
                <Save className="h-4 w-4 mr-2" />
                {updateProfile.isPending ? "Saving..." : "Save Profile"}
              </Button>
            </motion.div>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}
