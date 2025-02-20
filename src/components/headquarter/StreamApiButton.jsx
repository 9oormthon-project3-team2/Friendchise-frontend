import { useState } from 'react';
import {
  Button,
  CircularProgress,
  Box,
  Text,
  useToast,
  CardBody,
  Card,
} from '@chakra-ui/react';

const StreamApiButton = ({ coords, categoryGroup }) => {
  const [loading, setLoading] = useState(false);
  const [streamData, setStreamData] = useState("");
  const [error, setError] = useState(null);
  const toast = useToast();

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    setStreamData("");

    try {
      const token = localStorage.getItem('accessToken');

      const payload = {
        user_selected_category: categoryGroup,
        x: coords.lng,
        y: coords.lat,
      };

      const res = await fetch("http://13.209.82.1:8080/headquarter/store-recommendation-stream", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.response?.data?.message || error.message);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let buffer = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          // 읽은 청크를 디코딩
          const chunk = decoder.decode(value, { stream: true });
          // 버퍼에 추가
          buffer += chunk;

          // "\n\n" 기준으로 완전한 메시지 분리
          const parts = buffer.split("\n\n");
          // 마지막 부분은 미완성일 수 있으므로 버퍼에 남겨둔다.
          buffer = parts.pop();

          parts.forEach(part => {
            // "data:" 접두어 제거 및 트림
            const cleanedText = part.replaceAll("data:", "");
            // 기존 스트림 데이터에 누적, 각 메시지를 새로운 줄로 추가
            setStreamData(prev => prev + cleanedText);
          });
        }
      }

      // 남은 미완성 메시지 처리 (있는 경우)
      if (buffer.trim() !== "") {
        const cleaned = buffer.replace(/^data:/, "").trim();
        setStreamData(prev => prev + cleaned + "\n");
      }
    } catch (err) {
      setError(err.message);
      toast({
        title: '정보 조회 실패',
        description: err.message,
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
        해당 위치에 매장 입점 여부 추천받기
      </Button>

      {loading && (
        <Box mt={4}>
          <CircularProgress isIndeterminate color="blue.500" />
          <Text mt={2}>Loading streaming data...</Text>
        </Box>
      )}

      {streamData && (
        <Card mt={4}>
          <CardBody>
            <pre>{streamData}</pre>
          </CardBody>
        </Card>
      )}

      {error && (
        <Box mt={4} color="red.500">
          <Text>Error: {error}</Text>
        </Box>
      )}
    </Box>
  );
};

export default StreamApiButton;