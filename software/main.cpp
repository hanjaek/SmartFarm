#include <Arduino.h>  // 아두이노 라이브러리

const int relayPin = 6;  // 릴레이가 연결된 핀 번호

// 릴레이 ON/OFF 시간을 밀리초 단위로 설정
const unsigned long relayOnTime = 10000;  // 릴레이 ON 시간 (10초)
const unsigned long relayOffTime = 10000; // 릴레이 OFF 시간 (10초)

unsigned long previousMillis = 0;  // 마지막으로 상태가 변경된 시간
bool relayState = LOW;  // 릴레이의 초기 상태는 OFF

void setup() {
  pinMode(relayPin, OUTPUT);  // 릴레이 핀을 출력 모드로 설정
  Serial.begin(115200);  // 시리얼 통신 초기화 (디버깅용)
  Serial.println("Relay control starting...");
}

void loop() {
  unsigned long currentMillis = millis();  // 현재 시간 (밀리초 단위)

  // 릴레이 상태가 LOW이면, ON으로 전환해야 할 시간인지 확인
  if (relayState == LOW && currentMillis - previousMillis >= relayOffTime) {
    // 릴레이를 ON으로 설정
    relayState = HIGH;
    digitalWrite(relayPin, relayState);
    previousMillis = currentMillis;  // 마지막 변경 시간 갱신
    Serial.println("Relay ON");
  }

  // 릴레이 상태가 HIGH이면, OFF로 전환해야 할 시간인지 확인
  if (relayState == HIGH && currentMillis - previousMillis >= relayOnTime) {
    // 릴레이를 OFF로 설정
    relayState = LOW;
    digitalWrite(relayPin, relayState);
    previousMillis = currentMillis;  // 마지막 변경 시간 갱신
    Serial.println("Relay OFF");
  }

  // 여기에서 다른 작업을 할 수 있습니다.
}
