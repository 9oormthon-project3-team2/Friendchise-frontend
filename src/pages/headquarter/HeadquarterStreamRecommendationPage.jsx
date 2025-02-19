import React, { useState } from 'react';
import KakaoMap from '../../components/headquarter/KakaoMap';
import ApiButton from '../../components/headquarter/ApiButton';
import MultiSelectCategoryGroup from '@/components/headquarter/MultiSelectCategoryGroup';
import { Center, VStack } from '@chakra-ui/react';
import StreamApiButton from '@/components/headquarter/StreamApiButton';

const HeadquarterStreamRecommendationPage = () => {
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [categoryGroup, setCategoryGroup] = useState([]);

  return (
    <>
      <Center minHeight="100vh">
        <VStack spacing={4}>
          <KakaoMap setCoords={setCoords} />
          <MultiSelectCategoryGroup setCategoryGroup={setCategoryGroup} />
          <StreamApiButton coords={coords} categoryGroup={categoryGroup} />
        </VStack>
      </Center>
    </>
  );
};

export default HeadquarterStreamRecommendationPage;
