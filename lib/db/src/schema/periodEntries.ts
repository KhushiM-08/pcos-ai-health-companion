import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const periodEntriesTable = pgTable("period_entries", {
  id: serial("id").primaryKey(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  cycleLength: integer("cycle_length"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertPeriodEntrySchema = createInsertSchema(periodEntriesTable).omit({ id: true, createdAt: true });
export type InsertPeriodEntry = z.infer<typeof insertPeriodEntrySchema>;
export type PeriodEntry = typeof periodEntriesTable.$inferSelect;
