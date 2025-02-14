// src/pages/ChangePassword.js
import React, { useState } from 'react';

import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  useToast
} from '@chakra-ui/react';
import axiosInstance from '../api/axiosInstance';

const ChangePassword = () => {
  const [password, setPassword] = useState('');
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem('accessToken');
    try {
      await axiosInstance.put(
        '/manager/update/password',
        { password },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      toast({
        title: '비밀번호가 변경되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    } catch (error) {
      toast({
        title: '비밀번호 변경 실패',
        description: error.response?.data?.message || error.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6}>
      <Heading mb={6}>비밀번호 변경</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="password" isRequired>
            <FormLabel>새 비밀번호</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <Button type="submit" colorScheme="blue" width="full">
            변경하기
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default ChangePassword;
