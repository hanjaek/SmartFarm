#ifndef LIGHT_H
#define LIGHT_H

#include <Arduino.h>

void setupLightPin(int pin);       // 전구 핀 초기화 함수
void controlLight(String action);  // 전구 제어 함수

#endif
