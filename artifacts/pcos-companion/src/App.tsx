import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/app-layout";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import Dashboard from "@/pages/dashboard";
import Tracker from "@/pages/tracker";
import Symptoms from "@/pages/symptoms";
import Periods from "@/pages/periods";
import Reports from "@/pages/reports";
import Chatbot from "@/pages/chatbot";
import Profile from "@/pages/profile";
import Diet from "@/pages/diet";
import Learn from "@/pages/learn";
import DoctorGuide from "@/pages/doctor-guide";
import Consult from "@/pages/consult";
import Hospitals from "@/pages/hospitals";
import AuthPage from "@/pages/auth";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function ProtectedRouter() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg animate-pulse">
            <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <p className="text-violet-500 text-sm font-medium animate-pulse">Loading your wellness journey…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/tracker" component={Tracker} />
        <Route path="/symptoms" component={Symptoms} />
        <Route path="/periods" component={Periods} />
        <Route path="/reports" component={Reports} />
        <Route path="/chatbot" component={Chatbot} />
        <Route path="/profile" component={Profile} />
        <Route path="/diet" component={Diet} />
        <Route path="/learn" component={Learn} />
        <Route path="/doctor-guide" component={DoctorGuide} />
        <Route path="/consult" component={Consult} />
        <Route path="/hospitals" component={Hospitals} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <ProtectedRouter />
          </WouterRouter>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
