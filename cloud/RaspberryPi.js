const mqtt = require('mqtt');
const axios = require('axios');
const express = require('express');

const app = express();  // Express 애플리케이션 정의
const PORT = 8080; // RPI HTTP 포트

app.use(express.json());

// 1. RaspberryPi의 MQTT 브로커 연결 설정 (ESP32와 통신)
// ESP32가 publish하는 센서 데이터 수신용 (local broker)
const localMqttUrl = 'mqtt://localhost';  // RaspberryPi의 자체 브로커커
const localMqttClient = mqtt.connect(localMqttUrl);


const controlTopic = 'esp32/control'; // CloudServer -> RPi -> ESP32 제어명령 토픽
const dataTopic = 'esp32/led/status'; // ESP32 -> RPi (led 센서 상태 데이터) actuator/led/status로 수정할것

// 2. CloudServer의 MQTT 브로커 연결 설정
// CloudServer로부터 제어 명령 수신용 (cloud broker)
const cloudMqttUrl = 'mqtt://3.107.186.17:1883';  // CloudServer의 MQTT 브로커
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

  cloudMqttClient.subscribe(controlTopic, (err) => {
    if (!err) {
      console.log(`📡 CloudServer 제어 토픽 구독 중: ${controlTopic}`);
    } else {
      console.error(`❌ 제어 토픽 구독 실패: ${err.message}`);
    }
  });
});

// 센서 데이터 수신 시  MQTT를 사용해서 Cloud Server로 전달
localMqttClient.on('message', (topic, message) => {
  if (topic === dataTopic) {
    const sensorData = message.toString();
    console.log(`📥 ESP32로부터 센서 데이터 수신: ${sensorData}`);

    // 👉 MQTT로 CloudServer에 센서 데이터 전송
    cloudMqttClient.publish('actuator/led/status', sensorData, (err) => {
      if (err) {
        console.error('❌ 센서 데이터 MQTT 전송 실패:', err.message);
      } else {
        console.log('✅ CloudServer로 센서 데이터 MQTT 전송 성공');
      }
    });
  }
});


// 제어 명령 수신 시 처리
cloudMqttClient.on('message', (topic, message) => {
  console.log(`💡 수신한 topic: ${topic}`);
  console.log(`💬 메시지 내용: ${message.toString()}`);
  if (topic === controlTopic) {
    const command = message.toString();
    console.log(`💡 제어 명령 수신됨 (MQTT): ${command}`);

    // 👉 ESP32에게 제어 명령 다시 전달 (로컬 브로커)
    localMqttClient.publish(controlTopic, command);
  }
});

cloudMqttClient.on('error', (err) => {
  console.error('❌ CloudServer MQTT 연결 실패:', err.message);
});

localMqttClient.on('error', (err) => {
  console.error('❌ Local MQTT 연결 실패:', err.message);
});


// Raspberry Pi에서 HTTP 서버 실행
app.listen(PORT, () => {
  console.log(`🌐 Raspberry Pi HTTP 제어 서버 실행 중: http://localhost:${PORT}`);
});