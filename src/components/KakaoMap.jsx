import { useEffect, useState, useRef } from 'react';

const { kakao } = window;

const KakaoMap = ({ setCoords }) => {
  const mapCenter = new kakao.maps.LatLng(
    37.571680186686756,
    126.97663594996186,
  );
  const mapLevel = 3;
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) {
      console.error('Kakao Maps API is not loaded.');
      return;
    }
    const container = document.getElementById('map');
    const options = {
      center: mapCenter,
      level: mapLevel,
    };

    // 지도는 마운트 시 한 번만 생성합니다.
    const map = new kakao.maps.Map(container, options);
    mapRef.current = map;

    // 줌 컨트롤 추가
    const zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

    // 지도 클릭 이벤트 등록
    kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
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
        newMarker.setMap(map);
        markerRef.current = newMarker;
      }

      // 결과 메시지 표시
      const message = `클릭한 위치의 위도는 ${latlng.getLat()} 이고, 경도는 ${latlng.getLng()} 입니다`;
      const resultDiv = document.getElementById('clickLatlng');
      if (resultDiv) {
        resultDiv.innerHTML = message;
      }
    });
  }, []); // 빈 배열: 마운트 시 한 번만 실행

  return (
    <>
      <div id="map" style={{ width: '500px', height: '500px' }}></div>
      <div id="clickLatlng" style={{ marginTop: '10px' }}></div>
    </>
  );
};

export default KakaoMap;
