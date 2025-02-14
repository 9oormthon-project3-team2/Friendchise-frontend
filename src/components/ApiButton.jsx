import { Button, CircularProgress, Box, Text } from '@chakra-ui/react';
import { useState } from 'react';

const ApiButton = ({ coords, categoryGroup }) => {
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);

  const handleClick = async () => {
    // 전송할 데이터 구성 (필요에 따라 수정)
    setLoading(true);
    setError(null);
    setResponseData(null);

    const token = localStorage.getItem('access_token');

    const payload = {
      user_selected_category: categoryGroup,
      x: coords.lng,
      y: coords.lat,
    };

    try {
      const response = await fetch(
        'http://13.209.82.1:8080/headquarter/store-recommendation',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error('네트워크 응답이 올바르지 않습니다.');
      }

      const data = await response.json();
      console.log('API 응답:', data);
    } catch (error) {
      console.error('API 요청 에러:', error);
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
