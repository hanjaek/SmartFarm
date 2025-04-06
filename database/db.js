const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'SmartFarm',
  password: '1234', 
  port: 5432,
});

client.connect()
  .then(() => console.log('✅ DB 연결 성공'))
  .catch(err => console.error('❌ DB 연결 실패', err));

module.exports = client;
