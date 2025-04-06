const client = require('./db');

const insertSensorData = async (device_id, temperature, humidity) => {
  const query = `
    INSERT INTO dht11_data (time, device_id, temperature, humidity)
    VALUES (NOW(), $1, $2, $3)
  `;
  const values = [device_id, temperature, humidity];

  try {
    await client.query(query, values);
    console.log(`✅ 저장: ${device_id} - ${temperature}°C / ${humidity}%`);
  } catch (err) {
    console.error('❌ 데이터 저장 실패', err);
  }
};

// 1초마다 1개씩, 총 30개 랜덤 데이터 삽입
let count = 0;
const maxCount = 30;

const interval = setInterval(async () => {
  const temp = (Math.random() * 5 + 22).toFixed(1);    
  const humid = (Math.random() * 10 + 45).toFixed(1);   
  await insertSensorData('sensor01', parseFloat(temp), parseFloat(humid));

  count++;
  if (count >= maxCount) {
    clearInterval(interval);
    client.end();
    console.log('🏁 데이터 삽입 완료 및 DB 연결 종료');
  }
}, 1000); 
