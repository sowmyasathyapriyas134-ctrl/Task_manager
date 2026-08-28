// src/services/taskService.js
// The service layer contains all database logic using Prisma.
// Includes Prisma relation queries and educational SQL JOIN demonstrations.

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ─── Get All Tasks ────────────────────────────────────────────────────────────
// Demonstrates Prisma `include: { user: true }` which performs the relational join
async function getAllTasks(status) {
  const where = status ? { status } : {};

  const tasks = await prisma.task.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return tasks;
}

// ─── Get Task By ID ───────────────────────────────────────────────────────────
async function getTaskById(id) {
  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      user: true,
    },
  });

  return task;
}

// ─── Create Task ──────────────────────────────────────────────────────────────
async function createTask(data) {
  const task = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      priority: data.priority || "MEDIUM",
      userId: data.userId ? parseInt(data.userId) : null,
    },
    include: {
      user: true,
    },
  });

  return task;
}

// ─── Update Task ──────────────────────────────────────────────────────────────
async function updateTask(id, data) {
  const updateData = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.priority !== undefined) updateData.priority = data.priority;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.userId !== undefined) {
    updateData.userId = data.userId ? parseInt(data.userId) : null;
  }

  const task = await prisma.task.update({
    where: { id },
    data: updateData,
    include: {
      user: true,
    },
  });

  return task;
}

// ─── Delete Task ──────────────────────────────────────────────────────────────
async function deleteTask(id) {
  await prisma.task.delete({
    where: { id },
  });
}

// ─── Update Task Status Only ──────────────────────────────────────────────────
async function updateTaskStatus(id, status) {
  const task = await prisma.task.update({
    where: { id },
    data: { status },
    include: {
      user: true,
    },
  });

  return task;
}

// ─── SQL JOIN DEMO: Tasks With Users (INNER JOIN / Prisma include) ────────────
// Endpoint: GET /api/tasks/with-users
// Conceptual SQL:
//   SELECT tasks.id, tasks.title, tasks.status, tasks.priority, users.name AS assigned_to
//   FROM "Task" tasks
//   INNER JOIN "User" users ON tasks."userId" = users.id;
async function getTasksWithUsersJoin() {
  const tasks = await prisma.task.findMany({
    where: {
      userId: { not: null }, // Only tasks with assigned users (INNER JOIN behavior)
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { id: "asc" },
  });

  // Map to flat format for easy client presentation while keeping nested objects
  return tasks.map((t) => ({
    id: t.id,
    title: t.title,
    status: t.status,
    priority: t.priority,
    userId: t.userId,
    assignedTo: t.user ? t.user.name : "Unassigned",
    userEmail: t.user ? t.user.email : null,
  }));
}

// ─── SQL JOIN DEMO: Users With Tasks (LEFT JOIN) ──────────────────────────────
// Endpoint: GET /api/tasks/left-join
// Conceptual SQL:
//   SELECT users.id, users.name, tasks.id AS task_id, tasks.title
//   FROM "User" users
//   LEFT JOIN "Task" tasks ON users.id = tasks."userId";
async function getUsersWithTasksLeftJoin() {
  const users = await prisma.user.findMany({
    include: {
      tasks: {
        select: {
          id: true,
          title: true,
          status: true,
          priority: true,
        },
      },
    },
    orderBy: { id: "asc" },
  });

  // Flatten to show 1-to-many LEFT JOIN tabular structure including NULLs
  const rows = [];
  for (const user of users) {
    if (user.tasks.length === 0) {
      // Demonstrates LEFT JOIN preserving users even when tasks is NULL!
      rows.push({
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        taskId: null,
        taskTitle: null,
        taskStatus: null,
        matchStatus: "NO TASK (NULL in SQL)",
      });
    } else {
      for (const task of user.tasks) {
        rows.push({
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          taskId: task.id,
          taskTitle: task.title,
          taskStatus: task.status,
          matchStatus: "MATCHED",
        });
      }
    }
  }

  return rows;
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getTasksWithUsersJoin,
  getUsersWithTasksLeftJoin,
};
