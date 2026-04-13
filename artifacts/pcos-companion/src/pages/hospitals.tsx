import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Star, Phone, Clock, ChevronRight, Search, CheckCircle2, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };

const hospitals = [
  {
    id: 1,
    name: "Apollo Hospitals",
    location: "Bengaluru, Karnataka",
    specialties: ["PCOS Clinic", "Endocrinology", "Fertility Centre", "Gynecology"],
    rating: 4.9,
    reviews: 1240,
    distance: "2.4 km",
    type: "Multi-specialty",
    phone: "+91 80 2630 4050",
    timings: "24/7 Emergency | OPD: 8AM–8PM",
    beds: "1000+",
    img: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=200&auto=format&fit=crop",
    highlights: ["NABH Accredited", "ISO Certified", "International Patients"],
    city: "Bengaluru",
    fee: "₹500 – ₹1,500",
  },
  {
    id: 2,
    name: "Fortis Healthcare",
    location: "Mumbai, Maharashtra",
    specialties: ["Women's Health", "PCOS Management", "Reproductive Medicine"],
    rating: 4.8,
    reviews: 987,
    distance: "5.1 km",
    type: "Multi-specialty",
    phone: "+91 22 6245 5000",
    timings: "24/7 | OPD: 9AM–7PM",
    beds: "500+",
    img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=200&auto=format&fit=crop",
    highlights: ["JCI Accredited", "Robotic Surgery", "Telemedicine Available"],
    city: "Mumbai",
    fee: "₹600 – ₹2,000",
  },
  {
    id: 3,
    name: "AIIMS New Delhi",
    location: "New Delhi",
    specialties: ["Endocrinology", "Obstetrics & Gynecology", "Dietetics", "Dermatology"],
    rating: 4.7,
    reviews: 2100,
    distance: "8.3 km",
    type: "Government Hospital",
    phone: "+91 11 2658 8500",
    timings: "24/7 Emergency | OPD: 8AM–12PM",
    beds: "2500+",
    img: "https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=400&h=200&auto=format&fit=crop",
    highlights: ["Premier Government Institute", "Research & Training", "Affordable Care"],
    city: "Delhi",
    fee: "₹100 – ₹500",
  },
  {
    id: 4,
    name: "Narayana Health",
    location: "Chennai, Tamil Nadu",
    specialties: ["PCOS Clinic", "Fertility & IVF", "Women's Wellness", "Nutrition"],
    rating: 4.8,
    reviews: 876,
    distance: "3.7 km",
    type: "Multi-specialty",
    phone: "+91 44 2667 6700",
    timings: "24/7 | OPD: 8AM–8PM",
    beds: "700+",
    img: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&h=200&auto=format&fit=crop",
    highlights: ["NABH Accredited", "IVF Success Rate 65%+", "Comprehensive PCOS Program"],
    city: "Chennai",
    fee: "₹400 – ₹1,200",
  },
  {
    id: 5,
    name: "Medanta — The Medicity",
    location: "Gurugram, Haryana",
    specialties: ["Gynecology & Obstetrics", "Endocrinology", "PCOS & Hormones", "Mental Health"],
    rating: 4.9,
    reviews: 1560,
    distance: "4.2 km",
    type: "Super-specialty",
    phone: "+91 124 4141 414",
    timings: "24/7 | OPD: 8AM–8PM",
    beds: "1800+",
    img: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&h=200&auto=format&fit=crop",
    highlights: ["JCI & NABH Accredited", "International Centre", "Holistic PCOS Care"],
    city: "Gurugram",
    fee: "₹800 – ₹2,500",
  },
  {
    id: 6,
    name: "Nova IVF Fertility",
    location: "Hyderabad, Telangana",
    specialties: ["Fertility & IVF", "PCOS Fertility", "Reproductive Endocrinology"],
    rating: 4.9,
    reviews: 742,
    distance: "6.8 km",
    type: "Fertility Clinic",
    phone: "+91 40 4464 4466",
    timings: "Mon–Sat: 8AM–6PM",
    beds: "Clinic",
    img: "https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=400&h=200&auto=format&fit=crop",
    highlights: ["70%+ IVF Success Rate", "PCOS Fertility Specialists", "PGT-A Available"],
    city: "Hyderabad",
    fee: "₹1,000 – ₹3,000",
  },
];

type Hospital = typeof hospitals[number];

function BookingModal({ hospital, onClose, userName, userEmail }: { hospital: Hospital; onClose: () => void; userName: string; userEmail: string }) {
  const [dept, setDept] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [issue, setIssue] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const times = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];

  async function handleBook(e: React.FormEvent) {
    e.preventDefault();
    if (!dept || !date || !time) return;
    setLoading(true);
    try {
      await fetch("/api/bookings/doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          patientName: userName,
          patientEmail: userEmail,
          doctorName: `${hospital.name} — ${dept}`,
          specialty: dept,
          bookingDate: date,
          bookingTime: time,
          issue: issue || "General consultation",
          bookingType: "hospital",
        }),
      });
      setConfirmed(true);
    } catch {
      alert("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

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
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-lg">Book Hospital Appointment</h3>
                <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center"><X className="h-4 w-4" /></button>
              </div>
              <p className="text-white/75 text-sm">{hospital.name} · {hospital.location}</p>
            </div>
            <form onSubmit={handleBook} className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Department</label>
                <select
                  value={dept}
                  onChange={e => setDept(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-violet-200 bg-violet-50/30 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400/40"
                >
                  <option value="">Select department...</option>
                  {hospital.specialties.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Date</label>
                <input type="date" min={today} value={date} onChange={e => setDate(e.target.value)} required className="w-full px-3 py-2.5 rounded-xl border border-violet-200 bg-violet-50/30 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400/40" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Time</label>
                <div className="grid grid-cols-4 gap-2">
                  {times.map(t => (
                    <button key={t} type="button" onClick={() => setTime(t)} className={`py-2 rounded-xl text-xs font-medium border transition-all ${time === t ? "bg-violet-500 text-white border-violet-500" : "bg-white border-violet-200 hover:border-violet-400"}`}>{t.replace(" AM","AM").replace(" PM","PM")}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Reason (optional)</label>
                <textarea value={issue} onChange={e => setIssue(e.target.value)} rows={2} placeholder="Briefly describe your reason for visit..." className="w-full px-3 py-2.5 rounded-xl border border-violet-200 bg-violet-50/30 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400/40 resize-none" />
              </div>
              <div className="flex justify-between p-3 bg-violet-50 rounded-xl text-sm">
                <span className="text-muted-foreground">Estimated fee</span>
                <span className="font-bold text-violet-600">{hospital.fee}</span>
              </div>
              <button type="submit" disabled={loading || !dept || !date || !time} className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-semibold text-sm disabled:opacity-50">
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
            <p className="text-sm text-muted-foreground mb-5">{hospital.name} · {dept} department on <strong>{date}</strong> at <strong>{time}</strong></p>
            <button onClick={onClose} className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-semibold text-sm">Done</button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function Hospitals() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [filterCity, setFilterCity] = useState("All");
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  const cities = ["All", "Bengaluru", "Mumbai", "Delhi", "Chennai", "Gurugram", "Hyderabad"];

  const filtered = hospitals.filter(h => {
    const matchCity = filterCity === "All" || h.city === filterCity;
    const matchSearch = !search || h.name.toLowerCase().includes(search.toLowerCase()) || h.specialties.some(s => s.toLowerCase().includes(search.toLowerCase()));
    return matchCity && matchSearch;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      <motion.div variants={container} initial="hidden" animate="show">

        <motion.div variants={item}>
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 p-6 text-white shadow-xl shadow-indigo-300/25">
            <img src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=200&auto=format&fit=crop" alt="" className="absolute inset-0 w-full h-full object-cover opacity-10" />
            <div className="relative z-10">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">PCOS-Friendly Hospitals</h1>
              <p className="text-white/75 text-sm mb-4">Top hospitals across India with dedicated women's health and PCOS departments.</p>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search hospitals or specialties..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/15 backdrop-blur text-white placeholder:text-white/50 text-sm focus:outline-none focus:bg-white/20 border border-white/20"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* City filter */}
        <motion.div variants={item} className="flex gap-2 flex-wrap">
          {cities.map(c => (
            <button key={c} onClick={() => setFilterCity(c)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filterCity === c ? "bg-violet-500 text-white shadow-md" : "bg-white/75 border border-violet-200/50 text-foreground hover:bg-violet-50"}`}>{c}</button>
          ))}
        </motion.div>

        {/* Hospital cards */}
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(hospital => (
            <motion.div key={hospital.id} variants={item}>
              <Card className="bg-white/80 backdrop-blur-md border border-violet-100/60 shadow-sm hover:shadow-md transition-all overflow-hidden">
                <img src={hospital.img} alt={hospital.name} className="w-full h-36 object-cover" />
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-foreground">{hospital.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <MapPin className="h-3 w-3" />
                        {hospital.location}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs border-violet-200 text-violet-600 flex-shrink-0">{hospital.type}</Badge>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map(i => <Star key={i} className={`h-3 w-3 ${i <= Math.floor(hospital.rating) ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"}`} />)}
                    </div>
                    <span className="text-xs text-muted-foreground">{hospital.rating} ({hospital.reviews} reviews)</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {hospital.specialties.map(s => <Badge key={s} variant="secondary" className="text-xs rounded-full">{s}</Badge>)}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {hospital.highlights.map(h => (
                      <span key={h} className="flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 rounded-full px-2 py-0.5">
                        <CheckCircle2 className="h-2.5 w-2.5" /> {h}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1"><Clock className="h-3 w-3" />{hospital.timings.split("|")[0].trim()}</div>
                    <div className="flex items-center gap-1"><Phone className="h-3 w-3" />Available</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 text-sm">
                      <span className="text-muted-foreground">Fee: </span>
                      <span className="font-semibold text-violet-600">{hospital.fee}</span>
                    </div>
                    <button
                      onClick={() => setSelectedHospital(hospital)}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-semibold text-xs hover:shadow-lg hover:shadow-violet-300/30 transition-all flex items-center gap-1"
                    >
                      Book Appointment <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

      </motion.div>

      {selectedHospital && (
        <BookingModal
          hospital={selectedHospital}
          onClose={() => setSelectedHospital(null)}
          userName={user?.name ?? "Patient"}
          userEmail={user?.email ?? ""}
        />
      )}
    </div>
  );
}
