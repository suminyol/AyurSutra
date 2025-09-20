import { API_BASE_URL } from '../constants';
import { Appointment, CreateAppointmentData, UpdateAppointmentData } from '../types';

class AppointmentService {
  private baseURL = `${API_BASE_URL}/appointments`;

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('ayursutra_auth_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async createAppointment(appointmentData: CreateAppointmentData): Promise<Appointment> {
    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(appointmentData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create appointment');
      }

      return data.data.appointment;
    } catch (error) {
      console.error('Create appointment error:', error);
      throw error;
    }
  }

  async getAppointments(params?: {
    page?: number;
    limit?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
    type?: string;
  }): Promise<{ appointments: Appointment[]; pagination: any }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.status) queryParams.append('status', params.status);
      if (params?.startDate) queryParams.append('startDate', params.startDate);
      if (params?.endDate) queryParams.append('endDate', params.endDate);
      if (params?.type) queryParams.append('type', params.type);

      const url = queryParams.toString() ? `${this.baseURL}?${queryParams}` : this.baseURL;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch appointments');
      }

      return data.data;
    } catch (error) {
      console.error('Get appointments error:', error);
      throw error;
    }
  }

  async getAppointmentById(id: string): Promise<Appointment> {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch appointment');
      }

      return data.data.appointment;
    } catch (error) {
      console.error('Get appointment by ID error:', error);
      throw error;
    }
  }

  async updateAppointment(id: string, updateData: UpdateAppointmentData): Promise<Appointment> {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update appointment');
      }

      return data.data.appointment;
    } catch (error) {
      console.error('Update appointment error:', error);
      throw error;
    }
  }

  async cancelAppointment(id: string, reason: string): Promise<Appointment> {
    try {
      const response = await fetch(`${this.baseURL}/${id}/cancel`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ reason }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to cancel appointment');
      }

      return data.data.appointment;
    } catch (error) {
      console.error('Cancel appointment error:', error);
      throw error;
    }
  }

  async rescheduleAppointment(id: string, newDate: string, newTime: string): Promise<Appointment> {
    try {
      const response = await fetch(`${this.baseURL}/${id}/reschedule`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ newDate, newTime }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reschedule appointment');
      }

      return data.data.appointment;
    } catch (error) {
      console.error('Reschedule appointment error:', error);
      throw error;
    }
  }

  async completeAppointment(id: string, consultationData: {
    diagnosis: string;
    prescription?: any[];
    recommendations?: string[];
    followUpRequired?: boolean;
    followUpDate?: string;
    notes?: string;
  }): Promise<Appointment> {
    try {
      const response = await fetch(`${this.baseURL}/${id}/complete`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(consultationData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to complete appointment');
      }

      return data.data.appointment;
    } catch (error) {
      console.error('Complete appointment error:', error);
      throw error;
    }
  }

  async getAppointmentStats(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<any> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.startDate) queryParams.append('startDate', params.startDate);
      if (params?.endDate) queryParams.append('endDate', params.endDate);

      const url = queryParams.toString() ? `${this.baseURL}/stats?${queryParams}` : `${this.baseURL}/stats`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch appointment statistics');
      }

      return data.data;
    } catch (error) {
      console.error('Get appointment stats error:', error);
      throw error;
    }
  }
}

export const appointmentService = new AppointmentService();
