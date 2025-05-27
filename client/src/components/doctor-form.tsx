import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertDoctorSchema } from "@shared/schema";
import { z } from "zod";
import type { Department } from "@shared/schema";

const doctorFormSchema = insertDoctorSchema.extend({
  phone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz").optional().or(z.literal("")),
});

type DoctorFormData = z.infer<typeof doctorFormSchema>;

interface DoctorFormProps {
  onSuccess?: () => void;
}

export default function DoctorForm({ onSuccess }: DoctorFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<DoctorFormData>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      specialization: "",
      department_id: 0,
      phone: "",
      email: "",
      is_active: true,
    },
  });

  const { data: departments } = useQuery<Department[]>({
    queryKey: ["/api/departments"],
  });

  const createDoctorMutation = useMutation({
    mutationFn: async (data: DoctorFormData) => {
      const doctorData = {
        ...data,
        department_id: Number(data.department_id),
        email: data.email || undefined,
      };
      const response = await apiRequest("POST", "/api/doctors", doctorData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/doctors"] });
      queryClient.invalidateQueries({ queryKey: ["/api/statistics"] });
      toast({
        title: "Başarılı",
        description: "Doktor kaydı başarıyla oluşturuldu.",
      });
      form.reset();
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: error.message || "Doktor kaydı oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: DoctorFormData) => {
    createDoctorMutation.mutate(data);
  };

  const specializations = [
    "Kardiyolog",
    "Nörolog", 
    "Dahiliye Uzmanı",
    "Ortopedist",
    "Pediatrist",
    "Acil Tıp Uzmanı",
    "Genel Cerrah",
    "Kadın Doğum Uzmanı",
    "Göz Doktoru",
    "Kulak Burun Boğaz Uzmanı",
    "Üroloji Uzmanı",
    "Dermatoloji Uzmanı",
    "Psikiyatrist",
    "Radyoloji Uzmanı",
    "Anestezi Uzmanı",
    "Patoloji Uzmanı",
    "Fizik Tedavi Uzmanı",
    "Diğer"
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ad *</FormLabel>
                <FormControl>
                  <Input placeholder="Doktor adı" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Soyad *</FormLabel>
                <FormControl>
                  <Input placeholder="Doktor soyadı" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="specialization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Uzmanlık Alanı *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Uzmanlık alanı seçiniz" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {specializations.map((specialization) => (
                      <SelectItem key={specialization} value={specialization}>
                        {specialization}
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
            name="department_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departman *</FormLabel>
                <Select onValueChange={(value) => field.onChange(Number(value))}>
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefon *</FormLabel>
                <FormControl>
                  <Input placeholder="0555 123 45 67" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-posta</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="doktor@hastane.com" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Aktif Durum</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Doktorun aktif olarak çalışıp çalışmadığını belirtir
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
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
            disabled={createDoctorMutation.isPending}
          >
            {createDoctorMutation.isPending ? "Kaydediliyor..." : "Doktor Kaydı Oluştur"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
