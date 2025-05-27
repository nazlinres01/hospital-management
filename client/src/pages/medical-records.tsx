import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, FileText, Calendar, User, Building, Stethoscope } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMedicalRecordSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { MedicalRecord, Patient, DoctorWithDepartment } from "@shared/schema";
import { z } from "zod";

type MedicalRecordFormData = z.infer<typeof insertMedicalRecordSchema>;

interface MedicalRecordFormProps {
  onSuccess?: () => void;
}

function MedicalRecordForm({ onSuccess }: MedicalRecordFormProps) {
  const { toast } = useToast();

  const { data: patients } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  const { data: doctors } = useQuery<DoctorWithDepartment[]>({
    queryKey: ["/api/doctors"],
  });

  const form = useForm<MedicalRecordFormData>({
    resolver: zodResolver(insertMedicalRecordSchema),
    defaultValues: {
      patient_id: 0,
      doctor_id: 0,
      diagnosis: "",
      treatment: "",
      prescriptions: "",
      notes: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: MedicalRecordFormData) => {
      const response = await fetch("/api/medical-records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create medical record");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/medical-records"] });
      toast({
        title: "Başarılı",
        description: "Tıbbi kayıt başarıyla oluşturuldu.",
      });
      form.reset();
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Tıbbi kayıt oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: MedicalRecordFormData) => {
    mutation.mutate(data);
  };

  const formatPatientName = (patient: Patient) => {
    return `${patient.first_name} ${patient.last_name} (TC: ${patient.tc_no})`;
  };

  const formatDoctorName = (doctor: DoctorWithDepartment) => {
    return `Dr. ${doctor.first_name} ${doctor.last_name} - ${doctor.department.name}`;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="patient_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hasta</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value ? field.value.toString() : ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Hasta seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {patients?.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id.toString()}>
                        {formatPatientName(patient)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="doctor_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Doktor</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value ? field.value.toString() : ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Doktor seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {doctors?.filter(d => d.is_active).map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id.toString()}>
                        {formatDoctorName(doctor)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="diagnosis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tanı</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Hasta tanısını girin..."
                  value={field.value || ""}
                  onChange={field.onChange}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="treatment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tedavi</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Uygulanan tedaviyi girin..."
                  value={field.value || ""}
                  onChange={field.onChange}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="prescriptions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reçeteler</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Reçete edilen ilaçları girin..."
                  value={field.value || ""}
                  onChange={field.onChange}
                  rows={2}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notlar</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ek notlar..."
                  value={field.value || ""}
                  onChange={field.onChange}
                  rows={2}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onSuccess}>
            İptal
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function MedicalRecords() {
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);

  const { data: medicalRecords, isLoading } = useQuery<MedicalRecord[]>({
    queryKey: ["/api/medical-records"],
  });

  const { data: patients } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  const { data: doctors } = useQuery<DoctorWithDepartment[]>({
    queryKey: ["/api/doctors"],
  });

  const { data: patientRecords } = useQuery({
    queryKey: ["/api/medical-records/patient", selectedPatientId],
    enabled: !!selectedPatientId,
  });

  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return '-';
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const getPatientById = (id: number) => {
    return patients?.find(p => p.id === id);
  };

  const getDoctorById = (id: number) => {
    return doctors?.find(d => d.id === id);
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

  const filteredRecords = medicalRecords?.filter(record => {
    if (!searchQuery) return true;
    const patient = getPatientById(record.patient_id);
    const doctor = getDoctorById(record.doctor_id);
    const searchLower = searchQuery.toLowerCase();
    
    return (
      patient?.first_name.toLowerCase().includes(searchLower) ||
      patient?.last_name.toLowerCase().includes(searchLower) ||
      patient?.tc_no.includes(searchLower) ||
      doctor?.first_name.toLowerCase().includes(searchLower) ||
      doctor?.last_name.toLowerCase().includes(searchLower) ||
      record.diagnosis?.toLowerCase().includes(searchLower) ||
      record.treatment?.toLowerCase().includes(searchLower)
    );
  });

  const getStats = () => {
    if (!medicalRecords) return { total: 0, thisMonth: 0, uniquePatients: 0, recentRecords: 0 };
    
    const now = new Date();
    const thisMonth = medicalRecords.filter(record => {
      const recordDate = new Date(record.created_at);
      return recordDate.getMonth() === now.getMonth() && recordDate.getFullYear() === now.getFullYear();
    }).length;

    const uniquePatients = new Set(medicalRecords.map(r => r.patient_id)).size;
    
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const recentRecords = medicalRecords.filter(record => 
      new Date(record.created_at) > lastWeek
    ).length;

    return {
      total: medicalRecords.length,
      thisMonth,
      uniquePatients,
      recentRecords,
    };
  };

  const stats = getStats();

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
            <h1 className="text-2xl font-bold text-gray-900">Tıbbi Kayıtlar</h1>
            <p className="mt-1 text-sm text-gray-600">
              Hasta tıbbi kayıtlarını görüntüleyin ve yönetin
            </p>
          </div>
          <Button onClick={() => setShowRecordForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Yeni Kayıt
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Hasta adı, TC kimlik, doktor, tanı ile arama..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Toplam Kayıt</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.thisMonth}</div>
            <div className="text-sm text-gray-600">Bu Ay</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.uniquePatients}</div>
            <div className="text-sm text-gray-600">Farklı Hasta</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{stats.recentRecords}</div>
            <div className="text-sm text-gray-600">Son 7 Gün</div>
          </CardContent>
        </Card>
      </div>

      {/* Medical Records */}
      <div className="space-y-4">
        {filteredRecords?.map((record) => {
          const patient = getPatientById(record.patient_id);
          const doctor = getDoctorById(record.doctor_id);
          
          return (
            <Card key={record.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {patient ? `${patient.first_name} ${patient.last_name}` : 'Bilinmeyen Hasta'}
                      </CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(record.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {doctor && (
                    <div className="text-right">
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <Stethoscope className="h-3 w-3 mr-1" />
                        <span>Dr. {doctor.first_name} {doctor.last_name}</span>
                      </div>
                      <Badge className={getDepartmentColor(doctor.department.name)}>
                        {doctor.department.name}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Tanı</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {record.diagnosis || 'Belirtilmemiş'}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Tedavi</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {record.treatment || 'Belirtilmemiş'}
                    </p>
                  </div>
                </div>

                {record.prescriptions && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Reçeteler</h4>
                    <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                      {record.prescriptions}
                    </p>
                  </div>
                )}

                {record.notes && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Notlar</h4>
                    <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
                      {record.notes}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t text-xs text-gray-500">
                  <div className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    <span>TC: {patient?.tc_no}</span>
                  </div>
                  <div className="flex items-center">
                    <Building className="h-3 w-3 mr-1" />
                    <span>Kayıt #{record.id}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredRecords?.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'Kayıt bulunamadı' : 'Henüz tıbbi kayıt yok'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery 
              ? 'Arama kriterlerinize uygun tıbbi kayıt bulunamadı.' 
              : 'İlk tıbbi kaydınızı oluşturmak için aşağıdaki butona tıklayın.'
            }
          </p>
          {!searchQuery && (
            <Button onClick={() => setShowRecordForm(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              İlk Tıbbi Kaydı Oluştur
            </Button>
          )}
        </div>
      )}

      {/* Medical Record Form Modal */}
      <Dialog open={showRecordForm} onOpenChange={setShowRecordForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Yeni Tıbbi Kayıt</DialogTitle>
          </DialogHeader>
          <MedicalRecordForm onSuccess={() => setShowRecordForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}