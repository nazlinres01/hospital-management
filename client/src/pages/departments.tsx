import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Building, Plus, Users, UserCheck } from "lucide-react";
import type { Department, DoctorWithDepartment } from "@shared/schema";

export default function Departments() {
  const [showDepartmentForm, setShowDepartmentForm] = useState(false);

  const { data: departments, isLoading: departmentsLoading } = useQuery<Department[]>({
    queryKey: ["/api/departments"],
  });

  const { data: doctors } = useQuery<DoctorWithDepartment[]>({
    queryKey: ["/api/doctors"],
  });

  const getDoctorsByDepartment = (departmentId: number) => {
    return doctors?.filter(doctor => doctor.department_id === departmentId) || [];
  };

  const getActiveDoctorsByDepartment = (departmentId: number) => {
    return doctors?.filter(doctor => doctor.department_id === departmentId && doctor.is_active) || [];
  };

  const getDepartmentColor = (departmentName: string) => {
    const colors = {
      'Kardiyoloji': 'bg-blue-100 text-blue-800 border-blue-200',
      'Nöroloji': 'bg-purple-100 text-purple-800 border-purple-200',
      'Dahiliye': 'bg-green-100 text-green-800 border-green-200',
      'Ortopedi': 'bg-orange-100 text-orange-800 border-orange-200',
      'Pediatri': 'bg-pink-100 text-pink-800 border-pink-200',
      'Acil Servis': 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[departmentName as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (departmentsLoading) {
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
            <h1 className="text-2xl font-bold text-gray-900">Departman Yönetimi</h1>
            <p className="mt-1 text-sm text-gray-600">
              Hastane departmanlarını görüntüleyin ve yönetin
            </p>
          </div>
          <Button onClick={() => setShowDepartmentForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Yeni Departman
          </Button>
        </div>
      </div>

      {/* Department Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{departments?.length || 0}</div>
            <div className="text-sm text-gray-600">Toplam Departman</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {departments?.filter(dept => getDoctorsByDepartment(dept.id).length > 0).length || 0}
            </div>
            <div className="text-sm text-gray-600">Aktif Departman</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{doctors?.length || 0}</div>
            <div className="text-sm text-gray-600">Toplam Doktor</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {doctors?.filter(d => d.is_active).length || 0}
            </div>
            <div className="text-sm text-gray-600">Aktif Doktor</div>
          </CardContent>
        </Card>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments?.map((department) => {
          const departmentDoctors = getDoctorsByDepartment(department.id);
          const activeDoctors = getActiveDoctorsByDepartment(department.id);
          
          return (
            <Card key={department.id} className={`hover:shadow-lg transition-shadow border-l-4 ${getDepartmentColor(department.name).split(' ').pop()}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getDepartmentColor(department.name).split(' ').slice(0, 2).join(' ')}`}>
                      <Building className={`h-6 w-6 ${getDepartmentColor(department.name).split(' ')[1]}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{department.name}</CardTitle>
                      {department.description && (
                        <p className="text-sm text-gray-500 mt-1">{department.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Department Statistics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <Users className="h-4 w-4 text-blue-600 mr-1" />
                      <span className="text-lg font-semibold text-blue-600">
                        {departmentDoctors.length}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">Toplam Doktor</div>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <UserCheck className="h-4 w-4 text-green-600 mr-1" />
                      <span className="text-lg font-semibold text-green-600">
                        {activeDoctors.length}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">Aktif Doktor</div>
                  </div>
                </div>

                {/* Doctors List */}
                {departmentDoctors.length > 0 ? (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Doktorlar:</h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {departmentDoctors.map((doctor) => (
                        <div key={doctor.id} className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">
                            Dr. {doctor.first_name} {doctor.last_name}
                          </span>
                          <Badge 
                            variant={doctor.is_active ? "default" : "secondary"}
                            className={doctor.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}
                          >
                            {doctor.is_active ? "Aktif" : "Pasif"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">Bu departmanda doktor bulunmuyor</p>
                  </div>
                )}

                {/* Department Status */}
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Durum:</span>
                    <Badge 
                      className={activeDoctors.length > 0 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {activeDoctors.length > 0 ? "Aktif" : "Beklemede"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {departments?.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Henüz departman kaydı yok
          </h3>
          <p className="text-gray-500 mb-6">
            İlk departmanınızı oluşturmak için aşağıdaki butona tıklayın.
          </p>
          <Button onClick={() => setShowDepartmentForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            İlk Departmanı Oluştur
          </Button>
        </div>
      )}

      {/* Department Form Modal */}
      <Dialog open={showDepartmentForm} onOpenChange={setShowDepartmentForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Yeni Departman Oluştur</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-600">
              Departman oluşturma özelliği yakında eklenecek. Şimdilik örnek departmanlar mevcut.
            </p>
            <Button 
              onClick={() => setShowDepartmentForm(false)} 
              className="w-full"
              variant="outline"
            >
              Tamam
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
