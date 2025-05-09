import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/config/api.config';
import { AuthUser } from '@/types';

interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await api.get<AuthUser>('/auth/me');
                setUser(response.data);
            }
        } catch (error) {
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await api.post<{ access_token: string; user: AuthUser }>('/auth/login', {
                email,
                password,
            });

            const { access_token, user: userData } = response.data;
            localStorage.setItem('token', access_token);
            setUser(userData);
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
    };

    if (loading) {
        return <div>Chargement...</div>;
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 