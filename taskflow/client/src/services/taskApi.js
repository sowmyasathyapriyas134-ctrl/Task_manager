// src/services/taskApi.js
// All API calls to the Express backend are made here.
//
// ── JAVASCRIPT CONCEPT DEMONSTRATION ──
// This file deliberately uses BOTH fetch styles to show the difference:
//
//   • getTasks()           → async/await  (clean, readable)
//   • createTask()         → .then()/.catch()  (explicit Promise chaining)
//   • updateTaskStatus()   → async/await
//   • deleteTask()         → async/await
//   • updateTask()         → async/await
//   • getUsers()           → async/await
//   • getTasksWithUsers()  → async/await  (SQL INNER JOIN endpoint)
//   • getLeftJoinTasks()   → async/await  (SQL LEFT JOIN endpoint)
//   • getUserTaskCounts()  → async/await  (SQL JOIN + GROUP BY + COUNT)

// Base URLs - during development, Vite proxies /api → http://localhost:5000
const API_BASE = "/api/tasks";
const USERS_API_BASE = "/api/users";

// ─── GET all tasks (with optional status filter) ──────────────────────────────
// STYLE: async/await
async function getTasks(status) {
  const url = status ? `${API_BASE}?status=${status}` : API_BASE;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch tasks: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

// ─── CREATE task ──────────────────────────────────────────────────────────────
// STYLE: .then()/.catch() Promise chaining
// Flow: React event handler → createTask() → fetch() → Promise → Express API
//                          → Prisma → PostgreSQL → response → React state update
function createTask(taskData) {
  return fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  }).then((response) => {
    if (!response.ok) {
      return response.json().then((err) => {
        throw new Error(err.message || "Failed to create task");
      });
    }
    return response.json();
  });
}

// ─── UPDATE task status (PATCH) ───────────────────────────────────────────────
// STYLE: async/await
async function updateTaskStatus(id, status) {
  const response = await fetch(`${API_BASE}/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to update status");
  }

  return response.json();
}

// ─── DELETE task ──────────────────────────────────────────────────────────────
// STYLE: async/await
async function deleteTask(id) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to delete task");
  }

  return response.json();
}

// ─── UPDATE task (full update) ────────────────────────────────────────────────
// STYLE: async/await
async function updateTask(id, taskData) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to update task");
  }

  return response.json();
}

// ─── GET all users (for assigning tasks) ──────────────────────────────────────
async function getUsers() {
  const response = await fetch(USERS_API_BASE);
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
}

// ─── SQL JOIN DEMO 1: Tasks with Users (INNER JOIN) ───────────────────────────
async function getTasksWithUsers() {
  const response = await fetch(`${API_BASE}/with-users`);
  if (!response.ok) {
    throw new Error("Failed to execute INNER JOIN query");
  }
  return response.json();
}

// ─── SQL JOIN DEMO 2: Users with Tasks (LEFT JOIN) ────────────────────────────
async function getLeftJoinTasks() {
  const response = await fetch(`${API_BASE}/left-join`);
  if (!response.ok) {
    throw new Error("Failed to execute LEFT JOIN query");
  }
  return response.json();
}

// ─── SQL JOIN DEMO 3: Task count per user (JOIN + GROUP BY + COUNT) ───────────
async function getUserTaskCounts() {
  const response = await fetch(`${USERS_API_BASE}/task-count`);
  if (!response.ok) {
    throw new Error("Failed to execute Task Count JOIN query");
  }
  return response.json();
}

export {
  getTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
  updateTask,
  getUsers,
  getTasksWithUsers,
  getLeftJoinTasks,
  getUserTaskCounts,
};
