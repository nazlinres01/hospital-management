import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Hospital, 
  Users, 
  Calendar, 
  FileText, 
  BarChart3, 
  Shield,
  Clock,
  Heart,
  UserCheck
} from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Hospital className="text-blue-600 h-8 w-8" />
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">MedSystem Pro</h1>
                <p className="text-sm text-gray-500">Hastane Yönetim Sistemi</p>
              </div>
            </div>
            <Button onClick={handleLogin} className="bg-blue-600 hover:bg-blue-700">
              Giriş Yap
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Modern Hastane
            <span className="text-blue-600 block">Yönetim Sistemi</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Hasta kayıtlarından randevu yönetimine, tıbbi raporlardan personel takibine kadar 
            hastane operasyonlarınızı tek platformda yönetin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleLogin} size="lg" className="bg-blue-600 hover:bg-blue-700">
              Sisteme Giriş Yap
            </Button>
            <Button variant="outline" size="lg">
              Demo İzle
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Kapsamlı Hastane Yönetimi
            </h2>
            <p className="text-xl text-gray-600">
              Modern teknoloji ile hastane süreçlerinizi optimize edin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="text-blue-600 h-6 w-6" />
                </div>
                <CardTitle>Hasta Yönetimi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Hasta kayıtları, tıbbi geçmiş, iletişim bilgileri ve demografik veriler için 
                  merkezi yönetim sistemi.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="text-green-600 h-6 w-6" />
                </div>
                <CardTitle>Randevu Sistemi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Akıllı randevu planlama, otomatik hatırlatmalar ve doktor müsaitlik 
                  yönetimi ile verimli zaman planlaması.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <UserCheck className="text-purple-600 h-6 w-6" />
                </div>
                <CardTitle>Personel Yönetimi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Doktor ve sağlık personeli bilgileri, uzmanlık alanları, vardiya 
                  planlaması ve performans takibi.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="text-red-600 h-6 w-6" />
                </div>
                <CardTitle>Tıbbi Kayıtlar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Dijital hasta dosyaları, teşhis ve tedavi kayıtları, laboratuvar 
                  sonuçları ve tıbbi raporlar.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="text-yellow-600 h-6 w-6" />
                </div>
                <CardTitle>Raporlama</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Detaylı istatistikler, performans analizi, gelir raporları ve 
                  karar destek sistemleri.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="text-indigo-600 h-6 w-6" />
                </div>
                <CardTitle>Güvenlik</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  GDPR uyumlu veri koruması, rol tabanlı erişim kontrolü ve 
                  audit trail sistemi.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="flex items-center justify-center mb-4">
                <Clock className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold mb-2">%95</div>
              <div className="text-blue-100">Zaman Tasarrufu</div>
            </div>
            <div>
              <div className="flex items-center justify-center mb-4">
                <Heart className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Mutlu Hasta</div>
            </div>
            <div>
              <div className="flex items-center justify-center mb-4">
                <Hospital className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-blue-100">Hastane Kullanıyor</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Hastane Yönetiminizi Dijitalleştirin
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Modern hastane yönetim sistemi ile operasyonlarınızı optimize edin, 
            hasta memnuniyetini artırın ve iş süreçlerinizi hızlandırın.
          </p>
          <Button onClick={handleLogin} size="lg" className="bg-blue-600 hover:bg-blue-700">
            Hemen Başlayın
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Hospital className="text-blue-400 h-6 w-6" />
                <span className="ml-2 text-lg font-semibold">MedSystem Pro</span>
              </div>
              <p className="text-gray-400">
                Modern hastane yönetim çözümleri ile sağlık hizmetlerinizi 
                dijital dönüşüme hazırlayın.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Özellikler</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Hasta Yönetimi</li>
                <li>Randevu Sistemi</li>
                <li>Tıbbi Kayıtlar</li>
                <li>Raporlama</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">İletişim</h3>
              <ul className="space-y-2 text-gray-400">
                <li>info@medsystem.com</li>
                <li>+90 212 555 0123</li>
                <li>İstanbul, Türkiye</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MedSystem Pro. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}