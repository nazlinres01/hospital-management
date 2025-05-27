import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Palette, 
  Globe,
  Save,
  Download,
  Upload,
  Trash2
} from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Genel Ayarlar
    hospitalName: "MedSystem Pro Hastanesi",
    hospitalAddress: "İstanbul, Türkiye",
    hospitalPhone: "+90 212 555 0123",
    hospitalEmail: "info@medsystem.com",
    
    // Bildirim Ayarları
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    systemAlerts: true,
    
    // Güvenlik Ayarları
    autoLogout: 30,
    passwordExpiry: 90,
    twoFactorAuth: false,
    loginAttempts: 5,
    
    // Sistem Ayarları
    backupFrequency: "daily",
    dataRetention: 365,
    defaultLanguage: "tr",
    timezone: "Europe/Istanbul",
    
    // Tema Ayarları
    darkMode: false,
    primaryColor: "#3b82f6",
    fontSize: "medium"
  });

  const handleSave = () => {
    console.log("Ayarlar kaydedildi:", settings);
    // API çağrısı burada yapılacak
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'system-settings.json';
    link.click();
  };

  return (
    <div className="px-6 py-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sistem Ayarları</h1>
            <p className="mt-1 text-sm text-gray-600">
              Hastane yönetim sistemi ayarlarını düzenleyin
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Dışa Aktar
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Kaydet
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol Panel - Navigasyon */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Ayar Kategorileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center p-2 rounded-lg bg-blue-50 border border-blue-200">
                <Settings className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-900">Genel</span>
              </div>
              <div className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                <Bell className="h-4 w-4 text-gray-600 mr-2" />
                <span className="text-sm text-gray-700">Bildirimler</span>
              </div>
              <div className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                <Shield className="h-4 w-4 text-gray-600 mr-2" />
                <span className="text-sm text-gray-700">Güvenlik</span>
              </div>
              <div className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                <Database className="h-4 w-4 text-gray-600 mr-2" />
                <span className="text-sm text-gray-700">Sistem</span>
              </div>
              <div className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                <Palette className="h-4 w-4 text-gray-600 mr-2" />
                <span className="text-sm text-gray-700">Tema</span>
              </div>
            </CardContent>
          </Card>

          {/* Sistem Durumu */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Sistem Durumu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Veritabanı</span>
                <Badge className="bg-green-100 text-green-800">Çevrimiçi</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Servisi</span>
                <Badge className="bg-green-100 text-green-800">Aktif</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Yedekleme</span>
                <Badge className="bg-blue-100 text-blue-800">Güncel</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Disk Kullanımı</span>
                <Badge className="bg-yellow-100 text-yellow-800">%78</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sağ Panel - Ayar İçeriği */}
        <div className="lg:col-span-2 space-y-6">
          {/* Genel Ayarlar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Genel Ayarlar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hospitalName">Hastane Adı</Label>
                  <Input
                    id="hospitalName"
                    value={settings.hospitalName}
                    onChange={(e) => setSettings({...settings, hospitalName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="hospitalPhone">Telefon</Label>
                  <Input
                    id="hospitalPhone"
                    value={settings.hospitalPhone}
                    onChange={(e) => setSettings({...settings, hospitalPhone: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="hospitalAddress">Adres</Label>
                <Input
                  id="hospitalAddress"
                  value={settings.hospitalAddress}
                  onChange={(e) => setSettings({...settings, hospitalAddress: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="hospitalEmail">E-posta</Label>
                <Input
                  id="hospitalEmail"
                  type="email"
                  value={settings.hospitalEmail}
                  onChange={(e) => setSettings({...settings, hospitalEmail: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Bildirim Ayarları */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Bildirim Ayarları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>E-posta Bildirimleri</Label>
                  <p className="text-sm text-gray-500">Sistem olayları için e-posta gönder</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>SMS Bildirimleri</Label>
                  <p className="text-sm text-gray-500">Acil durumlar için SMS gönder</p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => setSettings({...settings, smsNotifications: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Randevu Hatırlatmaları</Label>
                  <p className="text-sm text-gray-500">Hasta randevu hatırlatmaları</p>
                </div>
                <Switch
                  checked={settings.appointmentReminders}
                  onCheckedChange={(checked) => setSettings({...settings, appointmentReminders: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Sistem Uyarıları</Label>
                  <p className="text-sm text-gray-500">Sistem bakım ve güncelleme bildirimleri</p>
                </div>
                <Switch
                  checked={settings.systemAlerts}
                  onCheckedChange={(checked) => setSettings({...settings, systemAlerts: checked})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Güvenlik Ayarları */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Güvenlik Ayarları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="autoLogout">Otomatik Çıkış (dakika)</Label>
                  <Input
                    id="autoLogout"
                    type="number"
                    value={settings.autoLogout}
                    onChange={(e) => setSettings({...settings, autoLogout: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="passwordExpiry">Şifre Süresi (gün)</Label>
                  <Input
                    id="passwordExpiry"
                    type="number"
                    value={settings.passwordExpiry}
                    onChange={(e) => setSettings({...settings, passwordExpiry: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>İki Faktörlü Doğrulama</Label>
                  <p className="text-sm text-gray-500">Ek güvenlik katmanı ekle</p>
                </div>
                <Switch
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => setSettings({...settings, twoFactorAuth: checked})}
                />
              </div>
              <div>
                <Label htmlFor="loginAttempts">Maksimum Giriş Denemesi</Label>
                <Input
                  id="loginAttempts"
                  type="number"
                  value={settings.loginAttempts}
                  onChange={(e) => setSettings({...settings, loginAttempts: parseInt(e.target.value)})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Sistem Ayarları */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Sistem Ayarları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dataRetention">Veri Saklama (gün)</Label>
                  <Input
                    id="dataRetention"
                    type="number"
                    value={settings.dataRetention}
                    onChange={(e) => setSettings({...settings, dataRetention: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">Saat Dilimi</Label>
                  <Input
                    id="timezone"
                    value={settings.timezone}
                    onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4 pt-4">
                <Button variant="outline" className="flex-1">
                  <Upload className="h-4 w-4 mr-2" />
                  Yedek Yükle
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Yedek İndir
                </Button>
                <Button variant="destructive" className="flex-1">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Verileri Temizle
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tema Ayarları */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Tema ve Görünüm
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Koyu Tema</Label>
                  <p className="text-sm text-gray-500">Karanlık mod kullan</p>
                </div>
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => setSettings({...settings, darkMode: checked})}
                />
              </div>
              <Separator />
              <div>
                <Label htmlFor="primaryColor">Ana Renk</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                    className="w-10 h-10 rounded border"
                  />
                  <Input
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="fontSize">Yazı Boyutu</Label>
                <select
                  value={settings.fontSize}
                  onChange={(e) => setSettings({...settings, fontSize: e.target.value})}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                >
                  <option value="small">Küçük</option>
                  <option value="medium">Orta</option>
                  <option value="large">Büyük</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}