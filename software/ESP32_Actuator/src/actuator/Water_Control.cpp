#include "Water_Control.h"
#include "../MQTT_Control.h"

extern MQTT_Control mqttControl; 

// -------- 내부 상태 변수 정의 --------
static int waterPin;                     // 물 펌프 제어용 핀
static bool manualMode = false;         // 수동 제어 모드 여부
static unsigned long lastManualTime = 0; // 마지막 수동 제어 시각 (millis 기준)
static bool lastState = false;          // 현재 펌프 상태 (중복 전송 방지용)

// -------- 핀 초기화 함수 --------
// 물 펌프를 제어할 핀을 OUTPUT 모드로 설정
void WaterPin_set(int pin) {
  waterPin = pin;
  pinMode(waterPin, OUTPUT);
}

// -------- 수동 제어 함수 --------
// 사용자가 MQTT로 직접 펌프 ON/OFF 명령을 내렸을 때 호출됨
void WaterControl_Manual(const String& command) {
  manualMode = true;                 // 수동 모드 진입
  lastManualTime = millis();        // 수동 제어 시각 기록

  if (command == "on") {
    digitalWrite(waterPin, HIGH);   // 펌프 ON
    if (!lastState) mqttControl.publishStatus("water", true);
    lastState = true;
  } else if (command == "off") {
    digitalWrite(waterPin, LOW);    // 펌프 OFF
    if (lastState) mqttControl.publishStatus("water", false);
    lastState = false;
  }
}

// -------- 자동 제어 함수 --------
// 토양 수분값을 기준으로 자동으로 펌프 제어
// 단, 수동 제어 후 5분이 지나야 자동 제어 활성화
void WaterControl_Auto(float soilMoisture) {
  if (manualMode) {
    if (millis() - lastManualTime >= 5 * 60 * 1000) {
      manualMode = false;           // 수동 제어 만료 → 자동 모드 복귀
    } else {
      return;                       // 수동 제어 유효 → 자동 무시
    }
  }

  if (soilMoisture > 700.0) {
    digitalWrite(waterPin, HIGH);   // 건조하므로 물 공급
    if (!lastState) mqttControl.publishStatus("water", true);
    lastState = true;
  } else {
    digitalWrite(waterPin, LOW);    // 습도가 충분하므로 펌프 OFF
    if (lastState) mqttControl.publishStatus("water", false);
    lastState = false;
  }
}
