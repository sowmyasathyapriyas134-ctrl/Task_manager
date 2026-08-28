// src/utils/sqlJoinExamples.js
// ─────────────────────────────────────────────────────────────────────────────
// DATABASE & SQL CONCEPT: SQL JOINS (INNER JOIN, LEFT JOIN, GROUP BY + COUNT)
//
// A SQL JOIN is an operation that combines columns from one or more tables
// in a relational database based on a related column between them (Foreign Key).
//
// In TaskFlow:
//   "User" Table  (Primary Key: id)
//        ↑
//        | (1 : Many relationship)
//        |
//   "Task" Table  (Foreign Key: "userId" references "User".id)
// ─────────────────────────────────────────────────────────────────────────────

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ─── 1. INNER JOIN EXAMPLE ───────────────────────────────────────────────────
// Concept: Returns ONLY records that have matching values in BOTH tables.
// If a task has no userId (NULL), or user doesn't exist, it is NOT returned.

async function runInnerJoinExample() {
  console.log("\n=== 1. INNER JOIN: Tasks with Assigned Users ===");

  // Raw parameterized SQL query using Prisma's $queryRaw template literal
  const tasksWithUsers = await prisma.$queryRaw`
    SELECT
      tasks.id,
      tasks.title,
      tasks.status,
      tasks.priority,
      users.name AS assigned_to,
      users.email AS user_email
    FROM "Task" tasks
    INNER JOIN "User" users
      ON tasks."userId" = users.id
    ORDER BY tasks.id ASC
  `;

  console.log("SQL Query:");
  console.log(`
    SELECT tasks.id, tasks.title, tasks.status, users.name AS assigned_to
    FROM "Task" tasks
    INNER JOIN "User" users
      ON tasks."userId" = users.id;
  `);

  console.table(tasksWithUsers);
  return tasksWithUsers;
}

// ─── 2. LEFT JOIN EXAMPLE ────────────────────────────────────────────────────
// Concept: Returns ALL records from the LEFT table ("User"), and the matched
// records from the RIGHT table ("Task"). If there is no match (like Arun),
// the result contains NULL for the task columns.

async function runLeftJoinExample() {
  console.log("\n=== 2. LEFT JOIN: All Users + Any Assigned Tasks ===");

  const usersWithTasks = await prisma.$queryRaw`
    SELECT
      users.id AS user_id,
      users.name AS user_name,
      users.email AS user_email,
      tasks.id AS task_id,
      tasks.title AS task_title,
      tasks.status AS task_status
    FROM "User" users
    LEFT JOIN "Task" tasks
      ON users.id = tasks."userId"
    ORDER BY users.id ASC, tasks.id ASC
  `;

  console.log("SQL Query:");
  console.log(`
    SELECT users.name, tasks.title
    FROM "User" users
    LEFT JOIN "Task" tasks
      ON users.id = tasks."userId";
  `);

  console.table(usersWithTasks);
  return usersWithTasks;
}

// ─── 3. JOIN + GROUP BY + COUNT AGGREGATION ──────────────────────────────────
// Concept: Calculates aggregate statistics (task count) per user using
// LEFT JOIN + GROUP BY + COUNT().

async function runTaskCountByGroupJoin() {
  console.log("\n=== 3. JOIN + GROUP BY + COUNT: Task Statistics per User ===");

  const userStats = await prisma.$queryRaw`
    SELECT
      users.id,
      users.name,
      COUNT(tasks.id)::int AS task_count
    FROM "User" users
    LEFT JOIN "Task" tasks
      ON users.id = tasks."userId"
    GROUP BY users.id, users.name
    ORDER BY task_count DESC
  `;

  console.log("SQL Query:");
  console.log(`
    SELECT users.name, COUNT(tasks.id) AS task_count
    FROM "User" users
    LEFT JOIN "Task" tasks
      ON users.id = tasks."userId"
    GROUP BY users.id, users.name
    ORDER BY task_count DESC;
  `);

  console.table(userStats);
  return userStats;
}

// ─── 4. PRISMA ORM EQUIVALENTS ───────────────────────────────────────────────
// In standard application code, Prisma provides a clean type-safe API for relations:
//
// 1. Prisma Relation Query (Equivalent to JOIN):
//    const tasks = await prisma.task.findMany({
//      include: { user: true }
//    });
//
// 2. Prisma Aggregation / Count:
//    const userCounts = await prisma.user.findMany({
//      select: {
//        name: true,
//        _count: { select: { tasks: true } }
//      }
//    });

module.exports = {
  runInnerJoinExample,
  runLeftJoinExample,
  runTaskCountByGroupJoin,
};
