// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.DBURL)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ DB Error: ", err));

// Routes
const authRoutes = require("./Routes/AuthRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/profile", require("./Routes/profileRoutes"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
