import { useState, useEffect } from "react";

function MonitoringPage() {
  const [data, setData] = useState({
    temperature: 25,
    humidity: 60,
    light: 300,
  });

  // 가짜 데이터 업데이트 효과
  useEffect(() => {
    const interval = setInterval(() => {
      setData({
        temperature: Math.floor(20 + Math.random() * 10),
        humidity: Math.floor(50 + Math.random() * 20),
        light: Math.floor(200 + Math.random() * 200),
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-b from-green-50 to-green-100 min-h-screen flex flex-col items-center p-6">
      <h2 className="text-4xl font-extrabold text-green-700 flex items-center gap-2">
        📡 실시간 환경 모니터링
      </h2>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {[
          { icon: "🌡️", label: "온도", value: `${data.temperature}°C`, color: "text-red-500" },
          { icon: "💧", label: "습도", value: `${data.humidity}%`, color: "text-blue-500" },
          { icon: "☀️", label: "조도", value: `${data.light} lx`, color: "text-yellow-500" }
        ].map((sensor, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-green-300 flex flex-col items-center transition-transform transform hover:scale-105">
            <span className="text-5xl">{sensor.icon}</span>
            <p className="text-lg font-semibold text-gray-700 mt-2">{sensor.label}</p>
            <p className={`text-2xl font-bold ${sensor.color} animate-pulse`}>{sensor.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MonitoringPage;
