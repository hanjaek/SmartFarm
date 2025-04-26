#pragma once
#include <Arduino.h>

void LedPin_set(int pin);

// 자동 제어 (온도 기준)
void LedControl_Auto(float temperature);

// 수동 제어 (ON/OFF 명령만)
void LedControl_Manual(const String& command);
