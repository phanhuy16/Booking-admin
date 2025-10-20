// Doctor Types
export interface Doctor {
  id: number;
  fullName: string;
  specialty: string;
  email: string;
  phone: string;
  licenseNumber?: string;
  experienceYears?: number;
  qualification?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Patient Types
export interface Patient {
  id: number;
  fullName: string;
  dateOfBirth: string;
  gender: 'Nam' | 'Nữ' | 'Khác';
  email?: string;
  phone: string;
  address?: string;
  medicalHistory?: string;
  allergies?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Appointment Types
export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  appointmentDate: string;
  status: 'Scheduled' | 'Confirmed' | 'Completed' | 'Cancelled';
  reason?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  // Relations
  patient?: Patient;
  doctor?: Doctor;
}

// Auth Types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  id: number;
  username: string;
  email: string;
  role?: string;
}