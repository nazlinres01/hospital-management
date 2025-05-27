import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Patients from "@/pages/patients";
import Appointments from "@/pages/appointments";
import Doctors from "@/pages/doctors";
import Departments from "@/pages/departments";
import MedicalRecords from "@/pages/medical-records";
import SettingsPage from "@/pages/settings";
import Reports from "@/pages/reports";
import Landing from "@/pages/landing";
import Profile from "@/pages/profile";
import Login from "@/pages/login";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/hastalar" component={Patients} />
      <Route path="/randevular" component={Appointments} />
      <Route path="/doktorlar" component={Doctors} />
      <Route path="/departmanlar" component={Departments} />
      <Route path="/tibbi-kayitlar" component={MedicalRecords} />
      <Route path="/raporlar" component={Reports} />
      <Route path="/ayarlar" component={SettingsPage} />
      <Route path="/profil" component={Profile} />
      <Route path="/login" component={Login} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto">
              <Router />
            </main>
          </div>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
