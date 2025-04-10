#include <Arduino.h>
// 통신 헤더
#include <WiFi.h>
#include <PubSubClient.h>
// 센서 헤더
#include <DHT.h>

// 핀번호 설정
#define DHT_PIN 4
#define CDS_PIN 34
#define MQ2_PIN 32

// 전역 변수 (센서 데이터 저장용)
float humidity = 0.0;
float temperature = 0.0;

DHT dht(DHT_PIN, DHT11); // DHT 핀번호, DHT 종류 설정

// WiFi 설정
const char* ssid = "최혁진의 iPhone"; 
const char* password = "gurwlsdlWkd123";

// MQTT 브로커 설정
const char* mqtt_server = "172.20.10.2"; 
const int mqtt_port = 1883;

WiFiClient espClient;
PubSubClient client(espClient);

// Wi-Fi 연결 함수
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

// MQTT 연결 함수
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

// DHT 센서 읽기 함수
void dht_sensor() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  if (isnan(h) || isnan(t)) {
    Serial.println("센서 데이터 오류");
    return;
  }
  else {
    // 전역 변수에 저장
    humidity = h;
    temperature = t;
  }

  // 시리얼 출력 (디버깅용)
  Serial.print("습도: ");
  Serial.print(humidity);
  Serial.print("% \t 온도: ");
  Serial.print(temperature);
  Serial.println(" °C");
}

void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  dht.begin();
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  delay(200); // 약간 대기
  dht_sensor(); // 센서 값 읽기

  // 센서 데이터 MQTT로 Publish
  String humidity_data = String(humidity);
  String temperature_data = String(temperature);

  client.publish("esp32/humidity", humidity_data.c_str());
  client.publish("esp32/temperature", temperature_data.c_str());

  Serial.println("MQTT 메시지 전송 - 습도: " + humidity_data + " 온도: " + temperature_data);

  delay(5000); // 5초 주기로 전송
}
