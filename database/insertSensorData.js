const client = require('./db');

// 센서 데이터 삽입 함수
const insertSensorData = async (device_id, {
  temperature = null,
  humidity = null,
  soil = null,
  co2 = null,
  light = null
}) => {
  const query = `
    INSERT INTO sensor_logs (time, device_id, temperature, humidity, soil_moisture, gas, light)
    VALUES (NOW(), $1, $2, $3, $4, $5, $6)
  `;
  const values = [device_id, temperature, humidity, soil, co2, light];

  try {
    await client.query(query, values);
    console.log(`✅ 저장: device_id=${device_id} | T=${temperature}°C H=${humidity}% S=${soil}% CO₂=${co2}ppm L=${light} lux`);
  } catch (err) {
    console.error('❌ 데이터 저장 실패', err);
  }
};

// 1초마다 센서별 랜덤 데이터 삽입 (30회 반복)
let count = 0;
const maxCount = 30;

const interval = setInterval(async () => {
  // 랜덤 데이터 생성
  const temperature = parseFloat((Math.random() * 5 + 22).toFixed(1));  // 22~27℃
  const humidity = parseFloat((Math.random() * 10 + 45).toFixed(1));    // 45~55%
  const soil = parseFloat((Math.random() * 100).toFixed(1));            // 0~100%
  const co2 = parseFloat((Math.random() * 500 + 400).toFixed(0));       // 400~900 ppm
  const light = parseFloat((Math.random() * 1000).toFixed(0));          // 0~1000 lux

  // DHT-11 → 온습도
  await insertSensorData(1, { temperature, humidity });

  // MQ2 → 가스
  await insertSensorData(2, { co2 });

  // CDS → 조도
  await insertSensorData(3, { light });

  count++;
  if (count >= maxCount) {
    clearInterval(interval);
    client.end();
    console.log('🏁 센서 데이터 삽입 완료 및 DB 연결 종료');
  }
}, 1000);
