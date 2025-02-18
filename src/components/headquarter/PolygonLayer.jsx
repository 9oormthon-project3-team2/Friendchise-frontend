// PolygonLayer.js
import { useEffect } from 'react';

const { kakao } = window;

const PolygonLayer = ({ map, geojsonData }) => {
  useEffect(() => {
    if (!map || !geojsonData) return;

    geojsonData.features.forEach((feature) => {
      feature.geometry.coordinates.forEach((linearRing, index) => {
        if (index === 0) {
          // GeoJSON 좌표는 [lng, lat] 순서이므로 Kakao에서는 [lat, lng] 순서로 변환합니다.
          const path = linearRing.map(
            (coord) => new kakao.maps.LatLng(coord[1], coord[0]),
          );
          const polygon = new kakao.maps.Polygon({
            map: map,
            path: path,
            strokeWeight: 1,
            strokeColor: '#004c80',
            strokeOpacity: 0.8,
            fillColor: '#ccff99',
            fillOpacity: 0.7,
          });
        }
      });
    });
  }, [map, geojsonData]);

  return null;
};

export default PolygonLayer;
