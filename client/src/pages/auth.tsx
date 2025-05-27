import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { 
  Hospital, 
  Mail, 
  Lock, 
  User, 
  Phone,
  Calendar,
  Eye,
  EyeOff
} from "lucide-react";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    confirmPassword: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // Giriş işlemi
        if (formData.email === "admin@medsystem.com" && formData.password === "admin123") {
          const userData = {
            id: "1",
            email: "admin@medsystem.com",
            firstName: "Admin",
            lastName: "User",
            role: "admin",
            department: "Sistem Yönetimi"
          };
          
          login(userData);
          toast({
            title: "Giriş başarılı!",
            description: "Hastane yönetim sistemine hoş geldiniz.",
          });
        } else {
          throw new Error("Geçersiz email veya şifre");
        }
      } else {
        // Kayıt işlemi
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Şifreler eşleşmiyor");
        }
        
        if (formData.password.length < 6) {
          throw new Error("Şifre en az 6 karakter olmalıdır");
        }

        const userData = {
          id: Date.now().toString(),
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          role: "user",
          department: "Genel"
        };

        login(userData);
        toast({
          title: "Kayıt başarılı!",
          description: "Hesabınız oluşturuldu ve giriş yapıldı.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
      confirmPassword: ""
    });
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Hospital className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">MedSystem Pro</h1>
          <p className="text-gray-600">Hastane Yönetim Sistemi</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">
              {isLogin ? "Giriş Yap" : "Hesap Oluştur"}
            </CardTitle>
            <p className="text-gray-600 text-sm">
              {isLogin 
                ? "Hesabınıza giriş yapın" 
                : "Yeni hesap oluşturun"
              }
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Ad</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="Adınız"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="lastName">Soyad</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Soyadınız"
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Telefon</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+90 555 123 4567"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="email">E-posta</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="ornek@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Şifre</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div>
                  <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "İşleniyor..." : (isLogin ? "Giriş Yap" : "Hesap Oluştur")}
              </Button>
            </form>

            {/* Demo bilgisi */}
            {isLogin && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>Demo Hesap:</strong><br />
                  E-posta: admin@medsystem.com<br />
                  Şifre: admin123
                </p>
              </div>
            )}

            {/* Geçiş butonu */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? "Hesabınız yok mu?" : "Zaten hesabınız var mı?"}{" "}
                <button
                  type="button"
                  onClick={switchMode}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  {isLogin ? "Kayıt ol" : "Giriş yap"}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Alt bilgi */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>Bu sistem demo amaçlıdır. Gerçek hasta verisi kullanmayınız.</p>
        </div>
      </div>
    </div>
  );
}