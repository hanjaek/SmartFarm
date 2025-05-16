const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const generateTopics = require('./services/topicGenerator');

const db = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'SmartFarm',
  password: '1234',
  port: 5432,
});
db.connect();

function createDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content.trim());
}

function generateSensorCode(sensorName, gpio) {
  return {
    cpp: `
float read_${sensorName}() {
  return analogRead(${gpio});
}

void ${sensorName}_init(int pin) {
  pinMode(pin, INPUT);
}`,
    h: `
#pragma once
float read_${sensorName}();
void ${sensorName}_init(int pin);`,
  };
}

function generateActuatorCode(actuatorName, gpio) {
  return {
    cpp: `
void ${actuatorName}_on() {
  digitalWrite(${gpio}, HIGH);
  uint8_t onMsg = 0x01;
  mqtt.publish(statusTopic, &onMsg, 1);
}

void ${actuatorName}_off() {
  digitalWrite(${gpio}, LOW);
  uint8_t offMsg = 0x00;
  mqtt.publish(statusTopic, &offMsg, 1);
}

void ${actuatorName}_init(int pin) {
  pinMode(pin, OUTPUT);
}

void ${actuatorName}_manual(uint8_t cmd, int& mode) {
  if (cmd == 0x01) {
    mode = 1;
    ${actuatorName}_on();
  } else if (cmd == 0x00) {
    mode = 2;
    ${actuatorName}_off();
  } else if (cmd == 0xFF) {
    mode = 0;
    uint8_t autoMsg = 0xFF;
    mqtt.publish(statusTopic, &autoMsg, 1);
  }
}`,
    h: `
#pragma once
#include <Arduino.h>
void ${actuatorName}_on();
void ${actuatorName}_off();
void ${actuatorName}_init(int pin);
void ${actuatorName}_manual(uint8_t cmd, int& mode);`,
  };
}

async function generateCode(email) {
  const user = await db.query('SELECT user_id FROM users WHERE email = $1', [email]);
  if (!user.rows.length) return console.error('❌ 사용자 없음');

  const userId = user.rows[0].user_id;
  const conditionsRes = await db.query(`
    SELECT 
      c.threshold, c.trigger,
      s.sensor_name, s.gpio_pin AS sensor_pin,
      a.actuator_name, a.gpio_pin AS actuator_pin,
      f.farm_name, e.esp_name
    FROM automation_conditions c
    JOIN sensors s ON c.sensor_id = s.sensor_id
    JOIN actuators a ON c.actuator_id = a.actuator_id
    JOIN esps e ON s.esp_id = e.esp_id
    JOIN farms f ON e.farm_id = f.farm_id
    WHERE c.user_id = $1
  `, [userId]);

  const output = './output2';
  const sensorDir = path.join(output, 'sensors');
  const actuatorDir = path.join(output, 'actuators');
  createDir(sensorDir);
  createDir(actuatorDir);

  const includes = { sensor: '', actuator: '' };
  const init = { sensor: '', actuator: '' };
  let callbacks = '', taskLoop = '', modeDecl = '', subs = '';
  const usedNames = new Set();

  for (const row of conditionsRes.rows) {
    const sensor_name = row.sensor_name;
    const sensor_pin = row.sensor_pin;
    const actuator_name = row.actuator_name;
    const actuator_pin = row.actuator_pin;
    const threshold = row.threshold;
    const trigger = row.trigger;
    const farm_name = typeof row.farm_name === 'string' ? row.farm_name : row.farm_name.name;
    const esp_name = typeof row.esp_name === 'string' ? row.esp_name : row.esp_name.name;

    const sensorTopic = `${farm_name}/${esp_name}/sensor/${sensor_name}/value`;
    const actuatorTopic = `${farm_name}/${esp_name}/actuator/${actuator_name}/control`;
    const statusTopic = `${farm_name}/${esp_name}/actuator/${actuator_name}/status`;

    if (!usedNames.has(sensor_name)) {
      usedNames.add(sensor_name);
      includes.sensor += `#include "sensors/${sensor_name}.h"\n`;
      init.sensor += `  ${sensor_name}_init(${sensor_pin});\n`;
      const { cpp, h } = generateSensorCode(sensor_name, sensor_pin);
      writeFile(path.join(sensorDir, `${sensor_name}.cpp`), cpp);
      writeFile(path.join(sensorDir, `${sensor_name}.h`), h);
    }

    if (!usedNames.has(actuator_name)) {
      usedNames.add(actuator_name);
      includes.actuator += `#include "actuators/${actuator_name}.h"\n`;
      init.actuator += `  ${actuator_name}_init(${actuator_pin});\n`;
      modeDecl += `int ${actuator_name}_mode = 0;\n`;
      callbacks += `  if (topic == "${actuatorTopic}") ${actuator_name}_manual(payload[0], ${actuator_name}_mode);\n`;
      const { cpp, h } = generateActuatorCode(actuator_name, actuator_pin);
      writeFile(path.join(actuatorDir, `${actuator_name}.cpp`), cpp);
      writeFile(path.join(actuatorDir, `${actuator_name}.h`), h);
      subs += `  mqtt.setCallback("${actuatorTopic}", onMessageReceived);\n`;
    }

    const cond = trigger === 'above' ? '>' : '<';
    taskLoop += `    float ${sensor_name}_val = read_${sensor_name}();\n`;
    taskLoop += `    if (${actuator_name}_mode == 0 && ${sensor_name}_val ${cond} ${threshold}) ${actuator_name}_on();\n`;
    taskLoop += `    char buf[16];\n    snprintf(buf, sizeof(buf), "%.2f", ${sensor_name}_val);\n    mqtt.publish("${sensorTopic}", (uint8_t*)buf, strlen(buf));\n\n`;
  }

  const main = `
#include <Arduino.h>
#include <WiFi.h>
#include <WiFiUDP.h>
#include "MqttSnClient.h"
#include "DHT.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
${includes.sensor}${includes.actuator}

${modeDecl}

const char* ssid = "김한재의 iPhone";
const char* password = "25120816";
IPAddress mqttBroker(192, 168, 0, 100);
uint16_t mqttPort = 1884;
WiFiUDP udp;
MqttSnClient mqtt(udp);

void onMessageReceived(const uint8_t* payload, uint16_t len, const char* topic) {
${callbacks}}

void sensorTask(void* param) {
  while (1) {
${taskLoop}    vTaskDelay(10000 / portTICK_PERIOD_MS);
  }
}

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) delay(500);
  mqtt.begin("ESP32_Client", mqttBroker, mqttPort);
${init.sensor}${init.actuator}${subs}  xTaskCreate(sensorTask, "SensorTask", 4096, NULL, 1, NULL);
}

void loop() {
  mqtt.loop();
}
`;
  writeFile(path.join(output, 'main.cpp'), main);
  console.log('✅ 자동화 코드 생성 완료');
}

generateCode('test@example.com');