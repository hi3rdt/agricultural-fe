# Agricultural Monitoring Dashboard

A real-time agricultural monitoring system built with Next.js that displays data from DHT22 (temperature/humidity) and LM393 (soil moisture) sensors connected to an ESP32.

## Features

- **Real-time Sensor Monitoring**: Display temperature, humidity, and soil moisture data
- **Historical Charts**: 24-hour trend visualization for all sensor readings
- **Automated Irrigation**: Configurable soil moisture thresholds for pump control
- **Manual Override**: Manual pump control when needed
- **Clean White UI**: Professional, intuitive interface optimized for agricultural use

## ESP32 Integration

### API Endpoints

Your ESP32 should send sensor data to these endpoints:

#### POST /api/sensors
Send sensor readings from your ESP32:

\`\`\`json
{
  "temperature": 24.5,
  "humidity": 65.2,
  "soilMoisture": 45.8,
  "pumpStatus": false
}
\`\`\`

#### GET /api/sensors
Get current sensor readings

#### GET /api/sensors/history
Get historical data for charts

#### POST /api/pump
Control pump settings:

\`\`\`json
{
  "action": "setThreshold",
  "threshold": 30
}
\`\`\`

### ESP32 Code Example

\`\`\`cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <DHT.h>

#define DHT_PIN 2
#define DHT_TYPE DHT22
#define SOIL_MOISTURE_PIN A0
#define PUMP_PIN 4

DHT dht(DHT_PIN, DHT_TYPE);

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverURL = "http://your-dashboard-url.com/api/sensors";

void setup() {
  Serial.begin(115200);
  dht.begin();
  pinMode(PUMP_PIN, OUTPUT);
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
}

void loop() {
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  int soilMoistureRaw = analogRead(SOIL_MOISTURE_PIN);
  float soilMoisture = map(soilMoistureRaw, 0, 4095, 0, 100);
  bool pumpStatus = digitalRead(PUMP_PIN);

  // Send data to dashboard
  HTTPClient http;
  http.begin(serverURL);
  http.addHeader("Content-Type", "application/json");

  StaticJsonDocument<200> doc;
  doc["temperature"] = temperature;
  doc["humidity"] = humidity;
  doc["soilMoisture"] = soilMoisture;
  doc["pumpStatus"] = pumpStatus;

  String jsonString;
  serializeJson(doc, jsonString);

  int httpResponseCode = http.POST(jsonString);
  if (httpResponseCode > 0) {
    Serial.println("Data sent successfully");
  }

  http.end();
  delay(5000); // Send data every 5 seconds
}
\`\`\`

## Getting Started

1. Deploy this dashboard to Vercel or your preferred hosting platform
2. Update the `serverURL` in your ESP32 code to point to your deployed dashboard
3. Connect your DHT22 and LM393 sensors to your ESP32
4. Upload the ESP32 code and start monitoring!

## Data Flow

1. ESP32 reads sensor data every 5 seconds
2. Data is sent via HTTP POST to `/api/sensors`
3. Dashboard updates in real-time
4. Historical data is maintained for 24-hour charts
5. Pump control logic runs automatically based on thresholds
