import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { db, trackerEntriesTable, symptomChecksTable, periodEntriesTable } from "@workspace/db";
import { SendChatMessageBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/recommendations", async (req, res): Promise<void> => {
  const recentEntries = await db.select().from(trackerEntriesTable)
    .orderBy(desc(trackerEntriesTable.date)).limit(7);

  const recs: Array<{
    id: number;
    category: string;
    title: string;
    description: string;
    priority: string;
    icon: string;
  }> = [];
  let id = 1;

  const avgWater = recentEntries.length > 0
    ? recentEntries.reduce((s, e) => s + e.waterIntakeLiters, 0) / recentEntries.length
    : 0;

  const avgExercise = recentEntries.length > 0
    ? recentEntries.reduce((s, e) => s + e.exerciseMinutes, 0) / recentEntries.length
    : 0;

  const sadMoodCount = recentEntries.filter(e => e.mood === "sad").length;

  if (avgWater < 2) {
    recs.push({
      id: id++,
      category: "hydration",
      title: "Increase Water Intake",
      description: "You've been drinking less than 2 liters per day. Proper hydration helps regulate hormones and reduce PCOS symptoms.",
      priority: "high",
      icon: "Droplets",
    });
  }

  if (avgExercise < 20) {
    recs.push({
      id: id++,
      category: "exercise",
      title: "Add More Movement",
      description: "Aim for at least 30 minutes of moderate exercise daily. Physical activity improves insulin sensitivity in PCOS.",
      priority: "high",
      icon: "Activity",
    });
  }

  if (sadMoodCount >= 3) {
    recs.push({
      id: id++,
      category: "mental_health",
      title: "Practice Mindfulness",
      description: "You've had several low-mood days recently. Try 10 minutes of daily meditation or deep breathing exercises.",
      priority: "medium",
      icon: "Heart",
    });
  }

  recs.push({
    id: id++,
    category: "nutrition",
    title: "Anti-Inflammatory Diet",
    description: "Include omega-3 rich foods, colorful vegetables, and whole grains to reduce inflammation associated with PCOS.",
    priority: "medium",
    icon: "Salad",
  });

  recs.push({
    id: id++,
    category: "sleep",
    title: "Prioritize Quality Sleep",
    description: "Aim for 7–9 hours of consistent sleep. Poor sleep disrupts hormones that regulate appetite and insulin.",
    priority: "medium",
    icon: "Moon",
  });

  recs.push({
    id: id++,
    category: "medical",
    title: "Regular Check-ups",
    description: "Schedule regular check-ups with your gynecologist and get blood work including insulin, androgen, and thyroid levels.",
    priority: "low",
    icon: "Stethoscope",
  });

  res.json(recs);
});

router.get("/recommendations/alerts", async (req, res): Promise<void> => {
  const alerts: Array<{
    id: number;
    type: string;
    title: string;
    message: string;
    severity: string;
    createdAt: string;
  }> = [];
  let id = 1;
  const now = new Date().toISOString();

  const recentEntries = await db.select().from(trackerEntriesTable)
    .orderBy(desc(trackerEntriesTable.date)).limit(7);

  const avgWater = recentEntries.length > 0
    ? recentEntries.reduce((s, e) => s + e.waterIntakeLiters, 0) / recentEntries.length
    : 0;

  const avgExercise = recentEntries.length > 0
    ? recentEntries.reduce((s, e) => s + e.exerciseMinutes, 0) / recentEntries.length
    : 0;

  if (avgWater < 1.5 && recentEntries.length > 0) {
    alerts.push({
      id: id++,
      type: "low_hydration",
      title: "Low Hydration Alert",
      message: "Your average water intake this week is below 1.5L. Staying hydrated is essential for hormone balance.",
      severity: "warning",
      createdAt: now,
    });
  }

  if (avgExercise < 15 && recentEntries.length > 0) {
    alerts.push({
      id: id++,
      type: "low_activity",
      title: "Low Activity Level",
      message: "You've been less active than recommended this week. Even a short daily walk can help manage PCOS symptoms.",
      severity: "warning",
      createdAt: now,
    });
  }

  const periods = await db.select().from(periodEntriesTable)
    .orderBy(desc(periodEntriesTable.startDate)).limit(1);

  if (periods[0]) {
    const lastPeriod = new Date(periods[0].startDate);
    const daysSince = Math.round((Date.now() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince > 45) {
      alerts.push({
        id: id++,
        type: "missed_cycle",
        title: "Possible Missed Cycle",
        message: `It has been ${daysSince} days since your last logged period. If you suspect a missed cycle, consider consulting your doctor.`,
        severity: "danger",
        createdAt: now,
      });
    }
  }

  const recentSymptoms = await db.select().from(symptomChecksTable)
    .orderBy(desc(symptomChecksTable.checkedAt)).limit(1);

  if (recentSymptoms[0]?.riskLevel === "high") {
    alerts.push({
      id: id++,
      type: "high_symptoms",
      title: "High Symptom Risk",
      message: "Your recent symptom check showed a high risk level. Please consult a healthcare professional.",
      severity: "danger",
      createdAt: now,
    });
  }

  res.json(alerts);
});

router.get("/reports/health-score-trend", async (req, res): Promise<void> => {
  const entries = await db.select().from(trackerEntriesTable)
    .orderBy(desc(trackerEntriesTable.date)).limit(30);

  const trend = entries.reverse().map(e => ({
    date: e.date,
    score: e.healthScore,
  }));

  res.json(trend);
});

router.get("/reports/symptom-trend", async (req, res): Promise<void> => {
  const checks = await db.select().from(symptomChecksTable)
    .orderBy(desc(symptomChecksTable.checkedAt)).limit(10);

  const trend = checks.reverse().map(c => ({
    date: c.checkedAt.toISOString().split("T")[0],
    symptomCount: c.score,
    riskLevel: c.riskLevel,
  }));

  res.json(trend);
});

const PCOS_RESPONSES: Record<string, string> = {
  diet: "For PCOS, a low-glycemic diet is highly recommended. Focus on whole grains, lean proteins, vegetables, and healthy fats. Avoid refined sugars and processed foods which can spike insulin levels.",
  exercise: "Regular exercise is one of the best ways to manage PCOS. Aim for 150 minutes of moderate activity per week. A mix of cardio and strength training helps improve insulin sensitivity and hormone balance.",
  period: "Irregular periods are one of the hallmark signs of PCOS. Tracking your cycle, maintaining a healthy weight, and managing stress can help regulate your menstrual cycle.",
  symptoms: "Common PCOS symptoms include irregular periods, acne, excess hair growth (hirsutism), hair thinning, weight gain, and mood changes. Not everyone experiences all symptoms.",
  fertility: "PCOS is a leading cause of infertility but many women with PCOS can conceive with proper medical support. Lifestyle changes, medications like Clomid or Letrozole, and in some cases IVF are options.",
  stress: "Chronic stress worsens PCOS symptoms by elevating cortisol, which disrupts hormonal balance. Yoga, meditation, deep breathing, and adequate sleep are excellent stress management strategies.",
  weight: "Weight management is important in PCOS as excess weight worsens insulin resistance. Even a 5-10% reduction in body weight can significantly improve symptoms.",
  insulin: "Insulin resistance affects 70-80% of women with PCOS. A low-glycemic diet, regular exercise, and sometimes metformin can help improve insulin sensitivity.",
  supplement: "Some supplements that may help PCOS include inositol (especially myo-inositol), vitamin D, magnesium, spearmint tea, and omega-3 fatty acids. Always consult your doctor before starting supplements.",
  acne: "PCOS-related acne is driven by elevated androgens. A skincare routine, dietary changes (reducing dairy and high-glycemic foods), and sometimes hormonal treatment can help.",
};

router.post("/chatbot/message", async (req, res): Promise<void> => {
  const parsed = SendChatMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const message = parsed.data.message.toLowerCase();
  let responseText = "I'm here to help with PCOS-related questions! You can ask me about diet, exercise, symptoms, periods, fertility, stress management, weight, insulin resistance, supplements, or acne.";
  const suggestions: string[] = [];

  let matched = false;
  for (const [keyword, response] of Object.entries(PCOS_RESPONSES)) {
    if (message.includes(keyword)) {
      responseText = response;
      matched = true;
      break;
    }
  }

  if (!matched) {
    if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
      responseText = "Hello! I'm your PCOS AI companion. I can answer questions about PCOS symptoms, diet, exercise, hormones, and lifestyle changes. What would you like to know?";
    } else if (message.includes("thank")) {
      responseText = "You're welcome! Remember, managing PCOS is a journey. Every small healthy choice adds up. Is there anything else I can help you with?";
    } else if (message.includes("help")) {
      responseText = "I can help you understand PCOS better. Try asking about: diet, exercise, symptoms, periods, fertility, stress management, weight, insulin resistance, supplements, or skin and acne.";
    }
  }

  if (!message.includes("diet") && !message.includes("nutrition")) {
    suggestions.push("What diet is best for PCOS?");
  }
  if (!message.includes("exercise")) {
    suggestions.push("How does exercise help with PCOS?");
  }
  if (!message.includes("supplement")) {
    suggestions.push("What supplements help with PCOS?");
  }

  res.json({
    message: responseText,
    suggestions: suggestions.slice(0, 3),
  });
});

export default router;
