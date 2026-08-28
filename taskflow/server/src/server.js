// src/server.js
// Main entry point for the TaskFlow Express backend

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ────────────────────────────────────────────────────────────────

// Allow the React frontend (http://localhost:5173) to talk to this server
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

// Parse incoming JSON request bodies
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────

// Mount all task-related routes under /api/tasks
app.use("/api/tasks", taskRoutes);

// Mount all user-related and JOIN-aggregation routes under /api/users
app.use("/api/users", userRoutes);

// Health check endpoint - useful for verifying the server is running
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "TaskFlow server is running!" });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ─── Centralized Error Handler ────────────────────────────────────────────────
// Express error handlers have 4 parameters: (err, req, res, next)

app.use((err, req, res, next) => {
  console.error("Server error:", err.message);
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🚀 TaskFlow server is running on http://localhost:${PORT}`);
  console.log(`📋 Task API: http://localhost:${PORT}/api/tasks`);
  console.log(`👤 User & JOIN API: http://localhost:${PORT}/api/users`);
  console.log(`❤️  Health check: http://localhost:${PORT}/api/health\n`);
});
