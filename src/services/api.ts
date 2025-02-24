import axios from 'axios';
import type { AxiosRequestHeaders } from 'axios';

interface User {
    id: number;
    username: string;
    email: string;
    status: 'online' | 'offline';
    last_seen: string;
}

interface AuthResponse {
    token: string;
    user: User;
}

interface Message {
    id: number;
    conversation_id: number;
    sender_id: number;
    receiver_id: number;
    content: string;
    read_at: string | null;
    created_at: string;
}

interface Conversation {
    id: number;
    user1_id: number;
    user2_id: number;
    user1_username: string;
    user2_username: string;
    user1_status: 'online' | 'offline';
    user2_status: 'online' | 'offline';
    last_message_at: string;
    unread_count: number;
}

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:80/api'
});

api.interceptors.request.use((config) => {
    console.log('API Request:', config.url, config.data);
    const token = localStorage.getItem('token');
    if (token) {
        if (!config.headers) {
            config.headers = {} as AxiosRequestHeaders;
        }
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
});

api.interceptors.response.use((response) => {
    console.log('API Response:', response.data);
    return response;
}, (error) => {
    console.error('Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
});

export const auth = {
    login: async (email: string, password: string) =>
        await api.post<AuthResponse>('/auth/login', { email, password }),
    
    register: async (username: string, email: string, password: string) =>
        await api.post<AuthResponse>('/auth/register', { username, email, password }),
    
    logout: async () => await api.post('/auth/logout'),
    
    me: async () => await api.get<User>('/auth/me')
};

export const users = {
    getAll: async (search?: string) =>
        await api.get<User[]>('/users', { params: { search } }),
    
    getById: async (id: number) =>
        await api.get<User>(`/users/${id}`),
    
    update: async (id: number, data: Partial<User>) =>
        await api.put<User>(`/users/${id}`, data),
    
    getOnline: async () =>
        await api.get<User[]>('/users/online')
};

export const messages = {
    getAll: async (limit = 50, offset = 0) =>
        await api.get<Message[]>('/messages', { params: { limit, offset } }),
    
    send: async (receiverId: number, content: string) =>
        await api.post<Message>('/messages', { receiver_id: receiverId, content }),
    
    getById: async (id: number) =>
        await api.get<Message>(`/messages/${id}`),
    
    markAsRead: async (id: number) =>
        await api.put<Message>(`/messages/${id}/read`),
    
    getConversations: async () =>
        await api.get<Conversation[]>('/conversations'),
    
    getConversation: async (id: number, limit = 50, offset = 0) =>
        await api.get<Message[]>(`/conversations/${id}`, { params: { limit, offset } })
};

const apiService = {
    auth,
    users,
    messages
};

export default apiService; 