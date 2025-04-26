const express = require('express');
const router = express.Router(); // JWT 인증 미들웨어
const pool = require('../../db');

//유저의 품종 , 기준치 가져오기
router.get('/user/plant-types', async (req, res) => {
    const userId = req.user.userId;  // JWT에서 사용자 ID 가져오기
  
    try {
      // 사용자별 식물 품종 및 환경 설정 가져오기
      const result = await pool.query(`
        SELECT plant_name, temperature_optimal, humidity_optimal, soil_moisture_optimal
        FROM user_plants
        WHERE user_id = $1
      `, [userId]);
  
      if (result.rows.length > 0) {
        // 품종 목록과 환경 설정 정보 반환
        const plantTypes = result.rows.map(row => ({
          plantName: row.plant_name,
          temperature: row.temperature_optimal,
          humidity: row.humidity_optimal,
          soilMoisture: row.soil_moisture_optimal
        }));
  
        res.json({ success: true, plantTypes });
      } else {
        res.json({ success: false, message: '등록된 식물이 없습니다.' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
  });
  
  
  //내 농장 설정 저장
router.post('/user/environment-settings', async (req, res) => {
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

    module.exports = router;