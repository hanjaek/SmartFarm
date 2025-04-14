require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const cookieParser = require('cookie-parser');
const moment = require('moment');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// 미들웨어 설정
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// PostgreSQL 연결 설정
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// ✅ DB 연결 테스트
pool.connect()
  .then(client => {
    console.log('✅ PostgreSQL 데이터베이스 연결 성공');
    client.release();
  })
  .catch(err => {
    console.error('❌ PostgreSQL 연결 실패', err);
  });

  // JWT 인증 미들웨어 추가 (✅ 이 부분 추가!)
function authenticateToken(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ success: false, message: '인증 토큰 없음' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: '유효하지 않은 토큰' });
    req.user = user;
    next();
  });
}

// 🌱 회원가입
app.post('/signup', async (req, res) => {
  console.log('[✅ 요청 도착]');
  const { email, password, user_name, nickname, farm_location } = req.body;

  try {
    console.log('[회원가입 시도]', { email, user_name, nickname });

    const hashedPassword = await bcrypt.hash(password, 10);
    const farmLocationValue = farm_location ? farm_location : null;

    const result = await pool.query(
      `INSERT INTO users (email, password, user_name, nickname, farm_location)
       VALUES ($1, $2, $3, $4, $5) RETURNING user_id, role`,
      [email, hashedPassword, user_name, nickname, farmLocationValue]
    );

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.user_id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    console.log('[회원가입 성공]', { userId: user.user_id, role: user.role });

    res
      .cookie('token', token, { httpOnly: true, sameSite: 'Lax', maxAge: 7 * 24 * 60 * 60 * 1000 })
      .json({ success: true, role: user.role });

  } catch (err) {
    console.error('[회원가입 오류]', err);
    res.status(500).json({ success: false, message: '회원가입 실패' });
  }
});

// 🔐 로그인
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('[로그인 시도]', email);

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      console.log('[로그인 실패] 이메일 없음');
      return res.status(401).json({ success: false, message: '이메일 또는 비밀번호가 틀렸습니다.' });
    }

    const user = result.rows[0];
    //const isMatch = await bcrypt.compare(password, user.password);
    const isMatch = password === user.password;
    
    if (!isMatch) {
      console.log('[로그인 실패] 비밀번호 불일치');
      return res.status(401).json({ success: false, message: '이메일 또는 비밀번호가 틀렸습니다.' });
    }

    const token = jwt.sign({ userId: user.user_id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    console.log('[로그인 성공]', { userId: user.user_id, role: user.role });

    res
      .cookie('token', token, { httpOnly: true, sameSite: 'Lax', maxAge: 7 * 24 * 60 * 60 * 1000 })
      .json({ success: true, role: user.role });

  } catch (err) {
    console.error('[로그인 오류]', err);
    res.status(500).json({ success: false, message: '로그인 실패' });
  }
});

// ✅ 자동 로그인
app.get('/me', async (req, res) => {
  const token = req.cookies.token;
  console.log('[자동 로그인 검사]');

  if (!token) {
    console.log('[자동 로그인 실패] 토큰 없음');
    return res.status(401).json({ success: false, message: '토큰 없음' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const result = await pool.query('SELECT role FROM users WHERE user_id = $1', [decoded.userId]);

    if (result.rows.length === 0) {
      console.log('[자동 로그인 실패] 사용자 없음');
      return res.status(401).json({ success: false, message: '사용자 없음' });
    }

    console.log('[자동 로그인 성공]', { userId: decoded.userId });
    res.json({ success: true, role: result.rows[0].role });

  } catch (err) {
    console.error('[자동 로그인 오류]', err);
    res.status(401).json({ success: false, message: '토큰 오류' });
  }
});

// 🚪 로그아웃
app.post("/logout", (req, res) => {
  res.clearCookie("token"); // HttpOnly 쿠키 제거
  res.json({ success: true, message: "로그아웃 완료" });
});

// ✅ User의 대시보드
app.get('/user/dashboard', authenticateToken, async (req, res) => {
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

// ✅ User의 환경 그래프
app.get('/user/sensor-data', authenticateToken, async (req, res) => {
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


// 💡 장치 상태 관련 API
let lightStatus = "OFF";
let fanStatus = "OFF";
let wateringStatus = "OFF";

app.get('/light/status', (req, res) => res.json({ lightStatus }));
app.post('/light/toggle', (req, res) => {
  const { lightStatus: status } = req.body;
  if (status !== 'ON' && status !== 'OFF') return res.status(400).json({ error: 'invalid lightStatus' });
  lightStatus = status;
  res.json({ lightStatus });
});

app.get('/fan/status', (req, res) => res.json({ fanStatus }));
app.post('/fan/toggle', (req, res) => {
  const { fanStatus: status } = req.body;
  if (status !== 'ON' && status !== 'OFF') return res.status(400).json({ error: 'invalid fanStatus' });
  fanStatus = status;
  res.json({ fanStatus });
});

app.get('/watering/status', (req, res) => res.json({ wateringStatus }));
app.post('/watering/toggle', (req, res) => {
  const { wateringStatus: status } = req.body;
  if (status !== 'ON' && status !== 'OFF') return res.status(400).json({ error: 'invalid wateringStatus' });
  wateringStatus = status;
  res.json({ wateringStatus });
});

//유저의 품종 , 기준치 가져오기
app.get('/user/plant-types', authenticateToken, async (req, res) => {
  console.log('✅ 이건 찍히는가?');
  const userId = req.user.userId;  // JWT에서 사용자 ID 가져오기

  try {
    // 사용자별 식물 품종 및 환경 설정 가져오기
    const result = await pool.query(`
      SELECT plant_name, temperature_optimal, humidity_optimal, soil_moisture_optimal
      FROM user_plants
      WHERE user_id = $1
    `, [userId]);

    // 쿼리 결과 로깅
    console.log('Query result rows:', result.rows);

    if (result.rows.length > 0) {
      // 품종 목록과 환경 설정 정보 반환
      const plantTypes = result.rows.map(row => ({
        plantName: row.plant_name,
        temperature: row.temperature_optimal,
        humidity: row.humidity_optimal,
        soilMoisture: row.soil_moisture_optimal
      }));

      // 로깅: 최종적으로 반환할 데이터
      console.log('Plant Types:', plantTypes);

      res.json({ success: true, plantTypes });
    } else {
      res.json({ success: false, message: '등록된 식물이 없습니다.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});


//환결 설정 저장
app.post('/user/environment-settings', authenticateToken, async (req, res) => {
  const { plantName, temperature, humidity, soilMoisture } = req.body;
  const userId = req.user.userId;  // JWT에서 사용자 ID 가져오기

  try {
    // 사용자에 해당하는 식물의 환경 설정을 업데이트
    const result = await pool.query(`
      UPDATE user_plants
      SET temperature_optimal = $1, humidity_optimal = $2, soil_moisture_optimal = $3
      WHERE user_id = $4 AND plant_name = $5
      RETURNING *
    `, [temperature, humidity, soilMoisture, userId, plantName]);

    if (result.rows.length > 0) {
      return res.json({ success: true, message: '환경 설정이 저장되었습니다.' });
    } else {
      return res.json({ success: false, message: '환경 설정 저장에 실패했습니다.' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});


// 서버 실행
app.listen(PORT, () => {
  console.log(`🌐 서버 실행 중: http://localhost:${PORT}`);
});
