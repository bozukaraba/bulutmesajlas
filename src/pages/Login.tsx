import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Text,
    Link,
    useToast,
    Container,
    Heading
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await login(email, password);
            navigate('/');
        } catch (error: any) {
            toast({
                title: 'Hata',
                description: error.response?.data?.error || 'Giriş başarısız',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxW="container.sm" py={10}>
            <VStack spacing={8} align="stretch">
                <Box textAlign="center">
                    <Heading>BulutMesajlas</Heading>
                    <Text mt={2} color="gray.600">
                        Hesabınıza giriş yapın
                    </Text>
                </Box>

                <Box as="form" onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                        <FormControl isRequired>
                            <FormLabel>E-posta</FormLabel>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="E-posta adresiniz"
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Şifre</FormLabel>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Şifreniz"
                            />
                        </FormControl>

                        <Button
                            type="submit"
                            colorScheme="blue"
                            width="full"
                            isLoading={isLoading}
                        >
                            Giriş Yap
                        </Button>

                        <Text textAlign="center">
                            Hesabınız yok mu?{' '}
                            <Link color="blue.500" onClick={() => navigate('/register')}>
                                Kayıt Ol
                            </Link>
                        </Text>
                    </VStack>
                </Box>
            </VStack>
        </Container>
    );
};

export default Login; 