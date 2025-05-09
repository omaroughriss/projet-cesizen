import api from './api';
import { Article } from '@/types';

export interface CreateArticleDto {
    title: string;
    content: string;
    image: string;
    categoryId: number;
}

// Constante pour l'URL de base de l'API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads/')) return `${API_BASE_URL}${imagePath}`;
    return `${API_BASE_URL}/uploads/${imagePath}`;
};

export const articleService = {
    uploadImage: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data.filename;
        } catch (error) {
            console.error('Erreur lors de l\'upload:', error);
            throw error;
        }
    },

    getAllArticles: async () => {
        const response = await api.get<Article[]>('/articles');
        return response.data.map(article => ({
            ...article,
            image: getImageUrl(article.image)
        }));
    },

    getArticleById: async (id: number) => {
        const response = await api.get<Article>(`/articles/${id}`);
        return {
            ...response.data,
            image: getImageUrl(response.data.image)
        };
    },

    createArticle: async (data: CreateArticleDto, file?: File) => {
        let imageUrl = data.image;
        if (file) {
            try {
                const filename = await articleService.uploadImage(file);
                imageUrl = filename; // On stocke juste le nom du fichier
            } catch (error) {
                throw new Error('Erreur lors de l\'upload de l\'image');
            }
        }

        const response = await api.post<Article>('/articles', {
            ...data,
            image: imageUrl
        });

        return {
            ...response.data,
            image: getImageUrl(response.data.image)
        };
    },

    updateArticle: async (id: number, data: Partial<CreateArticleDto>, file?: File) => {
        let imageUrl = data.image;
        if (file) {
            try {
                const filename = await articleService.uploadImage(file);
                imageUrl = filename; // On stocke juste le nom du fichier
            } catch (error) {
                throw new Error('Erreur lors de l\'upload de l\'image');
            }
        }

        const response = await api.put<Article>(`/articles/${id}`, {
            ...data,
            image: imageUrl
        });

        return {
            ...response.data,
            image: getImageUrl(response.data.image)
        };
    },

    deleteArticle: async (id: number) => {
        const response = await api.delete<void>(`/articles/${id}`);
        return response.data;
    },

    getArticlesByCategoryId: async (categoryId: number) => {
        const response = await api.get<Article[]>(`/articles/category/${categoryId}`);
        return response.data.map(article => ({
            ...article,
            image: getImageUrl(article.image)
        }));
    },
}; 