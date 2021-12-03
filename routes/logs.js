const express = require('express');
const router = express.Router();
const LogServices = require('../services/LogServices.js');

router.get('/time', LogServices.getLogsByTimePeriod);
router.get('/level/:level', LogServices.getLogsByLevel);
router.get('/', LogServices.getAllLogs);

module.exports = router;
