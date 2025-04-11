const mqtt = require('mqtt');

// Local MQTT broker (Raspberry Pi) - for communication with ESP32
const localMqttUrl = 'mqtt://localhost';
const localMqttClient = mqtt.connect(localMqttUrl);

// Cloud MQTT broker (CloudServer) - for communication with CloudServer
const cloudMqttUrl = 'mqtt://3.106.192.39:1883';
const cloudMqttClient = mqtt.connect(cloudMqttUrl);

// Topics
const controlTopic = 'esp32/control';               // CloudServer → RPi → ESP32
const dataTopic = 'esp32/led/status';               // ESP32 → RPi (sensor data)
const forwardTopic = 'actuator/led/status';         // RPi → CloudServer (forwarded sensor data)

// When connected to local MQTT broker
localMqttClient.on('connect', () => {
  console.log('✅ Connected to local MQTT broker (Raspberry Pi)');

  localMqttClient.subscribe(dataTopic, (err) => {
    if (!err) {
      console.log(`📡 Subscribed to ESP32 sensor data topic: ${dataTopic}`);
    } else {
      console.error(`❌ Failed to subscribe to local topic: ${err.message}`);
    }
  });
});

// When connected to cloud MQTT broker
cloudMqttClient.on('connect', () => {
  console.log('✅ Connected to Cloud MQTT broker (CloudServer)');

  cloudMqttClient.subscribe(controlTopic, (err) => {
    if (!err) {
      console.log(`📡 Subscribed to CloudServer control topic: ${controlTopic}`);
    } else {
      console.error(`❌ Failed to subscribe to cloud topic: ${err.message}`);
    }
  });
});

// Receive sensor data from ESP32 and forward to CloudServer
localMqttClient.on('message', (topic, message) => {
  if (topic === dataTopic) {
    const sensorData = message.toString();
    console.log(`📥 Received sensor data from ESP32: ${sensorData}`);

    cloudMqttClient.publish(forwardTopic, sensorData, (err) => {
      if (err) {
        console.error('❌ Failed to forward sensor data to CloudServer:', err.message);
      } else {
        console.log('✅ Sensor data forwarded to CloudServer successfully');
      }
    });
  }
});

// Receive control command from CloudServer and forward to ESP32
cloudMqttClient.on('message', (topic, message) => {
  if (topic === controlTopic) {
    const command = message.toString();
    console.log(`💡 Received control command from CloudServer: ${command}`);

    localMqttClient.publish(controlTopic, command, (err) => {
      if (err) {
        console.error('❌ Failed to forward command to ESP32:', err.message);
      } else {
        console.log('✅ Control command forwarded to ESP32');
      }
    });
  }
});

// Error handling
cloudMqttClient.on('error', (err) => {
  console.error('❌ Error connecting to Cloud MQTT broker:', err.message);
});

localMqttClient.on('error', (err) => {
  console.error('❌ Error connecting to Local MQTT broker:', err.message);
});