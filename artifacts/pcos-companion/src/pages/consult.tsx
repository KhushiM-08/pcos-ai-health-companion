import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Calendar, Clock, CheckCircle2, X, ChevronRight, Video, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };

const doctors = [
  {
    id: 1,
    name: "Dr. Priya Sharma",
    specialty: "Gynecologist & PCOS Specialist",
    experience: "14 years",
    rating: 4.9,
    reviews: 312,
    fee: "₹800",
    available: ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"],
    tags: ["PCOS Expert", "Laparoscopy", "Infertility"],
    img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&h=80&auto=format&fit=crop&crop=face",
    mode: ["Online", "In-person"],
    hospital: "Apollo Hospitals, Bengaluru",
  },
  {
    id: 2,
    name: "Dr. Anjali Kapoor",
    specialty: "Endocrinologist",
    experience: "11 years",
    rating: 4.8,
    reviews: 218,
    fee: "₹1,000",
    available: ["10:00 AM", "12:00 PM", "03:00 PM", "05:00 PM"],
    tags: ["Insulin Resistance", "Thyroid", "Metabolic Health"],
    img: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=80&h=80&auto=format&fit=crop&crop=face",
    mode: ["Online", "In-person"],
    hospital: "Fortis Hospital, Mumbai",
  },
  {
    id: 3,
    name: "Dr. Meera Nair",
    specialty: "Reproductive Medicine",
    experience: "9 years",
    rating: 4.7,
    reviews: 189,
    fee: "₹900",
    available: ["09:30 AM", "11:30 AM", "01:30 PM", "04:30 PM"],
    tags: ["IVF", "Fertility", "PCOS Cycles"],
    img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=80&h=80&auto=format&fit=crop&crop=face",
    mode: ["Online"],
    hospital: "Nova IVF Fertility, Delhi",
  },
  {
    id: 4,
    name: "Dr. Kavya Reddy",
    specialty: "Nutritionist & PCOS Diet Expert",
    experience: "7 years",
    rating: 4.9,
    reviews: 264,
    fee: "₹500",
    available: ["08:00 AM", "10:00 AM", "02:00 PM", "06:00 PM"],
    tags: ["Indian PCOS Diet", "Weight Management", "Hormonal Nutrition"],
    img: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=80&h=80&auto=format&fit=crop&crop=face",
    mode: ["Online"],
    hospital: "Max Healthcare, Hyderabad",
  },
  {
    id: 5,
    name: "Dr. Sunita Menon",
    specialty: "Dermatologist",
    experience: "12 years",
    rating: 4.8,
    reviews: 241,
    fee: "₹700",
    available: ["10:30 AM", "12:30 PM", "03:30 PM", "05:30 PM"],
    tags: ["Hormonal Acne", "Hirsutism", "Hair Loss"],
    img: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=80&h=80&auto=format&fit=crop&crop=face",
    mode: ["Online", "In-person"],
    hospital: "Narayana Health, Chennai",
  },
  {
    id: 6,
    name: "Dr. Roshni Patel",
    specialty: "Psychologist & PCOS Counsellor",
    experience: "8 years",
    rating: 5.0,
    reviews: 178,
    fee: "₹600",
    available: ["09:00 AM", "11:00 AM", "04:00 PM", "07:00 PM"],
    tags: ["CBT", "Anxiety & PCOS", "Body Image"],
    img: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=80&h=80&auto=format&fit=crop&crop=face",
    mode: ["Online"],
    hospital: "Medanta, Gurugram",
  },
];

type Doctor = typeof doctors[number];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`h-3 w-3 ${i <= Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"}`} />
      ))}
    </div>
  );
}

interface BookingModalProps {
  doctor: Doctor;
  onClose: () => void;
  userName: string;
  userEmail: string;
}

function BookingModal({ doctor, onClose, userName, userEmail }: BookingModalProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [issue, setIssue] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  async function handleBook(e: React.FormEvent) {
    e.preventDefault();
    if (!date || !time || !issue.trim()) return;
    setLoading(true);
    try {
      await fetch("/api/bookings/doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          patientName: userName,
          patientEmail: userEmail,
          doctorName: doctor.name,
          specialty: doctor.specialty,
          bookingDate: date,
          bookingTime: time,
          issue,
          bookingType: "doctor",
        }),
      });
      setConfirmed(true);
    } catch {
      alert("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md z-10 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {!confirmed ? (
          <>
            <div className="bg-gradient-to-r from-violet-500 to-indigo-600 p-5 text-white">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg">Book Appointment</h3>
                <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <img src={doctor.img} alt={doctor.name} className="w-12 h-12 rounded-full border-2 border-white/40 object-cover" />
                <div>
                  <p className="font-semibold">{doctor.name}</p>
                  <p className="text-white/75 text-xs">{doctor.specialty}</p>
                </div>
              </div>
            </div>
            <form onSubmit={handleBook} className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Select Date</label>
                <input
                  type="date"
                  min={today}
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-violet-200 bg-violet-50/30 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400/40"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Select Time</label>
                <div className="grid grid-cols-4 gap-2">
                  {doctor.available.map(t => (
                    <button
                      key={t} type="button"
                      onClick={() => setTime(t)}
                      className={`py-2 rounded-xl text-xs font-medium border transition-all ${time === t ? "bg-violet-500 text-white border-violet-500 shadow-md" : "bg-white border-violet-200 text-foreground hover:border-violet-400"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Describe your issue</label>
                <textarea
                  value={issue}
                  onChange={e => setIssue(e.target.value)}
                  required
                  rows={3}
                  placeholder="Briefly describe your symptoms or reason for consultation..."
                  className="w-full px-3 py-2.5 rounded-xl border border-violet-200 bg-violet-50/30 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400/40 resize-none"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-violet-50 rounded-xl">
                <span className="text-sm text-muted-foreground">Consultation fee</span>
                <span className="font-bold text-violet-600">{doctor.fee}</span>
              </div>
              <button
                type="submit"
                disabled={loading || !date || !time}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-semibold text-sm disabled:opacity-50 transition-all hover:shadow-lg hover:shadow-violet-300/30"
              >
                {loading ? "Confirming..." : "Confirm Booking"}
              </button>
            </form>
          </>
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Booking Confirmed! 🎉</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your appointment with <strong>{doctor.name}</strong> on <strong>{date}</strong> at <strong>{time}</strong> has been confirmed.
            </p>
            <div className="bg-violet-50 rounded-xl p-4 text-left mb-5 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Doctor</span>
                <span className="font-medium">{doctor.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">{date}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Time</span>
                <span className="font-medium">{time}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Mode</span>
                <span className="font-medium">{doctor.mode[0]}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-semibold text-sm"
            >
              Done
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function Consult() {
  const { user } = useAuth();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [filterSpec, setFilterSpec] = useState("All");

  const specialties = ["All", "Gynecologist", "Endocrinologist", "Nutritionist", "Dermatologist", "Psychologist"];

  const filtered = filterSpec === "All"
    ? doctors
    : doctors.filter(d => d.specialty.toLowerCase().includes(filterSpec.toLowerCase()));

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      <motion.div variants={container} initial="hidden" animate="show">

        {/* Header */}
        <motion.div variants={item}>
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-violet-500 via-indigo-500 to-purple-600 p-6 text-white shadow-xl shadow-violet-300/25">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/8 -translate-y-1/4 translate-x-1/4" />
            <img
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=180&auto=format&fit=crop"
              alt="Doctors"
              className="absolute inset-0 w-full h-full object-cover opacity-10"
            />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur rounded-full px-3 py-1.5 text-xs font-medium mb-3">
                <Video className="h-3.5 w-3.5" /> Online & In-Person Available
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Consult PCOS Specialists</h1>
              <p className="text-white/75 text-sm">Book appointments with verified gynecologists, endocrinologists, and nutritionists who specialise in PCOS.</p>
            </div>
          </div>
        </motion.div>

        {/* Filter */}
        <motion.div variants={item} className="flex gap-2 flex-wrap">
          {specialties.map(s => (
            <button
              key={s}
              onClick={() => setFilterSpec(s)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filterSpec === s ? "bg-violet-500 text-white shadow-md shadow-violet-300/30" : "bg-white/75 border border-violet-200/50 text-foreground hover:bg-violet-50"}`}
            >
              {s}
            </button>
          ))}
        </motion.div>

        {/* Doctor Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((doctor) => (
            <motion.div key={doctor.id} variants={item}>
              <Card className="bg-white/80 backdrop-blur-md border border-violet-100/60 shadow-sm hover:shadow-md hover:shadow-violet-100/40 transition-all">
                <CardContent className="p-5">
                  <div className="flex gap-3 mb-4">
                    <img src={doctor.img} alt={doctor.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-violet-100 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground text-sm">{doctor.name}</h3>
                      <p className="text-xs text-violet-600 font-medium">{doctor.specialty}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <StarRating rating={doctor.rating} />
                        <span className="text-xs text-muted-foreground">{doctor.rating} ({doctor.reviews})</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-violet-600">{doctor.fee}</p>
                      <p className="text-xs text-muted-foreground">per session</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {doctor.experience} exp
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {doctor.hospital.split(",")[1]?.trim() ?? "India"}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {doctor.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs rounded-full">{tag}</Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    {doctor.mode.map(m => (
                      <span key={m} className={`flex items-center gap-1 text-xs rounded-full px-2.5 py-1 font-medium ${m === "Online" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>
                        {m === "Online" ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />} {m}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => setSelectedDoctor(doctor)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-violet-300/30 transition-all flex items-center justify-center gap-1.5"
                  >
                    Book Appointment <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

      </motion.div>

      {selectedDoctor && (
        <BookingModal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
          userName={user?.name ?? "Patient"}
          userEmail={user?.email ?? ""}
        />
      )}
    </div>
  );
}
