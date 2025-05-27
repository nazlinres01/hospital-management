import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserCheck, Plus, Phone, Mail, Building } from "lucide-react";
import DoctorForm from "@/components/doctor-form";
import type { DoctorWithDepartment } from "@shared/schema";

export default function Doctors() {
  const [showDoctorForm, setShowDoctorForm] = useState(false);

  const { data: doctors, isLoading } = useQuery<DoctorWithDepartment[]>({
    queryKey: ["/api/doctors"],
  });

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

  const getStats = () => {
    if (!doctors) return { total: 0, active: 0, inactive: 0, departments: 0 };
    
    const uniqueDepartments = new Set(doctors.map(d => d.department_id)).size;
    
    return {
      total: doctors.length,
      active: doctors.filter(d => d.is_active).length,
      inactive: doctors.filter(d => !d.is_active).length,
      departments: uniqueDepartments,
    };
  };

  const stats = getStats();

  const groupDoctorsByDepartment = (doctors: DoctorWithDepartment[]) => {
    return doctors.reduce((acc, doctor) => {
      const deptName = doctor.department.name;
      if (!acc[deptName]) {
        acc[deptName] = [];
      }
      acc[deptName].push(doctor);
      return acc;
    }, {} as Record<string, DoctorWithDepartment[]>);
  };

  const groupedDoctors = doctors ? groupDoctorsByDepartment(doctors) : {};

  if (isLoading) {
    return (
      <div className="px-6 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
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
            <h1 className="text-2xl font-bold text-gray-900">Doktor & Personel Yönetimi</h1>
            <p className="mt-1 text-sm text-gray-600">
              Hastane personelini görüntüleyin ve yönetin
            </p>
          </div>
          <Button onClick={() => setShowDoctorForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Yeni Doktor
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Toplam Doktor</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-gray-600">Aktif Doktor</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
            <div className="text-sm text-gray-600">Pasif Doktor</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.departments}</div>
            <div className="text-sm text-gray-600">Aktif Departman</div>
          </CardContent>
        </Card>
      </div>

      {/* Doctors by Department */}
      <div className="space-y-8">
        {Object.entries(groupedDoctors).map(([departmentName, departmentDoctors]) => (
          <Card key={departmentName}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Building className="h-5 w-5 mr-2 text-gray-600" />
                  <span>{departmentName}</span>
                </div>
                <Badge variant="outline">
                  {departmentDoctors.length} doktor
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departmentDoctors.map((doctor) => (
                  <div key={doctor.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {doctor.first_name.charAt(0)}{doctor.last_name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Dr. {doctor.first_name} {doctor.last_name}
                          </h3>
                          <p className="text-sm text-gray-600">{doctor.specialization}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {doctor.is_active ? (
                          <Badge className="bg-green-100 text-green-800">
                            <UserCheck className="h-3 w-3 mr-1" />
                            Aktif
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">
                            Pasif
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {doctor.phone}
                      </div>
                      
                      {doctor.email && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-4 w-4 mr-2" />
                          {doctor.email}
                        </div>
                      )}

                      <div className="pt-2">
                        <Badge className={getDepartmentColor(doctor.department.name)}>
                          {doctor.department.name}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {doctors?.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCheck className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Henüz doktor kaydı yok
          </h3>
          <p className="text-gray-500 mb-6">
            İlk doktor kaydınızı oluşturmak için aşağıdaki butona tıklayın.
          </p>
          <Button onClick={() => setShowDoctorForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            İlk Doktoru Kaydet
          </Button>
        </div>
      )}

      {/* Doctor Form Modal */}
      <Dialog open={showDoctorForm} onOpenChange={setShowDoctorForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Yeni Doktor Kaydı</DialogTitle>
          </DialogHeader>
          <DoctorForm onSuccess={() => setShowDoctorForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
