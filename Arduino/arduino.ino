#include <OneWire.h>
#include <DallasTemperature.h>

const int sensor = 2;

OneWire oneWire(sensor);
DallasTemperature sensors(&oneWire);

void setup() {
  Serial.begin(9600);

  sensors.begin();
  sensors.setResolution(12);
}

void loop() {
  sensors.requestTemperatures();

  float temperatura1 = sensors.getTempCByIndex(0);
  float temperatura2 = sensors.getTempCByIndex(1);

  // Início do objeto JSON
  Serial.print("{\"temperatura1\":");

  // Valor da primeira temperatura
  Serial.print(temperatura1, 1);

  // Separação entre as propriedades
  Serial.print(",\"temperatura2\":");

  // Valor da segunda temperatura
  Serial.print(temperatura2, 1);

  // Fecha o objeto JSON e pula a linha
  Serial.println("}");

  delay(5000);
}
