#include "Sensor_DHT.h"

Sensor_DHT::Sensor_DHT(int pin) : PIN_NUM(pin), humidity(0), temperature(0), dht(pin, DHT11) {}

void Sensor_DHT::init_DHT() {
    dht.begin();
}

void Sensor_DHT::read() {
    int h = dht.readHumidity();
    int t = dht.readTemperature();

    if (isnan(h)) {
        Serial.println("[DHT 센서] 데이터 오류(습도)");
        h = 0;
    }
    if (isnan(t)) {
        Serial.println("[DHT 센서] 데이터 오류(온도)");
        t = 0;
    }

    humidity = h;
    temperature = t;
}

int Sensor_DHT::getTempValue(){
    return temperature;
}

int Sensor_DHT::getHumValue(){
    return humidity;
}