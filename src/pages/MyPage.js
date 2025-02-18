// src/pages/MyPage.js
import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Spinner,
  Button,
  useToast,
  Flex,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const MyPage = () => {
  const [user, setUser] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = localStorage.getItem('accessToken');
      try {
        const response = await axiosInstance.get('/manager/mypage', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setUser(response.data);
      } catch (error) {
        toast({
          title: '정보 조회 실패',
          description: error.response?.data?.message || error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };
    fetchData();
  }, [toast]);

  if (!user) return <Spinner mt={10} />;

  return (
    <Box maxW="md" mx="auto" mt={10} p={6}>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading>마이페이지</Heading>
        <Button colorScheme="teal" onClick={() => navigate('/notifications')}>
          내 알림창으로 이동
        </Button>
      </Flex>
      <VStack align="start" spacing={2}>
        <Text>
          <strong>ID:</strong> {user.id}
        </Text>
        <Text>
          <strong>Username:</strong> {user.username}
        </Text>
        <Text>
          <strong>Role:</strong> {user.role}
        </Text>
        <Text>
          <strong>Manage ID:</strong> {user.manageId}
        </Text>
      </VStack>
    </Box>
  );
};

export default MyPage;
