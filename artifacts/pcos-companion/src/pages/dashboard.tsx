import { motion } from "framer-motion";
import { Activity, Droplets, Heart, AlertCircle, TrendingUp, Zap, CheckCircle2, Info, AlertTriangle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetTrackerSummary, useGetRecommendations, useGetAlerts, useGetHealthScoreTrend } from "@workspace/api-client-react";
import { Link } from "wouter";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "@/contexts/auth-context";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

function HealthScoreRing({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? "#34D399" : score >= 40 ? "#FBBF24" : "#F87171";
  const gradId = "scoreGrad";
  return (
    <div className="relative flex items-center justify-center" style={{ width: 148, height: 148 }}>
      <svg width="148" height="148" style={{ transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <circle cx="74" cy="74" r={radius} fill="none" stroke="rgba(167,139,250,0.15)" strokeWidth="11" />
        <circle
          cx="74" cy="74" r={radius} fill="none"
          stroke={`url(#${gradId})`} strokeWidth="11"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold tracking-tight" style={{ color }}>{score}</span>
        <span className="text-xs text-white/70 font-medium">/ 100</span>
      </div>
    </div>
  );
}

function AlertSeverityIcon({ severity }: { severity: string }) {
  if (severity === "danger") return <AlertCircle className="h-4 w-4 text-destructive" />;
  if (severity === "warning") return <AlertTriangle className="h-4 w-4 text-warning" />;
  return <Info className="h-4 w-4 text-primary" />;
}

const statCards = [
  {
    label: "Health Score",
    key: "healthScore" as const,
    suffix: "/100",
    icon: Heart,
    gradient: "from-violet-500/15 to-purple-400/10",
    iconColor: "text-violet-500",
    iconBg: "bg-violet-100",
  },
  {
    label: "Water Today",
    key: "avgWaterIntake" as const,
    suffix: "L",
    icon: Droplets,
    gradient: "from-blue-400/15 to-cyan-400/10",
    iconColor: "text-blue-500",
    iconBg: "bg-blue-100",
  },
  {
    label: "Avg Exercise",
    key: "avgExerciseMinutes" as const,
    suffix: "min",
    icon: Activity,
    gradient: "from-emerald-400/15 to-green-300/10",
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-100",
  },
  {
    label: "Streak",
    key: "streak" as const,
    suffix: " days",
    icon: Zap,
    gradient: "from-amber-400/15 to-yellow-300/10",
    iconColor: "text-amber-500",
    iconBg: "bg-amber-100",
  },
];

const wellnessTips = [
  { emoji: "🧘", title: "Morning Yoga", desc: "10 min yoga reduces cortisol and improves cycle regularity", img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=120&h=80&auto=format&fit=crop" },
  { emoji: "🥗", title: "Anti-Inflammatory Diet", desc: "Foods rich in omega-3 help manage PCOS inflammation", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=120&h=80&auto=format&fit=crop" },
  { emoji: "💧", title: "Stay Hydrated", desc: "Drink 2–3L of water daily to support hormone balance", img: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=120&h=80&auto=format&fit=crop" },
];

export default function Dashboard() {
  const { data: summary, isLoading: summaryLoading } = useGetTrackerSummary();
  const { data: recommendations, isLoading: recsLoading } = useGetRecommendations();
  const { data: alerts, isLoading: alertsLoading } = useGetAlerts();
  const { data: trend } = useGetHealthScoreTrend();
  const { user } = useAuth();

  const score = summary?.healthScore ?? 50;
  const scoreLabel = score >= 70 ? "Feeling great 🌟" : score >= 40 ? "Holding steady 💪" : "Needs attention 🌱";

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">

        {/* Hero Section */}
        <motion.div variants={item}>
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-violet-500 via-indigo-500 to-purple-600 p-6 md:p-8 text-white shadow-2xl shadow-violet-300/30">
            {/* decorative shapes */}
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/8 -translate-y-1/3 translate-x-1/4" />
            <div className="absolute bottom-0 left-1/4 w-40 h-40 rounded-full bg-indigo-300/20 translate-y-1/2" />
            <div className="absolute top-1/2 left-2/3 w-24 h-24 rounded-full bg-purple-300/15" />

            {/* Hero image */}
            <div className="absolute right-0 bottom-0 h-full w-64 overflow-hidden pointer-events-none hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=320&auto=format&fit=crop&q=70"
                alt="Wellness"
                className="h-full w-full object-cover object-left opacity-15"
              />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-white/65 text-sm font-medium mb-1">
                  {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                </p>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{greeting}, {firstName} ✨</h1>
                <p className="text-white/75 mt-2 text-sm md:text-base">Here's your wellness overview for today</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur rounded-full px-3 py-1.5 text-xs font-medium">
                    🌸 {scoreLabel}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <HealthScoreRing score={score} />
                <p className="text-white/70 text-xs mt-2 font-medium">Health Score</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {statCards.map((stat) => {
            const rawVal = summary?.[stat.key];
            const displayVal = rawVal !== undefined
              ? `${rawVal}${stat.suffix}`
              : null;
            return (
              <Card key={stat.label} className={`bg-gradient-to-br ${stat.gradient} border-white/60`}>
                <CardContent className="p-4">
                  <div className={`w-9 h-9 rounded-xl ${stat.iconBg} flex items-center justify-center mb-3`}>
                    <stat.icon className={`h-4.5 w-4.5 ${stat.iconColor}`} style={{ width: "1.125rem", height: "1.125rem" }} />
                  </div>
                  {summaryLoading || displayVal === null ? (
                    <Skeleton className="h-7 w-16 mb-1" />
                  ) : (
                    <p className="text-2xl font-bold text-foreground tracking-tight">{displayVal}</p>
                  )}
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={item}>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Quick Actions</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Log Today", href: "/tracker", from: "from-violet-500", to: "to-indigo-600", emoji: "📊" },
              { label: "Check Symptoms", href: "/symptoms", from: "from-purple-500", to: "to-violet-600", emoji: "🩺" },
              { label: "Period Tracker", href: "/periods", from: "from-indigo-500", to: "to-blue-600", emoji: "📅" },
              { label: "Diet & Lifestyle", href: "/diet", from: "from-emerald-500", to: "to-teal-600", emoji: "🥗" },
            ].map((action) => (
              <Link key={action.label} href={action.href}>
                <div className={`bg-gradient-to-br ${action.from} ${action.to} rounded-2xl p-4 cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-lg shadow-violet-200/30 flex flex-col gap-2`}>
                  <span className="text-2xl">{action.emoji}</span>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">{action.label}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-white/70" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Wellness Tips */}
        <motion.div variants={item}>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Wellness Tips</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {wellnessTips.map((tip) => (
              <div key={tip.title} className="bg-white/75 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm overflow-hidden flex gap-0 hover:shadow-md transition-shadow">
                <img src={tip.img} alt={tip.title} className="w-24 h-full object-cover flex-shrink-0" />
                <div className="p-4 flex flex-col justify-center">
                  <p className="text-sm font-semibold text-foreground mb-1">{tip.emoji} {tip.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Score Trend + Alerts row */}
        <motion.div variants={item} className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-violet-500" />
                Health Score Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!trend || trend.length === 0 ? (
                <div className="h-36 flex flex-col items-center justify-center text-muted-foreground text-sm gap-3">
                  <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=80&h=60&auto=format&fit=crop" alt="chart" className="rounded-xl opacity-40 w-16 h-12 object-cover" />
                  <span>Start logging to see your trend</span>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={148}>
                  <LineChart data={trend}>
                    <defs>
                      <linearGradient id="scoreLineGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#6366F1" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.1)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} tickFormatter={(d) => { const s = String(d).slice(0, 10); return s.slice(5).replace('-', '/'); }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: "12px", border: "1px solid rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", fontSize: "12px" }}
                      formatter={(v) => [`${v}`, "Score"]}
                      labelFormatter={(l) => `Date: ${String(l).slice(0, 10)}`}
                    />
                    <Line type="monotone" dataKey="score" stroke="url(#scoreLineGrad)" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-warning" />
                Health Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {alertsLoading ? (
                <div className="space-y-2">{[1,2].map(i => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}</div>
              ) : alerts && alerts.length > 0 ? (
                <div className="space-y-2">
                  {alerts.slice(0, 3).map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/60 border border-amber-100">
                      <AlertSeverityIcon severity={alert.severity} />
                      <div>
                        <p className="text-sm font-medium">{alert.title}</p>
                        <p className="text-xs text-muted-foreground">{alert.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-36 flex flex-col items-center justify-center gap-2">
                  <CheckCircle2 className="h-10 w-10 text-success" />
                  <p className="text-sm font-medium text-success">All clear — great work!</p>
                  <p className="text-xs text-muted-foreground">No health alerts right now.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Recommendations */}
        <motion.div variants={item}>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                    <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                  </div>
                  AI Recommendations
                </CardTitle>
                <Link href="/reports">
                  <span className="text-xs text-violet-500 font-medium flex items-center gap-1 hover:underline">
                    View all <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recsLoading ? (
                <div className="space-y-2">{[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}</div>
              ) : (
                <div className="space-y-2">
                  {recommendations?.slice(0, 3).map((rec, i) => (
                    <div key={rec.id} className={`flex items-start gap-3 p-3.5 rounded-xl border ${
                      i === 0 ? "bg-gradient-to-r from-violet-500/8 to-indigo-400/5 border-violet-200/40" :
                      i === 1 ? "bg-gradient-to-r from-purple-400/8 to-violet-400/5 border-purple-200/40" :
                      "bg-gradient-to-r from-emerald-400/8 to-teal-400/5 border-emerald-200/40"
                    }`}>
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        i === 0 ? "bg-violet-100" : i === 1 ? "bg-purple-100" : "bg-emerald-100"
                      }`}>
                        <Heart className={`h-4 w-4 ${i === 0 ? "text-violet-500" : i === 1 ? "text-purple-500" : "text-emerald-500"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-semibold truncate">{rec.title}</p>
                          <Badge
                            variant={rec.priority === "high" ? "destructive" : rec.priority === "medium" ? "secondary" : "outline"}
                            className="text-[10px] h-4 px-1.5 flex-shrink-0"
                          >
                            {rec.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{rec.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

      </motion.div>
    </div>
  );
}
