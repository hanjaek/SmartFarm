const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // bcrypt 추가
const pool = require('../../db');

// 사용자 정보 조회 (GET)
router.get('/user/profile', async (req, res) => {
  const userId = req.user.userId;  // JWT 토큰에서 userId 추출

  try {
    // 사용자 기본 정보
    const userResult = await pool.query(`
      SELECT user_id, email, user_name, nickname, farm_location, role, provider, created_at
      FROM users
      WHERE user_id = $1
    `, [userId]);

    if (userResult.rowCount === 0) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    const { password, ...userInfo } = userResult.rows[0];  // 비밀번호 제외한 사용자 정보 반환

    // 작물 정보
    const userPlant = await pool.query(`
      SELECT plant_name, planted_at 
      FROM user_plants
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

    const userDashboard = {
      ...userInfo,
      plant: userPlant.rows[0] || null,
      devices: devicesResult.rows,
    };

    res.json(userDashboard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

// 사용자 프로필 수정 (PUT)
router.put('/user/profile', async (req, res) => {
  const userId = req.user.userId;
  const { nickname, farm_location, current_password, new_password } = req.body;

  try {
    if (nickname) {
      const nicknameCheck = await pool.query(
        'SELECT user_id FROM users WHERE nickname = $1 AND user_id != $2',
        [nickname, userId]
      );
      if (nicknameCheck.rowCount > 0) {
        return res.status(409).json({ message: '이미 사용 중인 닉네임입니다.' });
      }
    }

    let hashedPassword = null;
    if (new_password) {
      if (!current_password || current_password.trim() === '') {
        return res.status(400).json({ message: '비밀번호를 변경하려면 현재 비밀번호가 필요합니다.' });
      }

      const userResult = await pool.query(
        'SELECT password FROM users WHERE user_id = $1',
        [userId]
      );

      const isPasswordValid = await bcrypt.compare(current_password, userResult.rows[0].password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: '현재 비밀번호가 올바르지 않습니다.' });
      }

      const isSameAsOld = await bcrypt.compare(new_password, userResult.rows[0].password);
      if (isSameAsOld) {
        return res.status(400).json({ message: '기존 비밀번호와 동일한 비밀번호로 변경할 수 없습니다.' });
      }

      hashedPassword = await bcrypt.hash(new_password, 10);
    }

    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (nickname) {
      fields.push(`nickname = $${paramIndex++}`);
      values.push(nickname);
    }

    if (farm_location) {
      fields.push(`farm_location = $${paramIndex++}`);
      values.push(farm_location);
    }

    if (hashedPassword) {
      fields.push(`password = $${paramIndex++}`);
      values.push(hashedPassword);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: '변경할 항목이 없습니다.' });
    }

    values.push(userId);
    const updateQuery = `UPDATE users SET ${fields.join(', ')} WHERE user_id = $${paramIndex}`;

    await pool.query(updateQuery, values);

    res.status(200).json({ message: '프로필이 성공적으로 수정되었습니다.' });

  } catch (err) {
    console.error('프로필 수정 오류:', err);
    res.status(500).json({ message: '서버 오류로 인해 프로필을 수정할 수 없습니다.' });
  }
});

module.exports = router;