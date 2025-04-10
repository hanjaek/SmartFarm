#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>

#include "Sensor_DHT.h"
#include "Sensor_CDS.h"
#include "Sensor_MQ2.h"

// Wi-Fi 설정
const char* ssid = "최혁진의 iPhone";
const char* password = "gurwlsdlWkd123";

// MQTT 설정
const char* mqtt_server = "172.20.10.2";
const int mqtt_port = 1883;

WiFiClient espClient;
PubSubClient client(espClient);

// 센서 데이터
Sensor_DHT dhtData;
Sensor_CDS cdsData;
Sensor_MQ2 mq2Data;

void setup_wifi() {
  Serial.print("Wi-Fi 연결 중...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(" 연결됨!");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("MQTT 연결 시도 중...");
    if (client.connect("ESP32_Client")) {
      Serial.println(" 연결 성공!");
    } else {
      Serial.print(" 실패, 재시도 (");
      Serial.print(client.state());
      Serial.println(")");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);

  init_DHT(); // DHT 초기화
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  delay(2000); // 2초마다 읽기

  read_DHT(dhtData);
  read_CDS(cdsData);
  read_MQ2(mq2Data);

  // 테스트용 출력
  Serial.printf("습도: %.2f %%\t온도: %.2f °C\n", dhtData.humidity, dhtData.temperature);
  Serial.printf("조도: %.2f\n", cdsData.cds);
  Serial.printf("가스: %.2f\n", mq2Data.gas);

  // MQTT로 전송
  client.publish("esp32/humidity", String(dhtData.humidity).c_str());
  client.publish("esp32/temperature", String(dhtData.temperature).c_str());
  client.publish("esp32/cds", String(cdsData.cds).c_str());
  client.publish("esp32/gas", String(mq2Data.gas).c_str());

  Serial.println("MQTT 메시지 전송 완료");
}
