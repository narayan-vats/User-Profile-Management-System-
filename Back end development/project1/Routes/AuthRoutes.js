// backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");             // for hashing passwords
const jwt = require("jsonwebtoken");          // for tokens
const User = require("../Models/User");       // mongoose user model
const authMiddleware = require("../middleware/authMiddleware");

// helper: create JWT (stores only user id in token payload)
const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

/*
  POST /api/auth/register
  Body: { name, email, password }
  - validates input
  - checks duplicate email
  - hashes password
  - saves user and returns token + user (no password)
*/
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // basic validation
    if (!name || !email || !password)
      return res.status(400).json({ msg: "Please provide name, email and password." });

    if (password.length < 6)
      return res.status(400).json({ msg: "Password must be at least 6 characters." });

    // check if email already used
    const existing = await User.findOne({ email });
    if (existing)
       return res.status(400).json({ msg: "Email already in use." });

    // hash password (10 salt rounds)
    const hashed = await bcrypt.hash(password, 10);

    // create & save the user
    const user = new User({
      name,
      email,
      password: hashed
    });
    await user.save();

    // create token
    const token = createToken(user._id);

    // return user data without password
    const userObj = {
      id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      createdAt: user.createdAt
    };

    res.status(201).json({ token, user: userObj });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error." });
  }
});

/*
  POST /api/auth/login
  Body: { email, password }
  - finds user by email
  - compares password using bcrypt.compare
  - returns token + user (no password)
*/
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ msg: "Please provide email and password." });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

    const token = createToken(user._id);

    const userObj = {
      id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      createdAt: user.createdAt
    };

    res.json({ token, user: userObj });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error." });
  }
});

/*
  GET /api/auth/me
  - protected route
  - authMiddleware verifies token and attaches req.user (id)
  - returns the user (without password)
*/
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // req.user.id was set by the auth middleware
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found." });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error." });
  }
});

module.exports = router;

