#include "Sensor_MQ2.h"

Sensor_MQ2::Sensor_MQ2(int pin) : PIN_NUM(pin), gas(0) {} 

void Sensor_MQ2::read() {
    int g = analogRead(PIN_NUM);

    if (isnan(g)) {
        Serial.println("[MQ2 센서] 데이터 오류");
        return;
    }
    gas = g;
}

int Sensor_MQ2::getValue(){
    return gas;
}
