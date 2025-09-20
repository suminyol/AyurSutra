import { API_BASE_URL } from '../constants';

class PaymentService {
  private baseURL = `${API_BASE_URL}/payments`;

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('ayursutra_auth_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async createPaymentOrder(data: {
    appointmentId: string;
    amount: number;
    method?: string;
  }): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/create-order`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create payment order');
      }

      return result.data;
    } catch (error) {
      console.error('Create payment order error:', error);
      throw error;
    }
  }

  async verifyPayment(data: {
    appointmentId: string;
    paymentId: string;
    signature?: string;
    method?: string;
  }): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/verify`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Payment verification failed');
      }

      return result.data;
    } catch (error) {
      console.error('Verify payment error:', error);
      throw error;
    }
  }

  async getPaymentHistory(params?: {
    page?: number;
    limit?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<any> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.status) queryParams.append('status', params.status);
      if (params?.startDate) queryParams.append('startDate', params.startDate);
      if (params?.endDate) queryParams.append('endDate', params.endDate);

      const url = queryParams.toString() ? `${this.baseURL}/history?${queryParams}` : `${this.baseURL}/history`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch payment history');
      }

      return data.data;
    } catch (error) {
      console.error('Get payment history error:', error);
      throw error;
    }
  }

  async getPaymentStats(params?: {
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
        throw new Error(data.message || 'Failed to fetch payment statistics');
      }

      return data.data;
    } catch (error) {
      console.error('Get payment stats error:', error);
      throw error;
    }
  }

  async refundPayment(appointmentId: string, reason: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/refund`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ appointmentId, reason }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to process refund');
      }

      return data.data;
    } catch (error) {
      console.error('Refund payment error:', error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();
