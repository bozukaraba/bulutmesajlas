import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import { AuthProvider } from './context/AuthContext';
import { WebSocketProvider } from './context/WebSocketContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import { useAuth } from './context/AuthContext';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div>Yükleniyor...</div>;
    }

    return user ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
    return (
        <ChakraProvider>
            <CSSReset />
            <AuthProvider>
                <WebSocketProvider>
                    <Router>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route
                                path="/"
                                element={
                                    <PrivateRoute>
                                        <Chat />
                                    </PrivateRoute>
                                }
                            />
                        </Routes>
                    </Router>
                </WebSocketProvider>
            </AuthProvider>
        </ChakraProvider>
    );
};

export default App; 