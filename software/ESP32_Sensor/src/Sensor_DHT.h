#pragma once
#include <Arduino.h>
#include <DHT.h>

struct Sensor_DHT {
    float humidity;
    float temperature;
};

void init_DHT();
void read_DHT(Sensor_DHT& data);
