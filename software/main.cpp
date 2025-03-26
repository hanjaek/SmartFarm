#include <Arduino.h>  // Arduino 라이브러리 포함

const int relayPin = 6;  // 6번 핀에 릴레이 연결

void setup() {
  pinMode(relayPin, OUTPUT);  // 릴레이 핀을 출력으로 설정
}

void loop() {
  digitalWrite(relayPin, HIGH);  // 릴레이 ON
  delay(10000);  // 10초 대기
  digitalWrite(relayPin, LOW);   // 릴레이 OFF
  delay(10000);  // 10초 대기
}