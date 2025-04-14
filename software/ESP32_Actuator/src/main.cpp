#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>

// 통신 모듈
#include "MQTT_Control.h"
#include "Wifi_Control.h"

// 액추에이터 제어 모듈
#include "Led_Control.h"

// Wi-Fi 설정
const char* ssid = "최혁진의 iPhone";
const char* password = "gurwlsdlWkd123";

// MQTT 설정
const char* mqtt_server = "172.20.10.2";
const int mqtt_port = 1883;

// 통신 객체 선언
WiFiClient espClient;
Wifi_Control wifiControl(ssid, password);
MQTT_Control mqttControl(espClient, mqtt_server, mqtt_port);

// MQTT 메시지 수신 콜백
void callback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (unsigned int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  Serial.print("수신된 메시지 [");
  Serial.print(topic);
  Serial.print("]: ");
  Serial.println(message);

  if (String(topic) == "actuator/led/control") {
    handleLedControl(message);
  }
}

void setup() {
  Serial.begin(115200);

  pin_set(5);  // LED 핀 설정 (D5)

  wifiControl.connect();
  mqttControl.connect("ESP32_Client");
  client.setCallback(callback);
}

void loop() {
  mqttControl.loop();
}
