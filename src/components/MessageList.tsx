import React from 'react';
import {
    VStack,
    HStack,
    Text,
    Avatar,
    Box,
} from '@chakra-ui/react';
import moment from 'moment';
import 'moment/locale/tr';

interface Message {
    id: number;
    sender_id: number;
    receiver_id: number;
    content: string;
    created_at: string;
    read_at: string | null;
}

interface User {
    id: number;
    username: string;
}

interface MessageListProps {
    messages: Message[];
    currentUser: User | null;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUser }) => {
    const formatTime = (timestamp: string) => {
        moment.locale('tr');
        return moment(timestamp).format('HH:mm');
    };

    return (
        <VStack spacing={4} align="stretch">
            {messages.map(message => {
                const isOwnMessage = message.sender_id === currentUser?.id;

                return (
                    <Box
                        key={message.id}
                        alignSelf={isOwnMessage ? 'flex-end' : 'flex-start'}
                        maxW="70%"
                    >
                        <HStack
                            spacing={2}
                            alignItems="flex-start"
                            flexDirection={isOwnMessage ? 'row-reverse' : 'row'}
                        >
                            <Avatar
                                size="sm"
                                name={isOwnMessage ? currentUser?.username : `User ${message.sender_id}`}
                            />
                            <Box>
                                <Box
                                    bg={isOwnMessage ? 'blue.500' : 'gray.100'}
                                    color={isOwnMessage ? 'white' : 'black'}
                                    p={3}
                                    borderRadius="lg"
                                    position="relative"
                                >
                                    <Text>{message.content}</Text>
                                </Box>
                                <HStack
                                    spacing={1}
                                    justify={isOwnMessage ? 'flex-end' : 'flex-start'}
                                    mt={1}
                                >
                                    <Text fontSize="xs" color="gray.500">
                                        {formatTime(message.created_at)}
                                    </Text>
                                    {isOwnMessage && message.read_at && (
                                        <Text fontSize="xs" color="blue.500">
                                            Okundu
                                        </Text>
                                    )}
                                </HStack>
                            </Box>
                        </HStack>
                    </Box>
                );
            })}
        </VStack>
    );
};

export default MessageList; 