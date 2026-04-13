import { Router } from "express";
import { db } from "@workspace/db";
import { doctorBookingsTable } from "@workspace/db/schema";
import { desc } from "drizzle-orm";

const router = Router();

router.post("/bookings/doctor", async (req, res) => {
  try {
    const { patientName, patientEmail, doctorName, specialty, bookingDate, bookingTime, issue, bookingType } = req.body;
    if (!patientName || !doctorName || !bookingDate || !bookingTime) {
      return res.status(400).json({ error: "Missing required booking fields" });
    }
    const [booking] = await db.insert(doctorBookingsTable).values({
      patientName,
      patientEmail: patientEmail ?? "",
      doctorName,
      specialty: specialty ?? "",
      bookingDate,
      bookingTime,
      issue: issue ?? "General consultation",
      bookingType: bookingType ?? "doctor",
    }).returning();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: "Failed to save booking" });
  }
});

router.get("/bookings", async (req, res) => {
  try {
    const bookings = await db.select().from(doctorBookingsTable).orderBy(desc(doctorBookingsTable.createdAt)).limit(50);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

export default router;
