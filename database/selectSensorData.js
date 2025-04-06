const client = require('./db');

const selectSensorData = async () => {
  const latestQuery = `
    SELECT * FROM dht11_data
    ORDER BY time DESC
    LIMIT 10
  `;

  const avgQuery = `
    SELECT
        ROUND(AVG(temperature)::numeric, 2) AS avg_temp,
        ROUND(AVG(humidity)::numeric, 2) AS avg_humid
    FROM dht11_data
  `;

  try {
    // 최신 10개 조회
    const latest = await client.query(latestQuery);
    console.log('✅ 최근 센서 데이터 (최신순):');
    latest.rows.forEach(row => {
      console.log(`[${row.time}] ${row.device_id} - ${row.temperature}°C / ${row.humidity}%`);
    });

    // 전체 평균 조회
    const avg = await client.query(avgQuery);
    const { avg_temp, avg_humid } = avg.rows[0];
    console.log('\n📊 전체 평균');
    console.log(`🌡️ 평균 온도: ${avg_temp}°C`);
    console.log(`💧 평균 습도: ${avg_humid}%`);

  } catch (err) {
    console.error('❌ 데이터 조회 실패', err);
  } finally {
    client.end();
  }
};

selectSensorData();
