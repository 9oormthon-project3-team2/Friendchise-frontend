import { useEffect } from 'react';

const { kakao } = window;

const KakaoMap = () => {
  useEffect(() => {
    // window.kakao 객체가 로드되었는지 확인
    if (!window.kakao || !window.kakao.maps) {
      console.error('Kakao Maps API is not loaded.');
      return;
    }

    const container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
    const options = {
      //지도를 생성할 때 필요한 기본 옵션
      center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
      level: 3, //지도의 레벨(확대, 축소 정도)
    };

    const map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
    // 지도 중심 좌표에 마커 생성 및 지도에 추가
    const marker = new kakao.maps.Marker({
      position: map.getCenter(),
    });
    marker.setMap(map);

    // 지도에 클릭 이벤트 등록
    kakao.maps.event.addListener(
      map,
      'click',
      function (mouseEvent) {
        // 클릭한 위도, 경도 정보를 가져옵니다.
        var latlng = mouseEvent.latLng;

        // 마커 위치를 클릭한 위치로 옮깁니다.
        marker.setPosition(latlng);

        // 클릭한 위치의 좌표 정보를 문자열로 구성
        var message = '클릭한 위치의 위도는 ' + latlng.getLat() + ' 이고, ';
        message += '경도는 ' + latlng.getLng() + ' 입니다';

        // 결과를 표시할 DOM 요소 선택 후 내용 업데이트
        var resultDiv = document.getElementById('clickLatlng');
        if (resultDiv) {
          resultDiv.innerHTML = message;
        }
      },
      [],
    );
  });

  return (
    <>
      <div id="map" style={{ width: '500px', height: '500px' }}></div>
      {/* 클릭 결과를 출력할 영역 */}
      <div id="clickLatlng" style={{ marginTop: '10px' }}></div>
    </>
  );
};

export default KakaoMap;
