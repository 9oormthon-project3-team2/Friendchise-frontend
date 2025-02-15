import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  List,
  ListItem,
  Text,
  Badge,
  Button,
  Spinner,
  VStack,
} from '@chakra-ui/react';
import axiosInstance from '../api/axiosInstance';
import useSSE from '../hooks/useSSE';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const targetId = 1; // 실제 본사 ID (로그인 정보에서 가져와야 함)

  // SSE 구독 (실시간 알림 받기)
  useSSE(targetId, (newNotification) => {
    setNotifications((prev) => [newNotification, ...prev]);
  });

  // 알림 목록 조회
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axiosInstance.get('/notifications/my');
        setNotifications(response.data);
      } catch (error) {
        console.error('알림 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  // 알림 읽음 처리
  const markAsRead = async (notificationId) => {
    try {
      await axiosInstance.patch(`/notifications/${notificationId}/read`);
      setNotifications(
        notifications.map((n) =>
          n.id === notificationId ? { ...n, isRead: true } : n,
        ),
      );
    } catch (error) {
      console.error('읽음 처리 실패:', error);
    }
  };

  // 알림 삭제
  const deleteNotification = async (notificationId) => {
    try {
      await axiosInstance.delete(`/notifications/${notificationId}`);
      setNotifications(notifications.filter((n) => n.id !== notificationId));
    } catch (error) {
      console.error('알림 삭제 실패:', error);
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
          notifications.map((notification) => (
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
              <Button
                size="xs"
                colorScheme="blue"
                mr={2}
                onClick={() => markAsRead(notification.id)}
              >
                읽음
              </Button>
              <Button
                size="xs"
                colorScheme="red"
                onClick={() => deleteNotification(notification.id)}
              >
                삭제
              </Button>
            </ListItem>
          ))
        )}
      </VStack>
    </Box>
  );
};

export default NotificationPage;
