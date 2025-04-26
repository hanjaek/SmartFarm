#ifndef WIFI_CONTROL_H
#define WIFI_CONTROL_H

#include <WiFi.h>

class Wifi_Control {
public:
    Wifi_Control(const char* ssid, const char* password);
    void connect();
    IPAddress getLocalIP();
  
private:
    const char* ssid;
    const char* password;
};

#endif
