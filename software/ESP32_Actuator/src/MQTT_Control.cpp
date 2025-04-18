#include "MQTT_Control.h"

MQTT_Control::MQTT_Control(WiFiClient& client, const char* server, int port)
    : pubSubClient(client), server(server), port(port) {
    pubSubClient.setServer(server, port);
}

void MQTT_Control::connect(const char* clientID) {
    while (!pubSubClient.connected()) {
        Serial.print("MQTT 연결 시도 중...");
        if (pubSubClient.connect(clientID)) {
            Serial.println(" 연결 성공!");
        } else {
            Serial.print(" 실패, 재시도 (");
            Serial.print(pubSubClient.state());
            Serial.println(")");
            delay(5000);
        }
    }
}

void MQTT_Control::loop() {
    pubSubClient.loop();
}

void MQTT_Control::publish(const char* topic, const char* payload) {
    pubSubClient.publish(topic, payload);
}

void MQTT_Control::publishStatus(const char* actuator, bool isOn) {
    String topic = String("actuator/") + actuator + "/status"; 
    const char* payload = isOn ? "on" : "off";
    pubSubClient.publish(topic.c_str(), payload);
}


void MQTT_Control::setCallback(MQTT_CALLBACK_SIGNATURE) {
    pubSubClient.setCallback(callback);
}
