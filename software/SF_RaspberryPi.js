require('dotenv').config();
const mqtt = require('mqtt');
const { Client } = require('pg');

// MQTT 클라이언트 설정 (TLS 등 포함 가능)
const mqttOptions = {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
  // ca: fs.readFileSync("path/to/ca.crt"), // 인증서 사용 시
};

const mqttClient = mqtt.connect(process.env.MQTT_BROKER, mqttOptions);

// TimescaleDB 접속 클라이언트 설정
const dbClient = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: true // SSL 사용 시 true, 인증서 필요시 추가 설정
});

dbClient.connect()
  .then(() => console.log("🗄️ Connected to TimescaleDB"))
  .catch(err => console.error("❌ DB Connection Error:", err));

// MQTT 메시지 수신 시 DB에 삽입
mqttClient.on('connect', () => {
  console.log("📡 Connected to MQTT broker");
  mqttClient.subscribe(process.env.MQTT_TOPIC, (err) => {
    if (err) console.error("❌ Subscribe error:", err);
    else console.log("📥 Subscribed to topic:", process.env.MQTT_TOPIC);
  });
});

mqttClient.on('message', async (topic, message) => {
  try {
    const data = JSON.parse(message.toString()); // 메시지 예: { temperature: 23.5, humidity: 55 }
    console.log("📨 Received data:", data);

    const query = `
      INSERT INTO sensor_data (timestamp, temperature, humidity)
      VALUES (NOW(), $1, $2)
    `;
    await dbClient.query(query, [data.temperature, data.humidity]);
    console.log("✅ Data inserted to TimescaleDB");
  } catch (err) {
    console.error("⚠️ Error handling message:", err);
  }
});
