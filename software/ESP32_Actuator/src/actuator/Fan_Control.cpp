#include "Fan_Control.h"
#include "../MQTT_Control.h"

extern MQTT_Control mqttControl;

static int fanPin;
static bool manualMode = false;
static unsigned long lastManualTime = 0;
static bool lastState = false;

void FanPin_set(int pin) {
  fanPin = pin;
  pinMode(fanPin, OUTPUT);
}

void FanControl_Manual(const String& command) {
  manualMode = true;
  lastManualTime = millis();

  if (command == "on") {
    digitalWrite(fanPin, HIGH);
    if (!lastState) mqttControl.publishStatus("fan", true);
    lastState = true;
  } else if (command == "off") {
    digitalWrite(fanPin, LOW);
    if (lastState) mqttControl.publishStatus("fan", false);
    lastState = false;
  }
}

void FanControl_Auto(float gasValue) {
  if (manualMode) {
    if (millis() - lastManualTime >= 5 * 60 * 1000) {
      manualMode = false;
    } else {
      return;
    }
  }

  if (gasValue > 300.0) {
    digitalWrite(fanPin, HIGH);
    if (!lastState) mqttControl.publishStatus("fan", true);
    lastState = true;
  } else {
    digitalWrite(fanPin, LOW);
    if (lastState) mqttControl.publishStatus("fan", false);
    lastState = false;
  }
}
