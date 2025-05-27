import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Clock, Plus, User, Building } from "lucide-react";
import AppointmentForm from "@/components/appointment-form";
import type { AppointmentWithDetails } from "@shared/schema";

export default function Appointments() {
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);

  const { data: appointments, isLoading } = useQuery<AppointmentWithDetails[]>({
    queryKey: ["/api/appointments"],
  });

  const { data: todayAppointments } = useQuery<AppointmentWithDetails[]>({
    queryKey: ["/api/appointments/today"],
  });

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: 'long',
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

  const groupAppointmentsByDate = (appointments: AppointmentWithDetails[]) => {
    const grouped = appointments.reduce((acc, appointment) => {
      const date = new Date(appointment.appointment_date).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(appointment);
      return acc;
    }, {} as Record<string, AppointmentWithDetails[]>);

    // Sort appointments within each date by time
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => 
        new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime()
      );
    });

    return grouped;
  };

  const getStats = () => {
    if (!appointments) return { total: 0, scheduled: 0, completed: 0, cancelled: 0 };
    
    return {
      total: appointments.length,
      scheduled: appointments.filter(apt => apt.status === 'scheduled').length,
      completed: appointments.filter(apt => apt.status === 'completed').length,
      cancelled: appointments.filter(apt => apt.status === 'cancelled').length,
    };
  };

  const stats = getStats();
  const groupedAppointments = appointments ? groupAppointmentsByDate(appointments) : {};
  const sortedDates = Object.keys(groupedAppointments).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

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
            <h1 className="text-2xl font-bold text-gray-900">Randevu Yönetimi</h1>
            <p className="mt-1 text-sm text-gray-600">
              Hasta randevularını görüntüleyin ve yönetin
            </p>
          </div>
          <Button onClick={() => setShowAppointmentForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Yeni Randevu
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Toplam Randevu</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{stats.scheduled}</div>
            <div className="text-sm text-gray-600">Planlandı</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Tamamlandı</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
            <div className="text-sm text-gray-600">İptal Edildi</div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Appointments */}
      {todayAppointments && todayAppointments.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Bugünkü Randevular ({todayAppointments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {todayAppointments.map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-blue-600" />
                      <span className="font-semibold text-blue-900">
                        {formatTime(appointment.appointment_date)}
                      </span>
                    </div>
                    <Badge className={getStatusColor(appointment.status)}>
                      {getStatusText(appointment.status)}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <User className="h-3 w-3 mr-2 text-gray-500" />
                      <span className="font-medium">
                        {appointment.patient.first_name} {appointment.patient.last_name}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Building className="h-3 w-3 mr-2 text-gray-500" />
                      <span>{appointment.department.name}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Dr. {appointment.doctor.first_name} {appointment.doctor.last_name}
                    </div>
                    {appointment.complaint && (
                      <div className="text-sm text-gray-500 mt-2">
                        <span className="font-medium">Şikayet:</span> {appointment.complaint}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Appointments */}
      <div className="space-y-6">
        {sortedDates.map((dateString) => {
          const date = new Date(dateString);
          const isToday = date.toDateString() === new Date().toDateString();
          const dayAppointments = groupedAppointments[dateString];

          return (
            <Card key={dateString}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-gray-600" />
                    <span>
                      {formatDate(dateString)}
                      {isToday && <span className="ml-2 text-sm text-blue-600">(Bugün)</span>}
                    </span>
                  </div>
                  <Badge variant="outline">
                    {dayAppointments.length} randevu
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dayAppointments.map((appointment) => (
                    <div key={appointment.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-gray-500" />
                            <span className="font-semibold">
                              {formatTime(appointment.appointment_date)}
                            </span>
                          </div>
                          <Badge className={getDepartmentColor(appointment.department.name)}>
                            {appointment.department.name}
                          </Badge>
                        </div>
                        <Badge className={getStatusColor(appointment.status)}>
                          {getStatusText(appointment.status)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center mb-2">
                            <User className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="font-medium">
                              {appointment.patient.first_name} {appointment.patient.last_name}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 ml-6">
                            TC: {appointment.patient.tc_no}
                          </div>
                          <div className="text-sm text-gray-600 ml-6">
                            Tel: {appointment.patient.phone}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm">
                            <span className="font-medium">Doktor:</span> Dr. {appointment.doctor.first_name} {appointment.doctor.last_name}
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Uzmanlık:</span> {appointment.doctor.specialization}
                          </div>
                        </div>
                      </div>
                      
                      {appointment.complaint && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="text-sm">
                            <span className="font-medium">Şikayet:</span> {appointment.complaint}
                          </div>
                        </div>
                      )}

                      {appointment.notes && (
                        <div className="mt-2">
                          <div className="text-sm">
                            <span className="font-medium">Notlar:</span> {appointment.notes}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {appointments?.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Henüz randevu kaydı yok
          </h3>
          <p className="text-gray-500 mb-6">
            İlk randevunuzu oluşturmak için aşağıdaki butona tıklayın.
          </p>
          <Button onClick={() => setShowAppointmentForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            İlk Randevuyu Oluştur
          </Button>
        </div>
      )}

      {/* Appointment Form Modal */}
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
