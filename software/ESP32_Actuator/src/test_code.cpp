// #include <Arduino.h>

// #define LED_PIN 5
// #define FAN_PIN 18
// #define WATER_PIN 19  // 지금 테스트하니까 포함시켰어도 괜찮아

// void setup() {
//   Serial.begin(115200);

//   // 핀 모드 설정
//   pinMode(LED_PIN, OUTPUT);
//   pinMode(FAN_PIN, OUTPUT);
//   pinMode(WATER_PIN, OUTPUT);
// }

// void loop() {
//   // 릴레이 1번 ON
//   Serial.println("LED 릴레이 ON");
//   digitalWrite(LED_PIN, LOW); // 보통 LOW가 릴레이 ON
//   delay(1000);

//   // 릴레이 1번 OFF
//   Serial.println("LED 릴레이 OFF");
//   digitalWrite(LED_PIN, HIGH);
//   delay(1000);

//   // 릴레이 2번 ON
//   Serial.println("FAN 릴레이 ON");
//   digitalWrite(FAN_PIN, LOW);
//   delay(1000);

//   // 릴레이 2번 OFF
//   Serial.println("FAN 릴레이 OFF");
//   digitalWrite(FAN_PIN, HIGH);
//   delay(1000);

//   // 릴레이 3번 ON
//   Serial.println("WATER 릴레이 ON");
//   digitalWrite(WATER_PIN, LOW);
//   delay(1000);

//   // 릴레이 3번 OFF
//   Serial.println("WATER 릴레이 OFF");
//   digitalWrite(WATER_PIN, HIGH);
//   delay(1000);
// }
