import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { HeartPulse, Eye, EyeOff, Sparkles, Leaf, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        if (!name.trim()) { setError("Please enter your name"); setLoading(false); return; }
        await register(name, email, password);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex overflow-hidden relative">
      {/* Animated background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-48 -left-48 w-[600px] h-[600px] rounded-full bg-violet-200/50 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-48 w-[500px] h-[500px] rounded-full bg-indigo-200/40 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute -bottom-32 left-1/3 w-[450px] h-[450px] rounded-full bg-purple-200/35 blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/4 left-1/2 w-64 h-64 rounded-full bg-lavender-200/30 blur-2xl" />
      </div>

      {/* Left hero panel — hidden on mobile */}
      <div className="hidden lg:flex flex-col flex-1 relative bg-gradient-to-br from-violet-500/90 via-indigo-500/80 to-purple-600/90 overflow-hidden">
        {/* Overlay pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        {/* Hero image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=900&auto=format&fit=crop&q=80"
            alt="Wellness"
            className="w-full h-full object-cover opacity-20"
          />
        </div>

        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-auto">
            <div className="w-10 h-10 rounded-2xl bg-white/25 backdrop-blur flex items-center justify-center shadow-lg">
              <HeartPulse className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">PCOS Companion</span>
          </div>

          {/* Center content */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur rounded-full px-4 py-2 text-white/90 text-sm">
                <Sparkles className="h-3.5 w-3.5" />
                AI-Powered Women's Health
              </div>
              <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
                Your personal<br />
                <span className="text-violet-200">PCOS wellness</span><br />
                companion
              </h1>
              <p className="text-white/75 text-lg max-w-sm leading-relaxed">
                Track your cycle, manage symptoms, follow personalized diet plans, and get AI-powered health insights.
              </p>
            </div>

            {/* Feature pills */}
            <div className="mt-10 flex flex-wrap gap-3">
              {[
                { icon: "🌸", label: "Period Tracking" },
                { icon: "🥗", label: "Diet Plans" },
                { icon: "📊", label: "Health Analytics" },
                { icon: "🤖", label: "AI Chatbot" },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 text-white/90 text-sm font-medium border border-white/20">
                  <span>{f.icon}</span>
                  {f.label}
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div className="mt-auto pt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-300 text-yellow-300" />
                ))}
              </div>
              <p className="text-white/90 text-sm italic leading-relaxed">
                "This app completely changed how I manage my PCOS. The diet recommendations are so helpful and the tracking is seamless!"
              </p>
              <div className="mt-3 flex items-center gap-2.5">
                <img
                  src="https://images.unsplash.com/photo-1494790108755-2616b332c3bb?w=40&h=40&auto=format&fit=crop&crop=face"
                  alt="User"
                  className="w-8 h-8 rounded-full object-cover border-2 border-white/30"
                />
                <div>
                  <p className="text-white font-semibold text-sm">Priya Sharma</p>
                  <p className="text-white/60 text-xs">Managing PCOS for 2 years</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 lg:max-w-md xl:max-w-lg flex flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8 flex flex-col items-center">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-violet-300/40 mb-3">
            <HeartPulse className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">PCOS Companion</h1>
          <p className="text-muted-foreground text-sm mt-1">Your AI-powered wellness partner</p>
        </div>

        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-sm"
        >
          {/* Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-violet-200/40 border border-white/70 p-8">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-foreground">
                {mode === "login" ? "Welcome back 👋" : "Join us today 🌸"}
              </h2>
              <p className="text-muted-foreground text-sm mt-1.5">
                {mode === "login"
                  ? "Sign in to continue your wellness journey"
                  : "Create your free account to get started"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence>
                {mode === "signup" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Sarah Patel"
                      className="w-full px-4 py-3 rounded-xl border border-violet-200/60 bg-violet-50/40 focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400 placeholder:text-muted-foreground/50 text-sm transition-all"
                      autoComplete="name"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-violet-200/60 bg-violet-50/40 focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400 placeholder:text-muted-foreground/50 text-sm transition-all"
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === "signup" ? "At least 6 characters" : "Enter your password"}
                    className="w-full px-4 py-3 pr-11 rounded-xl border border-violet-200/60 bg-violet-50/40 focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400 placeholder:text-muted-foreground/50 text-sm transition-all"
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl"
                >
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-violet-300/40 hover:shadow-violet-300/60 hover:from-violet-600 hover:to-indigo-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
                    </svg>
                    {mode === "login" ? "Signing in..." : "Creating account..."}
                  </span>
                ) : (
                  mode === "login" ? "Sign In" : "Create Account"
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              {mode === "login" ? (
                <>
                  Don't have an account?{" "}
                  <button
                    onClick={() => { setMode("signup"); setError(""); }}
                    className="text-violet-600 font-semibold hover:text-violet-700 transition-colors"
                  >
                    Sign up free
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => { setMode("login"); setError(""); }}
                    className="text-violet-600 font-semibold hover:text-violet-700 transition-colors"
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
            {[
              { icon: <Leaf className="h-3.5 w-3.5 text-violet-400" />, label: "100% Free" },
              { icon: <HeartPulse className="h-3.5 w-3.5 text-violet-400" />, label: "Private & Secure" },
              { icon: <Sparkles className="h-3.5 w-3.5 text-violet-400" />, label: "AI-Powered" },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-1.5">
                {b.icon}
                <span>{b.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
