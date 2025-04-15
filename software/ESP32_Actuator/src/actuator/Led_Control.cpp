#include "Led_Control.h"
#include "../MQTT_Control.h"

extern MQTT_Control mqttControl;

static int ledPin;
static bool manualMode = false;
static unsigned long lastManualTime = 0;
static bool lastState = false;

void LedPin_set(int pin) {
  ledPin = pin;
  pinMode(ledPin, OUTPUT);
}

void LedControl_Manual(const String& command) {
  manualMode = true;
  lastManualTime = millis();

  if (command == "on") {
    digitalWrite(ledPin, HIGH);
    if (!lastState) mqttControl.publishStatus("led", true);
    lastState = true;
  } else if (command == "off") {
    digitalWrite(ledPin, LOW);
    if (lastState) mqttControl.publishStatus("led", false);
    lastState = false;
  }
}

void LedControl_Auto(float lightValue) {
  if (manualMode) {
    if (millis() - lastManualTime >= 5 * 60 * 1000) {
      manualMode = false;
    } else {
      return;
    }
  }

  if (lightValue < 200.0) {
    digitalWrite(ledPin, HIGH);
    if (!lastState) mqttControl.publishStatus("led", true);
    lastState = true;
  } else {
    digitalWrite(ledPin, LOW);
    if (lastState) mqttControl.publishStatus("led", false);
    lastState = false;
  }
}
