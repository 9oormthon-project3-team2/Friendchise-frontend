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

const MyPageCustomer = () => {
  const [user, setUser] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: destinationY, longitude: destinationX } = position.coords;
        const accessToken = localStorage.getItem('accessToken');
        try {
          await axiosInstance.post(
            '/customer/logout',
            { destinationY, destinationX }, // 현재 위치 전달
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
  
          // 토큰 삭제 및 페이지 이동
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          toast({
            title: '로그아웃 성공',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
  
          navigate('/login/customer');
        } catch (error) {
          toast({
            title: '로그아웃 실패',
            description: error.response?.data?.message || error.message,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      },
      (error) => {
        toast({
          title: '위치 정보 가져오기 실패',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = localStorage.getItem('accessToken');
      try {
        const response = await axiosInstance.get('/customer/mypage', {
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
        <Button colorScheme="teal" onClick={() => navigate('/nearest-store')}>
          매장 추천페이지로 이동
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
          <strong>총 이동거리:</strong> {user.movedDistance}
        </Text>
      </VStack>
      <Button colorScheme="red" mt={4} onClick={handleLogout}>
        로그아웃
      </Button>
    </Box>
  );
};

export default MyPageCustomer