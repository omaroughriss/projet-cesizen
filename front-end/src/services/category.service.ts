import api from './api';
import { Category, CreateCategoryDto } from '@/types';

export const categoryService = {
    getAllCategories: async () => {
        const response = await api.get<Category[]>('/categories');
        return response.data;
    },

    getCategoryById: async (id: number) => {
        const response = await api.get<Category>(`/categories/${id}`);
        return response.data;
    },

    createCategory: async (data: CreateCategoryDto) => {
        const response = await api.post<Category>('/categories', data);
        return response.data;
    },

    updateCategory: async (id: number, data: Partial<CreateCategoryDto>) => {
        const response = await api.put<Category>(`/categories/${id}`, data);
        return response.data;
    },

    deleteCategory: async (id: number) => {
        const response = await api.delete<void>(`/categories/${id}`);
        return response.data;
    },
}; 