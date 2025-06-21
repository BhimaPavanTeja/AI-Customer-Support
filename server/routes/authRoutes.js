const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const SECRET = "supersecretkey"; // Store in .env in real app

const users = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "user", password: "user123", role: "user" },
];

// POST /auth/login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ username, role: user.role }, SECRET, { expiresIn: "2h" });
  res.json({ token });
});

// Middleware to protect routes
const verifyToken = (roles = []) => (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(403).json({ message: "Token required" });

  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    if (roles.length > 0 && !roles.includes(decoded.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = { authRouter: router, verifyToken };
