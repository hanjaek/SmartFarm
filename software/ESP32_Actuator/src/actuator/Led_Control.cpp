#include "Led_Control.h"

static int ledPin;
static bool manualMode = false;
static unsigned long lastManualTime = 0;

// 핀 세팅
void LedPin_set(int pin) {
  ledPin = pin;
  pinMode(ledPin, OUTPUT);
}

// 수동 제어: ON/OFF 명령 처리 + 자동 제어 정지
void LedControl_Manual(const String& command) {
  manualMode = true;
  lastManualTime = millis();

  if (command == "on") {
    digitalWrite(ledPin, HIGH);
  } else if (command == "off") {
    digitalWrite(ledPin, LOW);
  }
}

// 자동 제어: 조도값 기준 제어 (단, 수동 제어 후 5분 지나야 복귀)
void LedControl_Auto(float lightValue) {
  if (manualMode) {
    if (millis() - lastManualTime >= 5 * 60 * 1000) {  // 5분 경과 시 자동 복귀
      manualMode = false;
    } else {
      return;  // 수동 제어 유효 시간 내에는 자동 무시
    }
  }

  if (lightValue < 200.0) {
    digitalWrite(ledPin, HIGH);
  } else {
    digitalWrite(ledPin, LOW);
  }
}
