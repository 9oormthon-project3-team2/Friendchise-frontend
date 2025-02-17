// src/hooks/useSSE.js
import { useEffect } from 'react';

const useSSE = (storeId, onNewNotification) => {
  useEffect(() => {
    if (!storeId) {
      console.warn('❌ storeId가 없음, SSE 실행 안됨');
      return;
    }

    console.log(`✅ SSE 실행됨, storeId: ${storeId}`);
    const BASE_URL = 'http://localhost:8080';
    const eventSource = new EventSource(
      `${BASE_URL}/notifications/subscribe/${storeId}`,
    );

    eventSource.addEventListener('Promotion', (event) => {
      console.log('📢 Promotion 이벤트 수신:', event);
      try {
        const notification = JSON.parse(event.data);
        if (!notification || !notification.title) {
          console.warn('⚠️ 유효하지 않은 알림 데이터:', notification);
          return;
        }

        // SSE로 받은 알림에는 고유 id가 없으므로, 임시로 Date.now() 사용
        const notificationWithId = {
          id: Date.now(),
          ...notification,
        };

        // ❌ 기존: onNewNotification((prev) => [notificationWithId, ...prev]);
        // ⭕ 수정: 알림 "객체"만 콜백으로 넘겨줌
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
  }, [storeId, onNewNotification]);
};

export default useSSE;
