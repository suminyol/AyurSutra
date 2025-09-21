// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// App Configuration
export const APP_NAME = 'AyurSutra';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Panchakarma Patient Management and Therapy Scheduling Software';

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PATIENT_DASHBOARD: '/patient/dashboard',
  DOCTOR_DASHBOARD: '/doctor/dashboard',
  APPOINTMENT_SCHEDULE: '/appointment/schedule',
  TREATMENT_HISTORY: '/treatment/history',
  PATIENT_MANAGEMENT: '/doctor/patients',
  PROGRESS_TRACKING: '/patient/progress',
  NOTIFICATIONS: '/notifications',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

// Therapy Types
export const THERAPY_TYPES = [
  {
    id: 'vamana',
    name: 'Vamana (Therapeutic Vomiting)',
    description: 'A cleansing therapy that eliminates toxins through controlled vomiting',
    duration: 120,
    preparation: [
      'Follow specific diet for 3 days before therapy',
      'Avoid heavy meals 24 hours before',
      'Take prescribed medications as directed',
    ],
    postCare: [
      'Rest for 24-48 hours',
      'Follow light diet for 3 days',
      'Avoid exposure to cold',
    ],
    contraindications: [
      'Pregnancy',
      'Heart conditions',
      'High blood pressure',
    ],
    benefits: [
      'Removes Kapha toxins',
      'Improves respiratory function',
      'Enhances digestion',
    ],
  },
  {
    id: 'virechana',
    name: 'Virechana (Purgation Therapy)',
    description: 'A cleansing therapy that eliminates Pitta toxins through purgation',
    duration: 90,
    preparation: [
      'Follow Pitta pacifying diet',
      'Take ghee for 3-7 days',
      'Avoid spicy and hot foods',
    ],
    postCare: [
      'Rest for 24 hours',
      'Follow cooling diet',
      'Avoid sun exposure',
    ],
    contraindications: [
      'Diarrhea',
      'Weakness',
      'Pregnancy',
    ],
    benefits: [
      'Removes Pitta toxins',
      'Improves liver function',
      'Enhances skin health',
    ],
  },
  {
    id: 'basti',
    name: 'Basti (Enema Therapy)',
    description: 'A rejuvenating therapy using medicated enemas',
    duration: 60,
    preparation: [
      'Follow Vata pacifying diet',
      'Take prescribed oils',
      'Avoid cold foods',
    ],
    postCare: [
      'Rest for 2-3 hours',
      'Follow warm diet',
      'Avoid cold exposure',
    ],
    contraindications: [
      'Rectal bleeding',
      'Severe constipation',
      'Fever',
    ],
    benefits: [
      'Removes Vata toxins',
      'Strengthens nervous system',
      'Improves joint health',
    ],
  },
  {
    id: 'nasya',
    name: 'Nasya (Nasal Therapy)',
    description: 'A therapy involving nasal administration of medicated oils',
    duration: 30,
    preparation: [
      'Avoid heavy meals 2 hours before',
      'Clear nasal passages',
      'Take prescribed herbs',
    ],
    postCare: [
      'Avoid cold exposure',
      'Follow light diet',
      'Rest for 1 hour',
    ],
    contraindications: [
      'Nasal bleeding',
      'Sinusitis',
      'Pregnancy',
    ],
    benefits: [
      'Clears nasal passages',
      'Improves mental clarity',
      'Enhances sensory functions',
    ],
  },
  {
    id: 'raktamokshana',
    name: 'Raktamokshana (Bloodletting)',
    description: 'A specialized therapy for blood purification',
    duration: 45,
    preparation: [
      'Follow specific diet for 7 days',
      'Take prescribed herbs',
      'Avoid alcohol and smoking',
    ],
    postCare: [
      'Rest for 24-48 hours',
      'Follow cooling diet',
      'Avoid physical exertion',
    ],
    contraindications: [
      'Anemia',
      'Low blood pressure',
      'Pregnancy',
    ],
    benefits: [
      'Purifies blood',
      'Improves circulation',
      'Reduces inflammation',
    ],
  },
] as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  SESSION_REMINDER: 'session_reminder',
  PRECAUTION_ALERT: 'precaution_alert',
  SESSION_CANCELLED: 'session_cancelled',
  SESSION_RESCHEDULED: 'session_rescheduled',
  FEEDBACK_REQUEST: 'feedback_request',
  GENERAL: 'general',
} as const;

// Session Status
export const SESSION_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  RESCHEDULED: 'rescheduled',
} as const;

// User Roles
export const USER_ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  ADMIN: 'admin',
} as const;

// Time Slots
export const TIME_SLOTS = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00',
] as const;

// Days of Week
export const DAYS_OF_WEEK = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

// Chart Colors
export const CHART_COLORS = [
  '#0ea5e9', // Primary blue
  '#22c55e', // Wellness green
  '#f59e0b', // Ayurveda yellow
  '#ef4444', // Red
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#84cc16', // Lime
] as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'ayursutra_auth_token',
  USER_DATA: 'ayursutra_user_data',
  THEME: 'ayursutra_theme',
  LANGUAGE: 'ayursutra_language',
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`,
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  NAME_TOO_SHORT: `Name must be at least ${VALIDATION_RULES.NAME_MIN_LENGTH} characters`,
  NAME_TOO_LONG: `Name must be no more than ${VALIDATION_RULES.NAME_MAX_LENGTH} characters`,
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  REGISTER_SUCCESS: 'Registration successful',
  PROFILE_UPDATED: 'Profile updated successfully',
  THERAPY_BOOKED: 'Therapy session booked successfully',
  THERAPY_CANCELLED: 'Therapy session cancelled successfully',
  FEEDBACK_SUBMITTED: 'Feedback submitted successfully',
  NOTIFICATION_SENT: 'Notification sent successfully',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100],
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy h:mm a',
  API: 'yyyy-MM-dd',
  API_WITH_TIME: 'yyyy-MM-dd HH:mm:ss',
  TIME_ONLY: 'h:mm a',
} as const;
