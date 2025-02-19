// src/pages/NotificationPage.js
import React, { useEffect, useContext, useState } from 'react';
import {
  Box,
  Heading,
  List,
  ListItem,
  Text,
  Badge,
  Spinner,
  VStack,
  Button,
  HStack,
} from '@chakra-ui/react';
import axiosInstance from '../api/axiosInstance';
import { jwtDecode } from 'jwt-decode';
import { NotificationsContext } from '../context/NotificationsContext';

const NotificationPage = () => {
  const {
    notifications,
    updateNotifications,
    markNotificationAsRead,
    deleteNotification,
  } = useContext(NotificationsContext);
  const [storeId, setStoreId] = useState(null);
  const [loading, setLoading] = useState(true);

  // JWT에서 storeId 추출
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.error('❌ JWT 없음, storeId 설정 불가');
      return;
    }
    try {
      const decoded = jwtDecode(accessToken);
      setStoreId(decoded.storeId);
      console.log('✅ JWT에서 추출한 storeId:', decoded.storeId);
    } catch (error) {
      console.error('❌ JWT 디코딩 실패:', error);
    }
  }, []);

  // 초기 알림 목록 조회
  useEffect(() => {
    const fetchNotifications = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('❌ 토큰 없음, 요청 불가');
        setLoading(false);
        return;
      }
      try {
        const response = await axiosInstance.get('/notifications/my', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        console.log('✅ 알림 목록:', response.data);
        updateNotifications(response.data);
      } catch (error) {
        console.error(
          '❌ 알림 조회 실패:',
          error.response?.data || error.message,
        );
      } finally {
        setLoading(false);
      }
    };

    if (storeId) {
      fetchNotifications();
    }
  }, [storeId, updateNotifications]);

  // 읽음 처리 함수
  const handleMarkAsRead = async (notificationId) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;
    try {
      await axiosInstance.patch(
        `/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      markNotificationAsRead(notificationId);
    } catch (error) {
      console.error(
        '❌ 읽음 처리 실패:',
        error.response?.data || error.message,
      );
    }
  };

  // 알림 삭제 함수
  const handleDeleteNotification = async (notificationId) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;
    try {
      await axiosInstance.delete(`/notifications/${notificationId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      deleteNotification(notificationId);
    } catch (error) {
      console.error(
        '❌ 알림 삭제 실패:',
        error.response?.data || error.message,
      );
    }
  };

  if (loading) return <Spinner mt={10} />;

  return (
    <Box maxW="md" mx="auto" mt={10} p={6}>
      <Heading mb={4}>📢 알림 목록</Heading>
      <VStack align="stretch" spacing={3}>
        {notifications.length === 0 ? (
          <Text>📭 새로운 알림이 없습니다.</Text>
        ) : (
          <List spacing={3}>
            {notifications.map((notification) => (
              <ListItem
                key={notification.id}
                p={3}
                borderWidth="1px"
                borderRadius="md"
              >
                <Text fontWeight="bold">
                  {notification.title}{' '}
                  {!notification.isRead && <Badge colorScheme="red">NEW</Badge>}
                </Text>
                <Text>{notification.content}</Text>
                <HStack spacing={2} mt={2}>
                  {!notification.isRead && (
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      읽음
                    </Button>
                  )}
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleDeleteNotification(notification.id)}
                  >
                    삭제
                  </Button>
                </HStack>
              </ListItem>
            ))}
          </List>
        )}
      </VStack>
    </Box>
  );
};

export default NotificationPage;
