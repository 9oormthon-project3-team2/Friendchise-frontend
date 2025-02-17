// HeadquarterRegisterPage.jsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  VStack,
  useToast,
} from '@chakra-ui/react';
import axiosInstance from '@/api/axiosInstance';

const categories = [
  { value: '패스트푸드', label: '패스트푸드' },
  { value: '분식', label: '분식' },
  { value: '한식', label: '한식' },
  { value: '중식', label: '중식' },
  { value: '일식', label: '일식' },
  { value: '양식', label: '양식' },
  { value: '카페', label: '카페' },
  { value: '디저트', label: '디저트' },
  { value: '간식', label: '간식' },
  { value: '술집', label: '술집' },
];

const subCategoriesMap = {
  분식: [{ value: '떡볶이', label: '떡볶이' }],
  한식: [
    { value: '고기', label: '고기' },
    { value: '국수', label: '국수' },
    { value: '국밥', label: '국밥' },
    { value: '해물', label: '해물' },
  ],
  일식: [
    { value: '돈까스', label: '돈까스' },
    { value: '초밥', label: '초밥' },
    { value: '우동', label: '우동' },
    { value: '라멘', label: '라멘' },
  ],
  양식: [
    { value: '피자', label: '피자' },
    { value: '스테이크', label: '스테이크' },
    { value: '이탈리안', label: '이탈리안' },
    { value: '햄버거', label: '햄버거' },
    { value: '멕시칸', label: '멕시칸' },
  ],
};

const HeadquarterRegisterPage = () => {
  const toast = useToast();
  const [franchiseName, setFranchiseName] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setSubCategory(''); // 상위 카테고리 변경 시 하위 카테고리 초기화
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 간단한 유효성 검사
    if (!franchiseName || !category) {
      toast({
        title: '입력 오류',
        description: '프랜차이즈 이름과 카테고리를 모두 선택해주세요.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const payload = {
      franchise_name: franchiseName,
      category: category,
      sub_category: subCategory,
    };

    try {
      const response = await axiosInstance.post(
        '/headquarter/register',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        },
      );
      toast({
        title: '등록 성공',
        description: '본사 정보가 성공적으로 등록되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      // 필요한 경우 폼 초기화 또는 페이지 전환 로직 추가
    } catch (error) {
      toast({
        title: '등록 실패',
        description: error.response?.data?.message || error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // 선택된 상위 카테고리에 따른 하위 카테고리 옵션을 가져옵니다.
  const subCategoryOptions = category ? subCategoriesMap[category] || [] : [];

  return (
    <Center minH="100vh" p={4}>
      <Box maxW="md" w="100%" borderWidth="1px" borderRadius="lg" p={6}>
        <Heading size="lg">프랜차이즈 본사 정보 등록하기</Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl id="franchiseName" isRequired>
              <FormLabel>프랜차이즈 이름</FormLabel>
              <Input
                type="text"
                placeholder="프랜차이즈 이름 입력"
                value={franchiseName}
                onChange={(e) => setFranchiseName(e.target.value)}
              />
            </FormControl>

            <FormControl id="category" isRequired>
              <FormLabel>카테고리</FormLabel>
              <Select
                placeholder="카테고리 선택"
                value={category}
                onChange={handleCategoryChange}
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </Select>
            </FormControl>

            {subCategoryOptions.length > 0 && (
              <FormControl id="subCategory">
                <FormLabel>하위 카테고리</FormLabel>
                <Select
                  placeholder="하위 카테고리 선택 (선택사항)"
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                >
                  <option value="">선택 안함</option>
                  {subCategoryOptions.map((sub) => (
                    <option key={sub.value} value={sub.value}>
                      {sub.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
            )}
            <Button type="submit" colorScheme="blue">
              본사 정보 생성
            </Button>
          </VStack>
        </form>
      </Box>
    </Center>
  );
};

export default HeadquarterRegisterPage;
