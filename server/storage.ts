import {
  departments,
  doctors,
  patients,
  appointments,
  medical_records,
  type Department,
  type Doctor,
  type Patient,
  type Appointment,
  type MedicalRecord,
  type InsertDepartment,
  type InsertDoctor,
  type InsertPatient,
  type InsertAppointment,
  type InsertMedicalRecord,
  type AppointmentWithDetails,
  type PatientWithLastAppointment,
  type DoctorWithDepartment,
} from "@shared/schema";

export interface IStorage {
  // User operations (for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Departments
  getDepartments(): Promise<Department[]>;
  getDepartment(id: number): Promise<Department | undefined>;
  createDepartment(department: InsertDepartment): Promise<Department>;
  updateDepartment(id: number, department: Partial<InsertDepartment>): Promise<Department | undefined>;
  deleteDepartment(id: number): Promise<boolean>;

  // Doctors
  getDoctors(): Promise<DoctorWithDepartment[]>;
  getDoctor(id: number): Promise<DoctorWithDepartment | undefined>;
  getDoctorsByDepartment(departmentId: number): Promise<DoctorWithDepartment[]>;
  createDoctor(doctor: InsertDoctor): Promise<Doctor>;
  updateDoctor(id: number, doctor: Partial<InsertDoctor>): Promise<Doctor | undefined>;
  deleteDoctor(id: number): Promise<boolean>;

  // Patients
  getPatients(): Promise<PatientWithLastAppointment[]>;
  getPatient(id: number): Promise<Patient | undefined>;
  getPatientByTcNo(tcNo: string): Promise<Patient | undefined>;
  searchPatients(query: string): Promise<Patient[]>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatient(id: number, patient: Partial<InsertPatient>): Promise<Patient | undefined>;
  deletePatient(id: number): Promise<boolean>;

  // Appointments
  getAppointments(): Promise<AppointmentWithDetails[]>;
  getAppointment(id: number): Promise<AppointmentWithDetails | undefined>;
  getAppointmentsByDate(date: string): Promise<AppointmentWithDetails[]>;
  getAppointmentsByPatient(patientId: number): Promise<AppointmentWithDetails[]>;
  getAppointmentsByDoctor(doctorId: number): Promise<AppointmentWithDetails[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment | undefined>;
  deleteAppointment(id: number): Promise<boolean>;

  // Medical Records
  getMedicalRecords(): Promise<MedicalRecord[]>;
  getMedicalRecord(id: number): Promise<MedicalRecord | undefined>;
  getMedicalRecordsByPatient(patientId: number): Promise<MedicalRecord[]>;
  createMedicalRecord(record: InsertMedicalRecord): Promise<MedicalRecord>;
  updateMedicalRecord(id: number, record: Partial<InsertMedicalRecord>): Promise<MedicalRecord | undefined>;
  deleteMedicalRecord(id: number): Promise<boolean>;

  // Statistics
  getStatistics(): Promise<{
    totalPatients: number;
    todayAppointments: number;
    activeDoctors: number;
    totalDepartments: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private departments: Map<number, Department>;
  private doctors: Map<number, Doctor>;
  private patients: Map<number, Patient>;
  private appointments: Map<number, Appointment>;
  private medicalRecords: Map<number, MedicalRecord>;
  private currentDepartmentId: number;
  private currentDoctorId: number;
  private currentPatientId: number;
  private currentAppointmentId: number;
  private currentMedicalRecordId: number;

  constructor() {
    this.departments = new Map();
    this.doctors = new Map();
    this.patients = new Map();
    this.appointments = new Map();
    this.medicalRecords = new Map();
    this.currentDepartmentId = 1;
    this.currentDoctorId = 1;
    this.currentPatientId = 1;
    this.currentAppointmentId = 1;
    this.currentMedicalRecordId = 1;

    this.initializeSampleData();
  }

  // User operations (for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existing = this.users.get(userData.id);
    const user: User = {
      ...userData,
      createdAt: existing?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.users.set(userData.id, user);
    return user;
  }

  private initializeSampleData() {
    // Sample departments
    const depts = [
      { name: "Kardiyoloji", description: "Kalp ve damar hastalıkları" },
      { name: "Nöroloji", description: "Sinir sistemi hastalıkları" },
      { name: "Dahiliye", description: "Genel iç hastalıkları" },
      { name: "Ortopedi", description: "Kemik ve eklem hastalıkları" },
      { name: "Pediatri", description: "Çocuk hastalıkları" },
      { name: "Acil Servis", description: "Acil müdahale servisi" },
    ];

    depts.forEach(dept => {
      const id = this.currentDepartmentId++;
      this.departments.set(id, { ...dept, id, head_doctor_id: null });
    });

    // Sample doctors
    const docs = [
      { first_name: "Ayşe", last_name: "Tanır", specialization: "Kardiyolog", department_id: 1, phone: "0532 123 45 67", email: "ayse.tanir@hospital.com", is_active: true },
      { first_name: "Mehmet", last_name: "Öz", specialization: "Nörolog", department_id: 2, phone: "0532 123 45 68", email: "mehmet.oz@hospital.com", is_active: true },
      { first_name: "Elif", last_name: "Kaya", specialization: "Dahiliye Uzmanı", department_id: 3, phone: "0532 123 45 69", email: "elif.kaya@hospital.com", is_active: true },
      { first_name: "Can", last_name: "Usta", specialization: "Ortopedist", department_id: 4, phone: "0532 123 45 70", email: "can.usta@hospital.com", is_active: true },
    ];

    docs.forEach(doc => {
      const id = this.currentDoctorId++;
      this.doctors.set(id, { ...doc, id });
    });
  }

  // Departments
  async getDepartments(): Promise<Department[]> {
    return Array.from(this.departments.values());
  }

  async getDepartment(id: number): Promise<Department | undefined> {
    return this.departments.get(id);
  }

  async createDepartment(department: InsertDepartment): Promise<Department> {
    const id = this.currentDepartmentId++;
    const newDepartment: Department = { ...department, id };
    this.departments.set(id, newDepartment);
    return newDepartment;
  }

  async updateDepartment(id: number, department: Partial<InsertDepartment>): Promise<Department | undefined> {
    const existing = this.departments.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...department };
    this.departments.set(id, updated);
    return updated;
  }

  async deleteDepartment(id: number): Promise<boolean> {
    return this.departments.delete(id);
  }

  // Doctors
  async getDoctors(): Promise<DoctorWithDepartment[]> {
    const doctors = Array.from(this.doctors.values());
    return doctors.map(doctor => ({
      ...doctor,
      department: this.departments.get(doctor.department_id)!,
    }));
  }

  async getDoctor(id: number): Promise<DoctorWithDepartment | undefined> {
    const doctor = this.doctors.get(id);
    if (!doctor) return undefined;
    return {
      ...doctor,
      department: this.departments.get(doctor.department_id)!,
    };
  }

  async getDoctorsByDepartment(departmentId: number): Promise<DoctorWithDepartment[]> {
    const doctors = Array.from(this.doctors.values()).filter(d => d.department_id === departmentId);
    return doctors.map(doctor => ({
      ...doctor,
      department: this.departments.get(doctor.department_id)!,
    }));
  }

  async createDoctor(doctor: InsertDoctor): Promise<Doctor> {
    const id = this.currentDoctorId++;
    const newDoctor: Doctor = { ...doctor, id };
    this.doctors.set(id, newDoctor);
    return newDoctor;
  }

  async updateDoctor(id: number, doctor: Partial<InsertDoctor>): Promise<Doctor | undefined> {
    const existing = this.doctors.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...doctor };
    this.doctors.set(id, updated);
    return updated;
  }

  async deleteDoctor(id: number): Promise<boolean> {
    return this.doctors.delete(id);
  }

  // Patients
  async getPatients(): Promise<PatientWithLastAppointment[]> {
    const patients = Array.from(this.patients.values());
    return patients.map(patient => {
      const patientAppointments = Array.from(this.appointments.values())
        .filter(apt => apt.patient_id === patient.id)
        .sort((a, b) => new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime());
      
      const lastAppointment = patientAppointments[0];
      let lastAppointmentWithDetails: AppointmentWithDetails | undefined;
      
      if (lastAppointment) {
        lastAppointmentWithDetails = {
          ...lastAppointment,
          patient,
          doctor: this.doctors.get(lastAppointment.doctor_id)!,
          department: this.departments.get(lastAppointment.department_id)!,
        };
      }

      return {
        ...patient,
        last_appointment: lastAppointmentWithDetails,
        appointment_count: patientAppointments.length,
      };
    });
  }

  async getPatient(id: number): Promise<Patient | undefined> {
    return this.patients.get(id);
  }

  async getPatientByTcNo(tcNo: string): Promise<Patient | undefined> {
    return Array.from(this.patients.values()).find(p => p.tc_no === tcNo);
  }

  async searchPatients(query: string): Promise<Patient[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.patients.values()).filter(patient =>
      patient.first_name.toLowerCase().includes(lowerQuery) ||
      patient.last_name.toLowerCase().includes(lowerQuery) ||
      patient.tc_no.includes(query) ||
      patient.phone.includes(query)
    );
  }

  async createPatient(patient: InsertPatient): Promise<Patient> {
    const id = this.currentPatientId++;
    const newPatient: Patient = { 
      ...patient, 
      id, 
      registration_date: new Date().toISOString()
    };
    this.patients.set(id, newPatient);
    return newPatient;
  }

  async updatePatient(id: number, patient: Partial<InsertPatient>): Promise<Patient | undefined> {
    const existing = this.patients.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...patient };
    this.patients.set(id, updated);
    return updated;
  }

  async deletePatient(id: number): Promise<boolean> {
    return this.patients.delete(id);
  }

  // Appointments
  async getAppointments(): Promise<AppointmentWithDetails[]> {
    const appointments = Array.from(this.appointments.values());
    return appointments.map(appointment => ({
      ...appointment,
      patient: this.patients.get(appointment.patient_id)!,
      doctor: this.doctors.get(appointment.doctor_id)!,
      department: this.departments.get(appointment.department_id)!,
    }));
  }

  async getAppointment(id: number): Promise<AppointmentWithDetails | undefined> {
    const appointment = this.appointments.get(id);
    if (!appointment) return undefined;
    return {
      ...appointment,
      patient: this.patients.get(appointment.patient_id)!,
      doctor: this.doctors.get(appointment.doctor_id)!,
      department: this.departments.get(appointment.department_id)!,
    };
  }

  async getAppointmentsByDate(date: string): Promise<AppointmentWithDetails[]> {
    const targetDate = new Date(date).toDateString();
    const appointments = Array.from(this.appointments.values()).filter(apt => 
      new Date(apt.appointment_date).toDateString() === targetDate
    );
    return appointments.map(appointment => ({
      ...appointment,
      patient: this.patients.get(appointment.patient_id)!,
      doctor: this.doctors.get(appointment.doctor_id)!,
      department: this.departments.get(appointment.department_id)!,
    }));
  }

  async getAppointmentsByPatient(patientId: number): Promise<AppointmentWithDetails[]> {
    const appointments = Array.from(this.appointments.values()).filter(apt => apt.patient_id === patientId);
    return appointments.map(appointment => ({
      ...appointment,
      patient: this.patients.get(appointment.patient_id)!,
      doctor: this.doctors.get(appointment.doctor_id)!,
      department: this.departments.get(appointment.department_id)!,
    }));
  }

  async getAppointmentsByDoctor(doctorId: number): Promise<AppointmentWithDetails[]> {
    const appointments = Array.from(this.appointments.values()).filter(apt => apt.doctor_id === doctorId);
    return appointments.map(appointment => ({
      ...appointment,
      patient: this.patients.get(appointment.patient_id)!,
      doctor: this.doctors.get(appointment.doctor_id)!,
      department: this.departments.get(appointment.department_id)!,
    }));
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const id = this.currentAppointmentId++;
    const newAppointment: Appointment = { ...appointment, id };
    this.appointments.set(id, newAppointment);
    return newAppointment;
  }

  async updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const existing = this.appointments.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...appointment };
    this.appointments.set(id, updated);
    return updated;
  }

  async deleteAppointment(id: number): Promise<boolean> {
    return this.appointments.delete(id);
  }

  // Medical Records
  async getMedicalRecords(): Promise<MedicalRecord[]> {
    return Array.from(this.medicalRecords.values());
  }

  async getMedicalRecord(id: number): Promise<MedicalRecord | undefined> {
    return this.medicalRecords.get(id);
  }

  async getMedicalRecordsByPatient(patientId: number): Promise<MedicalRecord[]> {
    return Array.from(this.medicalRecords.values()).filter(record => record.patient_id === patientId);
  }

  async createMedicalRecord(record: InsertMedicalRecord): Promise<MedicalRecord> {
    const id = this.currentMedicalRecordId++;
    const newRecord: MedicalRecord = { 
      ...record, 
      id, 
      created_at: new Date().toISOString()
    };
    this.medicalRecords.set(id, newRecord);
    return newRecord;
  }

  async updateMedicalRecord(id: number, record: Partial<InsertMedicalRecord>): Promise<MedicalRecord | undefined> {
    const existing = this.medicalRecords.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...record };
    this.medicalRecords.set(id, updated);
    return updated;
  }

  async deleteMedicalRecord(id: number): Promise<boolean> {
    return this.medicalRecords.delete(id);
  }

  // Statistics
  async getStatistics(): Promise<{
    totalPatients: number;
    todayAppointments: number;
    activeDoctors: number;
    totalDepartments: number;
  }> {
    const today = new Date().toDateString();
    const todayAppointments = Array.from(this.appointments.values()).filter(apt => 
      new Date(apt.appointment_date).toDateString() === today
    ).length;

    return {
      totalPatients: this.patients.size,
      todayAppointments,
      activeDoctors: Array.from(this.doctors.values()).filter(d => d.is_active).length,
      totalDepartments: this.departments.size,
    };
  }
}

export const storage = new MemStorage();
