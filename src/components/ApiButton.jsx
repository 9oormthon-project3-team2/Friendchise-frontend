import axiosInstance from '@/api/axiosInstance';
import {
  Button,
  CircularProgress,
  Box,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';

const ApiButton = ({ coords, categoryGroup }) => {
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const toast = useToast();

  const handleClick = async () => {
    // 전송할 데이터 구성 (필요에 따라 수정)
    setLoading(true);
    setError(null);
    setResponseData(null);

    const token = localStorage.getItem('accessToken');

    const payload = {
      user_selected_category: categoryGroup,
      x: coords.lng,
      y: coords.lat,
    };

    try {
      const response = await axiosInstance.post(
        '/headquarter/store-recommendation',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();
      console.log('API 응답:', data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast({
        title: '정보 조회 실패',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box textAlign="center">
      <Button colorScheme="blue" onClick={handleClick} isDisabled={loading}>
        매장 입점 여부 추천받기
      </Button>

      {loading && (
        <Box mt={4}>
          <CircularProgress isIndeterminate color="blue.500" />
          <Text mt={2}>Loading...</Text>
        </Box>
      )}

      {responseData && (
        <Box mt={4}>
          <Text>API Response:</Text>
          <pre>{JSON.stringify(responseData, null, 2)}</pre>
        </Box>
      )}

      {error && (
        <Box mt={4} color="red.500">
          <Text>Error: {error}</Text>
        </Box>
      )}
    </Box>
  );
};

export default ApiButton;
