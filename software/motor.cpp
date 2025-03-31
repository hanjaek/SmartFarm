// motor.cpp
#include "motor.h"
#include <Arduino.h>

const int relayPin = 16;  // 모터 제어 핀

// 모터 초기화 함수
void motor_init() {
  pinMode(relayPin, OUTPUT);  // relayPin을 출력으로 설정
  digitalWrite(relayPin, LOW);  // 초기에는 모터를 끄기
}

// 모터 켜는 함수
void motor_on() {
  digitalWrite(relayPin, HIGH);  // 모터 켜기
}

// 모터 끄는 함수
void motor_off() {
  digitalWrite(relayPin, LOW);   // 모터 끄기
}
