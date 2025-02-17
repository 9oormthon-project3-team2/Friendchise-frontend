import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance"; // axios 인스턴스 불러오기

const getNearestStore = async (requestData) => {
  try {
    const response = await axiosInstance.post("/nearest-store", requestData);
    return response.data; // 백엔드에서 반환한 storeAddress
  } catch (error) {
    console.error("Error fetching nearest store:", error);
    throw error;
  }
};

const RecommendationStore = () => {
  const [storeAddress, setStoreAddress] = useState("");
  const [inputData, setInputData] = useState({
    address: "",
    franchiseName: "",
  });

  const handleFindNearestStore = async () => {
    try {
      const result = await getNearestStore(inputData);
      setStoreAddress(result);
    } catch (error) {
      setStoreAddress(""); // 에러 발생 시 초기화
      alert("매장을 찾는 중 오류가 발생했습니다.");
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-3/4 max-w-xl">
        <h2 className="text-3xl font-semibold text-gray-900 mb-8 text-center">
          가장 가까운 매장 찾기
        </h2>
  
        <div className="space-y-8">
          {/* 주소 입력 */}
          <div className="relative">
            <input
              type="text"
              placeholder="주소를 입력하세요"
              value={inputData.address}
              onChange={(e) => setInputData({ ...inputData, address: e.target.value })}
              className="w-full py-4 px-5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg"
              size="50"
            />
          </div>
  
          {/* 프랜차이즈 이름 입력 */}
          <div className="relative">
            <input
              type="text"
              placeholder="프랜차이즈 이름을 입력하세요"
              value={inputData.franchiseName}
              onChange={(e) => setInputData({ ...inputData, franchiseName: e.target.value })}
              className="w-full py-4 px-5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg"
              size="50"
            />
          </div>
  
          {/* 매장 찾기 버튼 */}
          <button
            onClick={handleFindNearestStore}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300 text-lg font-semibold"
          >
            매장 찾기
          </button>
        </div>
  
        {/* 결과 표시 */}
        {storeAddress && (
          <p className="mt-6 text-center text-xl font-medium text-gray-800">
            가장 가까운 매장: {storeAddress}
          </p>
        )}
      </div>
    </div>
  );
  
};

export default RecommendationStore;