
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");
const jobRoutes = require("./routes/jobRoutes");
const savedJobRoutes = require("./routes/savedJobRoutes");
const walkInRoutes = require("./routes/walkInRoutes");
const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/saved-jobs", savedJobRoutes);
app.use("/api/walkins", walkInRoutes);
// Home route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Job Agent Backend is running"
    });
});

module.exports = app;
