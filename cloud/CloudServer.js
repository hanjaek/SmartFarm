require('dotenv').config();
const express = require('express');
const cors = require('cors');
const aedes = require('aedes')();  // Aedes MQTT 브로커
const mqtt = require('mqtt');
const net = require('net');

const app = express();
const port = process.env.PORT || 15023;

app.use(cors());
app.use(express.json());

// Aedes MQTT 브로커 설정
const mqttPort = 1883; // MQTT 포트 설정
const server = net.createServer(aedes.handle);  // Aedes 브로커 서버
server.listen(mqttPort, function () {
  console.log(`✅ Aedes MQTT 브로커가 ${mqttPort} 포트에서 실행 중입니다.`);
});

// CloudServer의 MQTT 클라이언트 설정 (Aedes 브로커에 연결)
const controlTopic = 'esp32/control';
const mqttClient = mqtt.connect(`mqtt://localhost:${mqttPort}`);  // Aedes 브로커에 연결

mqttClient.on('connect', () => {
  console.log('✅ CloudServer MQTT 클라이언트가 Aedes 브로커에 연결됨');
});

mqttClient.on('error', (err) => {
  console.error('❌ MQTT 연결 오류:', err.message);
});

// 전구 상태 변수
let isLightOn = false;

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
 * 📩 Raspberry Pi → CloudServer: 센서 데이터 수신
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

// ✅ 서버 실행
app.listen(port, () => {
  console.log(`🌐 CloudServer HTTP 서버 실행 중: http://localhost:${port}`);
});