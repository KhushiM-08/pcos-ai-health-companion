import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { db, symptomChecksTable } from "@workspace/db";
import { CheckSymptomsBody } from "@workspace/api-zod";

const router: IRouter = Router();

function analyzeSymptoms(body: {
  irregularPeriods: boolean;
  acne: boolean;
  excessHairGrowth: boolean;
  weightGain: boolean;
  hairLoss: boolean;
  fatigue: boolean;
  moodSwings: boolean;
  pelvicPain: boolean;
}): { riskLevel: "low" | "medium" | "high"; score: number; suggestions: string[] } {
  let score = 0;
  const suggestions: string[] = [];

  if (body.irregularPeriods) { score += 2; suggestions.push("Track your cycle carefully and consult a gynecologist for cycle regulation options."); }
  if (body.acne) { score += 1; suggestions.push("Consider a skincare routine and discuss hormonal acne treatment with your doctor."); }
  if (body.excessHairGrowth) { score += 2; suggestions.push("Excess hair growth can be a sign of elevated androgens — talk to your doctor about hormone testing."); }
  if (body.weightGain) { score += 1; suggestions.push("Maintain a balanced diet low in refined carbs and include regular physical activity."); }
  if (body.hairLoss) { score += 1; suggestions.push("Hair loss may be related to hormone imbalances — consider iron and vitamin D testing."); }
  if (body.fatigue) { score += 1; suggestions.push("Prioritize quality sleep of 7–9 hours and consider checking thyroid levels."); }
  if (body.moodSwings) { score += 1; suggestions.push("Mindfulness, yoga, and reducing stress can help stabilize mood with PCOS."); }
  if (body.pelvicPain) { score += 2; suggestions.push("Pelvic pain should be evaluated by a gynecologist to rule out ovarian cysts or endometriosis."); }

  suggestions.push("Maintain a diet rich in whole foods, fiber, and anti-inflammatory foods.");
  suggestions.push("Regular exercise (150 min/week) helps improve insulin sensitivity in PCOS.");

  let riskLevel: "low" | "medium" | "high" = "low";
  if (score >= 7) riskLevel = "high";
  else if (score >= 3) riskLevel = "medium";

  return { riskLevel, score, suggestions };
}

function serializeCheck(check: typeof symptomChecksTable.$inferSelect) {
  return {
    id: check.id,
    riskLevel: check.riskLevel as "low" | "medium" | "high",
    score: check.score,
    suggestions: check.suggestions,
    symptoms: {
      irregularPeriods: check.irregularPeriods,
      acne: check.acne,
      excessHairGrowth: check.excessHairGrowth,
      weightGain: check.weightGain,
      hairLoss: check.hairLoss,
      fatigue: check.fatigue,
      moodSwings: check.moodSwings,
      pelvicPain: check.pelvicPain,
    },
    checkedAt: check.checkedAt.toISOString(),
  };
}

router.post("/symptoms/check", async (req, res): Promise<void> => {
  const parsed = CheckSymptomsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { riskLevel, score, suggestions } = analyzeSymptoms(parsed.data);

  const [check] = await db.insert(symptomChecksTable).values({
    riskLevel,
    score,
    suggestions,
    irregularPeriods: parsed.data.irregularPeriods,
    acne: parsed.data.acne,
    excessHairGrowth: parsed.data.excessHairGrowth,
    weightGain: parsed.data.weightGain,
    hairLoss: parsed.data.hairLoss,
    fatigue: parsed.data.fatigue,
    moodSwings: parsed.data.moodSwings,
    pelvicPain: parsed.data.pelvicPain,
  }).returning();

  res.json(serializeCheck(check));
});

router.get("/symptoms/history", async (req, res): Promise<void> => {
  const checks = await db.select().from(symptomChecksTable).orderBy(desc(symptomChecksTable.checkedAt)).limit(20);
  res.json(checks.map(serializeCheck));
});

export default router;
