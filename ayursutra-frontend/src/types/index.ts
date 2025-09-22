// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'doctor';
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: Address;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Patient specific types
export interface Patient extends User {
  role: 'patient';
  medicalHistory: MedicalRecord[];
  currentTherapies: TherapySession[];
  emergencyContact: EmergencyContact;
  insuranceInfo?: InsuranceInfo;
  examinationData?: any;
}

export interface MedicalRecord {
  id: string;
  condition: string;
  diagnosis: string;
  treatment: string;
  date: string;
  doctor: string;
  notes?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  expiryDate: string;
}

// Doctor specific types
export interface Doctor extends User {
  role: 'doctor';
  specialization: string;
  licenseNumber: string;
  experience: number;
  patients: string[]; // Patient IDs
  schedule: DoctorSchedule;
  qualifications: string[];
}

export interface DoctorSchedule {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

// Therapy and Treatment Types
export interface TherapySession {
  id: string;
  patientId: string;
  doctorId: string;
  therapyType: TherapyType;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  status: SessionStatus;
  notes?: string;
  precautions: Precaution[];
  feedback?: PatientFeedback;
  createdAt: string;
  updatedAt: string;
}

export interface TherapyType {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  preparation: string[];
  postCare: string[];
  contraindications: string[];
  benefits: string[];
}

export interface Precaution {
  id: string;
  type: 'pre' | 'post';
  title: string;
  description: string;
  timing: string; // e.g., "2 hours before", "immediately after"
  isRequired: boolean;
}

export interface PatientFeedback {
  id: string;
  sessionId: string;
  rating: number; // 1-5
  symptoms: string[];
  improvements: string[];
  sideEffects: string[];
  comments: string;
  submittedAt: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId?: string;
  user?: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  readAt?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledFor?: string;
  sentAt?: string;
  deliveryMethod?: string[];
  isActive?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export type NotificationType = 
  | 'session_reminder'
  | 'precaution_alert'
  | 'session_cancelled'
  | 'session_rescheduled'
  | 'feedback_request'
  | 'appointment_reminder'
  | 'appointment_confirmation'
  | 'appointment_cancelled'
  | 'appointment_rescheduled'
  | 'treatment_reminder'
  | 'treatment_stage_completed'
  | 'treatment_completed'
  | 'payment_confirmation'
  | 'payment_failed'
  | 'general'
  | 'system';

// Progress Tracking Types
export interface ProgressData {
  id: string;
  patientId: string;
  metric: string;
  value: number;
  unit: string;
  date: string;
  notes?: string;
}

export interface ProgressChart {
  id: string;
  patientId: string;
  title: string;
  type: 'line' | 'bar' | 'area';
  data: ProgressData[];
  xAxis: string;
  yAxis: string;
  color: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'patient' | 'doctor';
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
}

export interface TherapyBookingForm {
  therapyTypeId: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
}

// UI State Types
export interface ThemeState {
  mode: 'light' | 'dark';
  primaryColor: string;
}

export interface LoadingState {
  isLoading: boolean;
  loadingMessage?: string;
}

export interface ErrorState {
  hasError: boolean;
  errorMessage?: string;
  errorCode?: string;
}

// Enums
export enum SessionStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled',
}

export enum UserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  ADMIN = 'admin',
}

// Additional types for backend integration
export interface Appointment {
  id: string;
  patient: string | Patient;
  doctor: string | Doctor;
  date: string;
  time: string;
  duration: number;
  type: 'consultation' | 'follow-up' | 'emergency' | 'therapy';
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show' | 'rescheduled';
  reason: string;
  symptoms: string[];
  notes?: string;
  consultation?: {
    diagnosis: string;
    prescription: any[];
    recommendations: string[];
    followUpRequired: boolean;
    followUpDate?: string;
    notes: string;
  };
  payment: {
    amount: number;
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    method: 'cash' | 'card' | 'upi' | 'netbanking' | 'wallet';
    transactionId?: string;
    paidAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentData {
  doctor: string;
  date: string;
  time: string;
  reason: string;
  symptoms?: string[];
  type?: string;
}

export interface UpdateAppointmentData {
  date?: string;
  time?: string;
  reason?: string;
  symptoms?: string[];
  status?: string;
}

export interface Treatment {
  id: string;
  patient: string | Patient;
  doctor: string | Doctor;
  appointment: string | Appointment;
  diagnosis: {
    primary: string;
    secondary?: string[];
    symptoms?: string[];
    notes?: string;
  };
  aiGeneratedPlan?: {
    isGenerated: boolean;
    generatedAt: string;
    stages: TreatmentStage[];
    overallDuration: { value: number; unit: string };
    estimatedCost: number;
    successRate: number;
    confidence: number;
  };
  doctorCustomizedPlan?: {
    isCustomized: boolean;
    customizedAt: string;
    customizedBy: string;
    modifications: any[];
    stages: TreatmentStage[];
    overallDuration: { value: number; unit: string };
    estimatedCost: number;
  };
  currentStage: {
    index: number;
    title: string;
    startDate?: string;
    expectedEndDate?: string;
    actualEndDate?: string;
    isCompleted: boolean;
    completedAt?: string;
  };
  progress: {
    overall: number;
    stages: TreatmentStageProgress[];
  };
  sessions: TreatmentSession[];
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  startDate?: string;
  endDate?: string;
  actualEndDate?: string;
  cost: {
    estimated: number;
    actual: number;
    paid: number;
    remaining: number;
  };
  feedback?: {
    patient?: { rating: number; comment: string; submittedAt: string };
    doctor?: { rating: number; comment: string; submittedAt: string };
  };
  createdAt: string;
  updatedAt: string;
}

export interface TreatmentStage {
  title: string;
  description: string;
  duration: { value: number; unit: string };
  precautions: string[];
  dailyTasks: string[];
  weeklyTasks: string[];
  therapies: TreatmentTherapy[];
  medications: TreatmentMedication[];
  diet: {
    allowed: string[];
    restricted: string[];
    recommendations: string[];
  };
  lifestyle: {
    activities: string[];
    restrictions: string[];
    recommendations: string[];
  };
}

export interface TreatmentTherapy {
  name: string;
  description: string;
  duration: number;
  frequency: string;
  instructions: string;
}

export interface TreatmentMedication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface TreatmentStageProgress {
  stageIndex: number;
  title: string;
  progress: number;
  startDate?: string;
  endDate?: string;
  isCompleted: boolean;
  completedAt?: string;
  notes?: string;
}

export interface TreatmentSession {
  stageIndex: number;
  stageTitle: string;
  date: string;
  time: string;
  duration: number;
  therapist?: string;
  therapy: {
    name: string;
    description: string;
    instructions: string;
  };
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  patientFeedback?: {
    rating: number;
    comment: string;
    submittedAt: string;
  };
  therapistNotes?: string;
  checkInTime?: string;
  checkOutTime?: string;
}

export interface CreateTreatmentData {
  patientId: string;
  appointmentId: string;
  diagnosis: {
    primary: string;
    secondary?: string[];
    symptoms?: string[];
    notes?: string;
  };
  aiPlan?: any;
  doctorCustomizations?: any[];
}

export interface MedicalHistoryEntry {
  condition: string;
  diagnosisDate?: string;
  treatment?: string;
  status?: 'active' | 'resolved' | 'chronic';
  notes?: string;
}

export interface UpdateDoctorData {
  licenseNumber?: string;
  specialization?: string;
  qualifications?: any[];
  experience?: { years: number; description?: string };
  consultationFee?: number;
  clinic?: any;
  services?: any[];
  languages?: string[];
}