// src/pages/user/UserSampleData.js
const userSampleData = {
    crop: "상추",
    growthStage: "성장기",
    expectedHarvest: "2025-04-20",
    alerts: ["토양 수분 부족", "온도 상승 주의"],
    deviceStatus: {
      light: "OFF",
      water: "ON",
      fan: "OFF",
    },
    sensorData: [
      { date: "04-01", temperature: 22, humidity: 50, moisture: 58 },
      { date: "04-02", temperature: 23, humidity: 52, moisture: 60 },
      { date: "04-03", temperature: 25, humidity: 54, moisture: 57 },
      { date: "04-04", temperature: 24, humidity: 53, moisture: 54 },
      { date: "04-05", temperature: 26, humidity: 55, moisture: 52 },
      { date: "04-06", temperature: 24, humidity: 56, moisture: 50 },
      { date: "04-07", temperature: 23, humidity: 58, moisture: 48 },
    ],
    todayData: {
      labels: ["08시", "10시", "12시", "14시", "16시", "18시"],
      temperature: [21, 22, 24, 25, 24, 22],
      humidity: [60, 61, 63, 64, 62, 60],
      moisture: [65, 63, 60, 58, 55, 53],
    },
  };
  
  export default userSampleData;
  