#include "Water_Control.h"
#include "../MQTT_Control.h"

extern MQTT_Control mqttControl;

static int waterPin;
static bool manualMode = false;
static unsigned long lastManualTime = 0;
static bool lastState = false;

void WaterPin_set(int pin) {
  waterPin = pin;
  pinMode(waterPin, OUTPUT);
}

void WaterControl_Manual(const String& command) {
  manualMode = true;
  lastManualTime = millis();

  if (command == "on") {
    digitalWrite(waterPin, HIGH);
    if (!lastState) mqttControl.publishStatus("water", true);
    lastState = true;
  } else if (command == "off") {
    digitalWrite(waterPin, LOW);
    if (lastState) mqttControl.publishStatus("water", false);
    lastState = false;
  }
}

void WaterControl_Auto(float soilMoisture) {
  if (manualMode) {
    if (millis() - lastManualTime >= 5 * 60 * 1000) {
      manualMode = false;
    } else {
      return;
    }
  }

  if (soilMoisture > 700.0) {
    digitalWrite(waterPin, HIGH);
    if (!lastState) mqttControl.publishStatus("water", true);
    lastState = true;
  } else {
    digitalWrite(waterPin, LOW);
    if (lastState) mqttControl.publishStatus("water", false);
    lastState = false;
  }
}
