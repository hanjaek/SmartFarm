#include "Led_Control.h"
#include "../MQTT_Control.h"

extern MQTT_Control mqttControl;  

// -------- 내부 상태 변수 정의 (private) --------
static int ledPin;                       // LED 연결 핀
static bool manualMode = false;         // 수동 제어 활성화 여부
static unsigned long lastManualTime = 0; // 수동 제어 시각 기록 (ms 단위)
static bool lastState = false;          // 마지막 LED 상태 (on/off), 중복 전송 방지용

// -------- 핀 초기화 함수 --------
// 제어할 LED의 핀 번호를 설정하고 출력 설정
void LedPin_set(int pin) {
  ledPin = pin;
  pinMode(ledPin, OUTPUT);
}

// -------- 수동 제어 함수 --------
// MQTT를 통해 "on" 또는 "off" 명령이 왔을 때 실행됨
void LedControl_Manual(const String& command) {
  manualMode = true;                // 수동 제어 모드로 전환
  lastManualTime = millis();       // 수동 제어 시각 저장

  if (command == "on") {
    digitalWrite(ledPin, HIGH);    // LED 켜기
    if (!lastState) mqttControl.publishStatus("led", true);  // 상태가 바뀌었으면 전송
    lastState = true;
  } else if (command == "off") {
    digitalWrite(ledPin, LOW);     // LED 끄기
    if (lastState) mqttControl.publishStatus("led", false);  // 상태가 바뀌었으면 전송
    lastState = false;
  }
}

// -------- 자동 제어 함수 --------
// 조도 센서 값을 기준으로 자동으로 켜고 끔
// 단, 최근 수동 제어 이후 5분이 지나야 자동 제어가 다시 가능
void LedControl_Auto(float lightValue) {
  if (manualMode) {
    if (millis() - lastManualTime >= 5 * 60 * 1000) {
      manualMode = false;         // 5분이 지나면 자동 모드로 복귀
    } else {
      return;                     // 아직 수동 모드 유지 → 자동 무시
    }
  }

  if (lightValue < 200.0) {
    digitalWrite(ledPin, HIGH);   // 조도가 낮으면 LED 켜기
    if (!lastState) mqttControl.publishStatus("led", true);
    lastState = true;
  } else {
    digitalWrite(ledPin, LOW);    // 조도가 충분히 밝으면 LED 끄기
    if (lastState) mqttControl.publishStatus("led", false);
    lastState = false;
  }
}
