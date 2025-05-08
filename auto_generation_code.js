const fs = require('fs');
const path = require('path');

// 디렉토리 및 파일 생성 함수
function createDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content.trim());
}

// 센서 C++ 코드 생성 함수
function generateSensorCode(sensorName, gpio) {
  return {
    cpp: `
#include <Arduino.h>

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

// 액추에이터 C++ 코드 생성 함수
function generateActuatorCode(actuatorName, gpio, statusTopic) {
  return {
    cpp: `
#include <Arduino.h>
#include "MQTT_Control.h"

void ${actuatorName}_on() {
  digitalWrite(${gpio}, HIGH);
  mqttControl.publish("${statusTopic}", "on");
}

void ${actuatorName}_off() {
  digitalWrite(${gpio}, LOW);
  mqttControl.publish("${statusTopic}", "off");
}

void ${actuatorName}_init(int pin) {
  pinMode(pin, OUTPUT);
}

void ${actuatorName}_manual(String cmd, int& mode) {
  if (cmd == "on") {
    mode = 1;
    ${actuatorName}_on();
  } else if (cmd == "off") {
    mode = 2;
    ${actuatorName}_off();
  } else if (cmd == "auto") {
    mode = 0;
  }
}`,
    h: `
#pragma once
void ${actuatorName}_on();
void ${actuatorName}_off();
void ${actuatorName}_init(int pin);
void ${actuatorName}_manual(String cmd, int& mode);`,
  };
}

// WiFi 제어 클래스 생성
function generateWifiControl() {
  return {
    cpp: `
#include <Arduino.h>
#include <WiFi.h>
#include "Wifi_Control.h"

Wifi_Control::Wifi_Control(const char* ssid, const char* password) : ssid(ssid), password(password) {}

void Wifi_Control::connect() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\\nWiFi connected");
}`,
    h: `
#pragma once
#include <WiFi.h>

class Wifi_Control {
private:
  const char* ssid;
  const char* password;
public:
  Wifi_Control(const char* ssid, const char* password);
  void connect();
};`,
  };
}

// MQTT 제어 클래스 생성
function generateMQTTControl() {
  return {
    cpp: `
#include "MQTT_Control.h"

MQTT_Control::MQTT_Control(WiFiClient& client, const char* server, int port)
  : mqtt(client) {
  mqtt.setServer(server, port);
}

void MQTT_Control::connect(const char* clientId) {
  while (!mqtt.connected()) {
    if (mqtt.connect(clientId)) {
      Serial.println("MQTT connected");
    } else {
      delay(1000);
    }
  }
}

void MQTT_Control::setCallback(MQTT_CALLBACK_SIGNATURE) {
  mqtt.setCallback(callback);
}

void MQTT_Control::loop() {
  mqtt.loop();
}

void MQTT_Control::subscribe(const char* topic) {
  mqtt.subscribe(topic);
}

void MQTT_Control::publish(const char* topic, const char* msg) {
  mqtt.publish(topic, msg);
}`,
    h: `
#pragma once

#include <PubSubClient.h>
#include <WiFiClient.h>

class MQTT_Control {
private:
  PubSubClient mqtt;
public:
  MQTT_Control(WiFiClient& client, const char* server, int port);
  void connect(const char* clientId);
  void setCallback(MQTT_CALLBACK_SIGNATURE);
  void loop();
  void subscribe(const char* topic);
  void publish(const char* topic, const char* msg);
};
extern MQTT_Control mqttControl;`,
  };
}

// ✅ 메인 자동화 코드 생성 함수
async function generateCode(email, pool) {
  const user = await pool.query(
    'SELECT user_id FROM users WHERE email = $1',
    [email]
  );

  if (!user.rows.length) {
    console.error('❌ 사용자 없음');
    return;
  }

  const userId = user.rows[0].user_id;

  const conditionsRes = await pool.query(`
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

  const output = './output';
  const sensorDir = path.join(output, 'sensors');
  const actuatorDir = path.join(output, 'actuators');
  createDir(sensorDir);
  createDir(actuatorDir);

  const includes = { sensor: '', actuator: '' };
  const init = { sensor: '', actuator: '' };
  let callback = '', loop = '', modeDecl = '';
  const subs = new Set();
  const usedNames = new Set();

  for (const row of conditionsRes.rows) {
    const sanitize = (str) => String(str).replace(/\s+/g, '_');
    const { sensor_name, sensor_pin, actuator_name, actuator_pin, threshold, trigger, farm_name, esp_name } = row;

    const sensorTopic = `${sanitize(farm_name)}/${sanitize(esp_name)}/sensor/${sanitize(sensor_name)}/value`;
    const actuatorTopic = `${sanitize(farm_name)}/${sanitize(esp_name)}/actuator/${sanitize(actuator_name)}/control`;
    const statusTopic = `${sanitize(farm_name)}/${sanitize(esp_name)}/actuator/${sanitize(actuator_name)}/status`;

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
      modeDecl += `int ${actuator_name}_mode = 0; // 0: AUTO, 1: ON, 2: OFF\n`;
      callback += `  if (String(topic) == "${actuatorTopic}") {\n`;
      callback += `    Serial.println("========== MQTT 수신 ==========");\n`;
      callback += `    Serial.print("수신된 토픽: "); Serial.println(topic);\n`;
      callback += `    Serial.print("수신된 메시지: "); Serial.println(message);\n`;
      callback += `    Serial.println("================================");\n`;
      callback += `    ${actuator_name}_manual(message, ${actuator_name}_mode);\n`;
      callback += `  }\n`;
      const { cpp, h } = generateActuatorCode(actuator_name, actuator_pin, statusTopic);
      writeFile(path.join(actuatorDir, `${actuator_name}.cpp`), cpp);
      writeFile(path.join(actuatorDir, `${actuator_name}.h`), h);
      subs.add(`  mqttControl.subscribe("${actuatorTopic}");\n`);
    }

    const cond = trigger === 'above' ? '>' : '<';
    loop += `  float ${sensor_name}_val = read_${sensor_name}();\n`;
    loop += `  if (${actuator_name}_mode == 0 && ${sensor_name}_val ${cond} ${threshold}) ${actuator_name}_on();\n`;
    loop += `  mqttControl.publish("${sensorTopic}", String(${sensor_name}_val).c_str());\n\n`;
  }

  const main = `
#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include "Wifi_Control.h"
#include "MQTT_Control.h"
${includes.sensor}${includes.actuator}

${modeDecl}

const char* ssid = "최혁진의 iPhone";
const char* password = "gurwlsdlWkd123";
const char* mqtt_server = "3.106.192.39";
const int mqtt_port = 1883;

WiFiClient espClient;
Wifi_Control wifiControl(ssid, password);
MQTT_Control mqttControl(espClient, mqtt_server, mqtt_port);

void callback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (unsigned int i = 0; i < length; i++) message += (char)payload[i];
${callback}}

void setup() {
  Serial.begin(115200);
${init.sensor}${init.actuator}  wifiControl.connect();
  mqttControl.connect("ESP32_Client");
${[...subs].join('')}  mqttControl.setCallback(callback);
}

void loop() {
  mqttControl.loop();
${loop}  delay(10000);
}`;

  writeFile(path.join(output, 'main.cpp'), main);
  const { cpp: wifiCpp, h: wifiH } = generateWifiControl();
  const { cpp: mqttCpp, h: mqttH } = generateMQTTControl();
  writeFile(path.join(output, 'Wifi_Control.cpp'), wifiCpp);
  writeFile(path.join(output, 'Wifi_Control.h'), wifiH);
  writeFile(path.join(output, 'MQTT_Control.cpp'), mqttCpp);
  writeFile(path.join(output, 'MQTT_Control.h'), mqttH);

  console.log('✅ 자동화 코드 생성 완료');
}

module.exports = { generateCode };