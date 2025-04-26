const { Pool } = require('pg');
const dotenv = require('dotenv');

// 환경변수 로드
dotenv.config();

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

module.exports = pool;