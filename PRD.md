# Product Requirements Document (PRD) — TaskFlow (with SQL JOINs)

## 1. Product Overview
**TaskFlow** is an educational, full-stack Task Management application built to master both **JavaScript Fundamentals** (Event Loop, Hoisting, Callbacks, Promises, `async/await`) and **Relational Database Concepts** (1:Many relationships, Foreign Keys, SQL INNER JOIN, LEFT JOIN, GROUP BY + COUNT) using React + Vite, Node.js + Express, Prisma ORM, and PostgreSQL.

* **Product Name:** TaskFlow
* **Tagline:** "Learn JavaScript. Manage Tasks."

---

## 2. Problem Statement
Developers frequently learn SQL concepts (such as joins, foreign keys, and aggregations) and JavaScript concurrency purely in isolation. TaskFlow provides a unified, hands-on full-stack application where relational data queries and async execution can be interactively explored, tested, and visualized against a live PostgreSQL database.

---

## 3. Goals & Objectives
1. **Task & User Management:** Provide full CRUD for tasks, with user assignees linked via foreign key relationships.
2. **Relational Database & SQL JOIN Demonstration:** Provide an interactive Database Lab (`/database-lab`) executing real `INNER JOIN`, `LEFT JOIN`, and `GROUP BY + COUNT()` queries against PostgreSQL.
3. **JavaScript Fundamentals Demonstration:** Provide an interactive JavaScript Lab (`/javascript-lab`) for the Event Loop, Hoisting, Callbacks vs Promises, and `async/await`.
4. **Transparent Full-Stack Pipeline:** Demonstrate how Prisma ORM abstracts relational SQL queries (`include: { user: true }`) while maintaining compatibility with raw SQL (`prisma.$queryRaw`).

---

## 4. Target Users
* Computer Science / Engineering students preparing for technical interviews, database viva exams, and full-stack evaluations.
* Web developers seeking a clean, reference implementation of SQL joins and JavaScript execution order.

---

## 5. Functional Requirements

### 5.1 Task Manager & User Assignment
* **FR-1.1:** The system shall allow users to create tasks with a title (≥ 3 characters), description, priority (`LOW`, `MEDIUM`, `HIGH`), and an optional assigned user.
* **FR-1.2:** The system shall display all tasks along with the name of the assigned user.
* **FR-1.3:** The system shall allow updating task status (`PENDING`, `IN_PROGRESS`, `COMPLETED`) and deleting tasks.
* **FR-1.4:** The system shall support filtering tasks by status.
* **FR-1.5:** The system shall display aggregate task statistics (Total, Pending, In Progress, Completed).

### 5.2 SQL JOIN Database Lab (`/database-lab`)
* **FR-2.1:** The system shall allow users to view relationships between users and tasks using SQL JOIN concepts.
* **FR-2.2 (INNER JOIN):** The system shall execute and display tasks together with their assigned users, returning only matched records.
* **FR-2.3 (LEFT JOIN):** The system shall display all users from the left table and their corresponding tasks, preserving users with no assigned tasks (returning `NULL`).
* **FR-2.4 (JOIN + GROUP BY + COUNT):** The system shall calculate and display the total task count per user, sorted in descending order.
* **FR-2.5 (ORM Comparison):** The system shall present a side-by-side mapping between raw SQL syntax and Prisma ORM methods.

### 5.3 JavaScript Learning Lab (`/javascript-lab`)
* **FR-3.1:** Interactive demonstration of `var` hoisting, function declaration hoisting, and the `let`/`const` Temporal Dead Zone.
* **FR-3.2:** Stepped execution showing the exact Event Loop order: `Start` → `End` → `Promise` → `Timeout`.
* **FR-3.3:** Side-by-side comparison of Callbacks, Promises, and `async/await`.
* **FR-3.4:** Comprehensive trace of the end-to-end request flow when completing a task.

---

## 6. Non-Functional Requirements
* **Simplicity & Readability:** Code written in clean, idiomatic JavaScript (no TypeScript, no Redux, no heavy external UI libraries).
* **Zero Mocking:** All relational join queries and task operations interact directly with PostgreSQL via Prisma ORM.
* **Security:** Use Prisma parameterization (`prisma.$queryRaw` template literals) to prevent SQL injection.
* **Responsiveness:** Dynamic CSS grid and dark theme for labs, responsive across mobile and desktop.

---

## 7. Database Requirements
* **Database Engine:** PostgreSQL
* **ORM:** Prisma
* **Models:**
  * `User` (`id`, `name`, `email`, `createdAt`, `tasks Task[]`)
  * `Task` (`id`, `title`, `description`, `status`, `priority`, `userId`, `createdAt`, `updatedAt`, `user User?`)
* **Relationship:** 1-to-Many (`User 1 ── * Task`) with Foreign Key `Task.userId -> User.id`.

---

## 8. API Requirements
* `GET /api/tasks` — List tasks (with assigned user details).
* `GET /api/tasks/with-users` — INNER JOIN query returning tasks with assignees.
* `GET /api/tasks/left-join` — LEFT JOIN query returning all users with their tasks.
* `GET /api/users` — List all registered users.
* `GET /api/users/task-count` — LEFT JOIN + GROUP BY + COUNT query returning task counts per user.
* `POST /api/tasks` — Create task with optional `userId`.
* `PUT /api/tasks/:id` — Update task details and assignee.
* `PATCH /api/tasks/:id/status` — Update task status.
* `DELETE /api/tasks/:id` — Delete task.

---

## 9. Success Criteria
* Accurate demonstration of INNER JOIN excluding unmatched rows and LEFT JOIN preserving unmatched rows with `NULL`.
* 100% persistent data operations through PostgreSQL.
* Clear visual distinction between the 3 main application modules: **Tasks**, **JavaScript Lab**, and **Database Lab**.
