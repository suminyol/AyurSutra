import { API_BASE_URL } from '../constants';
import { Treatment, CreateTreatmentData, TreatmentSession } from '../types';

class TreatmentService {
  private baseURL = `${API_BASE_URL}/treatments`;

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('ayursutra_auth_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async generateAITreatmentPlan(data: {
    patientId: string;
    appointmentId: string;
    symptoms: string[];
    diagnosis: string;
    patientHistory: any;
  }): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/generate-ai-plan`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to generate AI treatment plan');
      }

      return result.data;
    } catch (error) {
      console.error('Generate AI treatment plan error:', error);
      throw error;
    }
  }

  async createTreatment(treatmentData: CreateTreatmentData): Promise<Treatment> {
    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(treatmentData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create treatment');
      }

      return data.data.treatment;
    } catch (error) {
      console.error('Create treatment error:', error);
      throw error;
    }
  }

  async getTreatments(params?: {
    page?: number;
    limit?: number;
    status?: string;
    stage?: number;
  }): Promise<{ treatments: Treatment[]; pagination: any }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.status) queryParams.append('status', params.status);
      if (params?.stage !== undefined) queryParams.append('stage', params.stage.toString());

      const url = queryParams.toString() ? `${this.baseURL}?${queryParams}` : this.baseURL;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch treatments');
      }

      return data.data;
    } catch (error) {
      console.error('Get treatments error:', error);
      throw error;
    }
  }

  async getTreatmentById(id: string): Promise<Treatment> {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch treatment');
      }

      return data.data.treatment;
    } catch (error) {
      console.error('Get treatment by ID error:', error);
      throw error;
    }
  }

  async startTreatment(id: string): Promise<Treatment> {
    try {
      const response = await fetch(`${this.baseURL}/${id}/start`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to start treatment');
      }

      return data.data.treatment;
    } catch (error) {
      console.error('Start treatment error:', error);
      throw error;
    }
  }

  async completeTreatmentStage(id: string, stageIndex: number, notes?: string): Promise<Treatment> {
    try {
      const response = await fetch(`${this.baseURL}/${id}/complete-stage`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ stageIndex, notes }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to complete treatment stage');
      }

      return data.data.treatment;
    } catch (error) {
      console.error('Complete treatment stage error:', error);
      throw error;
    }
  }

  async addTreatmentSession(id: string, sessionData: TreatmentSession): Promise<Treatment> {
    try {
      const response = await fetch(`${this.baseURL}/${id}/sessions`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(sessionData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add treatment session');
      }

      return data.data.treatment;
    } catch (error) {
      console.error('Add treatment session error:', error);
      throw error;
    }
  }

  async completeTreatment(id: string): Promise<Treatment> {
    try {
      const response = await fetch(`${this.baseURL}/${id}/complete`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to complete treatment');
      }

      return data.data.treatment;
    } catch (error) {
      console.error('Complete treatment error:', error);
      throw error;
    }
  }

  async getTreatmentProgress(id: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/${id}/progress`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch treatment progress');
      }

      return data.data;
    } catch (error) {
      console.error('Get treatment progress error:', error);
      throw error;
    }
  }
}

export const treatmentService = new TreatmentService();
