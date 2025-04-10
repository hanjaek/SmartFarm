#include "Sensor_DHT.h"

#define DHT_PIN 4
DHT dht(DHT_PIN, DHT11);

void init_DHT() {
    dht.begin();
}

void read_DHT(Sensor_DHT& data) {
    float h = dht.readHumidity();
    float t = dht.readTemperature();

    if (isnan(h)) {
        Serial.println("DHT 습도 센서 데이터 오류");
        h = 0.0;
    if (isnan(t)) {
        Serial.println("DHT 온도 센서 데이터 오류");
        t = 0.0;
    }

    data.humidity = h;
    data.temperature = t;
}
