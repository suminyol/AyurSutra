import { API_BASE_URL } from '../constants';
import { Patient, MedicalHistoryEntry, ProgressData, ProgressChart } from '../types';

class PatientService {
  getProgressData(patientId: string) {
    throw new Error('Method not implemented.');
  }
  createProgressChart(chartData: Omit<ProgressChart, "id">) {
    throw new Error('Method not implemented.');
  }
  getProgressCharts(patientId: string) {
    throw new Error('Method not implemented.');
  }
  addProgressData(progressData: Omit<ProgressData, "id">) {
    throw new Error('Method not implemented.');
  }
  private baseURL = `${API_BASE_URL}/patients`;

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('ayursutra_auth_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getAllPatients(params?: {
    page?: number;
    limit?: number;
    search?: string;
    dosha?: string;
  }): Promise<{ patients: Patient[]; pagination: any }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.dosha) queryParams.append('dosha', params.dosha);

      const url = queryParams.toString() ? `${this.baseURL}?${queryParams}` : this.baseURL;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch patients');
      }

      return data.data;
    } catch (error) {
      console.error('Get all patients error:', error);
      throw error;
    }
  }

  async getPatientById(id: string): Promise<Patient> {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch patient');
      }

      return data.data.patient;
    } catch (error) {
      console.error('Get patient by ID error:', error);
      throw error;
    }
  }

  async updatePatient(id: string, updateData: Partial<Patient>): Promise<Patient> {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update patient');
      }

      return data.data.patient;
    } catch (error) {
      console.error('Update patient error:', error);
      throw error;
    }
  }

  async getMedicalHistory(id: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/${id}/medical-history`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch medical history');
      }

      return data.data;
    } catch (error) {
      console.error('Get medical history error:', error);
      throw error;
    }
  }

  async addMedicalHistory(id: string, historyEntry: MedicalHistoryEntry): Promise<Patient> {
    try {
      const response = await fetch(`${this.baseURL}/${id}/medical-history`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(historyEntry),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add medical history');
      }

      return data.data.patient;
    } catch (error) {
      console.error('Add medical history error:', error);
      throw error;
    }
  }

  async getPatientTreatments(id: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/${id}/treatments`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch patient treatments');
      }

      return data.data;
    } catch (error) {
      console.error('Get patient treatments error:', error);
      throw error;
    }
  }

  async getPatientAppointments(id: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/${id}/appointments`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch patient appointments');
      }

      return data.data;
    } catch (error) {
      console.error('Get patient appointments error:', error);
      throw error;
    }
  }
}

export const patientService = new PatientService();