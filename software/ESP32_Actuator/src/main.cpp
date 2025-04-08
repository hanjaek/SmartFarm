#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>

// Wi-Fi 정보
const char* ssid = "최혁진의 iPhone";
const char* password = "gurwlsdlWkd123";

// MQTT 브로커 정보
const char* mqtt_server = "172.20.10.2";
const int mqtt_port = 1883;

// 릴레이 핀 설정 (예: D2에 연결)
const int ledPin = 5;

WiFiClient espClient;
PubSubClient client(espClient);

// MQTT 메시지 수신 콜백 함수
void callback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (unsigned int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  Serial.print("수신된 메시지 [");
  Serial.print(topic);
  Serial.print("]: ");
  Serial.println(message);

  if (String(topic) == "esp32/control") {
    if (message == "ON") {
      digitalWrite(ledPin, HIGH);
    } else if (message == "OFF") {
      digitalWrite(ledPin, LOW);
    }

    // 실제 핀 상태 읽어서 확인
    int actualState = digitalRead(ledPin);
    if (actualState == HIGH) {
      client.publish("esp32/led/status", "ON");
      Serial.print("LED 상태: ");
      Serial.print(message);
    } else {
      client.publish("esp32/led/status", "OFF");
      Serial.print("LED 상태: ");
      Serial.print(message);
    }
  }
}

// Wi-Fi 연결
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

// MQTT 연결
void reconnect() {
  while (!client.connected()) {
    Serial.print("MQTT 연결 시도 중...");
    if (client.connect("ESP32_Actuator")) {
      Serial.println(" 연결 성공!");
      client.subscribe("esp32/control");  // 제어 토픽 구독
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
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW);  // 초기 OFF 상태

  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback); // 메시지 수신 콜백 함수 설정
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop(); // MQTT 메시지 수신 처리
}
