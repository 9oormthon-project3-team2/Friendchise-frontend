import { useEffect, useState } from 'react';

const useStream = (url) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      // event.data는 문자열 형태로 전달되므로 JSON 파싱 필요 시 처리
      try {
        setData(prevData => [...prevData, event.data]);
      } catch (err) {
        console.error('Parsing error:', err);
      }
    };

    eventSource.onerror = (event) => {
      setError('SSE 연결 에러');
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [url]);

  return { data, error };
};

export default useStream;