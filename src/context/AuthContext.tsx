import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth as authApi } from '../services/api';

interface User {
    id: number;
    username: string;
    email: string;
    status: 'online' | 'offline';
    last_seen: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (token) {
            fetchUser();
        } else {
            setIsLoading(false);
        }
    }, [token]);

    const fetchUser = async () => {
        try {
            const response = await authApi.me();
            setUser(response.data);
            setError(null);
        } catch (err) {
            setToken(null);
            localStorage.removeItem('token');
            setError('Oturum süresi doldu');
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            const response = await authApi.login(email, password);
            const { token: newToken, user: userData } = response.data;
            setToken(newToken);
            setUser(userData);
            localStorage.setItem('token', newToken);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Giriş başarısız');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (username: string, email: string, password: string) => {
        try {
            setIsLoading(true);
            const response = await authApi.register(username, email, password);
            const { token: newToken, user: userData } = response.data;
            setToken(newToken);
            setUser(userData);
            localStorage.setItem('token', newToken);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Kayıt başarısız');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (err) {
            console.error('Çıkış hatası:', err);
        } finally {
            setToken(null);
            setUser(null);
            localStorage.removeItem('token');
        }
    };

    const value = {
        user,
        token,
        login,
        register,
        logout,
        isLoading,
        error
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 