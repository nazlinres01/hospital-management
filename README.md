# MedSystem Pro - Hastane Yönetim Sistemi

Modern, kullanıcı dostu ve kapsamlı hastane yönetim sistemi. React ve Express.js teknolojileri ile geliştirilmiş, PostgreSQL veritabanı kullanan profesyonel bir sağlık yönetim platformu.

## 🚀 Özellikler

### 🔐 Kimlik Doğrulama Sistemi
- **Modern Giriş/Kayıt Sayfaları**: Responsive tasarım ile
- **Güvenli Oturum Yönetimi**: LocalStorage tabanlı
- **Demo Hesap**: Hızlı test için hazır hesap
- **Kullanıcı Profil Yönetimi**: Kişisel bilgi düzenleme

### 👥 Hasta Yönetimi
- **Hasta Kayıt Sistemi**: Detaylı hasta bilgileri
- **TC Kimlik No Kontrolü**: Benzersiz hasta tanımlama
- **Hasta Arama**: Hızlı hasta bulma sistemi
- **Hasta Geçmişi**: Randevu ve tedavi geçmişi
- **Acil Durum İletişim**: Yakın bilgileri

### 👨‍⚕️ Doktor Yönetimi
- **Doktor Kayıt Sistemi**: Uzmanlık alanları ile
- **Departman Atama**: Doktorları departmanlara atama
- **İletişim Bilgileri**: Telefon ve email yönetimi
- **Aktiflik Durumu**: Doktor çalışma durumu takibi

### 🏥 Departman Yönetimi
- **Departman Oluşturma**: Yeni klinikler ekleme
- **Departman Başkanı**: Başhekim atama sistemi
- **Açıklama Metinleri**: Departman detayları
- **Doktor Listesi**: Departmana bağlı doktorlar

### 📅 Randevu Sistemi
- **Randevu Oluşturma**: Hasta-doktor eşleştirme
- **Tarih/Saat Planlama**: Detaylı zaman yönetimi
- **Durum Takibi**: Beklemde, tamamlandı, iptal
- **Şikayet/Not Sistemi**: Randevu detayları
- **Günlük Randevular**: Bugünkü randevu listesi

### 📋 Tıbbi Kayıt Sistemi
- **Tanı Kayıtları**: Hastalık tanıları
- **Tedavi Planları**: Uygulanan tedaviler
- **Doktor Notları**: Detaylı açıklamalar
- **Tarih Takibi**: Kronolojik sıralama
- **Hasta Geçmişi**: Tüm tıbbi kayıtlar

### 📊 Raporlama ve İstatistikler
- **Ana Panel Dashboard**: Genel sistem görünümü
- **Hasta İstatistikleri**: Toplam hasta sayıları
- **Randevu Analizi**: Günlük/aylık randevu verileri
- **Departman Raporları**: Klinik performansı
- **Grafik Gösterimler**: Recharts ile görsel raporlar

### ⚙️ Sistem Ayarları
- **Hastane Bilgileri**: Kurum ayarları
- **Bildirim Ayarları**: Sistem bildirimleri
- **Yedekleme Sistemi**: Veri koruma
- **Kullanıcı Yönetimi**: Yetki kontrolü

## 🛠️ Teknoloji Stack

### Frontend
- **React 18**: Modern UI framework
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: Modern UI component library
- **Vite**: Fast build tool
- **Wouter**: Lightweight routing
- **TanStack Query**: Server state management
- **React Hook Form**: Form management
- **Zod**: Schema validation
- **Recharts**: Chart library
- **Lucide React**: Icon library

### Backend
- **Express.js**: Node.js web framework
- **TypeScript**: Server-side type safety
- **Drizzle ORM**: Type-safe database ORM
- **PostgreSQL**: Production database
- **Express Session**: Session management
- **Zod Validation**: Request validation

### UI Components
- **Radix UI**: Headless UI primitives
- **Class Variance Authority**: Component variants
- **Tailwind Merge**: CSS class merging
- **Framer Motion**: Animation library

## 📁 Proje Yapısı

```
├── client/                 # Frontend (React)
│   ├── src/
│   │   ├── components/     # UI Bileşenleri
│   │   │   ├── ui/        # Shadcn UI components
│   │   │   ├── forms/     # Form bileşenleri
│   │   │   ├── sidebar.tsx
│   │   │   └── header.tsx
│   │   ├── pages/         # Sayfa bileşenleri
│   │   │   ├── auth.tsx           # Giriş/Kayıt
│   │   │   ├── dashboard.tsx      # Ana Panel
│   │   │   ├── patients.tsx       # Hasta Yönetimi
│   │   │   ├── doctors.tsx        # Doktor Yönetimi
│   │   │   ├── appointments.tsx   # Randevu Sistemi
│   │   │   ├── departments.tsx    # Departman Yönetimi
│   │   │   ├── medical-records.tsx # Tıbbi Kayıtlar
│   │   │   ├── reports.tsx        # Raporlar
│   │   │   ├── settings.tsx       # Ayarlar
│   │   │   └── profile.tsx        # Profil
│   │   ├── hooks/         # Custom hooks
│   │   │   ├── useAuth.ts         # Kimlik doğrulama
│   │   │   └── use-toast.ts       # Bildirim sistemi
│   │   ├── lib/           # Utility functions
│   │   │   ├── utils.ts
│   │   │   └── queryClient.ts     # API client
│   │   └── main.tsx       # Entry point
│   ├── index.html
│   └── vite.config.ts
├── server/                # Backend (Express)
│   ├── db.ts             # Database connection
│   ├── storage.ts        # Data access layer
│   ├── routes.ts         # API routes
│   ├── replitAuth.ts     # Replit authentication
│   ├── index.ts          # Server entry point
│   └── vite.ts           # Development server
├── shared/               # Ortak dosyalar
│   └── schema.ts         # Database schema & types
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── drizzle.config.ts
```

## 🗄️ Veritabanı Şeması

### Ana Tablolar
- **users**: Kullanıcı hesapları
- **sessions**: Oturum yönetimi
- **departments**: Hastane departmanları
- **doctors**: Doktor bilgileri
- **patients**: Hasta kayıtları
- **appointments**: Randevu sistemi
- **medical_records**: Tıbbi kayıtlar

### İlişkiler
- Doktorlar → Departmanlar (Many-to-One)
- Randevular → Hastalar, Doktorlar, Departmanlar (Many-to-One)
- Tıbbi Kayıtlar → Hastalar, Doktorlar (Many-to-One)

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Node.js 18+
- PostgreSQL veritabanı
- NPM veya Yarn

### Kurulum
```bash
# Bağımlılıkları yükle
npm install

# Veritabanı şemasını oluştur
npm run db:push

# Development server başlat
npm run dev
```

### Ortam Değişkenleri
```env
DATABASE_URL=postgresql://user:password@host:port/database
SESSION_SECRET=your-session-secret
REPLIT_DOMAINS=your-domain.com
```

## 👤 Demo Hesap

Sistemi test etmek için hazır demo hesap:

**Email:** admin@medsystem.com  
**Şifre:** admin123

## 📱 Sayfa Rotaları

- `/` - Ana Panel (Dashboard)
- `/hastalar` - Hasta Yönetimi
- `/doktorlar` - Doktor Yönetimi
- `/randevular` - Randevu Sistemi
- `/departmanlar` - Departman Yönetimi
- `/tibbi-kayitlar` - Tıbbi Kayıtlar
- `/raporlar` - Raporlar ve İstatistikler
- `/ayarlar` - Sistem Ayarları
- `/profil` - Kullanıcı Profili

## 🔧 API Endpoints

### Kimlik Doğrulama
- `GET /api/auth/user` - Mevcut kullanıcı bilgileri
- `GET /api/login` - Giriş sayfası
- `GET /api/logout` - Çıkış işlemi

### Hastalar
- `GET /api/patients` - Tüm hastalar
- `POST /api/patients` - Yeni hasta ekle
- `PUT /api/patients/:id` - Hasta güncelle
- `DELETE /api/patients/:id` - Hasta sil
- `GET /api/patients/search` - Hasta ara

### Doktorlar
- `GET /api/doctors` - Tüm doktorlar
- `POST /api/doctors` - Yeni doktor ekle
- `PUT /api/doctors/:id` - Doktor güncelle
- `DELETE /api/doctors/:id` - Doktor sil

### Departmanlar
- `GET /api/departments` - Tüm departmanlar
- `POST /api/departments` - Yeni departman ekle
- `PUT /api/departments/:id` - Departman güncelle
- `DELETE /api/departments/:id` - Departman sil

### Randevular
- `GET /api/appointments` - Tüm randevular
- `GET /api/appointments/today` - Bugünkü randevular
- `POST /api/appointments` - Yeni randevu oluştur
- `PUT /api/appointments/:id` - Randevu güncelle
- `DELETE /api/appointments/:id` - Randevu sil

### Tıbbi Kayıtlar
- `GET /api/medical-records` - Tüm kayıtlar
- `POST /api/medical-records` - Yeni kayıt ekle
- `PUT /api/medical-records/:id` - Kayıt güncelle
- `DELETE /api/medical-records/:id` - Kayıt sil

### İstatistikler
- `GET /api/statistics` - Genel sistem istatistikleri

## 🎨 Tasarım Özellikleri

### Renk Paleti
- **Primary Blue**: #2563eb (Sistem ana rengi)
- **Success Green**: #16a34a (Başarı mesajları)
- **Warning Yellow**: #ca8a04 (Uyarılar)
- **Danger Red**: #dc2626 (Hata ve silme işlemleri)
- **Gray Scale**: Modern gri tonları

### Responsive Tasarım
- **Mobile First**: Önce mobil tasarım
- **Tablet Uyumlu**: Orta ekran boyutları
- **Desktop Optimized**: Büyük ekranlar için optimize

### Accessibility
- **Klavye Navigasyonu**: Tam klavye desteği
- **Screen Reader**: Ekran okuyucu uyumlu
- **Color Contrast**: WCAG AA uyumlu renk kontrastı
- **Focus Indicators**: Odak göstergeleri

## 🔒 Güvenlik Özellikleri

### Kimlik Doğrulama
- **Session-based Auth**: Güvenli oturum yönetimi
- **Password Protection**: Şifre koruması
- **Auto Logout**: Otomatik çıkış
- **Route Protection**: Sayfa erişim kontrolü

### Veri Güvenliği
- **Input Validation**: Girdi doğrulama
- **SQL Injection Protection**: ORM koruması
- **XSS Prevention**: Cross-site scripting koruması
- **CSRF Protection**: Cross-site request forgery koruması

## 📈 Performans Optimizasyonları

### Frontend
- **Code Splitting**: Kod bölünmesi
- **Lazy Loading**: Gecikmeli yükleme
- **Caching**: React Query ile önbellekleme
- **Bundle Optimization**: Vite ile optimizasyon

### Backend
- **Database Indexing**: Veritabanı indeksleme
- **Query Optimization**: Sorgu optimizasyonu
- **Memory Caching**: Bellek önbellekleme
- **Pagination**: Sayfalama sistemi

## 🧪 Test Stratejisi

### Unit Tests
- Component testing
- Hook testing
- Utility function testing

### Integration Tests
- API endpoint testing
- Database operation testing
- Authentication flow testing

### E2E Tests
- User workflow testing
- Critical path testing
- Cross-browser testing

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Setup
- PostgreSQL database
- Node.js runtime
- SSL certificate
- Domain configuration

## 🔄 Güncellemeler ve Bakım

### Version Control
- Git flow kullanımı
- Feature branch stratejisi
- Release tagging

### Database Migrations
```bash
npm run db:push
```

### Monitoring
- Error tracking
- Performance monitoring
- User analytics

## 👥 Katkıda Bulunma

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 Destek

Teknik destek için:
- Email: support@medsystem.com
- Dokümantasyon: /docs
- Issue Tracker: GitHub Issues

## 🙏 Teşekkürler

Bu projeyi kullandığınız için teşekkür ederiz. Modern hastane yönetimi için geliştirilen bu sistem, sağlık sektörünün dijital dönüşümüne katkıda bulunmayı amaçlamaktadır.

---

**MedSystem Pro** - Modern Hastane Yönetim Sistemi © 2024