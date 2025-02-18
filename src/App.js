import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import LoginPage from './pages/LoginPage';
import MyPage from './pages/MyPage';
import ChangePassword from './pages/ChangePassword';
import ChangeStoreId from './pages/ChangeStoreId';
import MemberSearch from './pages/MemberSearch';
import DeleteAccount from './pages/DeleteAccount';
import RegisterPage from './pages/RegisterPage';
import HeadquarterRecommendationPage from './pages/headquarter/HeadquarterRecommendationPage';
import HeadquarterRegisterPage from './pages/headquarter/HeadquarterCreatePage';
import ItemRegisterPage from './pages/headquarter/ItemRegisterPage';
import HeadquarterDetailPage from './pages/headquarter/HeadquarterDetailPage';
import NotificationPage from '@/pages/NotificationPage';
import RecommendationStore from '@/pages/RecommendationStore';
import CreateStore from '@/pages/store/CreateStore';

const App = () => {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/change-store-id" element={<ChangeStoreId />} />
          <Route path="/member-search" element={<MemberSearch />} />
          <Route path="/delete-account" element={<DeleteAccount />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/nearest-store" element={<RecommendationStore />} />
          <Route path="/createStore" element={<CreateStore />} />
          <Route
            path="/headquarter/store-recommendation"
            element={<HeadquarterRecommendationPage />}
          />
          <Route
            path="/headquarter/register"
            element={<HeadquarterRegisterPage />}
          />
          <Route
            path="/headquarter/mypage"
            element={<HeadquarterDetailPage />}
          />
          <Route
            path="/headquarter/item/register"
            element={<ItemRegisterPage />}
          />
          <Route path="/notifications" element={<NotificationPage />} />
          {/* 필요에 따라 추가 라우팅 */}
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
};

export default App;
