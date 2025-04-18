// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();

const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 🌱 회원가입
router.post('/signup', async (req, res) => {
  console.log('[✅ 요청 도착]');
  const { email, password, user_name, nickname, farm_location } = req.body;

  try {
    console.log('[회원가입 시도]', { email, user_name, nickname });

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const farmLocationValue = farm_location ? farm_location : null;

    const result = await pool.query(
      `INSERT INTO users (email, password, user_name, nickname, farm_location)
       VALUES ($1, $2, $3, $4, $5) RETURNING user_id, role`,
      [email, hashedPassword, user_name, nickname, farmLocationValue]
    );

    console.log('[회원가입 성공]', { userId: result.rows[0].user_id });

    // ❌ JWT 발급 및 쿠키 설정은 생략
    res.json({ success: true, message: '회원가입 성공! 이제 로그인 해주세요.' });

  } catch (err) {
    console.error('[회원가입 오류]', err);
    res.status(500).json({ success: false, message: '회원가입 실패' });
  }
});

// 🔐 로그인
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('[로그인 시도]', email);

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      console.log('[로그인 실패] 이메일 없음');
      return res.status(401).json({ success: false, message: '이메일 또는 비밀번호가 틀렸습니다.' });
    }

    const user = result.rows[0];

    let isMatch = false;
    if (user.password.startsWith('$2b$')) {
      // 암호화된 비밀번호일 경우 bcrypt.compare 사용 (테스트용으로 평문 비밀번호 비교도 가능)
      isMatch = await bcrypt.compare(password, user.password); 
    } else {
      // 평문 비밀번호일 경우 바로 비교
      isMatch = password === user.password;
    }

    //const isMatch = await bcrypt.compare(password, user.password); 비문
    //const isMatch = password === user.password; 평문
    
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

// ✅ 자동 로그인 및 사용자 정보 반환
router.get('/me', async (req, res) => {
  const token = req.cookies.token;
  console.log('[자동 로그인 검사]');

  if (!token) {
    console.log('[자동 로그인 실패] 토큰 없음');
    return res.status(401).json({ success: false, message: '토큰 없음' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const result = await pool.query('SELECT user_id, role FROM users WHERE user_id = $1', [decoded.userId]);

    if (result.rows.length === 0) {
      console.log('[자동 로그인 실패] 사용자 없음');
      return res.status(401).json({ success: false, message: '사용자 없음' });
    }

    console.log('[자동 로그인 성공]', { userId: decoded.userId });
    res.json({ success: true, userId: decoded.userId, role: result.rows[0].role });

  } catch (err) {
    console.error('[자동 로그인 오류]', err);
    res.status(401).json({ success: false, message: '토큰 오류' });
  }
});

// 🚪 로그아웃
router.post("/logout", (req, res) => {
    res.clearCookie("token"); // HttpOnly 쿠키 제거
    res.json({ success: true, message: "로그아웃 완료" });
  });

module.exports = router;