const express = require("express");
const router = express.Router();
const Conversation = require("../models/Conversation");
const { getBotReply } = require("../utils/azureOpenAI");

// POST /chat → Send message and get bot reply
router.post("/", async (req, res) => {
  const { message, userId } = req.body;

  try {
    let convo = await Conversation.findOne({ userId });
    if (!convo) {
      convo = new Conversation({ userId, messages: [] });
    }

    // Add user message
    convo.messages.push({ role: "user", content: message });

    // Get bot reply from Azure OpenAI
    const reply = await getBotReply(convo.messages);

    // Add assistant message
    convo.messages.push({ role: "assistant", content: reply });

    await convo.save();

    res.json({ reply });
  } catch (error) {
    console.error("Chat error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /chat/history/:userId → Get previous conversation
router.get("/history/:userId", async (req, res) => {
  const { userId } = req.params;
  const convo = await Conversation.findOne({ userId });
  if (!convo) return res.json({ messages: [] });

  res.json({ messages: convo.messages });
});

module.exports = router;
