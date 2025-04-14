#pragma once
#include <Arduino.h>
#include <DHT.h>

class Sensor_DHT{
    private:
        int humidity, temperature, PIN_NUM;
        DHT dht;
    
    public:
        Sensor_DHT(int pin);
        void init_DHT();
        void read();
        int getTempValue();
        int getHumValue();
        
};