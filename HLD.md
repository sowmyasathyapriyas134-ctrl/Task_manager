# High-Level Design (HLD) — TaskFlow (with SQL JOIN Architecture)

## 1. System Overview
**TaskFlow** is structured around a 3-tier architecture with dual educational focus: **JavaScript Concurrency** and **Relational Database Design (SQL JOINs)**.

---

## 2. Updated Architecture Diagram

```text
                     TaskFlow React Frontend
                                |
       +------------------------+------------------------+
       |                        |                        |
       v                        v                        v
+--------------+      +-------------------+    +--------------------+
|  Task Board  |      |   JavaScript Lab  |    |    Database Lab    |
|  (CRUD + UI) |      | (Event Loop / TDZ)|    | (INNER / LEFT JOIN)|
+--------------+      +-------------------+    +--------------------+
       |                        |                        |
       +------------------------+------------------------+
                                |
                     HTTP REST API Requests
                                |
                                v
               +----------------------------------+
               |    Express Backend (Port 5000)   |
               |                                  |
               |   [taskRoutes]   [userRoutes]    |
               |         |              |         |
               |   [taskControl]  [userControl]   |
               |         |              |         |
               |   [taskService]  [userService]   |
               +----------------+-----------------+
                                |
                                v
               +----------------------------------+
               |         Prisma ORM Client        |
               +----------------+-----------------+
                                |
                  SQL Queries / Relational JOINs
                                |
                                v
               +----------------------------------+
               |  PostgreSQL Database (Port 5432) |
               |                                  |
               |   ┌─────────────┐                |
               |   │ "User" (1)  │                |
               |   └──────┬──────┘                |
               |          │ (1:Many)              |
               |          v                       |
               |   ┌─────────────┐                |
               |   │ "Task"  (*) │                |
               |   └─────────────┘                |
               +----------------------------------+
```

---

## 3. Relational Data Architecture

```text
                     User (Parent Table)
                  +-----------------------+
                  | id (PK)   : Int       |
                  | name      : String    |
                  | email     : String(UQ)|
                  | createdAt : DateTime  |
                  +-----------+-----------+
                              |
                              | 1 : Many
                              |
                              v
                     Task (Child Table)
                  +-----------------------+
                  | id (PK)   : Int       |
                  | title     : String    |
                  | description: String?  |
                  | status    : String    |
                  | priority  : String    |
                  | userId(FK): Int?      | ---> References User(id)
                  | createdAt : DateTime  |
                  | updatedAt : DateTime  |
                  +-----------------------+
```

---

## 4. SQL JOIN Request & Execution Flows

### 4.1 INNER JOIN Execution Flow (`GET /api/tasks/with-users`)
```text
Client (Run INNER JOIN)
    |
    v
Express Route (GET /api/tasks/with-users)
    |
    v
taskService calls prisma.task.findMany({ where: { userId: { not: null } }, include: { user: true } })
    |
    v
PostgreSQL executes:
    SELECT tasks.id, tasks.title, tasks.status, users.name AS assigned_to
    FROM "Task" tasks
    INNER JOIN "User" users ON tasks."userId" = users.id;
    |
    v
Returns matched tasks with their assignees.
```

### 4.2 LEFT JOIN Execution Flow (`GET /api/tasks/left-join`)
```text
Client (Run LEFT JOIN)
    |
    v
Express Route (GET /api/tasks/left-join)
    |
    v
taskService calls prisma.user.findMany({ include: { tasks: true } })
    |
    v
PostgreSQL executes:
    SELECT users.name, tasks.title
    FROM "User" users
    LEFT JOIN "Task" tasks ON users.id = tasks."userId";
    |
    v
Returns all users (including Arun with NULL task).
```

### 4.3 JOIN + GROUP BY + COUNT Flow (`GET /api/users/task-count`)
```text
Client (Run Task Count JOIN)
    |
    v
Express Route (GET /api/users/task-count)
    |
    v
userService calls prisma.user.findMany({ select: { name: true, _count: { select: { tasks: true } } } })
    |
    v
PostgreSQL executes:
    SELECT users.name, COUNT(tasks.id) AS task_count
    FROM "User" users
    LEFT JOIN "Task" tasks ON users.id = tasks."userId"
    GROUP BY users.id, users.name
    ORDER BY task_count DESC;
    |
    v
Returns user task counts in descending order (e.g. Sowmya: 3, Priya: 2, Rahul: 1, Arun: 0).
```

---

## 5. Technology Stack Summary

* **Frontend:** React 18, React Router v6, Vite, Vanilla CSS.
* **Backend:** Node.js, Express.js, CORS.
* **ORM & Database:** Prisma v5, PostgreSQL.
* **Query Mechanics:** Parameterized Prisma query API & `$queryRaw` educational queries.
