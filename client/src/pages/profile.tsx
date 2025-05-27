import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Shield,
  Key,
  Bell,
  Edit,
  Save,
  LogOut
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: "",
    department: "",
    title: "",
    bio: ""
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("/api/auth/profile", {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Profil güncellendi",
        description: "Profil bilgileriniz başarıyla güncellendi.",
      });
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: "Profil güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateProfileMutation.mutate(formData);
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  return (
    <div className="px-6 py-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profil Bilgileri</h1>
            <p className="mt-1 text-sm text-gray-600">
              Hesap bilgilerinizi görüntüleyin ve düzenleyin
            </p>
          </div>
          <div className="flex space-x-3">
            {isEditing ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  disabled={updateProfileMutation.isPending}
                >
                  İptal
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={updateProfileMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Kaydet
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Düzenle
              </Button>
            )}
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Çıkış Yap
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol Panel - Profil Kartı */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src={user?.profileImageUrl} />
                  <AvatarFallback className="text-lg bg-blue-100 text-blue-600">
                    {getInitials(user?.firstName, user?.lastName)}
                  </AvatarFallback>
                </Avatar>
                
                <h2 className="text-xl font-semibold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  {formData.title || "Sistem Kullanıcısı"}
                </p>
                
                <div className="flex space-x-2 mb-4">
                  <Badge className="bg-green-100 text-green-800">Aktif</Badge>
                  <Badge className="bg-blue-100 text-blue-800">Doğrulanmış</Badge>
                </div>

                <div className="w-full space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Üyelik Tarihi</span>
                    <span className="text-gray-900">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('tr-TR') : 'Bilinmiyor'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Son Güncelleme</span>
                    <span className="text-gray-900">
                      {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString('tr-TR') : 'Bilinmiyor'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Kullanıcı ID</span>
                    <span className="text-gray-900 text-xs">{user?.id}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Güvenlik Durumu */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-sm">
                <Shield className="h-4 w-4 mr-2" />
                Güvenlik Durumu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">E-posta Doğrulaması</span>
                <Badge className="bg-green-100 text-green-800">✓</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">İki Faktörlü Doğrulama</span>
                <Badge className="bg-yellow-100 text-yellow-800">Pasif</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Son Giriş</span>
                <span className="text-sm text-gray-900">Bugün</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sağ Panel - Detay Bilgileri */}
        <div className="lg:col-span-2 space-y-6">
          {/* Kişisel Bilgiler */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Kişisel Bilgiler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Ad</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Soyad</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">E-posta</Label>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    disabled={!isEditing}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Telefon</Label>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    disabled={!isEditing}
                    placeholder="+90 555 123 4567"
                    className="flex-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Meslek Bilgileri */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Meslek Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Unvan</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    disabled={!isEditing}
                    placeholder="Dr., Hemşire, Teknisyen..."
                  />
                </div>
                <div>
                  <Label htmlFor="department">Departman</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    disabled={!isEditing}
                    placeholder="Kardiyoloji, Dahiliye..."
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="bio">Biyografi</Label>
                <textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  placeholder="Kendiniz hakkında kısa bir açıklama yazın..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Güvenlik Ayarları */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="h-5 w-5 mr-2" />
                Güvenlik Ayarları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Şifre Değiştir</h4>
                  <p className="text-sm text-gray-600">Hesap güvenliğiniz için düzenli olarak şifrenizi güncelleyin</p>
                </div>
                <Button variant="outline" size="sm">
                  Değiştir
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">İki Faktörlü Doğrulama</h4>
                  <p className="text-sm text-gray-600">Ek güvenlik katmanı ekleyin</p>
                </div>
                <Button variant="outline" size="sm">
                  Etkinleştir
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Oturum Geçmişi</h4>
                  <p className="text-sm text-gray-600">Hesabınıza erişim geçmişini görüntüleyin</p>
                </div>
                <Button variant="outline" size="sm">
                  Görüntüle
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Bildirim Tercihleri */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Bildirim Tercihleri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">E-posta Bildirimleri</h4>
                    <p className="text-sm text-gray-600">Sistem olayları için e-posta alın</p>
                  </div>
                  <input type="checkbox" className="toggle" defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Randevu Hatırlatmaları</h4>
                    <p className="text-sm text-gray-600">Yaklaşan randevular için bildirim</p>
                  </div>
                  <input type="checkbox" className="toggle" defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Sistem Güncellemeleri</h4>
                    <p className="text-sm text-gray-600">Yeni özellikler ve güncellemeler</p>
                  </div>
                  <input type="checkbox" className="toggle" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}