const client = require('./db');

const selectSensorData = async () => {
  // ✅ 최신 10개 센서 데이터 (장치 이름까지 JOIN)
  const latestQuery = `
    SELECT s.*, d.name AS device_name
    FROM sensor_logs s
    JOIN devices d ON s.device_id = d.device_id
    WHERE temperature IS NOT NULL OR humidity IS NOT NULL OR light IS NOT NULL OR soil_moisture IS NOT NULL OR gas IS NOT NULL
    ORDER BY time DESC
    LIMIT 10
  `;

  // ✅ 센서별 평균값
  const avgQuery = `
    SELECT
      ROUND(AVG(temperature)::numeric, 2) AS avg_temp,
      ROUND(AVG(humidity)::numeric, 2) AS avg_humid,
      ROUND(AVG(light)::numeric, 2) AS avg_light,
      ROUND(AVG(soil_moisture)::numeric, 2) AS avg_soil,
      ROUND(AVG(gas)::numeric, 2) AS avg_gas
    FROM sensor_logs
  `;

  try {
    const latest = await client.query(latestQuery);
    console.log('✅ 최근 센서 데이터 (최신순):\n');

    latest.rows.forEach(row => {
      console.log(`[${row.time}] ${row.device_name} (${row.device_id})`);
      if (row.temperature !== null)     console.log(`🌡️ 온도: ${row.temperature}°C`);
      if (row.humidity !== null)        console.log(`💧 습도: ${row.humidity}%`);
      if (row.light !== null)           console.log(`🔆 조도: ${row.light} lux`);
      if (row.soil_moisture !== null)   console.log(`🌱 토양 수분: ${row.soil_moisture}%`);
      if (row.gas !== null)             console.log(`🫁 가스: ${row.gas} ppm`);
      console.log('---------------------------');
    });

    const avg = await client.query(avgQuery);
    const { avg_temp, avg_humid, avg_light, avg_soil, avg_gas } = avg.rows[0];

    console.log('\n📊 전체 평균 값:');
    if (avg_temp !== null)  console.log(`🌡️ 평균 온도: ${avg_temp}°C`);
    if (avg_humid !== null) console.log(`💧 평균 습도: ${avg_humid}%`);
    if (avg_light !== null) console.log(`🔆 평균 조도: ${avg_light} lux`);
    if (avg_soil !== null)  console.log(`🌱 평균 토양 수분: ${avg_soil}%`);
    if (avg_gas !== null)   console.log(`🫁 평균 가스: ${avg_gas} ppm`);

  } catch (err) {
    console.error('❌ 데이터 조회 실패', err);
  } finally {
    client.end();
  }
};

selectSensorData();
