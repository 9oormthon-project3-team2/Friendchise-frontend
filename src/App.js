import { ChakraProvider } from '@chakra-ui/react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

import React from 'react';
import KakaoMap from './components/KakaoMap';

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/kakaomap" element={<KakaoMap />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
