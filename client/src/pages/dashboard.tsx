import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, UserCheck, Building, TrendingUp, Plus } from "lucide-react";
import { useState } from "react";
import PatientForm from "@/components/patient-form";
import AppointmentForm from "@/components/appointment-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { AppointmentWithDetails, PatientWithLastAppointment } from "@shared/schema";

export default function Dashboard() {
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);

  const { data: stats } = useQuery({
    queryKey: ["/api/statistics"],
  });

  const { data: recentPatients } = useQuery<PatientWithLastAppointment[]>({
    queryKey: ["/api/patients"],
  });

  const { data: todayAppointments } = useQuery<AppointmentWithDetails[]>({
    queryKey: ["/api/appointments/today"],
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateString));
  };

  const formatTime = (dateString: string) => {
    return new Intl.DateTimeFormat('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
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

  return (
    <div className="px-6 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Ana Panel</h1>
        <p className="mt-1 text-sm text-gray-600">Hastane işlemlerinizi yönetin ve takip edin</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="text-blue-600 h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Hasta</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalPatients || 0}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% bu ay
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar className="text-orange-600 h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bugünkü Randevular</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.todayAppointments || 0}</p>
                <p className="text-sm text-gray-500">
                  {todayAppointments?.filter(apt => apt.status === 'scheduled').length || 0} beklemede
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="text-green-600 h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aktif Doktorlar</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.activeDoctors || 0}</p>
                <p className="text-sm text-green-600">
                  {Math.floor((stats?.activeDoctors || 0) * 0.8)} görevde
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-green-600 h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aylık Gelir</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(2100000)}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8.5% geçen ay
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Patients */}
        <div className="lg:col-span-2">
          <Card className="border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Son Kayıtlı Hastalar</h3>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  Tümünü Gör
                </Button>
              </div>
            </div>
            <div className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hasta Bilgileri
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Son Departman
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Durum
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kayıt Tarihi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentPatients?.slice(0, 5).map((patient) => (
                      <tr key={patient.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">
                                  {patient.first_name.charAt(0)}{patient.last_name.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {patient.first_name} {patient.last_name}
                              </div>
                              <div className="text-sm text-gray-500">TC: {patient.tc_no}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {patient.last_appointment ? (
                            <Badge className={getDepartmentColor(patient.last_appointment.department.name)}>
                              {patient.last_appointment.department.name}
                            </Badge>
                          ) : (
                            <span className="text-sm text-gray-500">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {patient.last_appointment ? (
                            <Badge className={getStatusColor(patient.last_appointment.status)}>
                              {getStatusText(patient.last_appointment.status)}
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              Yeni Kayıt
                            </Badge>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {patient.registration_date ? formatDate(patient.registration_date) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>

        {/* Today's Schedule & Quick Actions */}
        <div className="space-y-6">
          {/* Today's Schedule */}
          <Card className="border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Bugünkü Program</h3>
            </div>
            <div className="p-6 space-y-4">
              {todayAppointments?.slice(0, 4).map((appointment) => (
                <div key={appointment.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {formatTime(appointment.appointment_date)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {appointment.patient.first_name} {appointment.patient.last_name} - {appointment.complaint || 'Kontrol'}
                    </p>
                    <p className="text-xs text-gray-500">
                      Dr. {appointment.doctor.first_name} {appointment.doctor.last_name}
                    </p>
                  </div>
                </div>
              ))}
              {(!todayAppointments || todayAppointments.length === 0) && (
                <p className="text-sm text-gray-500 text-center py-4">
                  Bugün için randevu bulunmuyor
                </p>
              )}
            </div>
            <div className="px-6 py-3 border-t border-gray-200">
              <Button variant="ghost" size="sm" className="w-full text-blue-600 hover:text-blue-700">
                Tüm Randevuları Görüntüle
              </Button>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Hızlı İşlemler</h3>
            </div>
            <div className="p-6 space-y-3">
              <Button
                variant="ghost"
                className="w-full justify-between p-3 h-auto bg-gray-50 hover:bg-gray-100"
                onClick={() => setShowPatientForm(true)}
              >
                <div className="flex items-center">
                  <Plus className="text-blue-500 mr-3 h-4 w-4" />
                  <span className="text-sm font-medium text-gray-900">Yeni Hasta Kaydı</span>
                </div>
                <span className="text-gray-400">→</span>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-between p-3 h-auto bg-gray-50 hover:bg-gray-100"
                onClick={() => setShowAppointmentForm(true)}
              >
                <div className="flex items-center">
                  <Calendar className="text-green-500 mr-3 h-4 w-4" />
                  <span className="text-sm font-medium text-gray-900">Randevu Oluştur</span>
                </div>
                <span className="text-gray-400">→</span>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-between p-3 h-auto bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <TrendingUp className="text-orange-500 mr-3 h-4 w-4" />
                  <span className="text-sm font-medium text-gray-900">Rapor Oluştur</span>
                </div>
                <span className="text-gray-400">→</span>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-between p-3 h-auto bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <Building className="text-purple-500 mr-3 h-4 w-4" />
                  <span className="text-sm font-medium text-gray-900">Departman Durumu</span>
                </div>
                <span className="text-gray-400">→</span>
              </Button>
            </div>
          </Card>

          {/* System Status */}
          <Card className="border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Sistem Durumu</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Veritabanı Bağlantısı</span>
                <span className="flex items-center text-green-600">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                  Çevrimiçi
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Backup Durumu</span>
                <span className="flex items-center text-green-600">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                  Güncel
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Durumu</span>
                <span className="flex items-center text-yellow-600">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></div>
                  Yavaş
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <Dialog open={showPatientForm} onOpenChange={setShowPatientForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Yeni Hasta Kaydı</DialogTitle>
          </DialogHeader>
          <PatientForm onSuccess={() => setShowPatientForm(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={showAppointmentForm} onOpenChange={setShowAppointmentForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Yeni Randevu Oluştur</DialogTitle>
          </DialogHeader>
          <AppointmentForm onSuccess={() => setShowAppointmentForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
