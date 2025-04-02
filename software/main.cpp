#include <WiFi.h>
#include <PubSubClient.h>
#include "light.h"  // light.h 헤더 파일 포함
#include "sensor.h"
#include "motor.h"
#include "display.h"


const char* ssid = "your_SSID";
const char* password = "your_PASSWORD";

const char* mqtt_server = "test.mosquitto.org"; // MQTT 브로커 주소
const int mqttPort = 8883; // TLS 포트
const char* mqttTopic = "smartfarm/DSE/light";

WiFiClientSecure espClient; // TLS 적용
PubSubClient client(espClient);

void setup() {
  Serial.begin(115200);
  

  // 전구 제어 핀 설정 (예: GPIO 2번)
  setupLightPin(2);  // GPIO 2번에 연결된 전구 제어

  // MQTT 서버 연결
  setup_wifi();
  client.setServer(mqttServer, mqttPort);
  client.setCallback(mqttCallback);
}

// WiFi 연결 함수
void setup_wifi() {
  Serial.print("WiFi 연결 중...");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.print(".");
  }

  Serial.println("✅ WiFi 연결됨!");
  Serial.print("IP 주소: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
}

// MQTT 브로커 연결 함수
void reconnect() {
  while (!client.connected()) {
      Serial.print("MQTT 연결 시도...");
      if (client.connect("ESP32_Client")) {
          Serial.println("✅ MQTT 연결됨!");
          client.subscribe("mqttTopic");  // 구독할 토픽
      } else {
          Serial.print("연결 실패, 재시도 (");
          Serial.print(client.state());
          Serial.println(")");
          delay(2000);
      }
  }
}

// ✅ 콜백 함수 이름 수정
void mqttCallback(char* topic, byte* payload, unsigned int length) {
  String message = "";
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  Serial.print("수신된 메시지: ");
  Serial.println(message);

  // 전구 ON/OFF 처리
  if (message == "ON") {  // 대소문자 구분해서 체크
    digitalWrite(RELAY_PIN, HIGH); // 릴레이 ON
    Serial.println("💡 전구 ON");
  } 
  else if (message == "OFF") {
    digitalWrite(RELAY_PIN, LOW); // 릴레이 OFF
    Serial.println("💡 전구 OFF");
  }
}