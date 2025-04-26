const express = require('express');
const router = express.Router();
const pool = require('../../db');

// ✅ User의 대시보드
router.get('/user/dashboard',async (req, res) => {
    const userId = req.user.userId;
  
    try {
      // 작물 정보
      const userPlant = await pool.query(`
        SELECT plant_name, planted_at FROM user_plants
        WHERE user_id = $1 LIMIT 1
      `, [userId]);
  
      // 장치 상태들
      const devicesResult = await pool.query(`
        SELECT d.device_id, d.type AS device_type, ds.device_status AS status, ds.updated_at
        FROM devices d
        JOIN device_status ds ON d.device_id = ds.device_id
        WHERE d.user_id = $1
        ORDER BY ds.updated_at DESC
      `, [userId]);
  
      const devices = devicesResult.rows.map(device => ({
        id: device.device_id,
        type: device.device_type,
        status: device.status
      }));
  
      // 최신 센서 데이터 (최근 1개)
      const recentSensorData = await pool.query(`
        SELECT time, 
               MAX(CASE WHEN sensor_type = 'temperature' THEN sensor_value END) AS temperature,
               MAX(CASE WHEN sensor_type = 'humidity' THEN sensor_value END) AS humidity,
               MAX(CASE WHEN sensor_type = 'soil_moisture' THEN sensor_value END) AS soil_moisture
        FROM sensor_logs
        JOIN devices ON sensor_logs.device_id = devices.device_id
        WHERE devices.user_id = $1
        GROUP BY time
        ORDER BY time DESC
        LIMIT 1
      `, [userId]);
  
      // ✅ 1시간 단위 평균값 집계 (최근 24시간)
      const hourlyAverages = await pool.query(`
        SELECT
          time_bucket('1 hour', time) AS hour,
          AVG(CASE WHEN sensor_type = 'temperature' THEN sensor_value END) AS avg_temperature,
          AVG(CASE WHEN sensor_type = 'humidity' THEN sensor_value END) AS avg_humidity,
          AVG(CASE WHEN sensor_type = 'soil_moisture' THEN sensor_value END) AS avg_soil_moisture
        FROM sensor_logs
        JOIN devices ON sensor_logs.device_id = devices.device_id
        WHERE devices.user_id = $1
          AND time > NOW() - INTERVAL '24 hours'
        GROUP BY hour
        ORDER BY hour
      `, [userId]);
  
      const dailySensorLogs = hourlyAverages.rows.map(row => ({
        time: row.hour,
        temperature: Number(row.avg_temperature),
        humidity: Number(row.avg_humidity),
        soil_moisture: Number(row.avg_soil_moisture)
      }));
  
      res.json({
        crop: userPlant.rows[0]?.plant_name ?? '등록된 작물 없음',
        plantedAt: userPlant.rows[0]?.planted_at,
        devices,
        sensorLogs: recentSensorData.rows.reverse(),
        dailySensorLogs // ✅ 1시간 단위 하루치 센서 로그
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: '데이터 불러오기 실패' });
    }
  });

  module.exports = router;

