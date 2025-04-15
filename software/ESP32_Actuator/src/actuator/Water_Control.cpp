#include "Water_Control.h"

static int waterPin;
static bool manualMode = false;
static unsigned long lastManualTime = 0;

void WaterPin_set(int pin) {
  waterPin = pin;
  pinMode(waterPin, OUTPUT);
}

void WaterControl_Manual(const String& command) {
  manualMode = true;
  lastManualTime = millis();

  if (command == "on") {
    digitalWrite(waterPin, HIGH);
  } else if (command == "off") {
    digitalWrite(waterPin, LOW);
  }
}

void WaterControl_Auto(float soilMoisture) {
  if (manualMode) {
    if (millis() - lastManualTime >= 5 * 60 * 1000) {
      manualMode = false;
    } else {
      return;  // 수동 제어 유효 시간 내에는 자동 제어 무시
    }
  }

  if (soilMoisture > 700.0) {  // 건조하면 물 주기
    digitalWrite(waterPin, HIGH);
  } else {
    digitalWrite(waterPin, LOW);
  }
}
