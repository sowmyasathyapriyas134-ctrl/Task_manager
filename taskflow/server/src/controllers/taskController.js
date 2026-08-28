// src/controllers/taskController.js
// Controllers receive HTTP requests, validate input, call the service layer,
// and return the appropriate HTTP response.
//
// Flow: Route → Controller → Service → Prisma → PostgreSQL

const taskService = require("../services/taskService");

// ─── GET /api/tasks ───────────────────────────────────────────────────────────
// Supports optional query param: ?status=PENDING | IN_PROGRESS | COMPLETED
const getAllTasks = async (req, res, next) => {
  try {
    const { status } = req.query;
    const tasks = await taskService.getAllTasks(status);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/tasks/with-users ────────────────────────────────────────────────
// Demonstration of SQL INNER JOIN behavior (Tasks joined with Users)
const getTasksWithUsers = async (req, res, next) => {
  try {
    const joinedTasks = await taskService.getTasksWithUsersJoin();
    res.status(200).json(joinedTasks);
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/tasks/left-join ─────────────────────────────────────────────────
// Demonstration of SQL LEFT JOIN behavior (All Users including those with NULL tasks)
const getLeftJoinTasks = async (req, res, next) => {
  try {
    const leftJoinData = await taskService.getUsersWithTasksLeftJoin();
    res.status(200).json(leftJoinData);
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/tasks/:id ───────────────────────────────────────────────────────
const getTaskById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    const task = await taskService.getTaskById(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/tasks ──────────────────────────────────────────────────────────
// Body: { title, description?, priority?, userId? }
const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, userId } = req.body;

    // Basic validation
    if (!title || typeof title !== "string" || title.trim().length < 3) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Title is required and must be at least 3 characters long",
      });
    }

    // Validate priority if provided
    const validPriorities = ["LOW", "MEDIUM", "HIGH"];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Priority must be LOW, MEDIUM, or HIGH",
      });
    }

    const newTask = await taskService.createTask({
      title: title.trim(),
      description: description ? description.trim() : undefined,
      priority: priority || "MEDIUM",
      userId: userId ? parseInt(userId) : null,
    });

    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/tasks/:id ───────────────────────────────────────────────────────
// Body: { title?, description?, priority?, status?, userId? }
const updateTask = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    const { title, description, priority, status, userId } = req.body;

    // Check task exists
    const existing = await taskService.getTaskById(id);
    if (!existing) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Validate title length if provided
    if (title && title.trim().length < 3) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Title must be at least 3 characters long",
      });
    }

    // Validate priority if provided
    const validPriorities = ["LOW", "MEDIUM", "HIGH"];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Priority must be LOW, MEDIUM, or HIGH",
      });
    }

    // Validate status if provided
    const validStatuses = ["PENDING", "IN_PROGRESS", "COMPLETED"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Status must be PENDING, IN_PROGRESS, or COMPLETED",
      });
    }

    const updated = await taskService.updateTask(id, {
      title: title ? title.trim() : undefined,
      description: description !== undefined ? description.trim() : undefined,
      priority,
      status,
      userId: userId !== undefined ? (userId ? parseInt(userId) : null) : undefined,
    });

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/tasks/:id ────────────────────────────────────────────────────
const deleteTask = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    const existing = await taskService.getTaskById(id);
    if (!existing) {
      return res.status(404).json({ error: "Task not found" });
    }

    await taskService.deleteTask(id);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// ─── PATCH /api/tasks/:id/status ─────────────────────────────────────────────
// Body: { status: "COMPLETED" }
const updateTaskStatus = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    const { status } = req.body;
    const validStatuses = ["PENDING", "IN_PROGRESS", "COMPLETED"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Status must be PENDING, IN_PROGRESS, or COMPLETED",
      });
    }

    const existing = await taskService.getTaskById(id);
    if (!existing) {
      return res.status(404).json({ error: "Task not found" });
    }

    const updated = await taskService.updateTaskStatus(id, status);
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTasks,
  getTasksWithUsers,
  getLeftJoinTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
};
