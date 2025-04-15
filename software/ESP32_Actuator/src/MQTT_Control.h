#ifndef MQTT_CONTROL_H
#define MQTT_CONTROL_H

#include <PubSubClient.h>
#include <WiFiClient.h>

class MQTT_Control {
public:
    MQTT_Control(WiFiClient& client, const char* server, int port);
    void connect(const char* clientID);
    void loop();
    void publish(const char* topic, const char* payload);
    void publishStatus(const char* actuator, bool isOn); // 상태 표시
    void setCallback(MQTT_CALLBACK_SIGNATURE); // 콜백 설정

private:
    PubSubClient pubSubClient;
    const char* server;
    int port;
};

#endif
