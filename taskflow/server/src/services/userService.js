// src/services/userService.js
// Handles all database queries related to User records and JOIN aggregations

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ─── Get All Users ────────────────────────────────────────────────────────────
async function getAllUsers() {
  const users = await prisma.user.findMany({
    orderBy: { name: "asc" },
  });
  return users;
}

// ─── Get User By ID ───────────────────────────────────────────────────────────
async function getUserById(id) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      tasks: true,
    },
  });
  return user;
}

// ─── SQL JOIN + GROUP BY + COUNT Aggregation ──────────────────────────────────
// Endpoint: GET /api/users/task-count
// Conceptual SQL:
//   SELECT users.id, users.name, COUNT(tasks.id) AS task_count
//   FROM "User" users
//   LEFT JOIN "Task" tasks ON users.id = tasks."userId"
//   GROUP BY users.id, users.name
//   ORDER BY task_count DESC;
async function getUserTaskCounts() {
  const usersWithCounts = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      _count: {
        select: { tasks: true },
      },
    },
    orderBy: [
      { tasks: { _count: "desc" } },
      { name: "asc" },
    ],
  });

  // Map to flat structure matching the requested spec: [{ name, task_count, email, id }]
  return usersWithCounts.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    task_count: u._count.tasks,
  }));
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserTaskCounts,
};
