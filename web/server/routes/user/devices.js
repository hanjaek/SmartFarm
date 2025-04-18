// 💡 장치 상태 관련 API
const express = require('express');
const router = express.Router();
const pool = require('../../db');

// 💡 장치 상태 관련 API
let lightStatus = "OFF";
let fanStatus = "OFF";
let wateringStatus = "OFF";

router.get('/light/status', (req, res) => res.json({ lightStatus }));

router.post('/light/toggle', (req, res) => {
  const { lightStatus: status } = req.body;
  if (status !== 'ON' && status !== 'OFF') return res.status(400).json({ error: 'invalid lightStatus' });
  lightStatus = status;
  res.json({ lightStatus });
});

router.get('/fan/status', (req, res) => res.json({ fanStatus }));
router.post('/fan/toggle', (req, res) => {
  const { fanStatus: status } = req.body;
  if (status !== 'ON' && status !== 'OFF') return res.status(400).json({ error: 'invalid fanStatus' });
  fanStatus = status;
  res.json({ fanStatus });
});

router.get('/watering/status', (req, res) => res.json({ wateringStatus }));
router.post('/watering/toggle', (req, res) => {
  const { wateringStatus: status } = req.body;
  if (status !== 'ON' && status !== 'OFF') return res.status(400).json({ error: 'invalid wateringStatus' });
  wateringStatus = status;
  res.json({ wateringStatus });
});

module.exports = router;