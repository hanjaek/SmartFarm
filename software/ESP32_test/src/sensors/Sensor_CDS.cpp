#include "Sensor_CDS.h"

Sensor_CDS::Sensor_CDS(int pin) : PIN_NUM(pin), cds(0) {} // 클래스 생성자  

void Sensor_CDS::read() {
    int c = analogRead(PIN_NUM);
    if (isnan(c)) {
        Serial.println("[CDS 센서] 데이터 오류");
        return;
    }
    cds = c;
}

int Sensor_CDS::getValue(){
    return cds;
}