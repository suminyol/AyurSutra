import { API_BASE_URL } from '../constants';
import { Patient, MedicalHistoryEntry, ProgressData, ProgressChart } from '../types';

class PatientService {
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

  
async getPatientsByDoctor(): Promise<{ patients: Patient[] }> {
  try {
    // Calls the new, simpler URL and sends no ID
    const response = await fetch(`${this.baseURL}/doctor/my-patients`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch doctor patients');
    }
    return data.data;
  } catch (error) {
    console.error('Get patients by doctor error:', error);
    throw error;
  }
}

async addPatientByDoctor(patientData: any): Promise<Patient> {
  try {
    const response = await fetch(`${this.baseURL}/add-by-doctor`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(patientData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to add patient');
    }
    return data.data.patient;
  } catch (error) {
    console.error('Add patient by doctor error:', error);
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

  async saveExamination(patientId: string, examinationData: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/${patientId}/examination`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(examinationData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save examination data');
      }

      return data.data;
    } catch (error) {
      console.error('Save examination error:', error);
      throw error;
    }
  }

  async generateSolution({ patientId, formData }: { patientId: string; formData: any }): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/generate-solution`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ patientId, formData }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate AI solution');
      }

      return data.data;
    } catch (error) {
      console.error('Generate AI solution error:', error);
      throw error;
    }
  }

  async getProgressData(patientId: string): Promise<ProgressData[]> {
    try {
      const response = await fetch(`${this.baseURL}/${patientId}/progress`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch progress data');
      }

      return data.data;
    } catch (error) {
      console.error('Get progress data error:', error);
      throw error;
    }
  }

  async addProgressData(progressData: Omit<ProgressData, 'id'>): Promise<ProgressData> {
    try {
      const response = await fetch(`${this.baseURL}/progress`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(progressData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add progress data');
      }

      return data.data;
    } catch (error) {
      console.error('Add progress data error:', error);
      throw error;
    }
  }

  async getProgressCharts(patientId: string): Promise<ProgressChart[]> {
    try {
      const response = await fetch(`${this.baseURL}/${patientId}/progress-charts`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch progress charts');
      }

      return data.data;
    } catch (error) {
      console.error('Get progress charts error:', error);
      throw error;
    }
  }

  async createProgressChart(chartData: Omit<ProgressChart, 'id'>): Promise<ProgressChart> {
    try {
      const response = await fetch(`${this.baseURL}/progress-charts`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(chartData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create progress chart');
      }

      return data.data;
    } catch (error) {
      console.error('Create progress chart error:', error);
      throw error;
    }
  }
}

export const patientService = new PatientService();