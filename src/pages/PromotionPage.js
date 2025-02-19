// src/pages/PromotionPage.js
import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Input,
  FormControl,
  FormLabel,
  Button,
  VStack,
  Text,
  List,
  ListItem,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import axiosInstance from '../api/axiosInstance';

const PromotionPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    startDate: '',
    endDate: '',
  });
  const toast = useToast();

  // 프로모션 목록 조회 함수
  const fetchPromotions = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast({
        title: '토큰 없음',
        description: '로그인 후 시도해 주세요.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.get('/promotions/my', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setPromotions(response.data);
    } catch (error) {
      console.error(
        '❌ 프로모션 조회 실패:',
        error.response?.data || error.message,
      );
      toast({
        title: '프로모션 조회 실패',
        description: error.response?.data?.message || error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 프로모션 목록 조회
  useEffect(() => {
    fetchPromotions();
  }, []);

  // 폼 입력 핸들러
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 프로모션 생성 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast({
        title: '토큰 없음',
        description: '로그인 후 시도해 주세요.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // 날짜 문자열을 "YYYY-MM-DDT00:00:00" 형태로 변환
    const dataToSend = {
      ...formData,
      startDate: formData.startDate ? formData.startDate + 'T00:00:00' : '',
      endDate: formData.endDate ? formData.endDate + 'T00:00:00' : '',
    };

    try {
      const response = await axiosInstance.post(
        '/promotions/create',
        dataToSend,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      toast({
        title: '프로모션 생성 성공',
        description: response.data,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      // 폼 초기화
      setFormData({
        title: '',
        content: '',
        startDate: '',
        endDate: '',
      });
      // 목록 재조회
      fetchPromotions();
    } catch (error) {
      console.error(
        '❌ 프로모션 생성 실패:',
        error.response?.data || error.message,
      );
      toast({
        title: '프로모션 생성 실패',
        description: error.response?.data?.message || error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) return <Spinner mt={10} />;

  return (
    <Box maxW="md" mx="auto" mt={10} p={6}>
      <Heading mb={4}>프로모션 관리</Heading>

      {/* 프로모션 생성 폼 */}
      <Box as="form" onSubmit={handleSubmit} mb={8}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>제목</FormLabel>
            <Input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="프로모션 제목"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>내용</FormLabel>
            <Input
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="프로모션 내용"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>시작 날짜</FormLabel>
            <Input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>종료 날짜</FormLabel>
            <Input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
            />
          </FormControl>
          <Button colorScheme="blue" type="submit">
            프로모션 생성
          </Button>
        </VStack>
      </Box>

      {/* 생성된 프로모션 목록 */}
      <Heading size="md" mb={4}>
        내 프로모션 목록
      </Heading>
      {promotions.length === 0 ? (
        <Text>프로모션이 없습니다.</Text>
      ) : (
        <List spacing={3}>
          {promotions.map((promo) => (
            <ListItem key={promo.id} p={3} borderWidth="1px" borderRadius="md">
              <Text fontWeight="bold">{promo.title}</Text>
              <Text>{promo.content}</Text>
              <Text fontSize="sm" color="gray.500">
                시작: {promo.startDate} / 종료: {promo.endDate}
              </Text>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default PromotionPage;
