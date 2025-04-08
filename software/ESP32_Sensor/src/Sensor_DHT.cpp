#include "Sensor_DHT.h"

#define DHT_PIN 4
DHT dht(DHT_PIN, DHT11);

void init_DHT() {
    dht.begin();
}

void read_DHT(Sensor_DHT& data) {
    float h = dht.readHumidity();
    float t = dht.readTemperature();

    if (isnan(h) || isnan(t)) {
        Serial.println("DHT 센서 데이터 오류");
        return;
    }
    data.humidity = h;
    data.temperature = t;
}
