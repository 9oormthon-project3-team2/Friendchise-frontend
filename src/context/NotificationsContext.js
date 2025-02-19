// src/context/NotificationsContext.js
import React, { createContext, useState, useCallback } from 'react';

export const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // SSEManager나 초기 조회로 새 알림 추가 시 호출
  const addNotification = useCallback((notification) => {
    setNotifications((prev) => [notification, ...prev]);
  }, []);

  // 초기 조회한 알림 목록으로 상태를 대체
  const updateNotifications = useCallback((newNotifications) => {
    setNotifications(newNotifications);
  }, []);

  const markNotificationAsRead = useCallback((notificationId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)),
    );
  }, []);

  const deleteNotification = useCallback((notificationId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        addNotification,
        updateNotifications,
        markNotificationAsRead,
        deleteNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
