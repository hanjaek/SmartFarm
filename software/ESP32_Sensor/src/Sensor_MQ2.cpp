#include "Sensor_MQ2.h"

#define MQ2_PIN 32

void read_MQ2(Sensor_MQ2& data) {
    float g = analogRead(MQ2_PIN);

    if (isnan(g)) {
        Serial.println("MQ2 센서 데이터 오류");
        return;
    }
    data.gas = g;
}
