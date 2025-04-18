#include "Fan_Control.h"
#include "../MQTT_Control.h"

extern MQTT_Control mqttControl; 

// -------- 내부 상태 변수 정의 (private) --------
static int fanPin;                     // 팬이 연결된 핀 번호
static bool manualMode = false;       // 수동 제어 모드 플래그
static unsigned long lastManualTime = 0; // 수동 제어 시각 저장 (ms 단위)
static bool lastState = false;        // 이전 팬 상태 (ON/OFF) 기억
                                      // → 중복 MQTT 메시지 전송 방지

// -------- 초기 핀 설정 함수 --------
void FanPin_set(int pin) {
  fanPin = pin;
  pinMode(fanPin, OUTPUT); // 해당 핀을 출력으로 설정
}

// -------- 수동 제어 함수 --------
// MQTT 메시지를 통해 사용자가 팬 ON/OFF 명령을 보냈을 때 실행됨
void FanControl_Manual(const String& command) {
  manualMode = true;                   // 수동 제어 플래그 활성화
  lastManualTime = millis();          // 현재 시간 저장 (자동 제어 재개 타이머)

  if (command == "on") {
    digitalWrite(fanPin, HIGH);       // 팬 켜기
    if (!lastState) mqttControl.publishStatus("fan", true);  // 상태 변경 시 MQTT 전송
    lastState = true;
  } else if (command == "off") {
    digitalWrite(fanPin, LOW);        // 팬 끄기
    if (lastState) mqttControl.publishStatus("fan", false);  // 상태 변경 시 MQTT 전송
    lastState = false;
  }
}

// -------- 자동 제어 함수 --------
// 가스 센서 값에 따라 팬 자동 제어
// 단, 최근 수동 제어로부터 5분이 지나야 자동 제어 재개
void FanControl_Auto(float gasValue) {
  // 수동 제어 후 5분 동안은 자동 제어 무시
  if (manualMode) {
    if (millis() - lastManualTime >= 5 * 60 * 1000) {
      manualMode = false;  // 5분 지났으면 자동 제어 복귀 허용
    } else {
      return;              // 아직 수동 제어 유효 → 자동 제어 무시
    }
  }

  // 가스 수치가 높으면 팬 켜기, 낮으면 끄기
  if (gasValue > 300.0) {
    digitalWrite(fanPin, HIGH);
    if (!lastState) mqttControl.publishStatus("fan", true);  // 상태 변화 시 전송
    lastState = true;
  } else {
    digitalWrite(fanPin, LOW);
    if (lastState) mqttControl.publishStatus("fan", false);
    lastState = false;
  }
}
