import { pgTable, text, serial, integer, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const trackerEntriesTable = pgTable("tracker_entries", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(),
  waterIntakeLiters: real("water_intake_liters").notNull().default(0),
  exerciseMinutes: integer("exercise_minutes").notNull().default(0),
  mood: text("mood").notNull().default("neutral"),
  symptoms: text("symptoms").array().notNull().default([]),
  notes: text("notes"),
  healthScore: integer("health_score").notNull().default(50),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertTrackerEntrySchema = createInsertSchema(trackerEntriesTable).omit({ id: true, createdAt: true });
export type InsertTrackerEntry = z.infer<typeof insertTrackerEntrySchema>;
export type TrackerEntry = typeof trackerEntriesTable.$inferSelect;
