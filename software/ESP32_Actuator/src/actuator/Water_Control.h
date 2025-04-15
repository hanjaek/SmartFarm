#pragma once
#include <Arduino.h>

void WaterPin_set(int pin);

// 자동 제어 (토양 습도 기준)
void WaterControl_Auto(float soilMoisture);

// 수동 제어 (ON/OFF 명령만)
void WaterControl_Manual(const String& command);
