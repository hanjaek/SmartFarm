#include <Arduino.h>
//통신 헤더
#include <WiFi.h> // WiFi 사용하기 위한 헤더
#include <PubSubClient.h> // MQTT 사용하기 위한 헤더
// 센서 헤더
#include <DHT.h>

// 핀번호 설정
#define DHTPIN 4
#define CDSPIN 35
#define MQ2_PIN 32

// WiFi 설정 (연결될 wifi 이름, 비번)
const char* ssid = "최혁진의 iPhone";  // wifi 이름 설정
const char* password = "gurwlsdlWkd123"; // wifi 비번 설정정

// MQTT 브로커 설정 (라즈베리파이 IP)
const char* mqtt_server = "172.20.10.2"; // 라즈베리파이 ip 와 esp32와 같은 wifi 주소소
const int mqtt_port = 1883; // Mosquitto 기본 포트

WiFiClient espClient; // ESP32가 Wi-Fi 접속 후 데이터 주고받는 클라이언트 객체 생성하는 코드
PubSubClient client(espClient); // MQTT 클라이언트를 생성 

/*
float co2_sensor = 12.0; // ex) co2 sensor 값
sersor 변수들 추가...
*/

// Wi-Fi 연결 함수
void setup_wifi() {
  Serial.print("Wi-Fi 연결 중...");
  WiFi.begin(ssid, password); // wifi 접속
  while (WiFi.status() != WL_CONNECTED) {
    delay(500); 
    Serial.print("."); 
  }
  Serial.println(" 연결됨!");
  Serial.println(WiFi.localIP()); // wifi 연결 ip 출력력
}

// MQTT 연결함수
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
  Serial.begin(115200); // 통신 속도 설정
  setup_wifi(); // wifi 연결
  client.setServer(mqtt_server, mqtt_port); // MQTT 연결
}

void loop() {
  if (!client.connected()) {
    reconnect(); // MQTT 설정 실패하면 다시연결결
  }
  client.loop(); // MQTT 메시지 처리 (필수)

  /*
  TEST

  // 가상의 센서 데이터 생성 (0~100 랜덤값)
  int sensorValue = random(0, 100);

  // MQTT 메시지 전송
  String payload = String(sensorValue); // sersor 값 문자열로 변환환
  client.publish("esp32/testdata", payload.c_str()); // topit 형식으로 MQTT Publish

  Serial.println("MQTT 메시지 전송: " + payload); // MQTT로 전송된 메세지 확인인
  
  delay(5000); // 5초마다 전송
  */
}
