require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Routes
const chatRoutes = require("./routes/chatRoutes");
app.use("/chat", chatRoutes);

const faqRoutes = require("./routes/faqRoutes");
app.use("/faq", faqRoutes);

const { authRouter } = require("./routes/authRoutes");
app.use("/auth", authRouter);



mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
