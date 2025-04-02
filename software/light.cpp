#include "light.h"

int lightPin;  // 전구를 제어할 핀 번호

void setupLightPin(int pin) {
  lightPin = pin;
  pinMode(lightPin, OUTPUT);  // 전구 핀 초기화
  digitalWrite(lightPin, LOW);
}

void controlLight(String action) {
  if (action == "on") {
    digitalWrite(lightPin, HIGH);  // 전구 켜기
  } else if (action == "off") {
    digitalWrite(lightPin, LOW);   // 전구 끄기
  }
}
