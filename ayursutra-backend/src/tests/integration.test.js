const request = require('supertest');
const { app } = require('../app');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

describe('Integration Tests', () => {
  let authToken;
  let patientId;
  let doctorId;

  beforeEach(async () => {
    // Clean up database
    await User.deleteMany({});
    await Patient.deleteMany({});
    await Doctor.deleteMany({});
  });

  describe('Complete User Flow', () => {
    it('should complete full user registration and login flow', async () => {
      // 1. Register a patient
      const patientData = {
        name: 'John Patient',
        email: 'patient@test.com',
        password: 'password123',
        phone: '+1234567890',
        dateOfBirth: '1990-01-01',
        gender: 'male',
        role: 'patient'
      };

      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(patientData)
        .expect(201);

      expect(registerResponse.body.success).toBe(true);
      expect(registerResponse.body.data.user.email).toBe(patientData.email);
      expect(registerResponse.body.data.token).toBeDefined();

      authToken = registerResponse.body.data.token;

      // 2. Login with the registered user
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: patientData.email,
          password: patientData.password
        })
        .expect(200);

      expect(loginResponse.body.success).toBe(true);
      expect(loginResponse.body.data.user.email).toBe(patientData.email);

      // 3. Get user profile
      const profileResponse = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(profileResponse.body.success).toBe(true);
      expect(profileResponse.body.data.user.email).toBe(patientData.email);
    });

    it('should complete doctor registration and profile setup', async () => {
      // 1. Register a doctor
      const doctorData = {
        name: 'Dr. Jane Smith',
        email: 'doctor@test.com',
        password: 'password123',
        phone: '+1234567891',
        dateOfBirth: '1980-01-01',
        gender: 'female',
        role: 'doctor'
      };

      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(doctorData)
        .expect(201);

      authToken = registerResponse.body.data.token;
      doctorId = registerResponse.body.data.user.id;

      // 2. Update doctor profile
      const doctorProfileData = {
        licenseNumber: 'MD123456',
        specialization: 'General Medicine',
        experience: { years: 10 },
        consultationFee: 500,
        clinic: {
          name: 'Ayurveda Clinic',
          address: {
            street: '123 Main St',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001'
          }
        }
      };

      const updateResponse = await request(app)
        .put(`/api/doctors/${doctorId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(doctorProfileData)
        .expect(200);

      expect(updateResponse.body.success).toBe(true);
    });

    it('should create and manage appointments', async () => {
      // First create a patient and doctor
      const patientData = {
        name: 'Test Patient',
        email: 'patient@test.com',
        password: 'password123',
        phone: '+1234567890',
        dateOfBirth: '1990-01-01',
        gender: 'male',
        role: 'patient'
      };

      const doctorData = {
        name: 'Dr. Test Doctor',
        email: 'doctor@test.com',
        password: 'password123',
        phone: '+1234567891',
        dateOfBirth: '1980-01-01',
        gender: 'female',
        role: 'doctor'
      };

      // Register patient
      const patientResponse = await request(app)
        .post('/api/auth/register')
        .send(patientData)
        .expect(201);

      // Register doctor
      const doctorResponse = await request(app)
        .post('/api/auth/register')
        .send(doctorData)
        .expect(201);

      const patientToken = patientResponse.body.data.token;
      const doctorToken = doctorResponse.body.data.token;

      // Create appointment
      const appointmentData = {
        doctor: doctorResponse.body.data.user.id,
        date: '2024-12-25',
        time: '10:00',
        reason: 'General consultation',
        symptoms: ['Headache', 'Fatigue'],
        type: 'consultation'
      };

      const appointmentResponse = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${patientToken}`)
        .send(appointmentData)
        .expect(201);

      expect(appointmentResponse.body.success).toBe(true);
      expect(appointmentResponse.body.data.appointment.reason).toBe(appointmentData.reason);

      const appointmentId = appointmentResponse.body.data.appointment._id;

      // Get appointments
      const getAppointmentsResponse = await request(app)
        .get('/api/appointments')
        .set('Authorization', `Bearer ${patientToken}`)
        .expect(200);

      expect(getAppointmentsResponse.body.success).toBe(true);
      expect(getAppointmentsResponse.body.data.appointments.length).toBeGreaterThan(0);

      // Complete appointment (doctor action)
      const consultationData = {
        diagnosis: 'Stress-related headache',
        prescription: [
          {
            medicine: 'Ashwagandha',
            dosage: '500mg',
            frequency: 'Twice daily',
            duration: '2 weeks',
            instructions: 'Take with warm milk'
          }
        ],
        recommendations: ['Get adequate sleep', 'Practice meditation'],
        followUpRequired: true,
        followUpDate: '2024-12-30',
        notes: 'Patient should follow up in 5 days'
      };

      const completeResponse = await request(app)
        .put(`/api/appointments/${appointmentId}/complete`)
        .set('Authorization', `Bearer ${doctorToken}`)
        .send(consultationData)
        .expect(200);

      expect(completeResponse.body.success).toBe(true);
    });
  });

  describe('API Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('AyurSutra API is running');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid authentication', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid token');
    });

    it('should handle missing authentication', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('No token provided');
    });

    it('should handle validation errors', async () => {
      const invalidData = {
        name: 'A', // Too short
        email: 'invalid-email', // Invalid email
        password: '123', // Too short
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });
});
