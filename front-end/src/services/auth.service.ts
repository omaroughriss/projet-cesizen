import api from './api';
import { AuthUser } from '@/types';

export interface LoginResponse {
    accessToken: string;
    user: AuthUser;
}

export interface ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}

export const authService = {
    login: async (email: string, password: string) => {
        const response = await api.post<LoginResponse>('/auth/login', {
            email,
            password,
        });
        return response.data;
    },

    register: async (userData: Omit<AuthUser, 'id' | 'role'>) => {
        const response = await api.post<AuthUser>('/auth/register', userData);
        return response.data;
    },

    me: async () => {
        const response = await api.get<AuthUser>('/auth/me');
        return response.data;
    },

    changePassword: async (data: ChangePasswordDto) => {
        const response = await api.put<void>('/auth/change-password', data);
        return response.data;
    },
}; 