// server/routes/chatRoutes.js
const express = require("express");
const router = express.Router();
const Conversation = require("../models/Conversation");
const FAQ = require("../models/FAQ");
const { getBotReply } = require("../utils/azureOpenAI");

// Match user question to stored Q&A pairs
async function findAnswerFromFAQ(userMessage) {
  const faq = await FAQ.findOne().sort({ uploadedAt: -1 });
  if (!faq) return null;

  for (const { question, answer } of faq.qaPairs) {
    if (question.toLowerCase().includes(userMessage.toLowerCase())) {
      return answer;
    }
  }

  return null;
}

// ✅ Chat route with FAQ check first
router.post("/", async (req, res) => {
  const { message, userId } = req.body;

  try {
    let convo = await Conversation.findOne({ userId });
    if (!convo) {
      convo = new Conversation({ userId, messages: [] });
    }

    convo.messages.push({ role: "user", content: message });

    const matchedAnswer = await findAnswerFromFAQ(message);
    if (matchedAnswer) {
      convo.messages.push({ role: "assistant", content: matchedAnswer });
      await convo.save();
      return res.json({ reply: matchedAnswer });
    }

    const reply = await getBotReply(convo.messages);
    convo.messages.push({ role: "assistant", content: reply });
    await convo.save();

    res.json({ reply });
  } catch (error) {
    console.error("Chat error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/history/:userId", async (req, res) => {
  const { userId } = req.params;
  const convo = await Conversation.findOne({ userId });
  if (!convo) return res.json({ messages: [] });

  res.json({ messages: convo.messages });
});

module.exports = router;
