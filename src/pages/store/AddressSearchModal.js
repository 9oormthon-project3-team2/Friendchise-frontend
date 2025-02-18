import React, {useState} from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  VStack,
  Text,
  Spinner,
} from '@chakra-ui/react';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const AddressSearchModal = ({ onAddressSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [address, setAddress] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setAddress('');
    setResults([]);
  };

  const handleSearch = async () => {
    if (!address.trim()) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get('/store/search', {
        params: { address },
      });

      setResults(response.data);
    } catch (error) {
      console.error('정확한 주소를 입력해주세요.', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (addressData) => {
    onAddressSelect(addressData);
    closeModal();
  };

  return (
    <>
      <Button onClick={openModal} colorScheme="teal">
        주소찾기
      </Button>
      <Modal isOpen={isOpen} onClose={closeModal} isCentered size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>주소 검색</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="검색할 주소를 입력하세요."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              mb={4}
              />
            <Button onClick={handleSearch} colorScheme="blue" mb={4}>
              검색
            </Button>
            {loading ? (
              <Spinner />
            ) : (
              <VStack spacing={2} align="stretch">
                {results.length > 0 ? (
                  results.map((item, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => handleSelect(item)}
                    >
                      {item.roadAddress || item.address}
                    </Button>
                  ))
                ) : (
                  <Text>검색 결과가 없습니다.</Text>
                )}
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AddressSearchModal;