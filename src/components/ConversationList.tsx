import React, { useState, useEffect } from 'react';
import {
    VStack,
    HStack,
    Text,
    Avatar,
    Box,
    Badge,
} from '@chakra-ui/react';
import moment from 'moment';
import 'moment/locale/tr';
import { messages as messageApi } from '../services/api';

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

interface ConversationListProps {
    selectedUser: number | null;
    onSelectUser: (userId: number) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({ selectedUser, onSelectUser }) => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadConversations();
    }, []);

    const loadConversations = async () => {
        try {
            setIsLoading(true);
            const response = await messageApi.getConversations();
            setConversations(response.data);
        } catch (error) {
            console.error('Konuşmalar yüklenirken hata:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatLastMessageTime = (timestamp: string) => {
        moment.locale('tr');
        const messageTime = moment(timestamp);
        const now = moment();

        if (now.diff(messageTime, 'days') === 0) {
            return messageTime.format('HH:mm');
        } else if (now.diff(messageTime, 'days') === 1) {
            return 'Dün';
        } else if (now.diff(messageTime, 'days') < 7) {
            return messageTime.format('dddd');
        } else {
            return messageTime.format('DD.MM.YYYY');
        }
    };

    return (
        <VStack spacing={2} align="stretch">
            <Text fontWeight="bold" mb={2}>
                Konuşmalar
            </Text>

            {conversations.map(conversation => {
                const otherUserId = conversation.user1_id === selectedUser ? conversation.user2_id : conversation.user1_id;
                const otherUsername = conversation.user1_id === selectedUser ? conversation.user2_username : conversation.user1_username;
                const otherUserStatus = conversation.user1_id === selectedUser ? conversation.user2_status : conversation.user1_status;

                return (
                    <Box
                        key={conversation.id}
                        p={3}
                        cursor="pointer"
                        bg={selectedUser === otherUserId ? 'gray.100' : 'transparent'}
                        _hover={{ bg: 'gray.50' }}
                        borderRadius="md"
                        onClick={() => onSelectUser(otherUserId)}
                    >
                        <HStack spacing={3}>
                            <Avatar size="sm" name={otherUsername} />
                            <Box flex="1">
                                <HStack justify="space-between">
                                    <Text fontWeight="medium">{otherUsername}</Text>
                                    <Text fontSize="xs" color="gray.500">
                                        {formatLastMessageTime(conversation.last_message_at)}
                                    </Text>
                                </HStack>
                                <HStack justify="space-between" mt={1}>
                                    <Text fontSize="sm" color="gray.500">
                                        {otherUserStatus === 'online' ? 'Çevrimiçi' : 'Çevrimdışı'}
                                    </Text>
                                    {conversation.unread_count > 0 && (
                                        <Badge
                                            colorScheme="blue"
                                            borderRadius="full"
                                            px={2}
                                        >
                                            {conversation.unread_count}
                                        </Badge>
                                    )}
                                </HStack>
                            </Box>
                        </HStack>
                    </Box>
                );
            })}

            {isLoading && (
                <Text textAlign="center" color="gray.500">
                    Yükleniyor...
                </Text>
            )}

            {!isLoading && conversations.length === 0 && (
                <Text textAlign="center" color="gray.500">
                    Henüz konuşma yok
                </Text>
            )}
        </VStack>
    );
};

export default ConversationList; 