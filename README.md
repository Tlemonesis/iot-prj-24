#iot-dashboard 2024

AdruinoIDE code
'''
#ifdef ESP8266
  #include <ESP8266WiFi.h> /* WiFi library for ESP8266 */
#else
  #include <WiFi.h> /* WiFi library for ESP32 */
#endif
#include <Wire.h>
#include <PubSubClient.h>
#include "DHT.h" /* DHT11 sensor library */

#define DHTPIN 2
#define DHTTYPE DHT11  // DHT 11
DHT dht(DHTPIN, DHTTYPE);

#define wifi_ssid "TP-Link_9BC8"
#define wifi_password "02438383398"
#define mqtt_server "192.168.10.105"

#define humidity_topic "sensor/DHT11/humidity"
#define temperature_celsius_topic "sensor/DHT11/temperature_celsius"
#define light_intensity_topic "sensor/LDR/light_intensity"
const char* light_topic = "home/light";
const char* fan_topic = "home/fan";

WiFiClient espClient;
PubSubClient client(espClient);

const int ledPin = D1;
const int ledPin2 = D0;
const int ldrPin = A0;

void setup_wifi() {
  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(wifi_ssid);

  WiFi.begin(wifi_ssid, wifi_password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* message, unsigned int length) {
  if (String(topic) == "home/light") {
    {
      Serial.println(topic);
      String msg = "";
      for (int i = 0; i < length; i++) {
        Serial.print(char(message[i]));
        msg += String((char)message[i]);
      }
      Serial.println("");
      Serial.println(msg);
      if (msg == "ON") {
        digitalWrite(ledPin, HIGH);
        client.publish("home/light","{Light on}");
      } else if (msg == "OFF") {
        digitalWrite(ledPin, LOW);
        client.publish("home/light","{Light off}");
      }
    }
  }
    if (String(topic) == "home/fan") {
    {
      Serial.println(topic);
      String msg = "";
      for (int i = 0; i < length; i++) {
        Serial.print(char(message[i]));
        msg += String((char)message[i]);
      }
      Serial.println("");
      Serial.println(msg);
      if (msg == "ON") {
        digitalWrite(ledPin2, HIGH);
        client.publish("home/fan","{Fan on}");
      } else if (msg == "OFF") {
        digitalWrite(ledPin2, LOW);
        client.publish("home/fan","{Fan off}");
      }
    }
  }
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");

    if (client.connect("ESP8266Client")) {
      Serial.println("connected");
      client.subscribe("home/light");
      client.subscribe("home/fan");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  pinMode(ledPin, OUTPUT);
  pinMode(ledPin2, OUTPUT);
  Serial.begin(115200);
  // dht.begin();
  setup_wifi();
  client.setServer(mqtt_server, 2002);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // Wait a few seconds between measurements.
  delay(2000);

  // Reading temperature or humidity takes about 250 milliseconds!
  // Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
  float h = dht.readHumidity();
  // Read temperature as Celsius (the default)
  float t = dht.readTemperature();
  // Read temperature as Fahrenheit (isFahrenheit = true)
  float f = dht.readTemperature(true);

  int l = analogRead(ldrPin);
  int il = 1024 - l;
  // Check if any reads failed and exit early (to try again).
  if (isnan(h) || isnan(t) || isnan(f) || isnan(l)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  // Compute heat index in Fahrenheit (the default)
  float hif = dht.computeHeatIndex(f, h);
  // Compute heat index in Celsius (isFahreheit = false)
  float hic = dht.computeHeatIndex(t, h, false);
  Serial.print("Humidity: ");
  Serial.print(h);
  Serial.print(" %\t");
  Serial.print("Temperature: ");
  Serial.print(t);
  Serial.println(" *C\t");
  Serial.print("Light level: ");
  Serial.print(il);
  Serial.println(" lux\t");

  Serial.print("Temperature:");
  Serial.println(String(t).c_str());
  client.publish(temperature_celsius_topic, (String(t) + " *C").c_str(), true);

  Serial.print("Humidity:");
  Serial.println(String(h).c_str());
  client.publish(humidity_topic, (String(h) + " %").c_str(), true);

  Serial.print("Light level: ");
  Serial.println(String(il).c_str());
  client.publish(light_intensity_topic, (String(il) + " lux").c_str(), true);

  delay(1000);
}
'''
