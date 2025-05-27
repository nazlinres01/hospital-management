import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Plus, Phone, MapPin } from "lucide-react";
import PatientForm from "@/components/patient-form";
import type { PatientWithLastAppointment } from "@shared/schema";

export default function Patients() {
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: patients, isLoading } = useQuery<PatientWithLastAppointment[]>({
    queryKey: ["/api/patients"],
  });

  const { data: searchResults } = useQuery({
    queryKey: ["/api/patients/search", searchQuery],
    enabled: searchQuery.length > 2,
  });

  const filteredPatients = searchQuery.length > 2 ? searchResults : patients;

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateString));
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no_show':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Planlandı';
      case 'completed':
        return 'Tamamlandı';
      case 'cancelled':
        return 'İptal Edildi';
      case 'no_show':
        return 'Gelmedi';
      default:
        return status;
    }
  };

  const getDepartmentColor = (departmentName: string) => {
    const colors = {
      'Kardiyoloji': 'bg-blue-100 text-blue-800',
      'Nöroloji': 'bg-purple-100 text-purple-800',
      'Dahiliye': 'bg-green-100 text-green-800',
      'Ortopedi': 'bg-orange-100 text-orange-800',
      'Pediatri': 'bg-pink-100 text-pink-800',
      'Acil Servis': 'bg-red-100 text-red-800',
    };
    return colors[departmentName as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="px-6 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hasta Yönetimi</h1>
            <p className="mt-1 text-sm text-gray-600">
              Kayıtlı hastaları görüntüleyin ve yönetin
            </p>
          </div>
          <Button onClick={() => setShowPatientForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Yeni Hasta
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Hasta adı, TC kimlik, telefon ile arama..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{patients?.length || 0}</div>
            <div className="text-sm text-gray-600">Toplam Hasta</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {patients?.filter(p => p.last_appointment?.status === 'completed').length || 0}
            </div>
            <div className="text-sm text-gray-600">Tedavi Tamamlandı</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {patients?.filter(p => p.last_appointment?.status === 'scheduled').length || 0}
            </div>
            <div className="text-sm text-gray-600">Randevu Bekliyor</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {patients?.filter(p => !p.last_appointment).length || 0}
            </div>
            <div className="text-sm text-gray-600">Yeni Kayıt</div>
          </CardContent>
        </Card>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients?.map((patient) => (
          <Card key={patient.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {patient.first_name.charAt(0)}{patient.last_name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {patient.first_name} {patient.last_name}
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                      {calculateAge(patient.birth_date)} yaş • {patient.gender === 'male' ? 'Erkek' : 'Kadın'}
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                {patient.phone}
              </div>
              
              {patient.address && (
                <div className="flex items-start text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-2">{patient.address}</span>
                </div>
              )}

              <div className="pt-2 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Son Durum</span>
                  {patient.last_appointment ? (
                    <Badge className={getStatusColor(patient.last_appointment.status)}>
                      {getStatusText(patient.last_appointment.status)}
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      Yeni Kayıt
                    </Badge>
                  )}
                </div>
                
                {patient.last_appointment && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Departman:</span>
                      <Badge className={getDepartmentColor(patient.last_appointment.department.name)}>
                        {patient.last_appointment.department.name}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Doktor:</span>
                      <span className="text-gray-700">
                        Dr. {patient.last_appointment.doctor.first_name} {patient.last_appointment.doctor.last_name}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                <span>TC: {patient.tc_no}</span>
                <span>Kayıt: {patient.registration_date ? formatDate(patient.registration_date) : '-'}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredPatients?.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'Hasta bulunamadı' : 'Henüz hasta kaydı yok'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery 
              ? 'Arama kriterlerinize uygun hasta bulunamadı.' 
              : 'İlk hasta kaydınızı oluşturmak için aşağıdaki butona tıklayın.'
            }
          </p>
          {!searchQuery && (
            <Button onClick={() => setShowPatientForm(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              İlk Hastayı Kaydet
            </Button>
          )}
        </div>
      )}

      {/* Patient Form Modal */}
      <Dialog open={showPatientForm} onOpenChange={setShowPatientForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Yeni Hasta Kaydı</DialogTitle>
          </DialogHeader>
          <PatientForm onSuccess={() => setShowPatientForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
