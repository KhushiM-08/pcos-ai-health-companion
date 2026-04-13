import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Activity, 
  HeartPulse, 
  CalendarDays, 
  BarChart3, 
  MessageCircleHeart, 
  UserCircle,
  Salad,
  LogOut,
  BookOpen,
  Stethoscope,
  Calendar,
  Building2,
  ChevronDown,
  ChevronUp,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/auth-context";

interface AppLayoutProps {
  children: React.ReactNode;
}

const mainNavItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tracker", label: "Tracker", icon: Activity },
  { href: "/periods", label: "Periods", icon: CalendarDays },
  { href: "/symptoms", label: "Symptoms", icon: HeartPulse },
  { href: "/diet", label: "Diet & Lifestyle", icon: Salad },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/chatbot", label: "AI Chat", icon: MessageCircleHeart },
];

const healthNavItems = [
  { href: "/learn", label: "Learn (PCOS Guide)", icon: BookOpen },
  { href: "/doctor-guide", label: "Doctor Guide", icon: Stethoscope },
  { href: "/consult", label: "Consult Doctor", icon: Calendar },
  { href: "/hospitals", label: "Hospitals", icon: Building2 },
];

const profileNavItem = { href: "/profile", label: "Profile", icon: UserCircle };

const mobileNavItems = [
  mainNavItems[0],
  mainNavItems[1],
  mainNavItems[2],
  mainNavItems[4],
  mainNavItems[6],
];

function NavLink({ item, isActive }: { item: { href: string; label: string; icon: React.ElementType }; isActive: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative group",
        isActive
          ? "text-violet-600 font-medium"
          : "text-muted-foreground hover:text-foreground hover:bg-violet-50/60"
      )}
    >
      {isActive && (
        <motion.div
          layoutId="desktop-active-nav"
          className="absolute inset-0 bg-gradient-to-r from-violet-500/12 to-indigo-400/8 rounded-xl -z-10 border border-violet-400/20"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      <item.icon className={cn("flex-shrink-0", isActive ? "text-violet-500" : "text-muted-foreground group-hover:text-foreground")} style={{ width: "1.125rem", height: "1.125rem" }} />
      <span className="text-sm truncate">{item.label}</span>
    </Link>
  );
}

export function AppLayout({ children }: AppLayoutProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [healthExpanded, setHealthExpanded] = useState(
    healthNavItems.some(i => i.href === location)
  );

  const allItems = [...mainNavItems, ...healthNavItems, profileNavItem];

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-violet-200/45 blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 rounded-full bg-indigo-200/35 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full bg-purple-200/30 blur-3xl" />
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-violet-200/50 bg-white/70 backdrop-blur-xl z-10 shadow-xl shadow-violet-100/30 overflow-y-auto">
        <div className="p-5 pb-3">
          <div className="flex items-center gap-3 font-bold text-xl">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-300/40 flex-shrink-0">
              <HeartPulse className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Companion</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 ml-12">PCOS Care & Tracker</p>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-0.5">
          {/* Main nav */}
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-3 pt-2 pb-1">Main</p>
          {mainNavItems.map((item) => (
            <NavLink key={item.href} item={item} isActive={location === item.href} />
          ))}

          {/* Health Resources section */}
          <div className="pt-2">
            <button
              onClick={() => setHealthExpanded(!healthExpanded)}
              className="w-full flex items-center justify-between px-3 py-1 group"
            >
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Health Resources</p>
              {healthExpanded
                ? <ChevronUp className="h-3 w-3 text-muted-foreground" />
                : <ChevronDown className="h-3 w-3 text-muted-foreground" />}
            </button>
            <AnimatePresence initial={false}>
              {healthExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-0.5 pt-0.5">
                    {healthNavItems.map((item) => (
                      <NavLink key={item.href} item={item} isActive={location === item.href} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="pt-1">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-3 pt-2 pb-1">Account</p>
            <NavLink item={profileNavItem} isActive={location === profileNavItem.href} />
          </div>
        </nav>

        {/* User info + logout */}
        {user && (
          <div className="px-4 pb-3">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-violet-50/60 border border-violet-100/50">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
              </div>
              <button onClick={logout} className="text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0" title="Sign out">
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        <div className="p-4 m-4 mt-0 rounded-2xl bg-gradient-to-br from-violet-500/10 to-indigo-400/10 border border-violet-300/20">
          <p className="text-xs font-semibold text-violet-600 mb-1">Daily Reminder 🌸</p>
          <p className="text-xs text-muted-foreground">Log your health data to keep your score updated.</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white/70 backdrop-blur-xl border-b border-violet-200/50 sticky top-0 z-20 shadow-sm shadow-violet-100/20">
          <div className="flex items-center gap-2.5 font-bold text-lg">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
              <HeartPulse className="h-4 w-4 text-white" />
            </div>
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Companion</span>
          </div>
          {user && (
            <button onClick={logout} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-red-500 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-50">
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign out</span>
            </button>
          )}
        </header>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 pb-24 md:pb-8">
          <div className="max-w-5xl mx-auto w-full h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={location}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-violet-200/50 pb-safe z-30 shadow-[0_-4px_24px_rgba(139,92,246,0.12)]">
        <div className="flex items-center justify-around px-1 py-1.5">
          {mobileNavItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center w-14 h-14 relative">
                <div className={cn("p-1.5 rounded-full transition-colors relative z-10", isActive ? "text-violet-600" : "text-muted-foreground")}>
                  {isActive && (
                    <motion.div
                      layoutId="mobile-active-nav"
                      className="absolute inset-0 bg-gradient-to-br from-violet-500/15 to-indigo-400/10 rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <item.icon className="h-5 w-5" />
                </div>
                <span className={cn("text-[9px] mt-0.5 font-medium transition-colors truncate w-full text-center", isActive ? "text-violet-600" : "text-muted-foreground")}>
                  {item.label}
                </span>
              </Link>
            );
          })}
          {/* More button for health resources on mobile */}
          <Link href="/learn" className="flex flex-col items-center justify-center w-14 h-14 relative">
            <div className={cn("p-1.5 rounded-full transition-colors relative z-10", healthNavItems.some(i => i.href === location) ? "text-violet-600" : "text-muted-foreground")}>
              <BookOpen className="h-5 w-5" />
            </div>
            <span className={cn("text-[9px] mt-0.5 font-medium truncate w-full text-center", healthNavItems.some(i => i.href === location) ? "text-violet-600" : "text-muted-foreground")}>
              Learn
            </span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
