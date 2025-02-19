import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Input } from "@chakra-ui/react";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41], // 마커 아이콘 크기
  iconAnchor: [12, 41], // 마커의 기준점
  popupAnchor: [1, -34], // 팝업 위치 조정
});
const getNearestStore = async (requestData) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    if (!accessToken) {
      alert("토큰이 없습니다");
      return;
    }
    const { address, franchiseName } = requestData;
    const response = await axiosInstance.get(`/customer/nearest-store?address=${address}&franchiseName=${franchiseName}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data; // 백엔드에서 반환한 storeAddress
  } catch (error) {
    console.error("Error fetching nearest store:", error);
    throw error;
  }
};

const RecommendationStore = () => {
  const [storeAddress, setStoreAddress] = useState("");
  const [storePosition, setStorePosition] = useState(null);
  const [inputData, setInputData] = useState({ address: "", franchiseName: "" });

  const handleFindNearestStore = async () => {
    try {
      const result = await getNearestStore(inputData);
      setStoreAddress(result);

      // 주소를 좌표로 변환 (Geocoding)
      const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(result)}`;
      const response = await fetch(geocodeUrl);
      const data = await response.json();

      if (data.length > 0) {
        setStorePosition({ lat: data[0].lat, lng: data[0].lon });
      } else {
        alert("주소를 찾을 수 없습니다.");
      }
    } catch (error) {
      setStoreAddress("");
      setStorePosition(null);
      alert(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-3/4 max-w-xl">
        <div className="space-y-6 p-6 bg-white rounded-2xl shadow-lg w-full max-w-lg">
            {/* 매장 찾기 버튼 */}
  <button
    onClick={handleFindNearestStore}
    className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl text-lg font-semibold shadow-md transition-all hover:bg-blue-700 hover:shadow-lg active:scale-95"
  >
    🔍 매장 찾기
  </button>
  {/* 주소 입력 */}
  <div className="relative">
    <Input
      type="text"
      placeholder="📍 주소를 입력하세요"
      value={inputData.address}
      onChange={(e) => setInputData({ ...inputData, address: e.target.value })}
      className="w-full py-3 px-5 border border-gray-300 rounded-xl shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    />
  </div>

  {/* 프랜차이즈 이름 입력 */}
  <div className="relative">
    <Input
      type="text"
      placeholder="🏪 프랜차이즈 이름을 입력하세요"
      value={inputData.franchiseName}
      onChange={(e) => setInputData({ ...inputData, franchiseName: e.target.value })}
      className="w-full py-3 px-5 border border-gray-300 rounded-xl shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    />
  </div>

</div>


        {storeAddress && (
          <p className="mt-6 text-center text-xl font-medium text-gray-800">
            가장 가까운 매장: {storeAddress}
          </p>
        )}

{storePosition && (
  <div className="mt-6">
    <MapContainer center={storePosition} zoom={15} style={{ height: "300px", width: "50%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={storePosition} icon={customIcon}>
        <Popup>{storeAddress}</Popup>
      </Marker>
    </MapContainer>
  </div>
)}
      </div>
    </div>
  );
};

export default RecommendationStore;