import React, { useState, useEffect, useCallback } from 'react';
import {
    VStack,
    HStack,
    Text,
    Avatar,
    Badge,
    Input,
    Box,
    Divider
} from '@chakra-ui/react';
import { users as userApi } from '../services/api';

interface User {
    id: number;
    username: string;
    email: string;
    status: 'online' | 'offline';
    last_seen: string;
}

interface UserListProps {
    selectedUser: number | null;
    onSelectUser: (userId: number) => void;
}

const UserList: React.FC<UserListProps> = ({ selectedUser, onSelectUser }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const loadUsers = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await userApi.getAll(searchQuery);
            setUsers(response.data);
        } catch (error) {
            console.error('Kullanıcılar yüklenirken hata:', error);
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    return (
        <VStack spacing={4} align="stretch">
            <Input
                placeholder="Kullanıcı ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            <Divider />
            
            {users.map(user => (
                <Box
                    key={user.id}
                    p={3}
                    cursor="pointer"
                    bg={selectedUser === user.id ? 'gray.100' : 'transparent'}
                    _hover={{ bg: 'gray.50' }}
                    borderRadius="md"
                    onClick={() => onSelectUser(user.id)}
                >
                    <HStack spacing={3}>
                        <Avatar size="sm" name={user.username} />
                        <Box flex="1">
                            <Text fontWeight="medium">{user.username}</Text>
                            <Text fontSize="sm" color="gray.500">
                                {user.status === 'online' ? 'Çevrimiçi' : 'Çevrimdışı'}
                            </Text>
                        </Box>
                        <Badge
                            colorScheme={user.status === 'online' ? 'green' : 'gray'}
                            variant="solid"
                            borderRadius="full"
                            px={2}
                        >
                            {user.status === 'online' ? 'Online' : 'Offline'}
                        </Badge>
                    </HStack>
                </Box>
            ))}

            {isLoading && (
                <Text textAlign="center" color="gray.500">
                    Yükleniyor...
                </Text>
            )}

            {!isLoading && users.length === 0 && (
                <Text textAlign="center" color="gray.500">
                    Kullanıcı bulunamadı
                </Text>
            )}
        </VStack>
    );
};

export default UserList; 