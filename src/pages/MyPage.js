// src/pages/MyPage.js
import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, VStack, Spinner, useToast } from '@chakra-ui/react';
import axiosInstance from '../api/axiosInstance'; 

const MyPage = () => {
  const [user, setUser] = useState(null);
  const [detailedData, setDetailedData] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = localStorage.getItem('accessToken');
      try {
        const response = await axiosInstance.get('/manager/mypage', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        const userData = response.data;
        setUser(response.data);

        if (userData.role == 'HEADQUARTER') {
          const headQuarterResponse = await axiosInstance.get('/headquarter', {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          setDetailedData(headQuarterResponse.data);
        } else if (userData.role == 'STORE') {
          const storeReponse = await axiosInstance.get('/store', {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          setDetailedData(storeReponse.data);
        }
      } catch (error) {
        toast({
          title: '정보 조회 실패',
          description: error.response?.data?.message || error.message,
          status: 'error',
          duration: 3000,
          isClosable: true
        });
      }
    };
    fetchData();
  }, [toast]);

  if (!user) return <Spinner mt={10} />;

  return (
    <Box maxW="md" mx="auto" mt={10} p={6}>
      <Heading mb={4}>마이페이지</Heading>
      <VStack align="start" spacing={2}>
        <Text><strong>ID:</strong> {user.id}</Text>
        <Text><strong>Username:</strong> {user.username}</Text>
        <Text><strong>Role:</strong> {user.role}</Text>
        <Text><strong>Manage ID:</strong> {user.manageId}</Text>
        {detailedData && (
          <Text>
            <string>영업장 정보:</string> {JSON.stringify(detailedData)}
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default MyPage;
