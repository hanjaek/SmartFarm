#pragma once
#include <Arduino.h>

struct Sensor_CDS {
    float cds;
};

void read_CDS(Sensor_CDS& data);
