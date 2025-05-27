import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Users, 
  Calendar, 
  UserCheck, 
  Building, 
  FileText, 
  TrendingUp, 
  Settings,
  Hospital
} from "lucide-react";

const navigation = [
  { name: "Ana Panel", href: "/", icon: BarChart3 },
  { name: "Hasta Yönetimi", href: "/hastalar", icon: Users },
  { name: "Randevular", href: "/randevular", icon: Calendar },
  { name: "Doktor & Personel", href: "/doktorlar", icon: UserCheck },
  { name: "Departmanlar", href: "/departmanlar", icon: Building },
  { name: "Tıbbi Kayıtlar", href: "/tibbi-kayitlar", icon: FileText },
  { name: "Raporlar", href: "/raporlar", icon: TrendingUp },
  { name: "Ayarlar", href: "/ayarlar", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="hidden lg:flex lg:w-72 lg:flex-col">
      <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-0 overflow-y-auto">
        {/* Logo/Header */}
        <div className="flex items-center flex-shrink-0 px-6 py-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Hospital className="text-blue-600 h-8 w-8" />
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-gray-900">MedSystem Pro</h1>
              <p className="text-sm text-gray-500">Hastane Yönetimi</p>
            </div>
          </div>
        </div>
        
        {/* Navigation Menu */}
        <nav className="mt-6 flex-1 px-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.name} href={item.href}>
                <a className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                )}>
                  <Icon className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0",
                    isActive ? "text-blue-500" : "text-gray-400"
                  )} />
                  {item.name}
                  {item.name === "Randevular" && (
                    <span className="ml-auto bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                      23
                    </span>
                  )}
                  {item.name === "Hasta Yönetimi" && (
                    <span className="ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                      1,247
                    </span>
                  )}
                </a>
              </Link>
            );
          })}
        </nav>
        
        {/* User Profile */}
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div>
              <div className="inline-block h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-sm font-medium text-white">DM</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Dr. Mehmet Özkan</p>
              <p className="text-xs text-gray-500">Sistem Yöneticisi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
