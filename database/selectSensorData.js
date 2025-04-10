const client = require('./db');

const selectSensorData = async () => {
  // 최신 10개 데이터 (온도, 습도, 조도, 토양, CO2 중 하나라도 있는 행)
  const latestQuery = `
    SELECT * FROM sensor_data
    WHERE temperature IS NOT NULL OR humidity IS NOT NULL OR light IS NOT NULL OR soil IS NOT NULL OR co2 IS NOT NULL
    ORDER BY time DESC
    LIMIT 10
  `;

  // 센서별 평균값
  const avgQuery = `
    SELECT
      ROUND(AVG(temperature)::numeric, 2) AS avg_temp,
      ROUND(AVG(humidity)::numeric, 2) AS avg_humid,
      ROUND(AVG(light)::numeric, 2) AS avg_light,
      ROUND(AVG(soil)::numeric, 2) AS avg_soil,
      ROUND(AVG(co2)::numeric, 2) AS avg_co2
    FROM sensor_data
  `;

  try {
    const latest = await client.query(latestQuery);
    console.log('✅ 최근 센서 데이터 (최신순):\n');
    latest.rows.forEach(row => {
      console.log(`[${row.time}] 디바이스 ${row.device_id}`);
      if (row.temperature !== null) console.log(`🌡️ 온도: ${row.temperature}°C`);
      if (row.humidity !== null)    console.log(`💧 습도: ${row.humidity}%`);
      if (row.light !== null)       console.log(`🔆 조도: ${row.light} lux`);
      if (row.soil !== null)        console.log(`🌱 토양 수분: ${row.soil}%`);
      if (row.co2 !== null)         console.log(`🫁 CO₂: ${row.co2} ppm`);
      console.log('---------------------------');
    });

    const avg = await client.query(avgQuery);
    const { avg_temp, avg_humid, avg_light, avg_soil, avg_co2 } = avg.rows[0];

    console.log('\n📊 전체 평균 값:');
    if (avg_temp !== null)  console.log(`🌡️ 평균 온도: ${avg_temp}°C`);
    if (avg_humid !== null) console.log(`💧 평균 습도: ${avg_humid}%`);
    if (avg_light !== null) console.log(`🔆 평균 조도: ${avg_light} lux`);
    if (avg_soil !== null)  console.log(`🌱 평균 토양 수분: ${avg_soil}%`);
    if (avg_co2 !== null)   console.log(`🫁 평균 CO₂: ${avg_co2} ppm`);

  } catch (err) {
    console.error('❌ 데이터 조회 실패', err);
  } finally {
    client.end();
  }
};

selectSensorData();
