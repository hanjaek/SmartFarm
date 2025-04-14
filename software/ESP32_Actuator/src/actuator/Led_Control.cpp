#include "Led_Control.h"

static int ledPin;  // 사용할 핀 저장용 (private)

// 핀 세팅
void pin_set(int pin) {
  ledPin = pin;
  pinMode(ledPin, OUTPUT);
}

// 자동 제어: 온도 값에 따라 LED 켜기/끄기
void LedControl_Auto(float led_time) {
  if (led_time > 30.0) {  // LED 시간 정해서 키고 끄기
    digitalWrite(ledPin, HIGH);  // LED 켜기
  } else {
    digitalWrite(ledPin, LOW);   // LED 끄기
  }
}

// 수동 제어: "on" / "off" 명령 처리
void LedControl_Manual(const String& command) {
  if (command == "on") {
    digitalWrite(ledPin, HIGH);
  } else if (command == "off") {
    digitalWrite(ledPin, LOW);
  }
}