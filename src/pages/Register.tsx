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

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            toast({
                title: 'Hata',
                description: 'Şifreler eşleşmiyor',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        if (password.length < 8) {
            toast({
                title: 'Hata',
                description: 'Şifre en az 8 karakter olmalıdır',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        if (!email.includes('@')) {
            toast({
                title: 'Hata',
                description: 'Geçerli bir email adresi giriniz',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setIsLoading(true);

        try {
            console.log('Kayıt isteği gönderiliyor:', { username, email });
            await register(username, email, password);
            console.log('Kayıt başarılı');
            navigate('/');
        } catch (error: any) {
            console.error('Kayıt hatası:', error);
            const errorMessage = error.response?.data?.error || error.message || 'Kayıt başarısız';
            console.error('Hata detayı:', errorMessage);
            toast({
                title: 'Hata',
                description: errorMessage,
                status: 'error',
                duration: 5000,
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
                        Yeni hesap oluşturun
                    </Text>
                </Box>

                <Box as="form" onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                        <FormControl isRequired>
                            <FormLabel>Kullanıcı Adı</FormLabel>
                            <Input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Kullanıcı adınız"
                                minLength={3}
                            />
                        </FormControl>

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
                                minLength={8}
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Şifre Tekrar</FormLabel>
                            <Input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Şifrenizi tekrar girin"
                                minLength={8}
                            />
                        </FormControl>

                        <Button
                            type="submit"
                            colorScheme="blue"
                            width="full"
                            isLoading={isLoading}
                        >
                            Kayıt Ol
                        </Button>

                        <Text textAlign="center">
                            Zaten hesabınız var mı?{' '}
                            <Link color="blue.500" onClick={() => navigate('/login')}>
                                Giriş Yap
                            </Link>
                        </Text>
                    </VStack>
                </Box>
            </VStack>
        </Container>
    );
};

export default Register; 