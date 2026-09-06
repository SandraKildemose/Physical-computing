// Five Finger LED til Arduino output


#include "Arduino_LED_Matrix.h"
ArduinoLEDMatrix matrix;

// Husk: Led sat i pin 12 ,  det er den pin der har koblet ledningen til.
int ledPin = 12;
bool ledState = false;

void setup() {
  Serial.begin(9600);

  // Pin 12 skal være output, fordi Arduinoen skal sende størmenm ud til LED.
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW);
  matrix.begin();
  matrix.clear();
}

void loop() {
  if (Serial.available() > 0) {
    char cmd = Serial.read();
    if (cmd == '1') {
      if (!ledState) {
        turnLedOn();
      }
    }

    if (cmd == '0') {
      if (ledState) {
        turnLedOff();
      }
    }
  }
}

void turnLedOn() {
  ledState = true;
  digitalWrite(ledPin, HIGH);
  matrix.loadFrame(LEDMATRIX_HEART_BIG);
}

void turnLedOff() {
  ledState = false;
  digitalWrite(ledPin, LOW);
  matrix.clear();
}
