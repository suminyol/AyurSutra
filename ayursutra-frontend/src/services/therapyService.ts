import { API_BASE_URL } from '../constants';
import { TherapySession, TherapyType, PatientFeedback, TherapyBookingForm, ApiResponse, PaginatedResponse } from '../types';

class TherapyService {
  private baseURL = `${API_BASE_URL}/therapy`;

  private getAuthHeaders() {
    const token = localStorage.getItem('ayursutra_auth_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getSessions(filters?: any): Promise<TherapySession[]> {
    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, String(value));
          }
        });
      }

      const response = await fetch(`${this.baseURL}/sessions?${queryParams}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data: ApiResponse<TherapySession[]> = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch therapy sessions');
      }

      return data.data;
    } catch (error) {
      console.error('Get sessions error:', error);
      throw error;
    }
  }

  async getSessionById(sessionId: string): Promise<TherapySession> {
    try {
      const response = await fetch(`${this.baseURL}/sessions/${sessionId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data: ApiResponse<TherapySession> = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch session details');
      }

      return data.data;
    } catch (error) {
      console.error('Get session error:', error);
      throw error;
    }
  }

  async getTherapyTypes(): Promise<TherapyType[]> {
    try {
      const response = await fetch(`${this.baseURL}/types`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data: ApiResponse<TherapyType[]> = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch therapy types');
      }

      return data.data;
    } catch (error) {
      console.error('Get therapy types error:', error);
      throw error;
    }
  }

  async bookSession(bookingData: TherapyBookingForm): Promise<TherapySession> {
    try {
      const response = await fetch(`${this.baseURL}/sessions`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(bookingData),
      });

      const data: ApiResponse<TherapySession> = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to book therapy session');
      }

      return data.data;
    } catch (error) {
      console.error('Book session error:', error);
      throw error;
    }
  }

  async cancelSession(sessionId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/sessions/${sessionId}/cancel`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
      });

      const data: ApiResponse<void> = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel therapy session');
      }
    } catch (error) {
      console.error('Cancel session error:', error);
      throw error;
    }
  }

  async rescheduleSession(sessionId: string, newDate: string, newTime: string): Promise<TherapySession> {
    try {
      const response = await fetch(`${this.baseURL}/sessions/${sessionId}/reschedule`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ newDate, newTime }),
      });

      const data: ApiResponse<TherapySession> = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reschedule therapy session');
      }

      return data.data;
    } catch (error) {
      console.error('Reschedule session error:', error);
      throw error;
    }
  }

  async submitFeedback(feedback: PatientFeedback): Promise<PatientFeedback> {
    try {
      const response = await fetch(`${this.baseURL}/feedback`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(feedback),
      });

      const data: ApiResponse<PatientFeedback> = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit feedback');
      }

      return data.data;
    } catch (error) {
      console.error('Submit feedback error:', error);
      throw error;
    }
  }

  async getFeedback(sessionId: string): Promise<PatientFeedback | null> {
    try {
      const response = await fetch(`${this.baseURL}/sessions/${sessionId}/feedback`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data: ApiResponse<PatientFeedback | null> = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch feedback');
      }

      return data.data;
    } catch (error) {
      console.error('Get feedback error:', error);
      throw error;
    }
  }

  async getAvailableSlots(therapyTypeId: string, date: string): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseURL}/available-slots?therapyTypeId=${therapyTypeId}&date=${date}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data: ApiResponse<string[]> = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch available slots');
      }

      return data.data;
    } catch (error) {
      console.error('Get available slots error:', error);
      throw error;
    }
  }

  async getDoctorSchedule(doctorId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/doctors/${doctorId}/schedule`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data: ApiResponse<any> = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch doctor schedule');
      }

      return data.data;
    } catch (error) {
      console.error('Get doctor schedule error:', error);
      throw error;
    }
  }

  async updateSessionNotes(sessionId: string, notes: string): Promise<TherapySession> {
    try {
      const response = await fetch(`${this.baseURL}/sessions/${sessionId}/notes`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ notes }),
      });

      const data: ApiResponse<TherapySession> = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update session notes');
      }

      return data.data;
    } catch (error) {
      console.error('Update session notes error:', error);
      throw error;
    }
  }
}

export const therapyService = new TherapyService();
