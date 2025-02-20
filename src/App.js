import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { NotificationsProvider } from './context/NotificationsContext';

import LoginPage from './pages/LoginPage';
import MyPage from './pages/MyPage';
import ChangePassword from './pages/ChangePassword';
import ChangeStoreId from './pages/ChangeStoreId';
import DeleteAccount from './pages/DeleteAccount';
import RegisterPage from './pages/RegisterPage';
import HeadquarterRecommendationPage from './pages/headquarter/HeadquarterRecommendationPage';
import HeadquarterRegisterPage from './pages/headquarter/HeadquarterCreatePage';
import ItemRegisterPage from './pages/headquarter/ItemRegisterPage';
import HeadquarterDetailPage from './pages/headquarter/HeadquarterDetailPage';
import CreateStore from '@/pages/store/CreateStore';
import RecommendationStore from './pages/RecommendationStore';
import NotificationPage from './pages/NotificationPage';
import PromotionPage from './pages/PromotionPage';

import RegisterPageCustomer from './pages/RegisterPageCustomer';
import LoginPageCustomer from './pages/LoginPageCustomer';
import MyPageCustomer from './pages/MyPageCustomer';
import UpdateStore from './pages/store/UpdateStore';
import SSEManager from './components/SSEManager';


const App = () => {
  return (
    <ChakraProvider>
      <NotificationsProvider>
        <BrowserRouter>
          <SSEManager />
          <Routes>
            <Route path="/manager/login" element={<LoginPage />} />
            <Route path="/manager/mypage" element={<MyPage />} />
            <Route path="/manager/change-password" element={<ChangePassword />} />
            <Route path="/manager/change-store-id" element={<ChangeStoreId />} />
            <Route path="/manager/delete-account" element={<DeleteAccount />} />
            <Route path="/manager/register" element={<RegisterPage />} />
            <Route path="/nearest-store" element={<RecommendationStore />} />
            <Route path="/createStore" element={<CreateStore />} />
            <Route path="/updateStore" element={<UpdateStore />} />
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
            <Route
              path="/headquarter/store-recommendation"
              element={<HeadquarterRecommendationPage />}
            />
            <Route path="/notifications" element={<NotificationPage />} />
            <Route path="/promotions" element={<PromotionPage />} />
            <Route path="/register/customer" element={<RegisterPageCustomer />} />
            <Route path="/login/customer" element={<LoginPageCustomer />} />
            <Route path="/mypage/customer" element={<MyPageCustomer />} />
            {/* 필요에 따라 추가 라우팅 */}
          </Routes>
        </BrowserRouter>
      </NotificationsProvider>
    </ChakraProvider>
  );
};

export default App;
