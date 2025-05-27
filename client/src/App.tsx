import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Patients from "@/pages/patients";
import Appointments from "@/pages/appointments";
import Doctors from "@/pages/doctors";
import Departments from "@/pages/departments";
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
