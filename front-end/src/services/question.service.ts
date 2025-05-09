import api from './api';
import { Question } from '@/types';

export interface CreateQuestionDto {
    question: string;
    score: number;
}

export const questionService = {
    getAllQuestions: async () => {
        const response = await api.get<Question[]>('/questions');
        return response.data;
    },

    getQuestionById: async (id: number) => {
        const response = await api.get<Question>(`/questions/${id}`);
        return response.data;
    },

    createQuestion: async (data: CreateQuestionDto) => {
        const response = await api.post<Question>('/questions', data);
        return response.data;
    },

    updateQuestion: async (id: number, data: Partial<CreateQuestionDto>) => {
        const response = await api.put<Question>(`/questions/${id}`, data);
        return response.data;
    },

    deleteQuestion: async (id: number) => {
        const response = await api.delete<void>(`/questions/${id}`);
        return response.data;
    },
}; 