require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const chatRoutes = require("./routes/chatRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/chat", chatRoutes);

app.get("/history/:userId", async (req, res) => {
  const { userId } = req.params;
  const convo = await Conversation.findOne({ userId });
  if (!convo) return res.json({ messages: [] });
  res.json({ messages: convo.messages });
});


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
