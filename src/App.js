// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import LoginPage from './pages/LoginPage';
import MyPage from './pages/MyPage';
import ChangePassword from './pages/ChangePassword';
import ChangeStoreId from './pages/ChangeStoreId';
import MemberSearch from './pages/MemberSearch';
import DeleteAccount from './pages/DeleteAccount';
import RegisterPage from './pages/RegisterPage';

const App = () => {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/change-store-id" element={<ChangeStoreId />} />
          <Route path="/member-search" element={<MemberSearch />} />
          <Route path="/delete-account" element={<DeleteAccount />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* 필요에 따라 추가 라우팅 */}
        </Routes>
      </Router>
    </ChakraProvider>
  );
};

export default App;
