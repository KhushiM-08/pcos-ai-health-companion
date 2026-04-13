import { Router, type IRouter } from "express";
import { db, userProfilesTable } from "@workspace/db";
import { UpdateUserProfileBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/user/profile", async (req, res): Promise<void> => {
  const profiles = await db.select().from(userProfilesTable).limit(1);
  if (!profiles[0]) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }
  res.json({
    id: profiles[0].id,
    name: profiles[0].name,
    age: profiles[0].age,
    weight: profiles[0].weight,
    height: profiles[0].height,
    cycleRegularity: profiles[0].cycleRegularity,
    diagnosedWithPcos: profiles[0].diagnosedWithPcos,
    symptoms: profiles[0].symptoms,
    createdAt: profiles[0].createdAt.toISOString(),
  });
});

router.put("/user/profile", async (req, res): Promise<void> => {
  const parsed = UpdateUserProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const existing = await db.select().from(userProfilesTable).limit(1);

  if (!existing[0]) {
    const [created] = await db.insert(userProfilesTable).values({
      name: parsed.data.name ?? "User",
      age: parsed.data.age ?? 25,
      weight: parsed.data.weight ?? 60,
      height: parsed.data.height ?? 165,
      cycleRegularity: parsed.data.cycleRegularity ?? "unknown",
      diagnosedWithPcos: parsed.data.diagnosedWithPcos ?? false,
      symptoms: parsed.data.symptoms ?? [],
    }).returning();
    res.json({
      id: created.id,
      name: created.name,
      age: created.age,
      weight: created.weight,
      height: created.height,
      cycleRegularity: created.cycleRegularity,
      diagnosedWithPcos: created.diagnosedWithPcos,
      symptoms: created.symptoms,
      createdAt: created.createdAt.toISOString(),
    });
    return;
  }

  const updateData: Record<string, unknown> = {};
  if (parsed.data.name !== undefined) updateData.name = parsed.data.name;
  if (parsed.data.age !== undefined) updateData.age = parsed.data.age;
  if (parsed.data.weight !== undefined) updateData.weight = parsed.data.weight;
  if (parsed.data.height !== undefined) updateData.height = parsed.data.height;
  if (parsed.data.cycleRegularity !== undefined) updateData.cycleRegularity = parsed.data.cycleRegularity;
  if (parsed.data.diagnosedWithPcos !== undefined) updateData.diagnosedWithPcos = parsed.data.diagnosedWithPcos;
  if (parsed.data.symptoms !== undefined) updateData.symptoms = parsed.data.symptoms;

  const { eq } = await import("drizzle-orm");
  const [updated] = await db.update(userProfilesTable)
    .set(updateData)
    .where(eq(userProfilesTable.id, existing[0].id))
    .returning();

  res.json({
    id: updated.id,
    name: updated.name,
    age: updated.age,
    weight: updated.weight,
    height: updated.height,
    cycleRegularity: updated.cycleRegularity,
    diagnosedWithPcos: updated.diagnosedWithPcos,
    symptoms: updated.symptoms,
    createdAt: updated.createdAt.toISOString(),
  });
});

export default router;
