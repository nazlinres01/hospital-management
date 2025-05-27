import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertPatientSchema } from "@shared/schema";
import { z } from "zod";

const patientFormSchema = insertPatientSchema.extend({
  tc_no: z.string().length(11, "TC kimlik numarası 11 haneli olmalıdır"),
  phone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
});

type PatientFormData = z.infer<typeof patientFormSchema>;

interface PatientFormProps {
  onSuccess?: () => void;
}

export default function PatientForm({ onSuccess }: PatientFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      tc_no: "",
      birth_date: "",
      gender: "",
      phone: "",
      address: "",
      emergency_contact: "",
    },
  });

  const createPatientMutation = useMutation({
    mutationFn: async (data: PatientFormData) => {
      const response = await apiRequest("POST", "/api/patients", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/patients"] });
      queryClient.invalidateQueries({ queryKey: ["/api/statistics"] });
      toast({
        title: "Başarılı",
        description: "Hasta kaydı başarıyla oluşturuldu.",
      });
      form.reset();
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: error.message || "Hasta kaydı oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PatientFormData) => {
    createPatientMutation.mutate(data);
  };

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
                  <Input placeholder="Hasta adı" {...field} />
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
                  <Input placeholder="Hasta soyadı" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="tc_no"
            render={({ field }) => (
              <FormItem>
                <FormLabel>TC Kimlik No *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="11 haneli TC kimlik numarası" 
                    maxLength={11}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="birth_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Doğum Tarihi *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
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
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cinsiyet *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Cinsiyet seçiniz" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Erkek</SelectItem>
                    <SelectItem value="female">Kadın</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adres</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Hasta adresi" 
                  rows={3}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="emergency_contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Acil Durum İletişim</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Acil durum iletişim bilgisi" 
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
            disabled={createPatientMutation.isPending}
          >
            {createPatientMutation.isPending ? "Kaydediliyor..." : "Hasta Kaydı Oluştur"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
