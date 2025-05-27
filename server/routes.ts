import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertDepartmentSchema,
  insertDoctorSchema,
  insertPatientSchema,
  insertAppointmentSchema,
  insertMedicalRecordSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Departments
  app.get("/api/departments", async (req, res) => {
    try {
      const departments = await storage.getDepartments();
      res.json(departments);
    } catch (error) {
      res.status(500).json({ message: "Departmanlar alınırken hata oluştu" });
    }
  });

  app.get("/api/departments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const department = await storage.getDepartment(id);
      if (!department) {
        return res.status(404).json({ message: "Departman bulunamadı" });
      }
      res.json(department);
    } catch (error) {
      res.status(500).json({ message: "Departman alınırken hata oluştu" });
    }
  });

  app.post("/api/departments", async (req, res) => {
    try {
      const data = insertDepartmentSchema.parse(req.body);
      const department = await storage.createDepartment(data);
      res.status(201).json(department);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Geçersiz veri", errors: error.errors });
      }
      res.status(500).json({ message: "Departman oluşturulurken hata oluştu" });
    }
  });

  // Doctors
  app.get("/api/doctors", async (req, res) => {
    try {
      const doctors = await storage.getDoctors();
      res.json(doctors);
    } catch (error) {
      res.status(500).json({ message: "Doktorlar alınırken hata oluştu" });
    }
  });

  app.get("/api/doctors/department/:departmentId", async (req, res) => {
    try {
      const departmentId = parseInt(req.params.departmentId);
      const doctors = await storage.getDoctorsByDepartment(departmentId);
      res.json(doctors);
    } catch (error) {
      res.status(500).json({ message: "Doktorlar alınırken hata oluştu" });
    }
  });

  app.post("/api/doctors", async (req, res) => {
    try {
      const data = insertDoctorSchema.parse(req.body);
      const doctor = await storage.createDoctor(data);
      res.status(201).json(doctor);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Geçersiz veri", errors: error.errors });
      }
      res.status(500).json({ message: "Doktor oluşturulurken hata oluştu" });
    }
  });

  // Patients
  app.get("/api/patients", async (req, res) => {
    try {
      const patients = await storage.getPatients();
      res.json(patients);
    } catch (error) {
      res.status(500).json({ message: "Hastalar alınırken hata oluştu" });
    }
  });

  app.get("/api/patients/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Arama sorgusu gerekli" });
      }
      const patients = await storage.searchPatients(query);
      res.json(patients);
    } catch (error) {
      res.status(500).json({ message: "Hasta arama yapılırken hata oluştu" });
    }
  });

  app.get("/api/patients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const patient = await storage.getPatient(id);
      if (!patient) {
        return res.status(404).json({ message: "Hasta bulunamadı" });
      }
      res.json(patient);
    } catch (error) {
      res.status(500).json({ message: "Hasta alınırken hata oluştu" });
    }
  });

  app.post("/api/patients", async (req, res) => {
    try {
      const data = insertPatientSchema.parse(req.body);
      
      // Check if TC number already exists
      const existingPatient = await storage.getPatientByTcNo(data.tc_no);
      if (existingPatient) {
        return res.status(400).json({ message: "Bu TC kimlik numarası ile kayıtlı hasta bulunmaktadır" });
      }
      
      const patient = await storage.createPatient(data);
      res.status(201).json(patient);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Geçersiz veri", errors: error.errors });
      }
      res.status(500).json({ message: "Hasta oluşturulurken hata oluştu" });
    }
  });

  app.put("/api/patients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertPatientSchema.partial().parse(req.body);
      const patient = await storage.updatePatient(id, data);
      if (!patient) {
        return res.status(404).json({ message: "Hasta bulunamadı" });
      }
      res.json(patient);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Geçersiz veri", errors: error.errors });
      }
      res.status(500).json({ message: "Hasta güncellenirken hata oluştu" });
    }
  });

  // Appointments
  app.get("/api/appointments", async (req, res) => {
    try {
      const appointments = await storage.getAppointments();
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Randevular alınırken hata oluştu" });
    }
  });

  app.get("/api/appointments/today", async (req, res) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const appointments = await storage.getAppointmentsByDate(today);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Bugünkü randevular alınırken hata oluştu" });
    }
  });

  app.get("/api/appointments/date/:date", async (req, res) => {
    try {
      const date = req.params.date;
      const appointments = await storage.getAppointmentsByDate(date);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Randevular alınırken hata oluştu" });
    }
  });

  app.get("/api/appointments/patient/:patientId", async (req, res) => {
    try {
      const patientId = parseInt(req.params.patientId);
      const appointments = await storage.getAppointmentsByPatient(patientId);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Hasta randevuları alınırken hata oluştu" });
    }
  });

  app.post("/api/appointments", async (req, res) => {
    try {
      const data = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(data);
      res.status(201).json(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Geçersiz veri", errors: error.errors });
      }
      res.status(500).json({ message: "Randevu oluşturulurken hata oluştu" });
    }
  });

  app.put("/api/appointments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertAppointmentSchema.partial().parse(req.body);
      const appointment = await storage.updateAppointment(id, data);
      if (!appointment) {
        return res.status(404).json({ message: "Randevu bulunamadı" });
      }
      res.json(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Geçersiz veri", errors: error.errors });
      }
      res.status(500).json({ message: "Randevu güncellenirken hata oluştu" });
    }
  });

  // Medical Records
  app.get("/api/medical-records/patient/:patientId", async (req, res) => {
    try {
      const patientId = parseInt(req.params.patientId);
      const records = await storage.getMedicalRecordsByPatient(patientId);
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: "Tıbbi kayıtlar alınırken hata oluştu" });
    }
  });

  app.post("/api/medical-records", async (req, res) => {
    try {
      const data = insertMedicalRecordSchema.parse(req.body);
      const record = await storage.createMedicalRecord(data);
      res.status(201).json(record);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Geçersiz veri", errors: error.errors });
      }
      res.status(500).json({ message: "Tıbbi kayıt oluşturulurken hata oluştu" });
    }
  });

  // Statistics
  app.get("/api/statistics", async (req, res) => {
    try {
      const stats = await storage.getStatistics();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "İstatistikler alınırken hata oluştu" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
