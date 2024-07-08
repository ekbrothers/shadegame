const express = require('express');
const router = express.Router();
const schedule = require('../data/schedule.json');
const stadium = require('../data/stadium.json');

router.get('/schedule', (req, res) => {
  res.json(schedule);
});

router.get('/stadium', (req, res) => {
  res.json(stadium);
});

module.exports = router;
