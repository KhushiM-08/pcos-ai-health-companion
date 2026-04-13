import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";

export const doctorBookingsTable = pgTable("doctor_bookings", {
  id: serial("id").primaryKey(),
  patientName: text("patient_name").notNull(),
  patientEmail: text("patient_email").notNull(),
  doctorName: text("doctor_name").notNull(),
  specialty: text("specialty").notNull(),
  bookingDate: text("booking_date").notNull(),
  bookingTime: text("booking_time").notNull(),
  issue: text("issue").notNull(),
  bookingType: text("booking_type").notNull().default("doctor"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type DoctorBooking = typeof doctorBookingsTable.$inferSelect;
