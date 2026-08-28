// src/controllers/userController.js
// Handles HTTP requests for User entities and SQL JOIN aggregation stats

const userService = require("../services/userService");

// ─── GET /api/users ───────────────────────────────────────────────────────────
const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/users/task-count ────────────────────────────────────────────────
// Demonstrates SQL JOIN + GROUP BY + COUNT() aggregation
const getUserTaskCounts = async (req, res, next) => {
  try {
    const counts = await userService.getUserTaskCounts();
    res.status(200).json(counts);
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/users/:id ───────────────────────────────────────────────────────
const getUserById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await userService.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserTaskCounts,
  getUserById,
};
