#pragma once
#include <Arduino.h>

class Sensor_CDS {
    private:
        int cds, PIN_NUM;

    public:
        Sensor_CDS(int pin);
        void read();
        int getValue();
};
