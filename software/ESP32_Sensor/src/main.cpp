#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>

//통신 헤더들
#include "MQTT_Control.h"
#include "Wifi_Control.h"

//센서 헤더들
#include "sensors/Sensor_DHT.h"
#include "sensors/Sensor_CDS.h"
#include "sensors/Sensor_MQ2.h"

//PIN 번호 설정
#define DHT_PIN 4
#define MQ2_PIN 32
#define CDS_PIN 35

// Wi-Fi 설정
const char* ssid = "ㅎㅎ";
const char* password = "gusdnrla";

// MQTT 설정
const char* mqtt_server = "3.106.192.39";
const int mqtt_port = 1883;

// 통신 객체 선언
WiFiClient espClient;
Wifi_Control wifiControl(ssid, password);
MQTT_Control mqttControl(espClient, mqtt_server, mqtt_port);

// 센서 데이터
Sensor_DHT dhtData(DHT_PIN);
Sensor_CDS cdsData(CDS_PIN);
Sensor_MQ2 mq2Data(MQ2_PIN);

// 최초 1번 실행
void setup() {
  Serial.begin(115200);
  
  wifiControl.connect();
  mqttControl.connect("ESP32_Client");

  dhtData.init_DHT(); // DHT 초기화
}

// 반복
void loop() {
  mqttControl.loop();

  delay(2000); // 2초마다 읽기

  dhtData.read();
  cdsData.read();
  mq2Data.read();

  // 테스트용 출력
  Serial.printf("습도: %d %%\t온도: %d °C\n", dhtData.getHumValue(), dhtData.getTempValue());
  Serial.printf("조도: %d\n", cdsData.getValue());
  Serial.printf("가스: %d\n", mq2Data.getValue());

  // MQTT로 전송
  mqttControl.publish("sensor/humidity/value", String(dhtData.getHumValue()).c_str());
  mqttControl.publish("sensor/temperature/value", String(dhtData.getTempValue()).c_str());
  mqttControl.publish("sensor/cds/value", String(cdsData.getValue()).c_str());
  mqttControl.publish("sensor/gas/value", String(mq2Data.getValue()).c_str());

  Serial.println("MQTT 메시지 전송 완료");
}
