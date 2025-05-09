import api from './api';
import { Article } from '@/types';

export interface CreateArticleDto {
    title: string;
    content: string;
    image: string;
    categoryId: number;
}

export const articleService = {
    getAllArticles: async () => {
        const response = await api.get<Article[]>('/articles');
        return response.data;
    },

    getArticleById: async (id: number) => {
        const response = await api.get<Article>(`/articles/${id}`);
        return response.data;
    },

    createArticle: async (data: CreateArticleDto) => {
        const response = await api.post<Article>('/articles', data);
        return response.data;
    },

    updateArticle: async (id: number, data: Partial<CreateArticleDto>) => {
        const response = await api.put<Article>(`/articles/${id}`, data);
        return response.data;
    },

    deleteArticle: async (id: number) => {
        const response = await api.delete<void>(`/articles/${id}`);
        return response.data;
    },

    getArticlesByCategoryId: async (categoryId: number) => {
        const response = await api.get<Article[]>(`/articles/category/${categoryId}`);
        return response.data;
    },
}; 