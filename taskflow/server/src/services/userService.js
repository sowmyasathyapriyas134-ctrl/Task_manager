// server/src/services/userService.js

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/*
 * Get the number of tasks assigned to each user.
 *
 * LEFT JOIN is important here because we want
 * ALL users to appear, even users with zero tasks.
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
  getUserTaskCounts
};