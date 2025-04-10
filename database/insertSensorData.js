const client = require('./db');

// ✅ 센서 데이터 삽입 함수
const insertSensorData = async (device_id, {
  temperature = null,
  humidity = null,
  light = null,
  soil = null,
  co2 = null
}) => {
  const query = `
    INSERT INTO sensor_data (time, device_id, temperature, humidity, light, soil, co2)
    VALUES (NOW(), $1, $2, $3, $4, $5, $6)
  `;
  const values = [device_id, temperature, humidity, light, soil, co2];

  try {
    await client.query(query, values);
    console.log(`✅ 저장: device_id=${device_id} | T=${temperature}°C H=${humidity}% L=${light} S=${soil} CO2=${co2}`);
  } catch (err) {
    console.error('❌ 데이터 저장 실패', err);
  }
};

// ✅ 1초마다 랜덤 센서 데이터 삽입 (30회)
let count = 0;
const maxCount = 30;

const interval = setInterval(async () => {
  const temperature = parseFloat((Math.random() * 5 + 22).toFixed(1));  // 22~27도
  const humidity = parseFloat((Math.random() * 10 + 45).toFixed(1));    // 45~55%
  const light = parseFloat((Math.random() * 1000).toFixed(0));          // 0~1000 Lux
  const soil = parseFloat((Math.random() * 100).toFixed(1));            // 0~100%
  const co2 = parseFloat((Math.random() * 500 + 400).toFixed(0));       // 400~900 ppm

  await insertSensorData(1, { temperature, humidity, light, soil, co2 });  // device_id = 1

  count++;
  if (count >= maxCount) {
    clearInterval(interval);
    client.end();
    console.log('🏁 데이터 삽입 완료 및 DB 연결 종료');
  }
}, 1000);
