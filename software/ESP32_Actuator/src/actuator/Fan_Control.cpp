#include "Fan_Control.h"

static int fanPin;
static bool manualMode = false;
static unsigned long lastManualTime = 0;

// 핀 세팅
void FanPin_set(int pin) {
  fanPin = pin;
  pinMode(fanPin, OUTPUT);
}

// 수동 제어: ON/OFF 명령 처리 + 자동 제어 정지
void FanControl_Manual(const String& command) {
  manualMode = true;
  lastManualTime = millis();

  if (command == "on") {
    digitalWrite(fanPin, HIGH);
  } else if (command == "off") {
    digitalWrite(fanPin, LOW);
  }
}

// 자동 제어: 가스 값 기준 (단, 수동 제어 후 5분 지나야 복귀)
void FanControl_Auto(float gasValue) {
  if (manualMode) {
    if (millis() - lastManualTime >= 5 * 60 * 1000) {
      manualMode = false;
    } else {
      return;  // 수동 제어 유효 시간 내에는 자동 제어 무시
    }
  }

  if (gasValue > 300.0) {
    digitalWrite(fanPin, HIGH);
  } else {
    digitalWrite(fanPin, LOW);
  }
}
