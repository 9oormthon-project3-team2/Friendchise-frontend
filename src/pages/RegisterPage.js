// src/pages/RegisterPage.js
import React, { useState } from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Select,
  useToast
} from '@chakra-ui/react';
import axiosInstance from '../api/axiosInstance'; 

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [headquarterId, setHeadquarterId] = useState('');
  const [certificationNumber, setCertificationNumber] = useState('');
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let payload = { username, password, role };
      // 매장관리자의 경우 추가 필드 전송
      if (role === 'STORE') {
        payload = {
          ...payload,
          headquarterId: Number(headquarterId),
          certificationNumber
        };
      }
      const response = await axiosInstance.post('/manager/register', payload);
      toast({
        title: '회원가입 성공',
        description: `등록된 ID: ${response.data.id}`,
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      // 필요에 따라 페이지 이동 또는 폼 초기화
    } catch (error) {
      toast({
        title: '회원가입 실패',
        description: error.response?.data?.message || error.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6}>
      <Heading mb={6}>관리자 회원가입</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="username" isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <FormControl id="role" isRequired>
            <FormLabel>Role</FormLabel>
            <Select
              placeholder="역할 선택"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="HEADQUARTER">본사관리자</option>
              <option value="STORE">매장관리자</option>
            </Select>
          </FormControl>
          {role === 'STORE' && (
            <>
              <FormControl id="headquarterId" isRequired>
                <FormLabel>Headquarter ID</FormLabel>
                <Input
                  type="number"
                  value={headquarterId}
                  onChange={(e) => setHeadquarterId(e.target.value)}
                />
              </FormControl>
              <FormControl id="certificationNumber" isRequired>
                <FormLabel>Certification Number</FormLabel>
                <Input
                  type="text"
                  value={certificationNumber}
                  onChange={(e) => setCertificationNumber(e.target.value)}
                />
              </FormControl>
            </>
          )}
          <Button type="submit" colorScheme="blue" width="full">
            회원가입
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default RegisterPage;
