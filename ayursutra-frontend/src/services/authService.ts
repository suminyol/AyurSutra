import { API_BASE_URL } from '../constants';
import { LoginForm, RegisterForm, User, ApiResponse } from '../types';

class AuthService {
  private baseURL = `${API_BASE_URL}/auth`;

  async login(credentials: LoginForm): Promise<{ user: User; token: string }> {
    try {
      const response = await fetch(`${this.baseURL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data: ApiResponse<{ user: User; token: string }> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      return data.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData: RegisterForm): Promise<{ user: User; token: string }> {
    try {
      // Only send required fields and ensure valid formats
      const sanitizedData = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        phone: userData.phone ?? '',
        dateOfBirth: userData.dateOfBirth ?? '',
        gender: userData.gender ?? 'other',
      };
      // Optionally, format dateOfBirth to ISO string if present
      if (sanitizedData.dateOfBirth) {
        sanitizedData.dateOfBirth = new Date(sanitizedData.dateOfBirth).toISOString().split('T')[0];
      }
      const response = await fetch(`${this.baseURL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedData),
      });

      const data: ApiResponse<{ user: User; token: string }> = await response.json();

      if (!response.ok) {
        console.error('Registration failed:', data);
        throw new Error(data.message || 'Registration failed');
      }

      return data.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      const token = localStorage.getItem('ayursutra_auth_token');
      if (!token) return;

      await fetch(`${this.baseURL}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async getProfile(): Promise<User> {
    try {
      const token = localStorage.getItem('ayursutra_auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data: ApiResponse<{ user: User; profile: any }> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch profile');
      }

      return data.data.user;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const token = localStorage.getItem('ayursutra_auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const data: ApiResponse<{ user: User }> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      return data.data.user;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const token = localStorage.getItem('ayursutra_auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/users/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data: ApiResponse<void> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data: ApiResponse<void> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset email');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data: ApiResponse<void> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
