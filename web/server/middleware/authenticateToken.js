require('dotenv').config();

const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;  // ✅ 쿠키에서 토큰을 읽음

  if (!token) {
    return res.status(401).json({ message: "토큰이 없습니다." });
  }

  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "유효하지 않은 토큰입니다." });
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
