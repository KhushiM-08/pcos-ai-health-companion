import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCheckSymptoms, useGetSymptomHistory, getGetSymptomHistoryQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

type SymptomKey = "irregularPeriods" | "acne" | "excessHairGrowth" | "weightGain" | "hairLoss" | "fatigue" | "moodSwings" | "pelvicPain";

const QUESTIONS: { key: SymptomKey; label: string; description: string }[] = [
  { key: "irregularPeriods", label: "Irregular or missed periods", description: "Your periods are unpredictable, late, or you've missed them for months." },
  { key: "acne", label: "Persistent acne", description: "Acne that doesn't respond well to typical treatments, especially around the chin and jaw." },
  { key: "excessHairGrowth", label: "Excess hair growth (hirsutism)", description: "Unwanted hair on the face, chest, back, or other areas where men typically grow hair." },
  { key: "weightGain", label: "Unexplained weight gain", description: "Difficulty losing weight or unexplained weight gain, especially around the abdomen." },
  { key: "hairLoss", label: "Hair thinning or loss", description: "Thinning hair or hair loss on the scalp, similar to male-pattern baldness." },
  { key: "fatigue", label: "Chronic fatigue", description: "Persistent tiredness or low energy that doesn't improve with rest." },
  { key: "moodSwings", label: "Mood swings or anxiety", description: "Frequent mood changes, anxiety, or feelings of depression." },
  { key: "pelvicPain", label: "Pelvic pain", description: "Pain or discomfort in the pelvic area, especially around your period." },
];

type SymptomState = Record<SymptomKey, boolean>;

const initialState: SymptomState = {
  irregularPeriods: false, acne: false, excessHairGrowth: false, weightGain: false,
  hairLoss: false, fatigue: false, moodSwings: false, pelvicPain: false,
};

const riskColors = { low: "text-success bg-success/10 border-success/30", medium: "text-warning bg-warning/10 border-warning/30", high: "text-destructive bg-destructive/10 border-destructive/30" };
const riskIcons = { low: <CheckCircle2 className="h-8 w-8 text-success" />, medium: <AlertTriangle className="h-8 w-8 text-warning" />, high: <AlertCircle className="h-8 w-8 text-destructive" /> };

export default function Symptoms() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<SymptomState>(initialState);
  const [result, setResult] = useState<{ riskLevel: "low"|"medium"|"high"; suggestions: string[] } | null>(null);
  const checkSymptoms = useCheckSymptoms();
  const queryClient = useQueryClient();
  const { data: history, isLoading: historyLoading } = useGetSymptomHistory();

  const currentQ = QUESTIONS[step];
  const totalSteps = QUESTIONS.length;

  function toggle(key: SymptomKey) {
    setAnswers(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function next() {
    if (step < totalSteps - 1) {
      setStep(s => s + 1);
    } else {
      checkSymptoms.mutate({ data: answers }, {
        onSuccess: (res) => {
          setResult({ riskLevel: res.riskLevel, suggestions: res.suggestions });
          queryClient.invalidateQueries({ queryKey: getGetSymptomHistoryQueryKey() });
        },
      });
    }
  }

  function reset() {
    setStep(0);
    setAnswers(initialState);
    setResult(null);
  }

  if (result) {
    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          <div>
            <h1 className="text-2xl font-bold">Your Results</h1>
            <p className="text-muted-foreground text-sm mt-1">Based on your symptom profile</p>
          </div>

          <Card className={`rounded-2xl border-2 ${riskColors[result.riskLevel]}`}>
            <CardContent className="pt-6 text-center space-y-3">
              <div className="flex justify-center">{riskIcons[result.riskLevel]}</div>
              <div>
                <p className="text-sm uppercase tracking-wide font-medium">Risk Level</p>
                <p className="text-3xl font-bold capitalize">{result.riskLevel}</p>
              </div>
              {result.riskLevel === "high" && (
                <p className="text-sm">We recommend consulting a healthcare professional soon.</p>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Personalized Suggestions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.suggestions.map((s, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/40">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{s}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Button onClick={reset} className="w-full rounded-2xl" data-testid="button-retake">
            Check Again
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Symptom Checker</h1>
          <p className="text-muted-foreground text-sm mt-1">Answer a few questions to assess your PCOS risk level</p>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Question {step + 1} of {totalSteps}</span>
            <span>{Math.round(((step + 1) / totalSteps) * 100)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="rounded-2xl shadow-sm min-h-52">
              <CardContent className="pt-8 pb-8 space-y-6">
                <div className="text-center space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Symptom {step + 1}</p>
                  <h2 className="text-xl font-semibold">{currentQ.label}</h2>
                  <p className="text-muted-foreground text-sm">{currentQ.description}</p>
                </div>
                <div className="flex gap-4 justify-center">
                  <button
                    data-testid={`button-yes`}
                    onClick={() => { setAnswers(prev => ({ ...prev, [currentQ.key]: true })); }}
                    className={`flex-1 max-w-36 py-4 rounded-2xl border-2 font-semibold transition-all ${
                      answers[currentQ.key] ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-primary/50"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    data-testid={`button-no`}
                    onClick={() => { setAnswers(prev => ({ ...prev, [currentQ.key]: false })); }}
                    className={`flex-1 max-w-36 py-4 rounded-2xl border-2 font-semibold transition-all ${
                      !answers[currentQ.key] ? "border-muted bg-muted text-muted-foreground" : "border-border bg-card text-foreground hover:border-muted"
                    }`}
                  >
                    No
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-3">
          <Button variant="outline" className="rounded-2xl" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} data-testid="button-prev">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <Button className="flex-1 rounded-2xl" onClick={next} disabled={checkSymptoms.isPending} data-testid="button-next">
            {step === totalSteps - 1 ? (checkSymptoms.isPending ? "Analyzing..." : "See Results") : "Next"}
            {step < totalSteps - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
          </Button>
        </div>

        {/* History */}
        {!historyLoading && history && history.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-3">Previous Checks</p>
            <div className="space-y-2">
              {history.slice(0, 3).map(h => (
                <div key={h.id} className="flex items-center justify-between p-3 rounded-xl border">
                  <span className="text-sm">{new Date(h.checkedAt).toLocaleDateString()}</span>
                  <Badge variant={h.riskLevel === "high" ? "destructive" : h.riskLevel === "medium" ? "secondary" : "outline"} className="capitalize">
                    {h.riskLevel} risk
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
        {historyLoading && <Skeleton className="h-24 w-full rounded-xl" />}
      </div>
    </div>
  );
}
