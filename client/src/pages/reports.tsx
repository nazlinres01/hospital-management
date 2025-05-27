import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  TrendingUp, 
  Calendar, 
  Users, 
  UserCheck, 
  Building,
  FileText,
  Download,
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  DollarSign
} from "lucide-react";
import type { AppointmentWithDetails, PatientWithLastAppointment, DoctorWithDepartment } from "@shared/schema";

export default function Reports() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const { data: appointments } = useQuery<AppointmentWithDetails[]>({
    queryKey: ["/api/appointments"],
  });

  const { data: patients } = useQuery<PatientWithLastAppointment[]>({
    queryKey: ["/api/patients"],
  });

  const { data: doctors } = useQuery<DoctorWithDepartment[]>({
    queryKey: ["/api/doctors"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/statistics"],
  });

  // Rapor hesaplamaları
  const getReportData = () => {
    if (!appointments || !patients || !doctors) {
      return {
        totalRevenue: 0,
        appointmentStats: {},
        departmentStats: {},
        doctorPerformance: {},
        patientDemographics: {},
        dailyStats: {}
      };
    }

    // Gelir hesaplama (örnek fiyatlar)
    const appointmentPrices = {
      'Kardiyoloji': 500,
      'Nöroloji': 450,
      'Dahiliye': 300,
      'Ortopedi': 400,
      'Pediatri': 250,
      'Acil Servis': 200
    };

    const totalRevenue = appointments
      .filter(apt => apt.status === 'completed')
      .reduce((sum, apt) => {
        const dept = apt.department.name as keyof typeof appointmentPrices;
        return sum + (appointmentPrices[dept] || 300);
      }, 0);

    // Randevu durumu istatistikleri
    const appointmentStats = appointments.reduce((acc, apt) => {
      acc[apt.status] = (acc[apt.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Departman istatistikleri
    const departmentStats = appointments.reduce((acc, apt) => {
      const deptName = apt.department.name;
      if (!acc[deptName]) {
        acc[deptName] = { count: 0, completed: 0, cancelled: 0 };
      }
      acc[deptName].count++;
      if (apt.status === 'completed') acc[deptName].completed++;
      if (apt.status === 'cancelled') acc[deptName].cancelled++;
      return acc;
    }, {} as Record<string, any>);

    // Doktor performansı
    const doctorPerformance = appointments.reduce((acc, apt) => {
      const doctorId = apt.doctor_id;
      const doctorName = `Dr. ${apt.doctor.first_name} ${apt.doctor.last_name}`;
      if (!acc[doctorId]) {
        acc[doctorId] = { 
          name: doctorName, 
          department: apt.department.name,
          total: 0, 
          completed: 0, 
          cancelled: 0 
        };
      }
      acc[doctorId].total++;
      if (apt.status === 'completed') acc[doctorId].completed++;
      if (apt.status === 'cancelled') acc[doctorId].cancelled++;
      return acc;
    }, {} as Record<number, any>);

    // Hasta demografik bilgileri
    const patientDemographics = patients.reduce((acc, patient) => {
      const age = calculateAge(patient.birth_date);
      const ageGroup = age < 18 ? '0-17' : age < 35 ? '18-34' : age < 55 ? '35-54' : '55+';
      
      acc.ageGroups = acc.ageGroups || {};
      acc.ageGroups[ageGroup] = (acc.ageGroups[ageGroup] || 0) + 1;
      
      acc.genders = acc.genders || {};
      acc.genders[patient.gender] = (acc.genders[patient.gender] || 0) + 1;
      
      return acc;
    }, {} as any);

    return {
      totalRevenue,
      appointmentStats,
      departmentStats,
      doctorPerformance,
      patientDemographics,
    };
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

  const reportData = getReportData();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const exportReport = (type: 'pdf' | 'excel' | 'csv') => {
    console.log(`${type} raporu dışa aktarılıyor...`);
    // API çağrısı burada yapılacak
  };

  return (
    <div className="px-6 py-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Raporlar ve Analizler</h1>
            <p className="mt-1 text-sm text-gray-600">
              Hastane performans raporlarını görüntüleyin ve analiz edin
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => exportReport('excel')}>
              <Download className="h-4 w-4 mr-2" />
              Excel
            </Button>
            <Button variant="outline" onClick={() => exportReport('pdf')}>
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Filtreler */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Rapor Filtreleri
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="startDate">Başlangıç Tarihi</Label>
              <Input
                id="startDate"
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="endDate">Bitiş Tarihi</Label>
              <Input
                id="endDate"
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
              />
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                <BarChart3 className="h-4 w-4 mr-2" />
                Filtrele
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Özet Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="text-green-600 h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(reportData.totalRevenue)}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% bu ay
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="text-blue-600 h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Randevu</p>
                <p className="text-2xl font-bold text-gray-900">{appointments?.length || 0}</p>
                <p className="text-sm text-blue-600">
                  {reportData.appointmentStats.completed || 0} tamamlandı
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="text-purple-600 h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Hasta</p>
                <p className="text-2xl font-bold text-gray-900">{patients?.length || 0}</p>
                <p className="text-sm text-purple-600">
                  {patients?.filter(p => p.last_appointment).length || 0} aktif
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="text-orange-600 h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aktif Doktor</p>
                <p className="text-2xl font-bold text-gray-900">{doctors?.filter(d => d.is_active).length || 0}</p>
                <p className="text-sm text-orange-600">
                  {doctors?.length || 0} toplam doktor
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Departman Performansı */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="h-5 w-5 mr-2" />
              Departman Performansı
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(reportData.departmentStats).map(([dept, stats]: [string, any]) => (
                <div key={dept} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{dept}</h4>
                    <p className="text-sm text-gray-600">
                      {stats.count} randevu • {stats.completed} tamamlandı
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-100 text-green-800">
                      %{Math.round((stats.completed / stats.count) * 100) || 0}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hasta Demografik Bilgileri */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Hasta Demografik Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-3">Yaş Grupları</h4>
                <div className="space-y-2">
                  {Object.entries(reportData.patientDemographics.ageGroups || {}).map(([age, count]: [string, any]) => (
                    <div key={age} className="flex items-center justify-between">
                      <span className="text-sm">{age} yaş</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{width: `${(count / (patients?.length || 1)) * 100}%`}}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Cinsiyet Dağılımı</h4>
                <div className="space-y-2">
                  {Object.entries(reportData.patientDemographics.genders || {}).map(([gender, count]: [string, any]) => (
                    <div key={gender} className="flex items-center justify-between">
                      <span className="text-sm">{gender === 'male' ? 'Erkek' : 'Kadın'}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'}`}
                            style={{width: `${(count / (patients?.length || 1)) * 100}%`}}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Doktor Performans Tablosu */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <LineChart className="h-5 w-5 mr-2" />
            Doktor Performans Analizi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doktor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Departman
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Toplam Randevu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tamamlanan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Başarı Oranı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(reportData.doctorPerformance).map(([doctorId, performance]: [string, any]) => {
                  const successRate = Math.round((performance.completed / performance.total) * 100) || 0;
                  return (
                    <tr key={doctorId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{performance.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{performance.department}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{performance.total}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{performance.completed}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">%{successRate}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={
                          successRate >= 90 ? "bg-green-100 text-green-800" :
                          successRate >= 70 ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }>
                          {successRate >= 90 ? 'Mükemmel' : successRate >= 70 ? 'İyi' : 'Gelişmeli'}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}