// src/routes/taskRoutes.js
// Defines all task-related URL routes and maps them to controller functions

const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

// SQL JOIN Demonstration endpoints (placed before :id route)
router.get("/with-users", taskController.getTasksWithUsers);
router.get("/left-join", taskController.getLeftJoinTasks);

// Core CRUD task routes
router.get("/", taskController.getAllTasks);
router.get("/:id", taskController.getTaskById);
router.post("/", taskController.createTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);
router.patch("/:id/status", taskController.updateTaskStatus);

module.exports = router;
