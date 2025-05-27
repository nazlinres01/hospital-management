import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertAppointmentSchema } from "@shared/schema";
import { z } from "zod";
import type { Department, DoctorWithDepartment, Patient } from "@shared/schema";
import { useState } from "react";

const appointmentFormSchema = insertAppointmentSchema.extend({
  appointment_date: z.string().min(1, "Randevu tarihi ve saati gereklidir"),
});

type AppointmentFormData = z.infer<typeof appointmentFormSchema>;

interface AppointmentFormProps {
  onSuccess?: () => void;
}

export default function AppointmentForm({ onSuccess }: AppointmentFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
  const [patientSearch, setPatientSearch] = useState("");

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      patient_id: 0,
      doctor_id: 0,
      department_id: 0,
      appointment_date: "",
      status: "scheduled",
      notes: "",
      complaint: "",
    },
  });

  const { data: departments } = useQuery<Department[]>({
    queryKey: ["/api/departments"],
  });

  const { data: allDoctors } = useQuery<DoctorWithDepartment[]>({
    queryKey: ["/api/doctors"],
  });

  const { data: patients } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  const { data: searchResults } = useQuery<Patient[]>({
    queryKey: ["/api/patients/search", patientSearch],
    enabled: patientSearch.length > 2,
  });

  const availableDoctors = selectedDepartment 
    ? allDoctors?.filter(doctor => doctor.department_id === selectedDepartment && doctor.is_active) 
    : [];

  const patientOptions = patientSearch.length > 2 ? searchResults : patients?.slice(0, 50);

  const createAppointmentMutation = useMutation({
    mutationFn: async (data: AppointmentFormData) => {
      const appointmentData = {
        ...data,
        patient_id: Number(data.patient_id),
        doctor_id: Number(data.doctor_id),
        department_id: Number(data.department_id),
        appointment_date: new Date(data.appointment_date).toISOString(),
      };
      const response = await apiRequest("POST", "/api/appointments", appointmentData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/appointments/today"] });
      queryClient.invalidateQueries({ queryKey: ["/api/statistics"] });
      toast({
        title: "Başarılı",
        description: "Randevu başarıyla oluşturuldu.",
      });
      form.reset();
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: error.message || "Randevu oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AppointmentFormData) => {
    createAppointmentMutation.mutate(data);
  };

  const formatPatientName = (patient: Patient) => {
    return `${patient.first_name} ${patient.last_name} (TC: ${patient.tc_no})`;
  };

  const formatDoctorName = (doctor: DoctorWithDepartment) => {
    return `Dr. ${doctor.first_name} ${doctor.last_name} - ${doctor.specialization}`;
  };

  // Get minimum date-time (current date-time)
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Patient Selection */}
        <FormField
          control={form.control}
          name="patient_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hasta *</FormLabel>
              <div className="space-y-2">
                <Input
                  placeholder="Hasta adı veya TC ile arama..."
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                />
                <Select onValueChange={(value) => field.onChange(Number(value))}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Hasta seçiniz" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {patientOptions?.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id.toString()}>
                        {formatPatientName(patient)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Department Selection */}
        <FormField
          control={form.control}
          name="department_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Departman *</FormLabel>
              <Select 
                onValueChange={(value) => {
                  const deptId = Number(value);
                  field.onChange(deptId);
                  setSelectedDepartment(deptId);
                  // Reset doctor selection when department changes
                  form.setValue("doctor_id", 0);
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Departman seçiniz" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {departments?.map((department) => (
                    <SelectItem key={department.id} value={department.id.toString()}>
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Doctor Selection */}
        <FormField
          control={form.control}
          name="doctor_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doktor *</FormLabel>
              <Select 
                onValueChange={(value) => field.onChange(Number(value))}
                disabled={!selectedDepartment}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={selectedDepartment ? "Doktor seçiniz" : "Önce departman seçiniz"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableDoctors?.map((doctor) => (
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Appointment Date & Time */}
          <FormField
            control={form.control}
            name="appointment_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Randevu Tarihi ve Saati *</FormLabel>
                <FormControl>
                  <Input 
                    type="datetime-local" 
                    min={getMinDateTime()}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Durum *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Durum seçiniz" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="scheduled">Planlandı</SelectItem>
                    <SelectItem value="completed">Tamamlandı</SelectItem>
                    <SelectItem value="cancelled">İptal Edildi</SelectItem>
                    <SelectItem value="no_show">Gelmedi</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Complaint */}
        <FormField
          control={form.control}
          name="complaint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Şikayet/Başvuru Sebebi</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Hastanın şikayeti veya başvuru sebebi" 
                  rows={3}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notlar</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Randevu ile ilgili notlar" 
                  rows={2}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => onSuccess?.()}
          >
            İptal
          </Button>
          <Button 
            type="submit" 
            className="bg-blue-500 hover:bg-blue-600"
            disabled={createAppointmentMutation.isPending}
          >
            {createAppointmentMutation.isPending ? "Oluşturuluyor..." : "Randevu Oluştur"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
