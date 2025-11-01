// routes/profileRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../Models/User"); // import User model
const authMiddleware = require("../middleware/authMiddleware"); // to protect routes

// ---------------------------------------------
// @route   GET /api/profile/me
// @desc    Get logged-in user's profile
// @access  Private (JWT required)
// ---------------------------------------------
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // req.user comes from authMiddleware (decoded JWT user)
    const user = await User.findById(req.user.id).select("-password"); // remove password field
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// ---------------------------------------------
// @route   PUT /api/profile/update
// @desc    Update user's name or email
// @access  Private
// ---------------------------------------------
router.put("/update", authMiddleware, async (req, res) => {
  try {
    const { name, email } = req.body; // fields to update
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true } // return updated user
    ).select("-password");

    res.json({
      msg: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// ---------------------------------------------
// @route   DELETE /api/profile/delete
// @desc    Delete user account
// @access  Private
// ---------------------------------------------
router.delete("/delete", authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
