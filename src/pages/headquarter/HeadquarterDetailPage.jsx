import React, { useState, useEffect } from 'react';
import {
  Box,
  Center,
  Heading,
  Text,
  Spinner,
  Button,
  Input,
  useToast,
} from '@chakra-ui/react';
import axiosInstance from '@/api/axiosInstance';

const HeadquarterDetailPage = () => {
  const [headquarter, setHeadquarter] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  // 수정 폼에 사용할 상태. headquarter 데이터로 초기화할 예정.
  const [editForm, setEditForm] = useState({
    franchiseName: '',
    category: '',
    subCategory: '',
  });
  // 매장 목록 상태 관리
  const [items, setItems] = useState([]);
  const [isLoadingItems, setIsLoadingItems] = useState(true);
  const toast = useToast();

  // 본사 정보 조회
  useEffect(() => {
    const fetchHeadquarter = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axiosInstance.get('/headquarter', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHeadquarter(response.data);
        // 수정 모드에 진입할 때 사용할 초기값 세팅
        setEditForm({
          franchiseName: response.data.franchiseName,
          category: response.data.category,
          subCategory: response.data.subCategory,
        });
      } catch (error) {
        toast({
          title: '본사 정보 조회에 실패했습니다',
          description: error.response?.data?.message || error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchHeadquarter();
  }, [toast]);

  // 본사 정보가 로드된 후, 매장 정보 조회 (페이지네이션: page=0, size=10)
  useEffect(() => {
    if (headquarter) {
      const fetchItems = async () => {
        try {
          const token = localStorage.getItem('accessToken');
          // 만약 백엔드가 subCategory 필터링을 지원한다면 params에 추가할 수 있습니다.
          const response = await axiosInstance.get('/headquarter/items', {
            headers: { Authorization: `Bearer ${token}` },
            params: { page: 0, size: 15, sort: 'name' },
          });

          setItems(response.data.content);
        } catch (error) {
          toast({
            title: '메뉴 정보 조회에 실패했습니다',
            description: error.response?.data?.message || error.message,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        } finally {
          setIsLoadingItems(false);
        }
      };

      fetchItems();
    }
  }, [headquarter, toast]);

  // 수정 모드 전환
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // 취소 버튼 클릭 시 수정 내용 초기화 후 수정 모드 종료
  const handleCancelClick = () => {
    setEditForm({
      franchiseName: headquarter.franchiseName,
      category: headquarter.category,
      subCategory: headquarter.subCategory,
    });
    setIsEditing(false);
  };

  // 입력 값 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // 완료 버튼 클릭 시 PATCH 요청으로 수정 사항 반영
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axiosInstance.patch(
        '/headquarter/update',
        editForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setHeadquarter(response.data);
      toast({
        title: '본사 정보가 업데이트 되었습니다',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: '본사 정보 업데이트에 실패했습니다',
        description: error.response?.data?.message || error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (!headquarter) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Center minH="100vh" p={4}>
      <Box borderWidth="1px" borderRadius="lg" p={6} maxW="500px" w="100%">
        <Heading mb={4}>프랜차이즈 상세 정보</Heading>
        {isEditing ? (
          <>
            <Text mb={2}>
              <strong>ID:</strong> {headquarter.id}
            </Text>
            <Text mb={2}>
              <strong>프랜차이즈 이름:</strong>
              <Input
                name="franchiseName"
                value={editForm.franchiseName}
                onChange={handleInputChange}
                mt={2}
              />
            </Text>
            <Text mb={2}>
              <strong>카테고리:</strong>
              <Input
                name="category"
                value={editForm.category}
                onChange={handleInputChange}
                mt={2}
              />
            </Text>
            <Text mb={2}>
              <strong>하위 카테고리:</strong>
              <Input
                name="subCategory"
                value={editForm.subCategory}
                onChange={handleInputChange}
                mt={2}
              />
            </Text>
            <Button colorScheme="blue" onClick={handleUpdate} mr={3} mt={3}>
              완료
            </Button>
            <Button variant="outline" onClick={handleCancelClick} mt={3}>
              취소
            </Button>
          </>
        ) : (
          <>
            <Text>
              <strong>ID:</strong> {headquarter.id}
            </Text>
            <Text mt={2}>
              <strong>프랜차이즈 이름:</strong> {headquarter.franchiseName}
            </Text>
            <Text mt={2}>
              <strong>카테고리:</strong> {headquarter.category}
            </Text>
            <Text mt={2}>
              <strong>하위 카테고리:</strong> {headquarter.subCategory}
            </Text>
          </>
        )}
        {/* 하위 카테고리 밑에 관련 매장 목록 추가 */}
        <Box mt={4}>
          <Heading size="md">메뉴 목록</Heading>
          {isLoadingItems ? (
            <Spinner size="sm" mt={2} />
          ) : items.length > 0 ? (
            items.map((item) => (
              <Box
                key={item.id}
                borderWidth="1px"
                borderRadius="md"
                p={2}
                mt={2}
              >
                <Text>
                  <strong>메뉴 이름:</strong> {item.name}
                </Text>
                <Text>
                  <strong>가격:</strong> {item.price}원
                </Text>
              </Box>
            ))
          ) : (
            <Text mt={2}>메뉴가 없습니다.</Text>
          )}
        </Box>
        <Button colorScheme="blue" onClick={handleEditClick} mt={4}>
          수정하기
        </Button>
      </Box>
    </Center>
  );
};

export default HeadquarterDetailPage;
