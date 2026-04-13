import { Router, type IRouter } from "express";
import { eq, gte, lte, and, desc } from "drizzle-orm";
import { db, trackerEntriesTable } from "@workspace/db";
import {
  GetTrackerEntriesQueryParams,
  CreateTrackerEntryBody,
  UpdateTrackerEntryParams,
  UpdateTrackerEntryBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

function computeHealthScore(water: number, exercise: number, mood: string, symptoms: string[]): number {
  let score = 50;
  if (water >= 2.5) score += 15;
  else if (water >= 2) score += 10;
  else if (water >= 1.5) score += 5;
  else score -= 5;

  if (exercise >= 45) score += 20;
  else if (exercise >= 30) score += 15;
  else if (exercise >= 15) score += 8;
  else score -= 5;

  if (mood === "happy") score += 10;
  else if (mood === "neutral") score += 5;
  else score -= 5;

  score -= symptoms.length * 3;

  return Math.max(0, Math.min(100, score));
}

function serializeEntry(entry: typeof trackerEntriesTable.$inferSelect) {
  return {
    id: entry.id,
    date: entry.date,
    waterIntakeLiters: entry.waterIntakeLiters,
    exerciseMinutes: entry.exerciseMinutes,
    mood: entry.mood,
    symptoms: entry.symptoms,
    notes: entry.notes ?? null,
    healthScore: entry.healthScore,
    createdAt: entry.createdAt.toISOString(),
  };
}

router.get("/tracker/entries", async (req, res): Promise<void> => {
  const params = GetTrackerEntriesQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const conditions = [];
  if (params.data.startDate) conditions.push(gte(trackerEntriesTable.date, params.data.startDate));
  if (params.data.endDate) conditions.push(lte(trackerEntriesTable.date, params.data.endDate));

  const entries = await db.select().from(trackerEntriesTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(trackerEntriesTable.date));

  res.json(entries.map(serializeEntry));
});

router.post("/tracker/entries", async (req, res): Promise<void> => {
  const parsed = CreateTrackerEntryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const healthScore = computeHealthScore(
    parsed.data.waterIntakeLiters,
    parsed.data.exerciseMinutes,
    parsed.data.mood,
    parsed.data.symptoms,
  );

  const [entry] = await db.insert(trackerEntriesTable).values({
    date: parsed.data.date,
    waterIntakeLiters: parsed.data.waterIntakeLiters,
    exerciseMinutes: parsed.data.exerciseMinutes,
    mood: parsed.data.mood,
    symptoms: parsed.data.symptoms,
    notes: parsed.data.notes ?? null,
    healthScore,
  }).returning();

  res.status(201).json(serializeEntry(entry));
});

router.patch("/tracker/entries/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateTrackerEntryParams.safeParse({ id: rawId });
  if (!params.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const parsed = UpdateTrackerEntryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const existing = await db.select().from(trackerEntriesTable).where(eq(trackerEntriesTable.id, params.data.id));
  if (!existing[0]) {
    res.status(404).json({ error: "Entry not found" });
    return;
  }

  const updateData: Record<string, unknown> = { ...parsed.data };
  const water = parsed.data.waterIntakeLiters ?? existing[0].waterIntakeLiters;
  const exercise = parsed.data.exerciseMinutes ?? existing[0].exerciseMinutes;
  const mood = parsed.data.mood ?? existing[0].mood;
  const symptoms = parsed.data.symptoms ?? existing[0].symptoms;
  updateData.healthScore = computeHealthScore(water, exercise, mood, symptoms);

  const [updated] = await db.update(trackerEntriesTable)
    .set(updateData)
    .where(eq(trackerEntriesTable.id, params.data.id))
    .returning();

  res.json(serializeEntry(updated));
});

router.get("/tracker/summary", async (req, res): Promise<void> => {
  const entries = await db.select().from(trackerEntriesTable).orderBy(desc(trackerEntriesTable.date));

  if (entries.length === 0) {
    res.json({
      healthScore: 50,
      avgWaterIntake: 0,
      avgExerciseMinutes: 0,
      dominantMood: "neutral",
      streak: 0,
      totalEntriesThisMonth: 0,
    });
    return;
  }

  const totalWater = entries.reduce((s, e) => s + e.waterIntakeLiters, 0);
  const totalExercise = entries.reduce((s, e) => s + e.exerciseMinutes, 0);
  const avgHealthScore = Math.round(entries.reduce((s, e) => s + e.healthScore, 0) / entries.length);

  const moodCounts: Record<string, number> = {};
  for (const e of entries) {
    moodCounts[e.mood] = (moodCounts[e.mood] ?? 0) + 1;
  }
  const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "neutral";

  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const thisMonthEntries = entries.filter(e => e.date.startsWith(thisMonth));

  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const found = entries.find(e => e.date === dateStr);
    if (found) streak++;
    else break;
  }

  res.json({
    healthScore: avgHealthScore,
    avgWaterIntake: Math.round((totalWater / entries.length) * 10) / 10,
    avgExerciseMinutes: Math.round(totalExercise / entries.length),
    dominantMood,
    streak,
    totalEntriesThisMonth: thisMonthEntries.length,
  });
});

export default router;
