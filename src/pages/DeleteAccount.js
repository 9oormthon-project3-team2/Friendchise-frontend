// src/pages/DeleteAccount.js
import React from 'react';
import { Box, Heading, Button, useToast } from '@chakra-ui/react';
import axiosInstance from '../api/axiosInstance'; 
import { useNavigate } from 'react-router-dom';

const DeleteAccount = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const handleDelete = async () => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      await axiosInstance.delete('/manager', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      toast({
        title: '계정이 삭제되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      // 토큰 삭제 후 로그인 페이지로 리다이렉트
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/login');
    } catch (error) {
      toast({
        title: '삭제 실패',
        description: error.response?.data?.message || error.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6}>
      <Heading mb={6}>회원 삭제</Heading>
      <Button onClick={handleDelete} colorScheme="red" width="full">
        내 계정 삭제
      </Button>
    </Box>
  );
};

export default DeleteAccount;
