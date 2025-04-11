require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mqtt = require('mqtt');

const app = express();
const port = process.env.PORT || 15023;

app.use(cors());
app.use(express.json());

// MQTT 브로커 주소 (Mosquitto가 localhost에서 실행 중)
const mqttBrokerUrl = 'mqtt://localhost:1883';

// MQTT 토픽
const controlTopic = 'esp32/control';               // 서버 → RPi 제어
const sensorDataTopic = 'actuator/led/status';      // RPi → 서버 센서 데이터

// MQTT 클라이언트 연결
const mqttClient = mqtt.connect(mqttBrokerUrl);

mqttClient.on('connect', () => {
  console.log('✅ CloudServer MQTT 클라이언트가 Mosquitto에 연결됨');

  mqttClient.subscribe(sensorDataTopic, (err) => {
    if (!err) {
      console.log(`📡 센서 데이터 토픽 구독 중: ${sensorDataTopic}`);
    } else {
      console.error('❌ 센서 데이터 토픽 구독 실패:', err.message);
    }
  });
});

mqttClient.on('error', (err) => {
  console.error('❌ MQTT 연결 오류:', err.message);
});

// 전구 상태 변수
let isLightOn = false;
let latestSensorData = null;  // 센서 데이터 저장 변수

// 로그인 처리
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === '1234') {
    res.status(200).json({ success: true, role: 'admin' });
  } else if (username === 'user' && password === '1234') {
    res.status(200).json({ success: true, role: 'user' });
  } else {
    res.status(401).json({ success: false, message: '로그인 실패: 아이디 또는 비밀번호가 틀렸습니다.' });
  }
});

/**
 * 📩 Raspberry Pi → CloudServer: 센서 데이터 수신 (HTTP 방식)
 */
app.post('/data', (req, res) => {
  const { sensorData } = req.body;
  console.log('📨 Raspberry Pi에서 받은 데이터:', sensorData);
  res.sendStatus(200);
});

/**
 * 🔦 전구 상태 확인
 */
app.get('/light/status', (req, res) => {
  res.json({ status: isLightOn ? 'on' : 'off' });
});

/**
 * 💡 전구 제어 요청 → MQTT로 제어 명령 publish
 */
app.post('/light/toggle', (req, res) => {
  const { lightStatus } = req.body;
  console.log('📥 사용자로부터 전구 제어 요청 수신됨');
  console.log(`💡 요청된 lightStatus: ${lightStatus}`);

  if (!lightStatus || (lightStatus !== 'ON' && lightStatus !== 'OFF')) {
    return res.status(400).json({ error: '유효하지 않은 lightStatus 값입니다. (ON 또는 OFF)' });
  }

  mqttClient.publish(controlTopic, lightStatus, (err) => {
    if (err) {
      console.error('❌ MQTT publish 실패:', err.message);
      return res.status(500).json({ error: 'MQTT 전송 실패' });
    }
    console.log(`📤 RaspberryPi로 MQTT 제어 명령 전송됨: ${lightStatus}`);
    res.json({ lightStatus });
  });
});

/**
 * ✅ MQTT로 수신된 센서 데이터 저장
 */
mqttClient.on('message', (topic, message) => {
  if (topic === sensorDataTopic) {
    latestSensorData = message.toString();
    console.log('📨 MQTT 센서 데이터 수신:', latestSensorData);
  }
});

/**
 * ✅ 사용자 요청 시 최신 센서 데이터 제공
 */
app.get('/actuator/led/status', (req, res) => {
  console.log("📡 Client requested latest sensor data");  // 로그 확인용

  if (latestSensorData) {
    res.json({ sensorData: latestSensorData });
  } else {
    res.status(404).json({ error: 'No sensor data available yet.' });
  }
});


// ✅ 서버 실행
app.listen(port, () => {
  console.log(`🌐 CloudServer HTTP 서버 실행 중: http://localhost:${port}`);
});