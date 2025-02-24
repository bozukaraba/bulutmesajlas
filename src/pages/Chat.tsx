import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Grid,
    GridItem,
    VStack,
    HStack,
    Input,
    IconButton,
    Text,
    Avatar,
    useToast,
    Divider
} from '@chakra-ui/react';
import { IoSend } from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import { messages as messageApi } from '../services/api';
import UserList from '../components/UserList';
import MessageList from '../components/MessageList';
import ConversationList from '../components/ConversationList';

interface Message {
    id: number;
    sender_id: number;
    receiver_id: number;
    content: string;
    created_at: string;
    read_at: string | null;
}

const Chat: React.FC = () => {
    const [selectedUser, setSelectedUser] = useState<number | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messageEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const { user } = useAuth();
    const { socket, sendMessage, startTyping, stopTyping } = useWebSocket();
    const toast = useToast();

    useEffect(() => {
        if (selectedUser) {
            loadMessages();
        }
    }, [selectedUser]);

    useEffect(() => {
        if (socket) {
            socket.on('message', handleNewMessage);
            socket.on('typing', handleTypingStatus);

            return () => {
                socket.off('message');
                socket.off('typing');
            };
        }
    }, [socket]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadMessages = async () => {
        try {
            const response = await messageApi.getConversation(selectedUser!);
            setMessages(response.data);
        } catch (error) {
            toast({
                title: 'Hata',
                description: 'Mesajlar yüklenirken bir hata oluştu',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleNewMessage = (message: Message) => {
        if (message.sender_id === selectedUser || message.sender_id === user?.id) {
            setMessages(prev => [...prev, message]);
        }
    };

    const handleTypingStatus = (data: { sender: number; isTyping: boolean }) => {
        if (data.sender === selectedUser) {
            setIsTyping(data.isTyping);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedUser) return;

        try {
            await messageApi.send(selectedUser, newMessage);
            sendMessage(selectedUser, newMessage);
            setNewMessage('');
        } catch (error) {
            toast({
                title: 'Hata',
                description: 'Mesaj gönderilemedi',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);

        if (selectedUser) {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            startTyping(selectedUser);
            typingTimeoutRef.current = setTimeout(() => {
                stopTyping(selectedUser);
            }, 1000);
        }
    };

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <Grid
            templateColumns="250px 1fr"
            h="100vh"
            gap={0}
        >
            <GridItem borderRight="1px" borderColor="gray.200">
                <VStack h="100%" spacing={0}>
                    <Box w="100%" p={4} borderBottom="1px" borderColor="gray.200">
                        <ConversationList
                            selectedUser={selectedUser}
                            onSelectUser={setSelectedUser}
                        />
                    </Box>
                    <Box flex="1" w="100%" overflowY="auto" p={4}>
                        <UserList
                            selectedUser={selectedUser}
                            onSelectUser={setSelectedUser}
                        />
                    </Box>
                </VStack>
            </GridItem>

            <GridItem>
                <VStack h="100%" spacing={0}>
                    {selectedUser ? (
                        <>
                            <Box w="100%" p={4} borderBottom="1px" borderColor="gray.200">
                                <HStack>
                                    <Avatar size="sm" />
                                    <Text fontWeight="bold">Kullanıcı {selectedUser}</Text>
                                </HStack>
                            </Box>

                            <Box flex="1" w="100%" overflowY="auto" p={4}>
                                <MessageList messages={messages} currentUser={user} />
                                <div ref={messageEndRef} />
                                {isTyping && (
                                    <Text fontSize="sm" color="gray.500" mt={2}>
                                        Yazıyor...
                                    </Text>
                                )}
                            </Box>

                            <Box w="100%" p={4} borderTop="1px" borderColor="gray.200">
                                <HStack>
                                    <Input
                                        placeholder="Mesajınızı yazın..."
                                        value={newMessage}
                                        onChange={handleInputChange}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    />
                                    <IconButton
                                        aria-label="Gönder"
                                        icon={<IoSend />}
                                        colorScheme="blue"
                                        onClick={handleSendMessage}
                                    />
                                </HStack>
                            </Box>
                        </>
                    ) : (
                        <Box
                            flex="1"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Text color="gray.500">
                                Mesajlaşmak için bir kullanıcı seçin
                            </Text>
                        </Box>
                    )}
                </VStack>
            </GridItem>
        </Grid>
    );
};

export default Chat; 