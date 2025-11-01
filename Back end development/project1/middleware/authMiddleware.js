// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // try common places for token: Authorization header or x-auth-token
  const authHeader = req.headers.authorization || req.headers["x-auth-token"];
  if (!authHeader) return res.status(401).json({ msg: "No token, authorization denied." });

  // Authorization header format: "Bearer <token>"
  let token = null;
  if (authHeader.startsWith("Bearer ")) token = authHeader.split(" ")[1];
  else token = authHeader; // allow raw token in x-auth-token for simplicity

  if (!token) return res.status(401).json({ msg: "Token missing." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // store minimal info so other routes can use it
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ msg: "Token is not valid." });
  }
};
