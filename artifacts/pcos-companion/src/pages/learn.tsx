import { motion } from "framer-motion";
import { BookOpen, ChevronRight, Heart, AlertTriangle, Stethoscope, Leaf, Users, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };

const sections = [
  {
    id: "what-is-pcos",
    icon: "🌸",
    title: "What is PCOS?",
    color: "from-violet-500/15 to-purple-400/10",
    border: "border-violet-200/50",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    content: `Polycystic Ovary Syndrome (PCOS) is one of the most common hormonal disorders affecting women of reproductive age, impacting 1 in 10 women worldwide. It's characterized by an imbalance of reproductive hormones that can disrupt the development and release of eggs from the ovaries.

The "polycystic" in the name refers to the multiple small fluid-filled sacs (follicles) that develop on the ovaries. These follicles contain immature eggs that never mature enough to trigger ovulation.`,
    facts: ["Affects 10-15% of women globally", "Leading cause of infertility", "Manageable with lifestyle changes", "Often undiagnosed for years"],
  },
  {
    id: "what-is-pcod",
    icon: "💜",
    title: "What is PCOD?",
    color: "from-indigo-500/15 to-blue-400/10",
    border: "border-indigo-200/50",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    content: `Polycystic Ovarian Disease (PCOD) is a condition where the ovaries release immature or partially mature eggs, which eventually turns into cysts. It is less severe than PCOS and is more of a lifestyle condition.

In PCOD, the ovaries become enlarged and produce excess androgens (male hormones), which can cause various symptoms. Unlike PCOS, PCOD can often be reversed completely with proper diet and lifestyle changes.`,
    facts: ["Affects both ovaries usually", "More lifestyle-related", "Can be reversed with care", "Doesn't always affect fertility"],
  },
  {
    id: "difference",
    icon: "⚖️",
    title: "PCOS vs PCOD — Key Differences",
    color: "from-emerald-500/15 to-teal-400/10",
    border: "border-emerald-200/50",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    content: null,
    table: [
      { aspect: "Nature", pcos: "Metabolic disorder", pcod: "Functional disorder" },
      { aspect: "Fertility impact", pcos: "Can affect fertility significantly", pcod: "Fertility usually maintained" },
      { aspect: "Prevalence", pcos: "Less common (10%)", pcod: "More common (1 in 5)" },
      { aspect: "Severity", pcos: "More serious condition", pcod: "Milder condition" },
      { aspect: "Reversal", pcos: "Manageable, not fully reversible", pcod: "Fully reversible with care" },
      { aspect: "Hormone imbalance", pcos: "Severe imbalance", pcod: "Moderate imbalance" },
    ],
    facts: [],
  },
  {
    id: "symptoms",
    icon: "🩺",
    title: "Common Symptoms",
    color: "from-rose-500/15 to-pink-400/10",
    border: "border-rose-200/50",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    content: `Symptoms of PCOS/PCOD vary from person to person and can range from mild to severe. Many women only discover they have PCOS when they struggle to get pregnant or gain unexplained weight.`,
    symptoms: [
      { name: "Irregular periods", desc: "Infrequent, irregular or prolonged menstrual cycles" },
      { name: "Excess androgen", desc: "Elevated levels of male hormones causing excess hair growth on the face and body" },
      { name: "Polycystic ovaries", desc: "Enlarged ovaries with multiple small follicles" },
      { name: "Weight gain", desc: "Unexplained weight gain, especially around the abdomen" },
      { name: "Acne & oily skin", desc: "Persistent acne on face, chest or back" },
      { name: "Hair thinning", desc: "Hair loss or thinning on the scalp (female pattern baldness)" },
      { name: "Darkened skin", desc: "Dark patches of skin in body creases (acanthosis nigricans)" },
      { name: "Mood changes", desc: "Anxiety, depression, and mood swings" },
    ],
    facts: [],
  },
  {
    id: "causes",
    icon: "🔬",
    title: "Causes & Risk Factors",
    color: "from-amber-500/15 to-yellow-400/10",
    border: "border-amber-200/50",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    content: `The exact cause of PCOS is unknown, but several factors are believed to play a role:`,
    causes: [
      { icon: "🧬", name: "Genetics", desc: "PCOS tends to run in families. Having a mother or sister with PCOS increases your risk." },
      { icon: "📈", name: "Insulin resistance", desc: "Up to 70% of women with PCOS have insulin resistance, where cells don't respond properly to insulin." },
      { icon: "⚡", name: "Excess androgen production", desc: "The ovaries produce abnormally high levels of androgens (male hormones)." },
      { icon: "🔥", name: "Low-grade inflammation", desc: "Chronic low-grade inflammation stimulates polycystic ovaries to produce androgens." },
      { icon: "🍔", name: "Unhealthy lifestyle", desc: "Poor diet, sedentary lifestyle, and stress can worsen hormonal imbalances." },
    ],
    facts: [],
  },
  {
    id: "treatment",
    icon: "💊",
    title: "Treatment Options",
    color: "from-blue-500/15 to-cyan-400/10",
    border: "border-blue-200/50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    content: `There is no single treatment for all symptoms of PCOS. Treatment is focused on managing your individual concerns, such as infertility, hirsutism, acne or obesity.`,
    treatments: [
      { type: "Lifestyle", items: ["5-10% weight loss can significantly improve symptoms", "Regular exercise (30 min/day)", "Low-GI diet to manage insulin", "Stress management & sleep hygiene"] },
      { type: "Medications", items: ["Birth control pills to regulate periods", "Metformin for insulin resistance", "Anti-androgen medications", "Fertility medications (Clomiphene)"] },
      { type: "Procedures", items: ["Laparoscopic ovarian drilling", "In vitro fertilization (IVF)", "Ovarian wedge resection (rare)"] },
    ],
    facts: [],
  },
  {
    id: "lifestyle",
    icon: "🌿",
    title: "Lifestyle Management",
    color: "from-green-500/15 to-emerald-400/10",
    border: "border-green-200/50",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    content: `Lifestyle changes are the first-line treatment for PCOS. Small, consistent changes can make a significant difference in managing symptoms and improving quality of life.`,
    tips: [
      { emoji: "🥗", title: "Eat a low-GI diet", desc: "Whole grains, legumes, vegetables, and lean protein help manage insulin levels." },
      { emoji: "🏃", title: "Exercise regularly", desc: "Aim for 30 minutes of moderate exercise 5 days a week. Walking, yoga, and swimming are excellent." },
      { emoji: "😴", title: "Prioritize sleep", desc: "7-9 hours of quality sleep helps regulate hormones and reduce cortisol levels." },
      { emoji: "🧘", title: "Manage stress", desc: "Chronic stress elevates cortisol, worsening hormonal imbalance. Try meditation, journaling, or therapy." },
      { emoji: "💊", title: "Take key supplements", desc: "Inositol, Vitamin D, Magnesium, and Omega-3 fatty acids can help manage PCOS symptoms." },
      { emoji: "🚫", title: "Avoid endocrine disruptors", desc: "Reduce exposure to BPA, pesticides, and certain plastics that can disrupt hormones." },
    ],
    facts: [],
  },
  {
    id: "consult",
    icon: "👩‍⚕️",
    title: "When to See a Doctor",
    color: "from-purple-500/15 to-violet-400/10",
    border: "border-purple-200/50",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    content: `Don't wait — early diagnosis and treatment can prevent long-term complications like type 2 diabetes, cardiovascular disease, and endometrial cancer.`,
    warnings: [
      "Your periods are irregular, infrequent, or absent",
      "You're experiencing unexplained weight gain",
      "You notice excess facial or body hair (hirsutism)",
      "You're struggling to get pregnant",
      "You have persistent acne that doesn't respond to treatment",
      "You have patches of dark, velvety skin",
      "You're experiencing severe mood swings or depression",
    ],
    facts: [],
  },
];

const stories = [
  {
    name: "Priya S., 28",
    city: "Bengaluru",
    story: "I was diagnosed with PCOS at 24. Within 6 months of changing my diet and doing yoga daily, my periods became regular. I lost 8 kg and my acne cleared up completely!",
    img: "https://images.unsplash.com/photo-1494790108755-2616b332c3bb?w=60&h=60&auto=format&fit=crop&crop=face",
    outcome: "Reversed symptoms in 6 months",
  },
  {
    name: "Meera K., 32",
    city: "Mumbai",
    story: "After years of irregular cycles and weight struggles, I finally got diagnosed. With the right medication and lifestyle changes, I conceived naturally after 1 year of management.",
    img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=60&h=60&auto=format&fit=crop&crop=face",
    outcome: "Conceived naturally after treatment",
  },
  {
    name: "Anjali R., 25",
    city: "Delhi",
    story: "PCOS made me feel hopeless about my body. Learning about it through this app and changing small habits helped me feel in control again. My hair stopped falling and my energy is back!",
    img: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=60&h=60&auto=format&fit=crop&crop=face",
    outcome: "Energy & confidence restored",
  },
];

export default function Learn() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      <motion.div variants={container} initial="hidden" animate="show">

        {/* Header */}
        <motion.div variants={item} className="text-center py-6">
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-600 rounded-full px-4 py-2 text-sm font-medium mb-4">
            <BookOpen className="h-4 w-4" />
            PCOS Knowledge Hub
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Understanding <span className="text-violet-600">PCOS & PCOD</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Everything you need to know about PCOS and PCOD — symptoms, causes, treatment, and how to live your best life.
          </p>
        </motion.div>

        {/* Quick nav pills */}
        <motion.div variants={item} className="flex flex-wrap gap-2 justify-center">
          {sections.map(s => (
            <a key={s.id} href={`#${s.id}`}
              className="inline-flex items-center gap-1.5 bg-white/75 backdrop-blur-sm border border-violet-200/50 hover:border-violet-400/50 hover:bg-violet-50/60 rounded-full px-3 py-1.5 text-xs font-medium text-foreground transition-all">
              <span>{s.icon}</span>{s.title.split(" — ")[0].split(" ")[0] + (s.title.split(" ")[1] ? " " + s.title.split(" ")[1] : "")}
            </a>
          ))}
        </motion.div>

        {/* Sections */}
        {sections.map((section, idx) => (
          <motion.div key={section.id} id={section.id} variants={item}>
            <Card className={`bg-gradient-to-br ${section.color} border ${section.border} shadow-sm`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-2xl ${section.iconBg} flex items-center justify-center text-xl`}>
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-bold text-foreground">{section.title}</h2>
                  <Badge variant="outline" className="ml-auto text-xs hidden sm:block">Section {idx + 1}</Badge>
                </div>

                {section.content && (
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{section.content}</p>
                )}

                {/* Facts */}
                {section.facts && section.facts.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {section.facts.map(f => (
                      <div key={f} className="flex items-center gap-1.5 bg-white/60 rounded-full px-3 py-1 text-xs font-medium">
                        <ChevronRight className="h-3 w-3 text-violet-500" />
                        {f}
                      </div>
                    ))}
                  </div>
                )}

                {/* Table for difference */}
                {section.table && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/40">
                          <th className="text-left py-2 pr-4 font-semibold text-foreground/70 text-xs uppercase tracking-wide">Aspect</th>
                          <th className="text-left py-2 pr-4 font-semibold text-violet-600 text-xs uppercase tracking-wide">PCOS</th>
                          <th className="text-left py-2 font-semibold text-indigo-600 text-xs uppercase tracking-wide">PCOD</th>
                        </tr>
                      </thead>
                      <tbody>
                        {section.table.map(row => (
                          <tr key={row.aspect} className="border-b border-white/30 last:border-0">
                            <td className="py-2.5 pr-4 font-medium text-foreground text-xs">{row.aspect}</td>
                            <td className="py-2.5 pr-4 text-muted-foreground text-xs">{row.pcos}</td>
                            <td className="py-2.5 text-muted-foreground text-xs">{row.pcod}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Symptoms list */}
                {section.symptoms && (
                  <div className="grid sm:grid-cols-2 gap-2">
                    {section.symptoms.map(s => (
                      <div key={s.name} className="flex items-start gap-2.5 bg-white/50 rounded-xl p-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Causes */}
                {section.causes && (
                  <div className="space-y-2">
                    {section.causes.map(c => (
                      <div key={c.name} className="flex items-start gap-3 bg-white/50 rounded-xl p-3">
                        <span className="text-xl flex-shrink-0">{c.icon}</span>
                        <div>
                          <p className="text-sm font-semibold">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Treatments */}
                {section.treatments && (
                  <div className="grid sm:grid-cols-3 gap-3">
                    {section.treatments.map(t => (
                      <div key={t.type} className="bg-white/60 rounded-xl p-4">
                        <p className="text-sm font-bold text-foreground mb-2">{t.type}</p>
                        <ul className="space-y-1">
                          {t.items.map(i => (
                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                              <ChevronRight className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                              {i}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {/* Lifestyle tips */}
                {section.tips && (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {section.tips.map(t => (
                      <div key={t.title} className="flex items-start gap-3 bg-white/60 rounded-xl p-3">
                        <span className="text-xl flex-shrink-0">{t.emoji}</span>
                        <div>
                          <p className="text-sm font-semibold">{t.title}</p>
                          <p className="text-xs text-muted-foreground">{t.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Warnings */}
                {section.warnings && (
                  <div className="space-y-2">
                    {section.warnings.map(w => (
                      <div key={w} className="flex items-center gap-2.5 bg-white/50 rounded-xl p-3">
                        <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                        <p className="text-sm text-foreground">{w}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Success Stories */}
        <motion.div variants={item}>
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-violet-500" />
            <h2 className="text-xl font-bold">Real Success Stories</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {stories.map(s => (
              <Card key={s.name} className="bg-white/75 backdrop-blur-md border border-violet-100/60 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={s.img} alt={s.name} className="w-12 h-12 rounded-full object-cover border-2 border-violet-200" />
                    <div>
                      <p className="font-semibold text-sm">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.city}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground italic leading-relaxed mb-3">"{s.story}"</p>
                  <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 rounded-full px-3 py-1 text-xs font-medium">
                    <Heart className="h-3 w-3" />
                    {s.outcome}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
