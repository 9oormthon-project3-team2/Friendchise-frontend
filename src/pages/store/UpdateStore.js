import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Heading,
  VStack,
  useToast, HStack,
} from '@chakra-ui/react';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate, useLocation } from 'react-router-dom';
import AddressSearchModal from './AddressSearchModal';

const UpdateStoreForm = () => {
  // form 데이터를 관리하는 state
  const [formData, setFormData] = useState({
    address: '',
    roadAddress: '',
    zoneNumber: '',
    dong: '',
    x: '',
    y: '',
    franchiseName: '',
    headQuarterName: ''
  });

  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // 입력값 변경 시 state 업데이트
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (location.state?.data) {
      const data = location.state.data;
      setFormData({
        address: data.roadAddress || '',
        roadAddress: data.address || '', // 값이 없으면 빈 문자열
        zoneNumber: data.zoneNumber || '',
        dong: data.dong || '',
        // API 응답이 pointX, pointY이면 이를 x, y에 매핑
        x: data.pointX || data.x || '',
        y: data.pointY || data.y || '',
        franchiseName: data.franchiseName || '',
        headQuarterName: data.headQuarterName || '',
      });
    }
  }, [location.state]);

  const handleAddressSelect = (addressData) => {
    setFormData((prevData) => ({
      ...prevData,
      address: addressData.address || '',
      roadAddress: addressData.roadAddress || '',
      zoneNumber: addressData.zoneNumber || '',
      x: addressData.x || '',
      y: addressData.y || '',
      dong: addressData.dong || '',
    }));
  };

  // 폼 제출 시 API 요청
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 숫자 필드 변환 (x, y)
    const storeData = {
      ...formData,
      x: parseFloat(formData.x),
      y: parseFloat(formData.y),
    };

    const accessToken = localStorage.getItem('accessToken'); // JWT 토큰 가져오기

    try {
      const response = await axiosInstance.put(
        '/store', // 실제 API 엔드포인트에 맞게 수정
        storeData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      toast({
        title: 'Store 변경 성공',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      // 필요에 따라 페이지 이동 (예: 리스트 페이지)
      navigate('/mypage');
    } catch (error) {
      toast({
        title: 'Store 생성 실패',
        description: error.response?.data?.message || error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="md">
      <Heading mb={6}>Store 생성</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="address" isRequired>
            <FormLabel>Address</FormLabel>
            <HStack>
              <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="주소가 선택됩니다"
                readOnly
              />
              {/* 주소검색 모달 컴포넌트 */}
              <AddressSearchModal onAddressSelect={handleAddressSelect} />
            </HStack>
          </FormControl>
          <FormControl id="roadAddress" isRequired>
            <FormLabel>Road Address</FormLabel>
            <Input
              name="roadAddress"
              value={formData.roadAddress}
              onChange={handleChange}
              placeholder="도로명 주소 입력"
              readOnly
            />
          </FormControl>
          <FormControl id="zoneNumber" isRequired>
            <FormLabel>Zone Number</FormLabel>
            <Input
              name="zoneNumber"
              value={formData.zoneNumber}
              onChange={handleChange}
              placeholder="우편번호 입력"
              readOnly
            />
          </FormControl>
          <FormControl id="dong" isRequired>
            <FormLabel>Dong</FormLabel>
            <Input
              name="dong"
              value={formData.dong}
              onChange={handleChange}
              placeholder="동 입력"
              readOnly
            />
          </FormControl>
          <FormControl id="x" isRequired>
            <FormLabel>X Coordinate</FormLabel>
            <Input
              name="x"
              value={formData.x}
              onChange={handleChange}
              placeholder="X 좌표 입력"
              readOnly
            />
          </FormControl>
          <FormControl id="y" isRequired>
            <FormLabel>Y Coordinate</FormLabel>
            <Input
              name="y"
              value={formData.y}
              onChange={handleChange}
              placeholder="Y 좌표 입력"
              readOnly
            />
          </FormControl>
          <FormControl id="franchiseName" isRequired>
            <FormLabel>Franchise Name</FormLabel>
            <Input
              name="franchiseName"
              value={formData.franchiseName}
              onChange={handleChange}
              placeholder="프랜차이즈명 입력"
            />
          </FormControl>
          <FormControl id="headQuarterName" isRequired>
            <FormLabel>Headquarter Name</FormLabel>
            <Input
              name="headQuarterName"
              value={formData.headQuarterName}
              onChange={handleChange}
              placeholder="본사명 입력"
            />
          </FormControl>
          <Button type="submit" colorScheme="blue" width="full">
            Store 수정
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default UpdateStoreForm;