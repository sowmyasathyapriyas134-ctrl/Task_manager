// src/routes/userRoutes.js
// Defines user-related routes and task count aggregation

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Aggregation endpoint: GET /api/users/task-count (placed before :id route)
router.get("/task-count", userController.getUserTaskCounts);

// Core User routes
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);

module.exports = router;
