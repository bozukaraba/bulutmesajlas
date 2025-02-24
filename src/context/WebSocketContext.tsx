import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client/build/esm/socket';
import { useAuth } from './AuthContext';

interface WebSocketContextType {
    socket: Socket | null;
    isConnected: boolean;
    sendMessage: (receiverId: number, content: string) => void;
    startTyping: (receiverId: number) => void;
    stopTyping: (receiverId: number) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const { token } = useAuth();

    useEffect(() => {
        if (token) {
            const newSocket = io(process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:8080', {
                auth: { token }
            });

            newSocket.on('connect', () => {
                setIsConnected(true);
                console.log('WebSocket bağlantısı kuruldu');
            });

            newSocket.on('disconnect', () => {
                setIsConnected(false);
                console.log('WebSocket bağlantısı kesildi');
            });

            setSocket(newSocket);

            return () => {
                newSocket.close();
            };
        }
    }, [token]);

    const sendMessage = (receiverId: number, content: string) => {
        if (socket) {
            socket.emit('message', {
                type: 'message',
                receiver: receiverId,
                content
            });
        }
    };

    const startTyping = (receiverId: number) => {
        if (socket) {
            socket.emit('typing', {
                type: 'typing',
                receiver: receiverId,
                isTyping: true
            });
        }
    };

    const stopTyping = (receiverId: number) => {
        if (socket) {
            socket.emit('typing', {
                type: 'typing',
                receiver: receiverId,
                isTyping: false
            });
        }
    };

    const value = {
        socket,
        isConnected,
        sendMessage,
        startTyping,
        stopTyping
    };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (context === undefined) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
}; 