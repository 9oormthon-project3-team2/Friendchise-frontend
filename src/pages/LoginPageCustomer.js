// src/pages/LoginPage.js
import React, { useState } from 'react';
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Heading,
  VStack,
  useToast
} from '@chakra-ui/react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const LoginPageCustomer = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!navigator.geolocation) {
      toast({
        title: '위치 정보를 가져올 수 없습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude: startY, longitude: startX } = position.coords;
      try {
        const response = await axiosInstance.post('/customer/login', {
          username,
          password,
          startY,
          startX, 
        });

        const { accessToken, refreshToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        toast({
          title: '로그인 성공',
          status: 'success',
          duration: 3000,
          isClosable: true
        });

        navigate('/mypage/customer');
      } catch (error) {
        toast({
          title: '로그인 실패',
          description: error.response?.data?.message || error.message,
          status: 'error',
          duration: 3000,
          isClosable: true
        });
      }
    }, (error) => {
      toast({
        title: '위치 정보를 가져올 수 없습니다.',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    });
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="md">
      <Heading mb={6}>고객 로그인</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="username" isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <Button type="submit" colorScheme="blue" width="full">
            Login
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default LoginPageCustomer;
