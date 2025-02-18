import { useEffect, useState, useRef } from 'react';

const { kakao } = window;

const KakaoMap = ({ setCoords }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) {
      console.error('Kakao Maps API is not loaded.');
      return;
    }

    const mapCenter = new kakao.maps.LatLng(
      37.571680186686756,
      126.97663594996186,
    );
    const options = {
      center: mapCenter,
      level: 3,
    };

    // 지도는 마운트 시 한 번만 생성합니다.
    if (!mapRef.current) {
      const map = new kakao.maps.Map(containerRef.current, options);
      mapRef.current = map;
    }

    // 줌 컨트롤 추가
    const zoomControl = new kakao.maps.ZoomControl();
    mapRef.current.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

    // 지도 클릭 이벤트 등록
    kakao.maps.event.addListener(
      mapRef.current,
      'click',
      function (mouseEvent) {
        const latlng = mouseEvent.latLng;
        setCoords({
          lat: latlng.getLat(),
          lng: latlng.getLng(),
        });

        // 마커가 있으면 위치만 이동, 없으면 생성
        if (markerRef.current) {
          markerRef.current.setPosition(latlng);
        } else {
          const newMarker = new kakao.maps.Marker({
            position: latlng,
          });
          newMarker.setMap(mapRef.current);
          markerRef.current = newMarker;
        }

        // 결과 메시지 표시
        const message = `클릭한 위치의 위도는 ${latlng.getLat()} 이고, 경도는 ${latlng.getLng()} 입니다`;
        const resultDiv = document.getElementById('clickLatlng');
        if (resultDiv) {
          resultDiv.innerHTML = message;
        }
      },
    );
  }, []); // 빈 배열: 마운트 시 한 번만 실행

  return (
    <>
      <div style={{ width: '500px', height: '500px' }} ref={containerRef}></div>
      <div id="clickLatlng" style={{ marginTop: '10px' }}></div>
    </>
  );
};

export default KakaoMap;
