// src/hooks/useSSE.js
import { useEffect } from 'react';

const useSSE = (storeId, token, onNewNotification) => {
  useEffect(() => {
    if (!storeId || !token) {
      console.warn('❌ storeId 또는 token이 없음, SSE 실행 안됨');
      return;
    }

    console.log(`✅ SSE 실행됨, storeId: ${storeId}`);
    //배포시 서버 수정 필요
    const BASE_URL = 'http://localhost:8080';
    const eventSourceUrl = `${BASE_URL}/notifications/subscribe/${storeId}?token=${encodeURIComponent(
      token,
    )}`;
    const eventSource = new EventSource(eventSourceUrl);

    eventSource.addEventListener('Promotion', (event) => {
      console.log('📢 Promotion 이벤트 수신:', event);
      try {
        const notification = JSON.parse(event.data);
        if (!notification || !notification.title) {
          console.warn('⚠️ 유효하지 않은 알림 데이터:', notification);
          return;
        }

        // 서버에서 전달한 notificationId를 우선 사용. 없으면 fallback.
        const notificationId = notification.notificationId
          ? parseInt(notification.notificationId, 10)
          : null;
        const notificationWithId = {
          id: notificationId !== null ? notificationId : Date.now(),
          ...notification,
        };

        onNewNotification(notificationWithId);
      } catch (error) {
        console.error('❌ 알림 데이터 파싱 오류:', error);
      }
    });

    eventSource.onopen = () => {
      console.log('🟢 SSE 연결 성공!');
    };

    eventSource.onerror = (error) => {
      console.error('❌ SSE 연결 오류 발생:', error);
      eventSource.close();
    };

    return () => {
      console.log('❌ SSE 연결 해제');
      eventSource.close();
    };
  }, [storeId, token, onNewNotification]);
};

export default useSSE;
