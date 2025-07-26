const express = require('express');
const router = express.Router();
const axios = require('axios');
const Conversation = require('../models/Conversation');
require('dotenv').config();

// Function to get AI response using Groq
const getAIResponse = async (userMessage) => {
  const res = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
    model: 'llama3-70b-8192',
    messages: [{ role: 'user', content: userMessage }],
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  return res.data.choices[0].message.content;
};

// POST /api/chat
router.post('/', async (req, res) => {
  try {
    const { userId, message, conversationId } = req.body;

    console.log("🟢 Incoming request body:", req.body);

    let conversation = conversationId
      ? await Conversation.findById(conversationId)
      : new Conversation({ userId, messages: [] });

    conversation.messages.push({ sender: 'user', text: message });

    const aiText = await getAIResponse(message);
    console.log("🤖 Groq AI responded with:", aiText);

    const aiResponse = { sender: 'ai', text: aiText };
    conversation.messages.push(aiResponse);
    await conversation.save();

    res.json({
      conversationId: conversation._id,
      response: aiText
    });

  } catch (err) {
  console.error("❌ Full error in /api/chat:", err.response?.data || err.message || err);
  res.status(500).json({ error: "Something went wrong in /api/chat" });
}

});

module.exports = router;
