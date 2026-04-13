import { motion } from "framer-motion";
import { TrendingUp, Activity, Heart, BarChart2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import {
  useGetHealthScoreTrend, useGetSymptomTrend, useGetTrackerEntries, useGetTrackerSummary
} from "@workspace/api-client-react";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const MOOD_COLORS = { happy: "#34D399", neutral: "#FBBF24", sad: "#F87171" };
const RISK_COLORS = { low: "#34D399", medium: "#FBBF24", high: "#F87171" };

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">
      {message}
    </div>
  );
}

export default function Reports() {
  const { data: healthTrend, isLoading: trendLoading } = useGetHealthScoreTrend();
  const { data: symptomTrend, isLoading: symptomLoading } = useGetSymptomTrend();
  const { data: entries } = useGetTrackerEntries();
  const { data: summary } = useGetTrackerSummary();

  const moodData = entries ? (() => {
    const counts: Record<string, number> = { happy: 0, neutral: 0, sad: 0 };
    entries.forEach(e => { counts[e.mood] = (counts[e.mood] ?? 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
  })() : [];

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={item}>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">Visualize your PCOS health journey over time</p>
        </motion.div>

        {/* Summary Cards */}
        <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Avg Health Score", value: summary?.healthScore, suffix: "/100", color: "text-primary", icon: <Heart className="h-4 w-4" /> },
            { label: "Avg Water Intake", value: summary?.avgWaterIntake, suffix: "L", color: "text-blue-500", icon: <Activity className="h-4 w-4" /> },
            { label: "Avg Exercise", value: summary?.avgExerciseMinutes, suffix: "min", color: "text-green-500", icon: <TrendingUp className="h-4 w-4" /> },
            { label: "Entries Tracked", value: summary?.totalEntriesThisMonth, suffix: " this month", color: "text-warning", icon: <BarChart2 className="h-4 w-4" /> },
          ].map(stat => (
            <Card key={stat.label} className="rounded-2xl shadow-sm">
              <CardContent className="p-4">
                <div className={`flex items-center gap-1.5 mb-1 ${stat.color}`}>
                  {stat.icon}
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
                {stat.value === undefined ? (
                  <Skeleton className="h-6 w-16" />
                ) : (
                  <p className="text-xl font-bold">{stat.value}{stat.suffix}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Health Score Trend */}
        <motion.div variants={item}>
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" /> Health Score Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              {trendLoading ? (
                <Skeleton className="h-48 w-full rounded-xl" />
              ) : !healthTrend || healthTrend.length === 0 ? (
                <EmptyChart message="No health score data yet. Start logging daily!" />
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={healthTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={d => String(d).slice(0, 10).slice(5).replace('-', '/')} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Tooltip formatter={v => [`${v}`, "Health Score"]} labelFormatter={l => `Date: ${String(l).slice(0, 10)}`} />
                    <Line type="monotone" dataKey="score" stroke="#7C83FD" strokeWidth={2} dot={{ fill: "#7C83FD", r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Symptom Trend */}
        <motion.div variants={item}>
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4 text-destructive" /> Symptom Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              {symptomLoading ? (
                <Skeleton className="h-48 w-full rounded-xl" />
              ) : !symptomTrend || symptomTrend.length === 0 ? (
                <EmptyChart message="No symptom check history yet. Use the Symptom Checker!" />
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={symptomTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={d => String(d).slice(0, 10).slice(5).replace('-', '/')} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip formatter={v => [`${v}`, "Symptom Score"]} labelFormatter={l => `Date: ${String(l).slice(0, 10)}`} />
                    <Bar dataKey="symptomCount" radius={[4, 4, 0, 0]}>
                      {symptomTrend.map((entry, i) => (
                        <Cell key={i} fill={RISK_COLORS[entry.riskLevel as keyof typeof RISK_COLORS] ?? "#7C83FD"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Mood Distribution */}
        <motion.div variants={item}>
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Heart className="h-4 w-4 text-accent-foreground" /> Mood Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!entries ? (
                <Skeleton className="h-48 w-full rounded-xl" />
              ) : moodData.every(d => d.value === 0) ? (
                <EmptyChart message="No mood data yet. Start tracking daily!" />
              ) : (
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={moodData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {moodData.map((entry, i) => (
                          <Cell key={i} fill={MOOD_COLORS[entry.name.toLowerCase() as keyof typeof MOOD_COLORS] ?? "#7C83FD"} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Tracker Data Table */}
        {entries && entries.length > 0 && (
          <motion.div variants={item}>
            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {entries.slice(0, 7).map(entry => (
                    <div key={entry.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <span className="text-sm text-muted-foreground">{entry.date}</span>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-blue-500">{entry.waterIntakeLiters}L</span>
                        <span className="text-green-500">{entry.exerciseMinutes}m</span>
                        <span className={`capitalize font-medium ${entry.mood === "happy" ? "text-success" : entry.mood === "sad" ? "text-destructive" : "text-warning"}`}>{entry.mood}</span>
                        <span className="font-bold text-primary">{entry.healthScore}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
