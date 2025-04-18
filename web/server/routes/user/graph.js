const express = require('express');
const router = express.Router();
const pool = require('../../db');
const moment = require('moment');

// ✅ User의 환경 그래프
router.get('/user/sensor-data', async (req, res) => {
  const userId = req.user.userId; // authenticateToken 미들웨어에서 userId 추출
  const { timeFrame } = req.query;

  if (!timeFrame || !['7days', '30days'].includes(timeFrame)) {
    return res.status(400).json({ error: 'Invalid timeFrame parameter' });
  }

  const currentDate = moment();  // 현재 날짜와 시간
  let startDate;

  if (timeFrame === '7days') {
    startDate = currentDate.clone().subtract(7, 'days').format('YYYY-MM-DD');
  } else if (timeFrame === '30days') {
    startDate = currentDate.clone().subtract(30, 'days').format('YYYY-MM-DD');
  }

  try {
    const query = `
      SELECT DATE(time) as date, sensor_type, AVG(sensor_value) as avg_value
      FROM sensor_logs
      JOIN devices ON sensor_logs.device_id = devices.device_id
      WHERE devices.user_id = $1
        AND time >= $2
        AND time <= $3
      GROUP BY DATE(time), sensor_type
      ORDER BY DATE(time);
    `;
    const result = await pool.query(query, [userId, startDate, currentDate.format('YYYY-MM-DD')]);

    const sensorData = result.rows.reduce((acc, row) => {
      const date = moment(row.date).format('YYYY-MM-DD');
      if (!acc[date]) {
        acc[date] = {
          date,
          temperature: null,
          humidity: null,
          moisture: null,
        };
      }
      if (row.sensor_type === 'temperature') acc[date].temperature = row.avg_value;
      if (row.sensor_type === 'humidity') acc[date].humidity = row.avg_value;
      if (row.sensor_type === 'soil_moisture') acc[date].moisture = row.avg_value;
      return acc;
    }, {});

    const data = Object.values(sensorData);
    res.json(data);
  } catch (error) {
    console.error("Error fetching sensor data: ", error);
    res.status(500).json({ message: '서버 오류 발생', error: error.message });
  }
});

module.exports = router;