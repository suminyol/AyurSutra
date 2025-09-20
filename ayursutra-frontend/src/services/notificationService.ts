import { API_BASE_URL } from '../constants';
import { Notification } from '../types';

class NotificationService {
  private baseURL = `${API_BASE_URL}/notifications`;

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('ayursutra_auth_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getNotifications(params?: {
    page?: number;
    limit?: number;
    type?: string;
    isRead?: boolean;
  }): Promise<{ notifications: Notification[]; unreadCount: number; pagination: any }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.type) queryParams.append('type', params.type);
      if (params?.isRead !== undefined) queryParams.append('isRead', params.isRead.toString());

      const url = queryParams.toString() ? `${this.baseURL}?${queryParams}` : this.baseURL;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch notifications');
      }

      return data.data;
    } catch (error) {
      console.error('Get notifications error:', error);
      throw error;
    }
  }

  async getNotificationById(id: string): Promise<Notification> {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch notification');
      }

      return data.data.notification;
    } catch (error) {
      console.error('Get notification by ID error:', error);
      throw error;
    }
  }

  async markAsRead(id: string): Promise<Notification> {
    try {
      const response = await fetch(`${this.baseURL}/${id}/read`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to mark notification as read');
      }

      return data.data.notification;
    } catch (error) {
      console.error('Mark notification as read error:', error);
      throw error;
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/read-all`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to mark all notifications as read');
      }
    } catch (error) {
      console.error('Mark all notifications as read error:', error);
      throw error;
    }
  }

  async deleteNotification(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete notification');
      }
    } catch (error) {
      console.error('Delete notification error:', error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();