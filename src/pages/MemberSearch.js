// src/pages/MemberSearch.js
import React, { useState } from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Text,
  useToast
} from '@chakra-ui/react';
import axiosInstance from '../api/axiosInstance'; 

const MemberSearch = () => {
  const [username, setUsername] = useState('');
  const [member, setMember] = useState(null);
  const toast = useToast();

  const handleSearch = async () => {
    try {
      const response = await axiosInstance.get(`/manager/${username}`);
      setMember(response.data);
    } catch (error) {
      toast({
        title: '회원 조회 실패',
        description: error.response?.data?.message || error.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6}>
      <Heading mb={6}>회원조회</Heading>
      <VStack spacing={4}>
        <FormControl id="username" isRequired>
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormControl>
        <Button onClick={handleSearch} colorScheme="blue" width="full">
          조회하기
        </Button>
        {member && (
          <Box borderWidth={1} borderRadius="md" p={4} w="100%">
            <Text><strong>ID:</strong> {member.id}</Text>
            <Text><strong>Username:</strong> {member.username}</Text>
            <Text><strong>Role:</strong> {member.role}</Text>
            <Text><strong>Manage ID:</strong> {member.manageId}</Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default MemberSearch;
