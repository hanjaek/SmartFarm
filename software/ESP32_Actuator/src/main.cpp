#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>

// 통신 모듈
#include "MQTT_Control.h"
#include "Wifi_Control.h"

// 액추에이터 제어 모듈
#include "actuator/Led_Control.h"
#include "actuator/Fan_Control.h"
//#include "actuator/Water_Control.h"

#define LED_PIN    5
#define FAN_PIN    18
//#define WATER_PIN  19

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
    LedControl_Manual(message);
  } else if (String(topic) == "actuator/fan/control") {
    FanControl_Manual(message);
  }
  // else if (String(topic) == "actuator/water/control") {
  //   WaterControl_Manual(message);
  // }
}

void setup() {
  Serial.begin(115200);

  // 핀 초기화
  LedPin_set(LED_PIN);
  FanPin_set(FAN_PIN);
  // WaterPin_set(WATER_PIN);

  // 통신 연결
  wifiControl.connect();
  mqttControl.connect("ESP32_Client");
  mqttControl.setCallback(callback);  // mqttControl 안에서 client.setCallback() 호출되게
}

void loop() {
  mqttControl.loop();
}
