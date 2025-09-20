import { API_BASE_URL } from '../constants';
import { Doctor, UpdateDoctorData } from '../types';

class DoctorService {
  private baseURL = `${API_BASE_URL}/doctors`;

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('ayursutra_auth_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getAllDoctors(params?: {
    page?: number;
    limit?: number;
    specialization?: string;
    city?: string;
    search?: string;
  }): Promise<{ doctors: Doctor[]; pagination: any }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.specialization) queryParams.append('specialization', params.specialization);
      if (params?.city) queryParams.append('city', params.city);
      if (params?.search) queryParams.append('search', params.search);

      const url = queryParams.toString() ? `${this.baseURL}?${queryParams}` : this.baseURL;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch doctors');
      }

      return data.data;
    } catch (error) {
      console.error('Get all doctors error:', error);
      throw error;
    }
  }

  async getDoctorById(id: string): Promise<Doctor> {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch doctor');
      }

      return data.data.doctor;
    } catch (error) {
      console.error('Get doctor by ID error:', error);
      throw error;
    }
  }

  async updateDoctor(id: string, updateData: UpdateDoctorData): Promise<Doctor> {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update doctor profile');
      }

      return data.data.doctor;
    } catch (error) {
      console.error('Update doctor error:', error);
      throw error;
    }
  }

  async getDoctorAvailability(id: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/${id}/availability`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch doctor availability');
      }

      return data.data;
    } catch (error) {
      console.error('Get doctor availability error:', error);
      throw error;
    }
  }

  async updateDoctorAvailability(id: string, availability: any, consultationFee?: number): Promise<Doctor> {
    try {
      const response = await fetch(`${this.baseURL}/${id}/availability`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ availability, consultationFee }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update doctor availability');
      }

      return data.data.doctor;
    } catch (error) {
      console.error('Update doctor availability error:', error);
      throw error;
    }
  }

  async getDoctorPatients(id: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/${id}/patients`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch doctor patients');
      }

      return data.data;
    } catch (error) {
      console.error('Get doctor patients error:', error);
      throw error;
    }
  }

  async getDoctorAppointments(id: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/${id}/appointments`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch doctor appointments');
      }

      return data.data;
    } catch (error) {
      console.error('Get doctor appointments error:', error);
      throw error;
    }
  }

  async getDoctorReviews(id: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/${id}/reviews`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch doctor reviews');
      }

      return data.data;
    } catch (error) {
      console.error('Get doctor reviews error:', error);
      throw error;
    }
  }
}

export const doctorService = new DoctorService();
