#include <Arduino.h>

// 릴레이가 연결된 핀 설정

//갈색 2번 핀
//빨간색 5v
//주황색 GND
const int relayPin = 16;  // 2번 핀

void setup() {
  // 릴레이 핀을 출력 모드로 설정
  pinMode(relayPin, OUTPUT);
}

void loop() {
  // 릴레이에 HIGH 신호를 보내 10초 동안 활성화
  digitalWrite(relayPin, HIGH);
  delay(10000);  // 10초 대기

  // 릴레이에 LOW 신호를 보내 10초 동안 비활성화
  digitalWrite(relayPin, LOW);
  delay(10000);  // 10초 대기
}
