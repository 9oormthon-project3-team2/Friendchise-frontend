import React, { useState } from 'react';
import KakaoMap from '../components/KakaoMap';
import ApiButton from '../components/ApiButton';
import MultiSelectCategoryGroup from '@/components/MultiSelectCategoryGroup';
import { Center, VStack } from '@chakra-ui/react';

const HeadquarterRecommendationPage = () => {
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [categoryGroup, setCategoryGroup] = useState([]);

  return (
    <>
      <Center minHeight="100vh">
        <VStack spacing={4}>
          <KakaoMap setCoords={setCoords} />
          <MultiSelectCategoryGroup setCategoryGroup={setCategoryGroup} />
          <ApiButton coords={coords} categoryGroup={categoryGroup} />
        </VStack>
      </Center>
    </>
  );
};

export default HeadquarterRecommendationPage;
