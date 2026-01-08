import { User } from '../stores/authStore';
import apiClient from '../../../lib/axios';
import { setCSRFToken, removeCSRFToken } from '../../../utils/security/csrf';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

interface AuthResponse {
  user: User;
  csrfToken: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    const { data } = await apiClient.post<AuthResponse>(
      '/auth/login',
      credentials
    );

    // Store CSRF token
    if (data.csrfToken) {
      setCSRFToken(data.csrfToken);
    }

    return data.user;
  },

  register: async (userData: RegisterData): Promise<User> => {
    const { data } = await apiClient.post<AuthResponse>(
      '/auth/register',
      userData
    );

    if (data.csrfToken) {
      setCSRFToken(data.csrfToken);
    }

    return data.user;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
    removeCSRFToken();
  },

  getCurrentUser: async (): Promise<User> => {
    const { data } = await apiClient.get<User>('/auth/me');
    return data;
  },

  refreshToken: async (): Promise<void> => {
    const { data } = await apiClient.post<{ csrfToken: string }>(
      '/auth/refresh'
    );
    if (data.csrfToken) {
      setCSRFToken(data.csrfToken);
    }
  },
};
