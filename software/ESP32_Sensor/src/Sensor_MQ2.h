#pragma once
#include <Arduino.h>

struct Sensor_MQ2 {
    float gas;
};

void read_MQ2(Sensor_MQ2& data);
