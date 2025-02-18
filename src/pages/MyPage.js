// src/pages/MyPage.js
import React, { useEffect, useRef, useState } from 'react';
import { Box, Heading, Text, VStack, Spinner, Button, useToast, Flex,
  Divider, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const MyPage = () => {
  const [user, setUser] = useState(null);
  const [detailedData, setDetailedData] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const cancelRef = useRef();

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

  const handleUpdateCompany = () => {
    if (user && user.role == 'STORE') {
      navigate('/createStore')
    } else if (user.role == 'HEADQUARTER'){
      navigate('/headquarter/register')
    }
  }

  const deleteCompany = async () => {
    const accessToken = localStorage.getItem('accessToken');
    try{
      if (user && user.role == 'HEADQUARTER') {
        const headQuarterResponse = await axiosInstance.delete('/headquarter', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setDetailedData(headQuarterResponse.data);
      } else if (user && user.role == 'STORE') {
        const storeReponse = await axiosInstance.delete('/store', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setDetailedData(storeReponse.data);
      }

    } catch (error) {
      toast({
        title: '삭제 실패',
        description: error.response?.data?.message || error.message,
        status: 'Delete Error',
        duration: 3000,
        isClosable: true
      });
    }
  }

  const onDeleteButtonClick = () => {
    setIsAlertOpen(true);
  }

  const onConfirmDelete = async () => {
    setIsAlertOpen(false);
    await deleteCompany();
  }

  const onCancelDelete = () => {
    setIsAlertOpen(false);
  }

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
        <Text><strong>ID:</strong> {user.id}</Text>
        <Text><strong>Username:</strong> {user.username}</Text>
        <Text><strong>Role:</strong> {user.role}</Text>
      </VStack>
      {detailedData && (
        <>
          <Divider my={4} />
          <Box p={4} borderWidth={1} borderRadius="md">
            <Heading as="h2" size="lg" mb={3}>
              영업장 정보
            </Heading>
            <VStack align="start" spacing={2}>
              <Text><strong>주소:</strong> {detailedData.address}</Text>
              <Text><strong>동:</strong> {detailedData.dong}</Text>
              <Text><strong>X 좌표:</strong> {detailedData.pointX}</Text>
              <Text><strong>Y 좌표:</strong> {detailedData.pointY}</Text>
              <Text><strong>프랜차이즈 명:</strong> {detailedData.franchiseName}</Text>
            </VStack>
            <Flex mt={4} justify="flex-end">
              <Button colorScheme="blue" mr={2} onClick={handleUpdateCompany}>
                수정
              </Button>
              <Button colorScheme="red" onClick={onDeleteButtonClick}>
                삭제
              </Button>
            </Flex>
          </Box>
        </>
      )}

      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isAlertOpen}
        onClose={onCancelDelete}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              삭제 확인
            </AlertDialogHeader>
            <AlertDialogBody>
              정말로 삭제하시겠습니까?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onCancelDelete}>
                아니오
              </Button>
              <Button colorScheme="red" onClick={onConfirmDelete} ml={3}>
                예
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default MyPage;