# MedSystem Pro - Hospital Management System

A modern, comprehensive hospital management system built with React and Express.js, featuring PostgreSQL database integration for professional healthcare facility operations.

## Features

### Authentication System
- Modern login/registration interface
- Secure session management
- Demo account for testing
- User profile management

### Core Modules
- **Patient Management**: Complete patient registration and tracking
- **Doctor Management**: Staff management with department assignments
- **Appointment System**: Automated scheduling and tracking
- **Department Management**: Hospital clinic organization
- **Medical Records**: Comprehensive patient history
- **Reports & Analytics**: Statistical dashboard with charts

### System Features
- Responsive design (mobile/tablet/desktop)
- Turkish interface
- Real-time data updates
- Type-safe development with TypeScript
- PostgreSQL database integration

## Tech Stack

**Frontend:** React 18, TypeScript, TailwindCSS, Shadcn/ui  
**Backend:** Express.js, Drizzle ORM, PostgreSQL  
**Tools:** Vite, TanStack Query, React Hook Form, Zod

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Installation
```bash
npm install
npm run db:push
npm run dev
```

### Demo Account
**Email:** admin@medsystem.com  
**Password:** admin123

## Project Structure

```
├── client/               # Frontend (React)
│   ├── src/
│   │   ├── components/   # UI Components
│   │   ├── pages/        # Page Components
│   │   ├── hooks/        # Custom Hooks
│   │   └── lib/          # Utilities
├── server/               # Backend (Express)
│   ├── db.ts            # Database connection
│   ├── storage.ts       # Data access layer
│   ├── routes.ts        # API routes
│   └── index.ts         # Server entry
├── shared/              # Shared files
│   └── schema.ts        # Database schema
└── README.md
```

## API Endpoints

### Authentication
- `GET /api/auth/user` - Current user info
- `GET /api/login` - Login page
- `GET /api/logout` - Logout

### Core Resources
- `GET|POST /api/patients` - Patient operations
- `GET|POST /api/doctors` - Doctor operations
- `GET|POST /api/appointments` - Appointment operations
- `GET|POST /api/departments` - Department operations
- `GET|POST /api/medical-records` - Medical record operations
- `GET /api/statistics` - System statistics

## Database Schema

### Main Tables
- **users**: User accounts and authentication
- **patients**: Patient information and records
- **doctors**: Medical staff with specializations
- **departments**: Hospital departments/clinics
- **appointments**: Scheduling system
- **medical_records**: Patient medical history

## Environment Variables

```env
DATABASE_URL=postgresql://user:password@host:port/database
SESSION_SECRET=your-session-secret
```

## Pages & Routes

- `/` - Dashboard
- `/hastalar` - Patient Management
- `/doktorlar` - Doctor Management
- `/randevular` - Appointments
- `/departmanlar` - Departments
- `/tibbi-kayitlar` - Medical Records
- `/raporlar` - Reports
- `/ayarlar` - Settings
- `/profil` - User Profile

## Security Features

- Session-based authentication
- Input validation with Zod
- SQL injection protection via ORM
- XSS and CSRF protection
- Route access control

## Performance Optimizations

- Code splitting and lazy loading
- React Query caching
- Database indexing
- Bundle optimization with Vite

## Development

### Build for Production
```bash
npm run build
```

### Database Operations
```bash
npm run db:push    # Apply schema changes
```

## License

MIT License

## Support

For technical support and documentation, please refer to the project repository.

---

**MedSystem Pro** - Modern Hospital Management System