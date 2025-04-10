const mqtt = require('mqtt');
const axios = require('axios');
const express = require('express');

const app = express();  // Express 애플리케이션 정의
const PORT = 8080; // RPI HTTP 포트

app.use(express.json());

// 1. RaspberryPi의 MQTT 브로커 연결 설정 (ESP32와 통신)
const localMqttUrl = 'mqtt://localhost';  // RaspberryPi의 자체 브로커
const controlTopic = 'esp32/control';
const dataTopic = 'esp32/testdata';
const localMqttClient = mqtt.connect(localMqttUrl);

// 2. CloudServer의 MQTT 브로커 연결 설정
const cloudMqttUrl = 'mqtt://116.124.191.174:1883';  // CloudServer의 MQTT 브로커
const cloudMqttClient = mqtt.connect(cloudMqttUrl);

// 1. RaspberryPi의 MQTT 브로커 연결 성공 시
localMqttClient.on('connect', () => {
  console.log('✅ RaspberryPi MQTT 브로커 연결됨');
  localMqttClient.subscribe(dataTopic, (err) => {
    if (!err) {
      console.log(`📡 ESP32 센서 데이터 구독 중: ${dataTopic}`);
    } else {
      console.error(`❌ 구독 실패: ${err.message}`);
    }
  });
});

// 2. CloudServer의 MQTT 브로커 연결 성공 시
cloudMqttClient.on('connect', () => {
  console.log('✅ CloudServer MQTT 브로커 연결됨');
});

// 센서 데이터 수신 시 Cloud Server로 전달
localMqttClient.on('message', async (topic, message) => {
  if (topic === dataTopic) {
    const sensorData = message.toString();
    console.log(`📥 ESP32로부터 센서 데이터 수신: ${sensorData}`);
    try {
      const res = await axios.post('http://116.124.191.174:15023/data', { sensorData });
      console.log('✅ Cloud 서버에 센서 데이터 전송 성공:', res.status);
    } catch (error) {
      console.error('❌ Cloud 서버 전송 실패:', error.message);
    }
  }
});

// 제어 명령 수신 시 처리
cloudMqttClient.on('message', (topic, message) => {
  console.log(`💡 수신한 topic: ${topic}`);  // 수신한 topic을 출력
  console.log(`💬 메시지 내용: ${message.toString()}`);  // 수신한 메시지 출력
  if (topic === controlTopic) {
    const command = message.toString();
    console.log(`💡 제어 명령 수신됨 (MQTT): ${command}`);
    // 'ON' 또는 'OFF' 명령을 처리하는 코드 작성
  }
});

// Raspberry Pi에서 HTTP 서버 실행
app.listen(PORT, () => {
  console.log(`🌐 Raspberry Pi HTTP 제어 서버 실행 중: http://localhost:${PORT}`);
});