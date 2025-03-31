// main.cpp
#include <WiFi.h>
#include <ESP32WebServer.h>
#include "motor.h"  // motor 관련 함수들을 motor.cpp에서 가져옴
#include "sensor.h"
#include "display.h"

const char* ssid = "your_SSID";        // Wi-Fi SSID
const char* password = "your_PASSWORD"; // Wi-Fi 비밀번호

ESP32WebServer server(80); // HTTP 서버 객체

// Wi-Fi 연결 함수
void setup_wifi() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("Connected to Wi-Fi!");
}

// /control-motor 엔드포인트 핸들러
void handle_motor_control() {
  String action = server.arg("action");  // action 파라미터 받기

  if (action == "on") {
    motor_on();  // 모터 켜기
    server.send(200, "text/plain", "Motor is ON");
  } else if (action == "off") {
    motor_off();  // 모터 끄기
    server.send(200, "text/plain", "Motor is OFF");
  } else {
    server.send(400, "text/plain", "Invalid action");
  }
}

void setup() {
  setup_wifi();  // Wi-Fi 연결

  motor_init();  // 모터 초기화

  // HTTP 요청에 대한 핸들러 설정
  server.on("/control-motor", HTTP_POST, handle_motor_control);

  server.begin();  // 서버 시작
  Serial.println("HTTP server started");
}

void loop() {
  server.handleClient();  // 클라이언트 요청 처리
}
