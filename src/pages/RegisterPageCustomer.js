import React, { useState } from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Select,
  useToast
} from '@chakra-ui/react';
import axiosInstance from '../api/axiosInstance'; 

const RegisterPageCustomer = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let payload = { username, password};
  
      const response = await axiosInstance.post('/customer/register', payload);
      toast({
        title: '회원가입 성공',
        description: `등록된 ID: ${response.data.id}`,
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      
    } catch (error) {
      toast({
        title: '회원가입 실패',
        description: error.response?.data?.message || error.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6}>
      <Heading mb={6}>고객 회원가입</Heading>
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
            회원가입
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default RegisterPageCustomer;