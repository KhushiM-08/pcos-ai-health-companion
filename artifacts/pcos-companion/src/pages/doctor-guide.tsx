import { motion } from "framer-motion";
import { Stethoscope, ChevronRight, Phone, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };

const doctorTypes = [
  {
    specialty: "Gynecologist / OB-GYN",
    emoji: "👩‍⚕️",
    icon: Stethoscope,
    color: "from-violet-500/15 to-purple-400/10",
    border: "border-violet-200/50",
    iconBg: "bg-violet-100",
    tagColor: "bg-violet-100 text-violet-700",
    description: "Your primary specialist for PCOS. A gynecologist diagnoses and manages PCOS, regulates menstrual cycles, and guides fertility treatment.",
    whenToVisit: [
      "Irregular, missed, or very painful periods",
      "Difficulty getting pregnant",
      "First PCOS/PCOD diagnosis",
      "Pelvic pain or ovarian cysts found on ultrasound",
      "Abnormal uterine bleeding",
    ],
    whatTheyDo: [
      "Diagnose PCOS via ultrasound and blood tests",
      "Prescribe hormonal birth control to regulate cycles",
      "Monitor follicle development",
      "Guide through pregnancy planning",
      "Manage ovarian cysts and related complications",
    ],
    tests: ["Pelvic ultrasound", "Blood hormone levels", "LH/FSH ratio", "AMH test", "Thyroid panel"],
    img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=180&auto=format&fit=crop",
  },
  {
    specialty: "Endocrinologist",
    emoji: "🔬",
    icon: Stethoscope,
    color: "from-indigo-500/15 to-blue-400/10",
    border: "border-indigo-200/50",
    iconBg: "bg-indigo-100",
    tagColor: "bg-indigo-100 text-indigo-700",
    description: "A specialist in hormone disorders. Essential if your PCOS is linked to insulin resistance, diabetes risk, thyroid issues, or adrenal problems.",
    whenToVisit: [
      "Insulin resistance or pre-diabetes",
      "Abnormal thyroid tests",
      "Unusual weight gain around the abdomen",
      "High testosterone or DHEA-S levels",
      "Suspected adrenal PCOS",
    ],
    whatTheyDo: [
      "Manage insulin resistance with Metformin",
      "Test and treat thyroid disorders",
      "Assess adrenal function",
      "Monitor blood sugar and HbA1c",
      "Optimize hormone balance holistically",
    ],
    tests: ["Fasting glucose & insulin", "HbA1c", "Thyroid panel (TSH, T3, T4)", "DHEA-S & cortisol", "Lipid profile"],
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=180&auto=format&fit=crop",
  },
  {
    specialty: "Nutritionist / Dietitian",
    emoji: "🥗",
    icon: Stethoscope,
    color: "from-emerald-500/15 to-green-400/10",
    border: "border-emerald-200/50",
    iconBg: "bg-emerald-100",
    tagColor: "bg-emerald-100 text-emerald-700",
    description: "A registered dietitian with expertise in PCOS can create a personalised anti-inflammatory, low-GI meal plan that directly addresses your hormonal imbalances.",
    whenToVisit: [
      "Struggling to lose weight with PCOS",
      "Managing insulin resistance through diet",
      "Digestive issues like bloating or IBS alongside PCOS",
      "Wanting a tailored Indian vegan PCOS meal plan",
      "Nutrient deficiencies (Vitamin D, Iron, B12)",
    ],
    whatTheyDo: [
      "Create personalised low-GI meal plans",
      "Guide on anti-inflammatory eating patterns",
      "Recommend supplements (Inositol, Omega-3, Vit D)",
      "Help with weight management",
      "Teach mindful eating and blood sugar management",
    ],
    tests: ["Nutrition assessment", "Food sensitivity testing", "Gut microbiome analysis", "Vitamin/mineral blood panel"],
    img: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=300&h=180&auto=format&fit=crop",
  },
  {
    specialty: "Dermatologist",
    emoji: "✨",
    icon: Stethoscope,
    color: "from-rose-500/15 to-pink-400/10",
    border: "border-rose-200/50",
    iconBg: "bg-rose-100",
    tagColor: "bg-rose-100 text-rose-700",
    description: "PCOS often causes visible skin and hair changes. A dermatologist treats acne, hirsutism (excess hair), and hair loss caused by high androgens.",
    whenToVisit: [
      "Persistent cystic acne that won't clear with standard treatment",
      "Unwanted facial or body hair (hirsutism)",
      "Hair thinning or female pattern baldness",
      "Dark, velvety skin patches (acanthosis nigricans)",
      "Skin tags or other androgen-related skin changes",
    ],
    whatTheyDo: [
      "Treat hormonal acne with topical or oral medication",
      "Prescribe anti-androgens for hair growth",
      "Recommend laser hair removal",
      "Treat scalp and hair loss with PRP or minoxidil",
      "Manage skin pigmentation issues",
    ],
    tests: ["Androgen blood levels", "Skin biopsy (rare)", "Trichoscopy for hair loss", "Hormonal evaluation"],
    img: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=300&h=180&auto=format&fit=crop",
  },
  {
    specialty: "Mental Health Professional",
    emoji: "🧠",
    icon: Stethoscope,
    color: "from-amber-500/15 to-yellow-400/10",
    border: "border-amber-200/50",
    iconBg: "bg-amber-100",
    tagColor: "bg-amber-100 text-amber-700",
    description: "PCOS has a significant psychological impact. Up to 50% of women with PCOS experience depression or anxiety. A therapist or psychologist can be a critical part of your care team.",
    whenToVisit: [
      "Feeling depressed or hopeless about your condition",
      "Persistent anxiety related to body image",
      "Disordered eating patterns",
      "Relationship stress due to fertility issues",
      "Struggling to maintain lifestyle changes",
    ],
    whatTheyDo: [
      "CBT (Cognitive Behavioural Therapy) for PCOS-related anxiety",
      "Support for body image and self-esteem",
      "Mindfulness-based stress reduction",
      "Fertility counselling for couples",
      "Help build sustainable lifestyle habits",
    ],
    tests: ["PHQ-9 depression screen", "GAD-7 anxiety screen", "Psychosocial assessment"],
    img: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=300&h=180&auto=format&fit=crop",
  },
];

const buildingATeam = [
  { step: "1", title: "Start with your OB-GYN", desc: "Get your initial PCOS diagnosis and understand your hormone levels." },
  { step: "2", title: "Add an Endocrinologist", desc: "If insulin resistance or metabolic issues are involved." },
  { step: "3", title: "Work with a Nutritionist", desc: "Build a sustainable, personalised diet plan that works for your lifestyle." },
  { step: "4", title: "See a Dermatologist if needed", desc: "For persistent acne, hair growth, or hair loss issues." },
  { step: "5", title: "Prioritise mental health", desc: "Don't overlook the psychological aspects of living with PCOS." },
];

export default function DoctorGuide() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      <motion.div variants={container} initial="hidden" animate="show">

        {/* Header */}
        <motion.div variants={item} className="text-center py-4">
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-600 rounded-full px-4 py-2 text-sm font-medium mb-4">
            <Stethoscope className="h-4 w-4" />
            Healthcare Team Guide
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Which Doctor Should<br />
            <span className="text-violet-600">You See for PCOS?</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
            PCOS is a complex condition. Understanding each specialist's role helps you build the right healthcare team for your unique needs.
          </p>
        </motion.div>

        {/* Doctor Type Cards */}
        {doctorTypes.map((doctor) => (
          <motion.div key={doctor.specialty} variants={item}>
            <Card className={`bg-gradient-to-br ${doctor.color} border ${doctor.border} shadow-sm overflow-hidden`}>
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <img src={doctor.img} alt={doctor.specialty} className="w-full md:w-48 h-40 md:h-auto object-cover flex-shrink-0" />
                  <div className="p-5 flex-1">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-xl ${doctor.iconBg} flex items-center justify-center text-lg`}>
                          {doctor.emoji}
                        </div>
                        <h3 className="text-lg font-bold">{doctor.specialty}</h3>
                      </div>
                      <Badge className={`${doctor.tagColor} border-0 text-xs flex-shrink-0`}>Specialist</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{doctor.description}</p>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">When to Visit</p>
                        <ul className="space-y-1">
                          {doctor.whenToVisit.slice(0, 3).map(w => (
                            <li key={w} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                              <ChevronRight className="h-3 w-3 text-violet-400 mt-0.5 flex-shrink-0" />
                              {w}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">Key Tests</p>
                        <div className="flex flex-wrap gap-1">
                          {doctor.tests.slice(0, 3).map(t => (
                            <span key={t} className="bg-white/60 text-xs rounded-full px-2 py-0.5 text-muted-foreground">{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Building your team */}
        <motion.div variants={item}>
          <Card className="bg-gradient-to-br from-violet-500/10 to-indigo-400/10 border border-violet-200/50">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
                <span>🏥</span> Building Your PCOS Healthcare Team
              </h2>
              <div className="space-y-3">
                {buildingATeam.map(step => (
                  <div key={step.step} className="flex items-start gap-4 bg-white/50 rounded-xl p-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {step.step}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{step.title}</p>
                      <p className="text-xs text-muted-foreground">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <Link href="/consult">
                  <button className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-violet-300/30 hover:shadow-violet-300/50 transition-all">
                    Book a Consultation →
                  </button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </motion.div>
    </div>
  );
}
