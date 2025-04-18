const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

// 환경변수 설정
dotenv.config();

const { authenticateToken } = require('./middleware/authenticateToken.js');

// 라우트 파일들 불러오기
const authRouter = require('./routes/auth');
const boardRouter = require('./routes/board');
const userRouter = require('./routes/user/dashboard');
const devicesRouter = require('./routes/user/devices');
const environmentRouter = require('./routes/user/environment.js');
const graphRouter = require('./routes/user/graph.js');
const profileRouter = require('./routes/user/profile.js');
const postRouter = require('./routes/user/post.js');


const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어 설정
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// 업로드된 파일을 클라이언트에서 접근할 수 있도록 설정 (boardRouter에서 사용될 예정)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));  // 추가

// 라우트 설정
app.use('/', authRouter);
app.use('/', boardRouter);
app.use('/', authenticateToken, userRouter);  // 인증된 사용자만 접근 가능한 대시보드
app.use('/', authenticateToken, devicesRouter);  // 인증된 사용자만 접근 가능한 장치 관련 API
app.use('/', authenticateToken, environmentRouter);
app.use('/', authenticateToken, graphRouter);
app.use('/', authenticateToken, profileRouter);
app.use('/', authenticateToken, postRouter);

// 서버 실행
app.listen(PORT, () => {
  console.log(`🌐 서버 실행 중: http://localhost:${PORT}`);
});
