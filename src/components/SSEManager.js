// src/components/SSEManager.js
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import useSSE from '../hooks/useSSE';
import { useToast } from '@chakra-ui/react';
import { NotificationsContext } from '../context/NotificationsContext';

const SSEManager = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  // context와 toast는 항상 호출 (조건 없이)
  const { addNotification } = useContext(NotificationsContext);
  const toast = useToast();

  // 항상 useState를 호출
  const [storeId, setStoreId] = useState(null);

  useEffect(() => {
    // 로그인 페이지면 SSE 로직 실행하지 않음
    if (isLoginPage) return;

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.warn('SSEManager: accessToken 없음');
      return;
    }
    try {
      const decoded = jwtDecode(accessToken);
      // JWT의 role이 '스토어'인 경우에만 SSE 연결 진행
      if (decoded.role !== 'STORE') {
        console.log(
          'SSEManager: 스토어 매니저가 아니므로 SSE 연결을 진행하지 않음.',
        );
        return;
      }
      setStoreId(decoded.storeId);
      console.log('SSEManager: JWT에서 추출한 storeId:', decoded.storeId);
    } catch (error) {
      console.error('SSEManager: JWT 디코딩 실패:', error);
    }
  }, [isLoginPage]);

  const handleNewNotification = useCallback(
    (notification) => {
      // 로그인 페이지라면 처리하지 않음
      if (isLoginPage) return;
      console.log('SSEManager: 새 알림 수신:', notification);
      toast({
        title: '새 알림 도착',
        description: notification.title,
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      addNotification(notification);
    },
    [toast, addNotification, isLoginPage],
  );

  // storeId가 null이면 useSSE 내부에서 아무 작업도 하지 않도록 처리합니다.
  useSSE(storeId, handleNewNotification);

  return null;
};

export default SSEManager;
