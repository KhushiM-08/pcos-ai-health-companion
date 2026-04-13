import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const symptomChecksTable = pgTable("symptom_checks", {
  id: serial("id").primaryKey(),
  riskLevel: text("risk_level").notNull(),
  score: integer("score").notNull(),
  suggestions: text("suggestions").array().notNull().default([]),
  irregularPeriods: boolean("irregular_periods").notNull().default(false),
  acne: boolean("acne").notNull().default(false),
  excessHairGrowth: boolean("excess_hair_growth").notNull().default(false),
  weightGain: boolean("weight_gain").notNull().default(false),
  hairLoss: boolean("hair_loss").notNull().default(false),
  fatigue: boolean("fatigue").notNull().default(false),
  moodSwings: boolean("mood_swings").notNull().default(false),
  pelvicPain: boolean("pelvic_pain").notNull().default(false),
  checkedAt: timestamp("checked_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertSymptomCheckSchema = createInsertSchema(symptomChecksTable).omit({ id: true, checkedAt: true });
export type InsertSymptomCheck = z.infer<typeof insertSymptomCheckSchema>;
export type SymptomCheck = typeof symptomChecksTable.$inferSelect;
