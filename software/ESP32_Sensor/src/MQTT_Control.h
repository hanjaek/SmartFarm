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
  
private:
    PubSubClient pubSubClient;
    const char* server;
    int port;
};

#endif
