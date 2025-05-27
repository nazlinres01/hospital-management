import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Bell, Plus, Menu } from "lucide-react";
import PatientForm from "./patient-form";

export default function Header() {
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Mobile menu button */}
        <Button variant="ghost" size="icon" className="lg:hidden text-gray-500 hover:text-gray-700">
          <Menu className="h-5 w-5" />
        </Button>
        
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Hasta adı, TC kimlik, telefon ile arama..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-3 py-2.5 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        {/* Header Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-500 relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
              3
            </Badge>
          </Button>
          
          {/* Quick Actions */}
          <Button 
            onClick={() => setShowPatientForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Yeni Hasta
          </Button>
        </div>
      </div>

      {/* Patient Form Modal */}
      <Dialog open={showPatientForm} onOpenChange={setShowPatientForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Yeni Hasta Kaydı</DialogTitle>
          </DialogHeader>
          <PatientForm onSuccess={() => setShowPatientForm(false)} />
        </DialogContent>
      </Dialog>
    </header>
  );
}
