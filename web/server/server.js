require('dotenv').config(); // .env 파일 로드
const express = require('express');
const cors = require('cors');
const mqtt = require('mqtt');

// Express 서버 설정
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // CORS 활성화
app.use(express.json()); // JSON 요청 파싱

// MQTT 브로커 설정 (TLS 적용)
const MQTT_BROKER = 'mqtts://test.mosquitto.org';
const MQTT_TOPIC = 'smartfarm/DSE/light';

// MQTT 클라이언트 생성 (TLS 적용)
const mqttClient = mqtt.connect(MQTT_BROKER, {
  port: 8883,  // TLS 포트
  reconnectPeriod: 1000, // 1초마다 재연결 시도
  rejectUnauthorized: false, // 🔥 공용 브로커일 경우 필요하지만, 자체 브로커 사용 시 제거할 것
});

// ✅ MQTT 연결 상태 확인
mqttClient.on('connect', () => {
  console.log('✅ MQTT 연결 성공!');
  mqttClient.subscribe(MQTT_TOPIC, (err) => {
    if (err) {
      console.error('❌ MQTT 토픽 구독 실패:', err);
    } else {
      console.log(`📡 MQTT 토픽 구독 성공: ${MQTT_TOPIC}`);
    }
  });
});

// ❌ MQTT 연결 실패 시 처리
mqttClient.on('error', (err) => {
  console.error('❌ MQTT 연결 실패:', err);
});

// 🚨 연결이 끊겼을 때 자동 재연결 로직
mqttClient.on('close', () => {
  console.warn('⚠️ MQTT 연결이 끊어졌습니다. 다시 연결 시도 중...');
});

// 📩 ESP32에서 메시지를 받았는지 확인하는 로그
mqttClient.on('message', (topic, message) => {
  console.log(`📥 MQTT 메시지 수신 [${topic}]: ${message.toString()}`);
});

// 전구 상태 저장 변수
let isLightOn = false;

// 📌 전구 상태 조회 API
app.get('/light/status', (req, res) => {
  res.json({ status: isLightOn ? 'on' : 'off' });
});

// 📌 전구 ON/OFF 제어 API (MQTT 메시지 전송)
app.post('/light/toggle', (req, res) => {
  if (!mqttClient.connected) {
    return res.status(500).json({ error: 'MQTT 연결 실패, 다시 시도하세요. ' });
  }

  isLightOn = !isLightOn; // 상태 변경
  const message = isLightOn ? 'ON' : 'OFF';
  mqttClient.publish(MQTT_TOPIC, message, { qos: 1 }, (err) => {
    if (err) {
      console.error('❌ MQTT 메시지 전송 실패:', err);
      return res.status(500).json({ error: '전구 상태 변경 실패' });
    }
    console.log(`💡 전구 상태 변경: ${message}`);
    res.json({ status: isLightOn ? 'on' : 'off' });
  });
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`✅ 서버가 http://localhost:${PORT} 에서 실행 중!`);
});
