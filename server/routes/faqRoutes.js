// 📁 server/routes/faqRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const FAQ = require("../models/FAQ");

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("faqFile"), async (req, res) => {
  try {
    const filePath = req.file.path;
    let content = "";

    if (req.file.mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      content = pdfData.text;
    } else if (req.file.mimetype === "text/plain") {
      content = fs.readFileSync(filePath, "utf-8");
    } else {
      return res.status(400).json({ message: "Only PDF or TXT files allowed." });
    }

    fs.unlinkSync(filePath); // Clean up

    // 🔍 Extract question-answer pairs
    const faqPairs = [];
    const regex = /\d+\.\s+(.*?)\n(.*?)(?=\n\d+\\.|$)/gs;

    let match;
    while ((match = regex.exec(content)) !== null) {
      const question = match[1].trim();
      const answer = match[2].trim();
      faqPairs.push({ question, answer });
    }

    await FAQ.create({ qaPairs: faqPairs });

    res.json({ message: "FAQ uploaded and processed successfully." });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Error processing file." });
  }
});

module.exports = router;
