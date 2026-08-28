# Low-Level Design (LLD) — TaskFlow (with SQL JOINs)

## 1. Directory Structure

```text
taskflow/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Stats.jsx
│   │   │   ├── TaskCard.jsx         # Displays task + assigned user badge
│   │   │   ├── TaskFilter.jsx
│   │   │   ├── TaskForm.jsx         # Includes Assignee User select dropdown
│   │   │   └── TaskList.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Task Management dashboard
│   │   │   ├── JavaScriptLab.jsx    # Event Loop, Hoisting, Promises lab
│   │   │   └── DatabaseLab.jsx      # INNER/LEFT JOIN & Aggregation lab
│   │   ├── services/
│   │   │   └── taskApi.js           # API client for tasks, users & JOINs
│   │   ├── App.jsx                  # Navbar with 3 module routes
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── prisma/
│   │   ├── schema.prisma            # User & Task models with relation
│   │   └── seed.js                  # Seeds Sowmya, Rahul, Priya, Arun
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── taskController.js
│   │   │   └── userController.js
│   │   ├── routes/
│   │   │   ├── taskRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── services/
│   │   │   ├── taskService.js
│   │   │   └── userService.js
│   │   ├── utils/
│   │   │   ├── callbackExamples.js
│   │   │   ├── eventLoopExamples.js
│   │   │   ├── hoistingExamples.js
│   │   │   ├── promiseExamples.js
│   │   │   └── sqlJoinExamples.js   # Raw SQL JOIN parameterized queries
│   │   └── server.js
│   ├── .env
│   └── package.json
│
├── PRD.md
├── HLD.md
├── LLD.md
└── README.md
```

---

## 2. Prisma Database Models

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  createdAt DateTime @default(now())

  tasks     Task[]
}

model Task {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  status      String   @default("PENDING")
  priority    String   @default("MEDIUM")
  userId      Int?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user        User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
}
```

---

## 3. Detailed REST API Endpoint Specifications

### 3.1 `GET /api/tasks/with-users` (INNER JOIN Demo)
* **Description:** Retrieves all tasks with their associated assigned user.
* **SQL Query:**
  ```sql
  SELECT tasks.id, tasks.title, tasks.status, tasks.priority, users.name AS assigned_to
  FROM "Task" tasks
  INNER JOIN "User" users ON tasks."userId" = users.id;
  ```
* **Response (200 OK):**
  ```json
  [
    {
      "id": 1,
      "title": "Learn JavaScript Event Loop",
      "status": "COMPLETED",
      "priority": "HIGH",
      "userId": 1,
      "assignedTo": "Sowmya",
      "userEmail": "sowmya@example.com"
    }
  ]
  ```

### 3.2 `GET /api/tasks/left-join` (LEFT JOIN Demo)
* **Description:** Retrieves all users from the left table and their corresponding tasks, returning `NULL` for users without tasks (such as Arun).
* **SQL Query:**
  ```sql
  SELECT users.name, tasks.title
  FROM "User" users
  LEFT JOIN "Task" tasks ON users.id = tasks."userId";
  ```
* **Response (200 OK):**
  ```json
  [
    {
      "userId": 4,
      "userName": "Arun",
      "userEmail": "arun@example.com",
      "taskId": null,
      "taskTitle": null,
      "taskStatus": null,
      "matchStatus": "NO TASK (NULL in SQL)"
    }
  ]
  ```

### 3.3 `GET /api/users/task-count` (JOIN + GROUP BY + COUNT Demo)
* **Description:** Aggregates and returns the total task count per user in descending order.
* **SQL Query:**
  ```sql
  SELECT users.name, COUNT(tasks.id) AS task_count
  FROM "User" users
  LEFT JOIN "Task" tasks ON users.id = tasks."userId"
  GROUP BY users.id, users.name
  ORDER BY task_count DESC;
  ```
* **Response (200 OK):**
  ```json
  [
    { "id": 1, "name": "Sowmya", "email": "sowmya@example.com", "task_count": 3 },
    { "id": 3, "name": "Priya", "email": "priya@example.com", "task_count": 2 },
    { "id": 2, "name": "Rahul", "email": "rahul@example.com", "task_count": 1 },
    { "id": 4, "name": "Arun", "email": "arun@example.com", "task_count": 0 }
  ]
  ```

### 3.4 `GET /api/users`
* **Description:** Returns list of all users for assignment dropdown.
* **Response (200 OK):** `[ { "id": 1, "name": "Sowmya", "email": "sowmya@example.com" } ]`

---

## 4. Frontend Component Design

### 4.1 `DatabaseLab.jsx`
* **Section 1 (INNER JOIN):** Executes `GET /api/tasks/with-users` and displays SQL logic and live tabular data.
* **Section 2 (LEFT JOIN):** Executes `GET /api/tasks/left-join` and visually highlights NULL values for users with 0 tasks.
* **Section 3 (JOIN + GROUP BY + COUNT):** Executes `GET /api/users/task-count` and displays aggregate assignee statistics.
* **Section 4 (SQL vs Prisma):** Direct mapping table between raw SQL keywords and Prisma ORM methods.
* **Section 5 (Viva Q&A):** High-frequency technical questions and explanations.

### 4.2 `TaskForm.jsx`
* Fetches `/api/users` on mount via `getUsers()`.
* Populates `<select id="task-assignee">` with user options.
* Passes `userId` in `createTask()` payload.

### 4.3 `TaskCard.jsx`
* Renders `👤 Assigned to: [User Name]` badge.
