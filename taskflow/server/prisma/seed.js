// prisma/seed.js
// Seeds the database with sample users and tasks for demonstrating SQL JOINs

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const sampleUsers = [
  { name: "Sowmya", email: "sowmya@example.com" },
  { name: "Rahul", email: "rahul@example.com" },
  { name: "Priya", email: "priya@example.com" },
  { name: "Arun", email: "arun@example.com" }, // Left with 0 tasks to demonstrate LEFT JOIN!
];

async function main() {
  console.log("🌱 Seeding database with Users and Tasks...");

  // Clear existing tasks and users first (due to foreign key constraints)
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Users
  const createdUsers = {};
  for (const u of sampleUsers) {
    const user = await prisma.user.create({ data: u });
    createdUsers[user.name] = user;
    console.log(`  👤 Created User: ${user.name} (ID: ${user.id})`);
  }

  // 2. Create Tasks assigned to Users (demonstrates 1:Many relationship)
  const sampleTasks = [
    {
      title: "Learn JavaScript Event Loop",
      description: "Understand microtasks, macrotasks, and the single-threaded event loop.",
      status: "COMPLETED",
      priority: "HIGH",
      userId: createdUsers["Sowmya"].id,
    },
    {
      title: "Practice SQL JOINs",
      description: "Understand INNER JOIN vs LEFT JOIN and GROUP BY aggregation.",
      status: "IN_PROGRESS",
      priority: "HIGH",
      userId: createdUsers["Sowmya"].id,
    },
    {
      title: "Explore Callback Patterns",
      description: "Understand callback functions and how Promises solve callback hell.",
      status: "PENDING",
      priority: "LOW",
      userId: createdUsers["Sowmya"].id,
    },
    {
      title: "Practice Promises and async/await",
      description: "Build asynchronous workflows with .then() and async/await.",
      status: "IN_PROGRESS",
      priority: "MEDIUM",
      userId: createdUsers["Rahul"].id,
    },
    {
      title: "Build a REST API with Express",
      description: "Create RESTful routes and controllers connected to Prisma ORM.",
      status: "COMPLETED",
      priority: "HIGH",
      userId: createdUsers["Priya"].id,
    },
    {
      title: "Complete React UI & Database Lab",
      description: "Build clean UI components with interactive SQL JOIN visualization.",
      status: "PENDING",
      priority: "MEDIUM",
      userId: createdUsers["Priya"].id,
    },
    // Note: Arun intentionally has 0 tasks to clearly demonstrate LEFT JOIN returning NULL!
  ];

  for (const task of sampleTasks) {
    const created = await prisma.task.create({ data: task });
    console.log(`  📋 Created Task: "${created.title}" (Assigned to: ${task.userId})`);
  }

  console.log(`\n🎉 Seeded ${sampleUsers.length} users and ${sampleTasks.length} tasks successfully!`);
  console.log(`💡 Tip: 'Arun' has 0 tasks assigned to test LEFT JOIN NULL output.\n`);
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
