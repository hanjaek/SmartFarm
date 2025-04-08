#include "Sensor_CDS.h"

#define CDS_PIN 35

void read_CDS(Sensor_CDS& data) {
    float c = analogRead(CDS_PIN);

    if (isnan(c)) {
        Serial.println("CDS 센서 데이터 오류");
        return;
    }
    data.cds = c;
}
