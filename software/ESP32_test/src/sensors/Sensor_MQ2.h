#pragma once
#include <Arduino.h>

class Sensor_MQ2{
    private:
        int gas, PIN_NUM;
    public:
        Sensor_MQ2(int pin);
        void read();
        int getValue();
};
