require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');  // axios를 가져옵니다.

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// 환경 변수에서 라즈베리파이 IP 가져오기 (localhost로 로컬 테스트 가능)
const RPI_IP = process.env.RPI_IP || 'localhost'; // 로컬 개발을 위한 기본값 localhost

// 초기 상태
let lightStatus = "OFF";
let fanStatus = "OFF";
let wateringStatus = "OFF";

// 로그인 처리
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === '1234') {
    res.status(200).json({ success: true, role: 'admin' });
  } else if (username === 'user' && password === '1234') {
    res.status(200).json({ success: true, role: 'user' });
  } else {
    res.status(401).json({ success: false, message: '로그인 실패: 아이디 또는 비밀번호가 틀렸습니다.' });
  }
});

app.get('/light/status', (req, res) => {
  console.log(`📥 [Light Status 요청] 현재 상태: ${lightStatus}`);
  res.json({ lightStatus });
});

// 상태 반환 - 팬
app.get('/fan/status', (req, res) => {
  console.log(`📥 [Fan Status 요청] 현재 상태: ${fanStatus}`);
  res.json({ fanStatus });
});

// 상태 반환 - 급수
app.get('/watering/status', (req, res) => {
  console.log(`📥 [Watering Status 요청] 현재 상태: ${wateringStatus}`);
  res.json({ wateringStatus });
});

// 조명 토글
app.post('/light/toggle', (req, res) => {
  const { lightStatus: requestedStatus } = req.body;

  if (!requestedStatus || (requestedStatus !== 'ON' && requestedStatus !== 'OFF')) {
    return res.status(400).json({ error: '유효하지 않은 lightStatus 값입니다. (ON 또는 OFF)' });
  }

  lightStatus = requestedStatus;
  console.log(`✅ 조명 상태 변경됨 → 현재 상태: ${lightStatus}`);
  res.json({ lightStatus });
});

// 팬 토글
app.post('/fan/toggle', (req, res) => {
  const { fanStatus: requestedStatus } = req.body;

  if (!requestedStatus || (requestedStatus !== 'ON' && requestedStatus !== 'OFF')) {
    return res.status(400).json({ error: '유효하지 않은 fanStatus 값입니다. (ON 또는 OFF)' });
  }

  fanStatus = requestedStatus;
  console.log(`✅ 팬 상태 변경됨 → 현재 상태: ${fanStatus}`);
  res.json({ fanStatus });
});

// 급수 토글
app.post('/watering/toggle', (req, res) => {
  const { wateringStatus: requestedStatus } = req.body;

  if (!requestedStatus || (requestedStatus !== 'ON' && requestedStatus !== 'OFF')) {
    return res.status(400).json({ error: '유효하지 않은 wateringStatus 값입니다. (ON 또는 OFF)' });
  }

  wateringStatus = requestedStatus;
  console.log(`✅ 급수 상태 변경됨 → 현재 상태: ${wateringStatus}`);
  res.json({ wateringStatus });
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`🌐 웹서버 실행 중: http://localhost:${PORT}`);
});
