const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
require('dotenv').config();

// POST /api/chat
router.post('/', async (req, res) => {
  res.status(403).json({ error: "API access is disabled." });
});

module.exports = router;
