// server/src/utils/sqlJoinExamples.js

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/*
 * LEFT JOIN
 *
 * Returns every user, including users
 * who have no tasks.
 */
async function leftJoinUsersAndTasks() {
  const result = await prisma.$queryRaw`
    SELECT
      u.id AS user_id,
      u.name AS user_name,
      t.id AS task_id,
      t.title AS task_title
    FROM "User" u
    LEFT JOIN "Task" t
      ON u.id = t."userId"
    ORDER BY u.id;
  `;

  return result;
}


/*
 * LEFT JOIN + GROUP BY + COUNT
 *
 * Counts tasks for every user.
 */
async function getUserTaskCounts() {
  const result = await prisma.$queryRaw`
    SELECT
      u.id,
      u.name,
      COUNT(t.id)::int AS task_count
    FROM "User" u
    LEFT JOIN "Task" t
      ON u.id = t."userId"
    GROUP BY u.id, u.name
    ORDER BY task_count DESC;
  `;

  return result;
}


module.exports = {
  leftJoinUsersAndTasks,
  getUserTaskCounts
};