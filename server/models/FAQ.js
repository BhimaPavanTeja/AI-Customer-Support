const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
  qaPairs: [
    {
      question: String,
      answer: String,
    }
  ],
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FAQ", faqSchema);