import { ChakraProvider } from '@chakra-ui/react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

import React from 'react';
import HeadquarterRecommendationPage from './pages/HeadquarterRecommendationPage';

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/kakaomap" element={<HeadquarterRecommendationPage />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
