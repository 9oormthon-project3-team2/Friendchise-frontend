import React, { useState } from 'react';
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  VStack,
  useToast,
} from '@chakra-ui/react';
import axiosInstance from '@/api/axiosInstance';

const ItemRegisterPage = () => {
  const toast = useToast();
  const [items, setItems] = useState([{ name: '', price: '' }]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { name: '', price: '' }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (let item of items) {
      if (!item.name || item.price === '') {
        toast({
          title: '입력 오류',
          description: '모든 메뉴 항목의 이름과 가격을 입력해주세요.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    }

    const payload = {
      itemList: items.map((item) => ({
        name: item.name,
        price: Number(item.price),
      })),
    };

    try {
      const token = localStorage.getItem('accessToken');
      await axiosInstance.post('/headquarter/items/register', payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      toast({
        title: '메뉴 등록 성공',
        description: '메뉴 항목들이 성공적으로 등록되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setItems([{ name: '', price: '' }]);
    } catch (error) {
      toast({
        title: '메뉴 등록 실패',
        description: error.response?.data?.message || error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Center minH="100vh" p={4}>
      <Box maxW="lg" w="100%" borderWidth="1px" borderRadius="lg" p={6}>
        <Heading size="lg" mb={4}>
          메뉴 등록하기
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            {items.map((item, index) => (
              <Box key={index} borderWidth="1px" borderRadius="md" p={4}>
                {/* HStack을 사용해 같은 행에 배치 */}
                <HStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>메뉴 이름</FormLabel>
                    <Input
                      placeholder="메뉴 이름"
                      value={item.name}
                      onChange={(e) =>
                        handleItemChange(index, 'name', e.target.value)
                      }
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>가격</FormLabel>
                    <Input
                      type="number"
                      placeholder="가격"
                      value={item.price}
                      onChange={(e) =>
                        handleItemChange(index, 'price', e.target.value)
                      }
                    />
                  </FormControl>
                </HStack>
                {items.length > 1 && (
                  <Button
                    mt={2}
                    colorScheme="red"
                    onClick={() => handleRemoveItem(index)}
                  >
                    삭제
                  </Button>
                )}
              </Box>
            ))}
            <Button colorScheme="blue" onClick={handleAddItem}>
              + 메뉴 항목 추가
            </Button>
            <Button type="submit" colorScheme="green">
              메뉴 등록
            </Button>
          </VStack>
        </form>
      </Box>
    </Center>
  );
};

export default ItemRegisterPage;
