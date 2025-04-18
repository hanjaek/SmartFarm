#pragma once
#include <Arduino.h>

void FanPin_set(int pin);

// 자동 제어 (가스 기준)
void FanControl_Auto(float gasValue);

// 수동 제어 (ON/OFF 명령만)
void FanControl_Manual(const String& command);
