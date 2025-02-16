import { useEffect } from 'react';

const useSSE = (targetId, onNewNotification) => {
  useEffect(() => {
    if (!targetId) return;

    const BASE_URL = 'http://localhost:8080'; // 백엔드 도인(필요에 따라 수정)
    const eventSource = new EventSource(
      `${BASE_URL}/notifications/subscribe/${targetId}`,
    );

    eventSource.onmessage = (event) => {
      console.log('새 알림 도착:', event.data);
      const notification = {
        id: Date.now(), // 임시 ID
        title: '새로운 프로모션',
        content: event.data,
        isRead: false,
      };
      onNewNotification(notification);
    };

    eventSource.onerror = (error) => {
      console.error('SSE 연결 오류:', error);
      eventSource.close();
    };

    return () => {
      console.log('SSE 연결 해제');
      eventSource.close();
    };
  }, [targetId, onNewNotification]);
};

export default useSSE;
