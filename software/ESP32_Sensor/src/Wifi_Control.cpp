#include "Wifi_Control.h"
#include <WiFi.h>

Wifi_Control::Wifi_Control(const char* ssid, const char* password) : ssid(ssid), password(password) {}

void Wifi_Control::connect() {
    Serial.print("Wi-Fi 연결 중...");
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println(" 연결됨!");
}

IPAddress Wifi_Control::getLocalIP() {
    return WiFi.localIP();
}
