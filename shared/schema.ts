import { pgTable, text, serial, integer, boolean, timestamp, date, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  head_doctor_id: integer("head_doctor_id"),
});

export const doctors = pgTable("doctors", {
  id: serial("id").primaryKey(),
  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  specialization: text("specialization").notNull(),
  department_id: integer("department_id").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  is_active: boolean("is_active").default(true),
});

export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  tc_no: text("tc_no").notNull().unique(),
  birth_date: date("birth_date").notNull(),
  gender: text("gender").notNull(),
  phone: text("phone").notNull(),
  address: text("address"),
  emergency_contact: text("emergency_contact"),
  registration_date: timestamp("registration_date").defaultNow(),
});

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patient_id: integer("patient_id").notNull(),
  doctor_id: integer("doctor_id").notNull(),
  department_id: integer("department_id").notNull(),
  appointment_date: timestamp("appointment_date").notNull(),
  status: text("status").notNull(), // scheduled, completed, cancelled, no_show
  notes: text("notes"),
  complaint: text("complaint"),
});

export const medical_records = pgTable("medical_records", {
  id: serial("id").primaryKey(),
  patient_id: integer("patient_id").notNull(),
  doctor_id: integer("doctor_id").notNull(),
  appointment_id: integer("appointment_id"),
  diagnosis: text("diagnosis"),
  treatment: text("treatment"),
  prescriptions: text("prescriptions"),
  notes: text("notes"),
  created_at: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertDepartmentSchema = createInsertSchema(departments).omit({
  id: true,
});

export const insertDoctorSchema = createInsertSchema(doctors).omit({
  id: true,
});

export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
  registration_date: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
});

export const insertMedicalRecordSchema = createInsertSchema(medical_records).omit({
  id: true,
  created_at: true,
});

// User types (for Replit Auth)
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Types
export type Department = typeof departments.$inferSelect;
export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;

export type Doctor = typeof doctors.$inferSelect;
export type InsertDoctor = z.infer<typeof insertDoctorSchema>;

export type Patient = typeof patients.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatientSchema>;

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;

export type MedicalRecord = typeof medical_records.$inferSelect;
export type InsertMedicalRecord = z.infer<typeof insertMedicalRecordSchema>;

// Extended types for joined data
export type AppointmentWithDetails = Appointment & {
  patient: Patient;
  doctor: Doctor;
  department: Department;
};

export type PatientWithLastAppointment = Patient & {
  last_appointment?: AppointmentWithDetails;
  appointment_count: number;
};

export type DoctorWithDepartment = Doctor & {
  department: Department;
};
