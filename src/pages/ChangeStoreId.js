// src/pages/ChangeStoreId.js
import React, { useState } from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  useToast
} from '@chakra-ui/react';
import axiosInstance from '../api/axiosInstance'; 

const ChangeStoreId = () => {
  const [newStoreId, setNewStoreId] = useState('');
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem('accessToken');
    try {
      await axiosInstance.put(
        `/manager/update/store-id?newStoreId=${newStoreId}`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      toast({
        title: 'Store ID가 변경되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    } catch (error) {
      toast({
        title: '변경 실패',
        description: error.response?.data?.message || error.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6}>
      <Heading mb={6}>Store ID 변경</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="storeId" isRequired>
            <FormLabel>새 Store ID</FormLabel>
            <Input
              type="number"
              value={newStoreId}
              onChange={(e) => setNewStoreId(e.target.value)}
            />
          </FormControl>
          <Button type="submit" colorScheme="blue" width="full">
            변경하기
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default ChangeStoreId;
