import { useState, useEffect } from "react";

function ControlPage() {
  const [lightStatus, setLightStatus] = useState("off"); // 전구 상태
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지

  // 전구 상태 가져오기
  useEffect(() => {
    fetch("http://localhost:5000/light/status")
      .then((res) => res.json())
      .then((data) => setLightStatus(data.status))
      .catch((err) => console.error("전구 상태 가져오기 실패:", err));
  }, []);

  // 전구 ON/OFF 토글 함수
  const toggleLight = () => {
    setErrorMessage(""); // 에러 메시지 초기화

    fetch("http://localhost:5000/light/toggle", { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "on" || data.status === "off") {
          setLightStatus(data.status); // 상태 업데이트
        } else {
          setErrorMessage("⚠️ 전구 상태 변경 실패! 서버와 연결을 확인하세요.");
        }
      })
      .catch(() => setErrorMessage("⚠️ 전구 제어 요청 실패! 네트워크를 확인하세요."));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">💡 전구 제어</h1>

      {/* 전구 상태 표시 */}
      <div className="text-6xl">
        {lightStatus === "on" ? "💡" : "🔅"}
      </div>
      <p className="text-lg font-semibold mt-2">
        현재 상태: {lightStatus === "on" ? "켜짐" : "꺼짐"}
      </p>

      {/* 전구 ON/OFF 버튼 */}
      <button
        onClick={toggleLight}
        className="mt-4 px-6 py-3 text-lg font-bold rounded-lg shadow-lg 
                  transition-transform transform hover:scale-105
                  text-white bg-green-500 hover:bg-green-600"
      >
        {lightStatus === "on" ? "전구 끄기" : "전구 켜기"}
      </button>

      {/* 에러 메시지 표시 */}
      {errorMessage && (
        <p className="mt-4 text-red-600 font-semibold">{errorMessage}</p>
      )}
    </div>
  );
}

export default ControlPage;
