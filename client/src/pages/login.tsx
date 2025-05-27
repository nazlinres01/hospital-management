import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Hospital, 
  ArrowRight,
  Shield,
  Users,
  Zap,
  CheckCircle
} from "lucide-react";

export default function Login() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const handleBackToHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button onClick={handleBackToHome} className="flex items-center group">
              <Hospital className="text-blue-600 h-8 w-8" />
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  MedSystem Pro
                </h1>
                <p className="text-sm text-gray-500">Hastane Yönetim Sistemi</p>
              </div>
            </button>
          </div>
        </div>
      </header>

      <div className="flex min-h-screen">
        {/* Sol Panel - Bilgi */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-12 items-center">
          <div className="max-w-md mx-auto text-white">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4">
                Hastane Yönetiminizi
                <br />
                Dijitalleştirin
              </h2>
              <p className="text-blue-100 text-lg">
                Modern, güvenli ve kullanıcı dostu hastane yönetim sistemi ile 
                operasyonlarınızı optimize edin.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold">Hasta Yönetimi</h3>
                  <p className="text-blue-100 text-sm">Merkezi hasta kayıt sistemi</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold">Güvenli Altyapı</h3>
                  <p className="text-blue-100 text-sm">GDPR uyumlu veri koruması</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold">Hızlı Kurulum</h3>
                  <p className="text-blue-100 text-sm">5 dakikada kullanıma hazır</p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-blue-500/30 rounded-lg">
              <div className="flex items-center mb-2">
                <CheckCircle className="h-5 w-5 text-green-300 mr-2" />
                <span className="text-sm font-medium">Güvenlik Sertifikalı</span>
              </div>
              <p className="text-blue-100 text-sm">
                ISO 27001 ve HIPAA uyumlu güvenlik standartları
              </p>
            </div>
          </div>
        </div>

        {/* Sağ Panel - Giriş Formu */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md w-full">
            <Card className="shadow-2xl border-0">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Hospital className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Giriş Yap
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Replit hesabınızla güvenli giriş yapın
                </p>
              </CardHeader>

              <CardContent className="pt-4">
                <div className="space-y-6">
                  {/* Replit Giriş Butonu */}
                  <Button 
                    onClick={handleLogin}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 text-lg font-medium"
                    size="lg"
                  >
                    <div className="flex items-center justify-center">
                      <span className="mr-2">🚀</span>
                      Replit ile Giriş Yap
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </div>
                  </Button>

                  {/* Bilgi Metni */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-4">
                      Replit hesabınız yoksa otomatik olarak oluşturulacaktır
                    </p>
                    
                    <div className="grid grid-cols-3 gap-4 text-xs text-gray-500">
                      <div className="text-center">
                        <div className="text-green-600 font-semibold">✓</div>
                        <div>Güvenli</div>
                      </div>
                      <div className="text-center">
                        <div className="text-green-600 font-semibold">✓</div>
                        <div>Hızlı</div>
                      </div>
                      <div className="text-center">
                        <div className="text-green-600 font-semibold">✓</div>
                        <div>Kolay</div>
                      </div>
                    </div>
                  </div>

                  {/* Demo Bilgi */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <span className="text-yellow-600">💡</span>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-yellow-800">
                          Demo Hesap
                        </h4>
                        <p className="text-xs text-yellow-700 mt-1">
                          Sistemi denemek için demo verilerle giriş yapabilirsiniz. 
                          Tüm özellikler kullanılabilir durumda.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Alt Bilgi */}
                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      Giriş yaparak{" "}
                      <button className="text-blue-600 hover:underline">
                        Kullanım Koşulları
                      </button>
                      {" "}ve{" "}
                      <button className="text-blue-600 hover:underline">
                        Gizlilik Politikası
                      </button>
                      'nı kabul etmiş olursunuz.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alt Bilgi Kartları */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">24/7</div>
                <div className="text-sm text-gray-600">Teknik Destek</div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">%99.9</div>
                <div className="text-sm text-gray-600">Uptime Garantisi</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}