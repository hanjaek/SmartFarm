#include "Wifi_Control.h"
#include <WiFi.h>

Wifi_Control::Wifi_Control(const char* ssid, const char* password) : ssid(ssid), password(password) {}

void Wifi_Control::connect() {
    Serial.println("📡 Wi-Fi 연결 시도 중...");
    WiFi.begin(ssid, password);

    unsigned long startAttemptTime = millis();
    const unsigned long timeout = 10000; // 최대 10초 동안만 시도

    while (WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < timeout) {
        delay(500);
        Serial.print(".");
    }

    if (WiFi.status() == WL_CONNECTED) {
        Serial.println("\n✅ Wi-Fi 연결 성공!");
        Serial.print("IP 주소: ");
        Serial.println(WiFi.localIP());
    } else {
        Serial.println("\n❌ Wi-Fi 연결 실패!");
        Serial.println("📶 주변 Wi-Fi 목록 스캔 중...");

        int n = WiFi.scanNetworks();
        if (n == 0) {
            Serial.println("⚠️ Wi-Fi 신호 없음 (아예 감지 안됨)");
        } else {
            Serial.printf("📡 %d개의 네트워크 발견:\n", n);
            for (int i = 0; i < n; ++i) {
                Serial.printf("  %d: %s (%ddBm) %s\n", i + 1,
                              WiFi.SSID(i).c_str(),
                              WiFi.RSSI(i),
                              (WiFi.encryptionType(i) == WIFI_AUTH_OPEN) ? "열림" : "보안됨");
            }
        }

        Serial.println("📛 SSID나 비밀번호가 틀렸거나, 네트워크에 문제가 있을 수 있습니다.");
    }
}

IPAddress Wifi_Control::getLocalIP() {
    return WiFi.localIP();
}
