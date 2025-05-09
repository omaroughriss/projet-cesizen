import api from './api';
import { User, CreateUserDto } from '@/types';

export const userService = {
    getAllUsers: async () => {
        const response = await api.get<User[]>('/users');
        return response.data;
    },

    getUserById: async (id: number) => {
        const response = await api.get<User>(`/users/${id}`);
        return response.data;
    },

    createUser: async (data: CreateUserDto) => {
        const response = await api.post<User>('/users', data);
        return response.data;
    },

    updateUser: async (id: number, data: Partial<CreateUserDto>) => {
        const response = await api.put<User>(`/users/${id}`, data);
        return response.data;
    },

    deleteUser: async (id: number) => {
        const response = await api.delete<void>(`/users/${id}`);
        return response.data;
    },

    desactivateUser: async (id: number) => {
        const response = await api.put<User>(`/users/${id}/desactivate`);
        return response.data;
    },

    reactivateUser: async (id: number) => {
        const response = await api.put<User>(`/users/${id}/reactivate`);
        return response.data;
    },
}; 