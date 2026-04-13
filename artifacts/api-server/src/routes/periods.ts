import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, periodEntriesTable } from "@workspace/db";
import { CreatePeriodBody, DeletePeriodParams } from "@workspace/api-zod";

const router: IRouter = Router();

function serializePeriod(p: typeof periodEntriesTable.$inferSelect) {
  return {
    id: p.id,
    startDate: p.startDate,
    endDate: p.endDate ?? null,
    cycleLength: p.cycleLength ?? null,
    notes: p.notes ?? null,
    createdAt: p.createdAt.toISOString(),
  };
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a);
  const db2 = new Date(b);
  return Math.round(Math.abs(db2.getTime() - da.getTime()) / (1000 * 60 * 60 * 24));
}

router.get("/periods", async (req, res): Promise<void> => {
  const periods = await db.select().from(periodEntriesTable).orderBy(desc(periodEntriesTable.startDate));
  res.json(periods.map(serializePeriod));
});

router.post("/periods", async (req, res): Promise<void> => {
  const parsed = CreatePeriodBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const previous = await db.select().from(periodEntriesTable)
    .orderBy(desc(periodEntriesTable.startDate))
    .limit(1);

  let cycleLength: number | null = null;
  if (previous[0]) {
    cycleLength = daysBetween(previous[0].startDate, parsed.data.startDate);
  }

  const [period] = await db.insert(periodEntriesTable).values({
    startDate: parsed.data.startDate,
    endDate: parsed.data.endDate ?? null,
    cycleLength,
    notes: parsed.data.notes ?? null,
  }).returning();

  res.status(201).json(serializePeriod(period));
});

router.delete("/periods/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeletePeriodParams.safeParse({ id: rawId });
  if (!params.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const [deleted] = await db.delete(periodEntriesTable)
    .where(eq(periodEntriesTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Period not found" });
    return;
  }

  res.sendStatus(204);
});

router.get("/periods/analysis", async (req, res): Promise<void> => {
  const periods = await db.select().from(periodEntriesTable).orderBy(desc(periodEntriesTable.startDate));

  if (periods.length === 0) {
    res.json({
      averageCycleLength: null,
      isRegular: false,
      lastPeriodDate: null,
      predictedNextDate: null,
      totalCycles: 0,
      irregularityNote: "No period data available yet.",
    });
    return;
  }

  const cycleLengths = periods.filter(p => p.cycleLength !== null).map(p => p.cycleLength as number);
  let averageCycleLength: number | null = null;
  let predictedNextDate: string | null = null;
  let isRegular = false;
  let irregularityNote: string | null = null;

  if (cycleLengths.length > 0) {
    averageCycleLength = Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length);
    const maxDiff = Math.max(...cycleLengths) - Math.min(...cycleLengths);
    isRegular = maxDiff <= 7;

    if (!isRegular) {
      irregularityNote = `Your cycle length varies by ${maxDiff} days, which may indicate irregularity. Consider tracking symptoms and consulting your doctor.`;
    }

    const lastDate = new Date(periods[0].startDate);
    lastDate.setDate(lastDate.getDate() + averageCycleLength);
    predictedNextDate = lastDate.toISOString().split("T")[0];
  }

  res.json({
    averageCycleLength,
    isRegular,
    lastPeriodDate: periods[0]?.startDate ?? null,
    predictedNextDate,
    totalCycles: periods.length,
    irregularityNote,
  });
});

export default router;
