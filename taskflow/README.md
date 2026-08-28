# ⚡ TaskFlow — "Learn JavaScript. Manage Tasks."

A full-stack, beginner-friendly Task Manager built to demonstrate and master both **JavaScript Fundamentals** (Event Loop, Call Stack, Microtasks, Hoisting, Callbacks, Promises, and `async/await`) and **Relational Database Concepts** (Foreign Keys, 1:Many Relationships, SQL INNER JOIN, LEFT JOIN, and GROUP BY + COUNT) using a modern web development stack.

---

## 🚀 Tech Stack

* **Frontend:** React 18, Vite, React Router, Vanilla CSS
* **Backend:** Node.js, Express.js
* **ORM:** Prisma v5
* **Database:** PostgreSQL
* **Language:** JavaScript (ES6+)

---

## 📁 Project Structure

```text
taskflow/
├── client/                     # React Frontend (Vite)
│   ├── src/
│   │   ├── components/         # Reusable UI (Stats, TaskForm, TaskCard, TaskFilter, TaskList)
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Task Manager dashboard
│   │   │   ├── JavaScriptLab.jsx    # JS fundamentals interactive lab
│   │   │   └── DatabaseLab.jsx      # SQL JOINs interactive lab
│   │   ├── services/
│   │   │   └── taskApi.js           # API client with Promises & async/await
│   │   ├── App.jsx                  # Navigation bar & routing
│   │   ├── main.jsx                 # React root entry point
│   │   └── index.css                # Global CSS design tokens
│   ├── package.json
│   └── vite.config.js               # Dev API proxy
│
├── server/                     # Express Backend
│   ├── src/
│   │   ├── controllers/        # Request validation & status codes
│   │   │   ├── taskController.js
│   │   │   └── userController.js
│   │   ├── routes/             # REST endpoints (/api/tasks, /api/users)
│   │   ├── services/           # Prisma ORM queries & JOIN aggregation logic
│   │   ├── utils/              # Educational JS & SQL scripts
│   │   │   ├── callbackExamples.js
│   │   │   ├── eventLoopExamples.js
│   │   │   ├── hoistingExamples.js
│   │   │   ├── promiseExamples.js
│   │   │   └── sqlJoinExamples.js   # Parameterized raw SQL JOIN queries
│   │   └── server.js           # Server entry point & CORS
│   ├── prisma/
│   │   ├── schema.prisma       # User & Task relational schema
│   │   └── seed.js             # Seeds Sowmya, Rahul, Priya, Arun
│   ├── .env                    # Environment variables (DATABASE_URL)
│   └── package.json
│
├── PRD.md                      # Product Requirements Document
├── HLD.md                      # High-Level Design Document
├── LLD.md                      # Low-Level Design Document
└── README.md                   # Setup and documentation
```

---

## 🛠️ Prerequisites

* **Node.js:** v18 or newer ([Download Node.js](https://nodejs.org/))
* **PostgreSQL:** v14 or newer running locally or via a cloud instance (e.g. Neon, Supabase).

---

## ⚙️ Installation & Setup

### 1. Configure Database Environment Variable

Navigate to `server/.env` and update the `DATABASE_URL` with your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/taskflow"
PORT=5000
```

---

### 2. Setup and Start Backend Server

```bash
# Navigate to the server folder
cd taskflow/server

# Install backend dependencies
npm install

# Generate Prisma Client & Run Database Migrations
npx prisma generate
npx prisma migrate dev --name add_users_and_task_relation

# Seed the database with sample users and tasks
node prisma/seed.js

# Start the Express development server
npm run dev
```

Backend will run on: **`http://localhost:5000`**  
Health Check: **`http://localhost:5000/api/health`**

---

### 3. Setup and Start Frontend Client

Open a new terminal window:

```bash
# Navigate to the client folder
cd taskflow/client

# Install frontend dependencies
npm install

# Start the Vite development server
npm run dev
```

Frontend will run on: **`http://localhost:5173`**

---

## 📡 REST API Endpoints

### Task Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks` | Get all tasks (includes assigned user details) |
| `GET` | `/api/tasks/with-users` | **INNER JOIN Demo:** Get tasks joined with users |
| `GET` | `/api/tasks/left-join` | **LEFT JOIN Demo:** Get all users with tasks (includes NULLs) |
| `GET` | `/api/tasks/:id` | Get single task by ID |
| `POST` | `/api/tasks` | Create task (`{ title, description, priority, userId }`) |
| `PUT` | `/api/tasks/:id` | Update task details & assignee |
| `PATCH` | `/api/tasks/:id/status` | Update task status (`{ status: "COMPLETED" }`) |
| `DELETE` | `/api/tasks/:id` | Delete task |

### User & JOIN Aggregation Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users` | Get all users for assignment dropdown |
| `GET` | `/api/users/task-count` | **GROUP BY + COUNT Demo:** Task count per user |

---

## 🗄️ SQL JOIN Concepts Demonstrated

### 1. INNER JOIN (Tasks ⨝ Users)
Returns only rows with matching records in both tables (`Task.userId = User.id`):
```sql
SELECT tasks.id, tasks.title, tasks.status, users.name AS assigned_to
FROM "Task" tasks
INNER JOIN "User" users ON tasks."userId" = users.id;
```

### 2. LEFT JOIN (Users ⟕ Tasks)
Preserves all users from the left table, even if they have 0 assigned tasks (e.g. Arun with `NULL` task fields):
```sql
SELECT users.name, tasks.title
FROM "User" users
LEFT JOIN "Task" tasks ON users.id = tasks."userId";
```

### 3. JOIN + GROUP BY + COUNT()
Calculates aggregate statistics across joined tables:
```sql
SELECT users.name, COUNT(tasks.id) AS task_count
FROM "User" users
LEFT JOIN "Task" tasks ON users.id = tasks."userId"
GROUP BY users.id, users.name
ORDER BY task_count DESC;
```

---

## 🧪 JavaScript Concepts Demonstrated

1. **The Event Loop & Queues:** Stepped visualization demonstrating `Start (Sync)` → `End (Sync)` → `Promise (Microtask)` → `Timeout (Macrotask)`.
2. **Hoisting & TDZ:** Visual demonstration of `var` hoisting to `undefined` vs `let`/`const` Temporal Dead Zone (`ReferenceError`).
3. **Promises vs async/await:** `taskApi.js` deliberately uses `.then()/.catch()` for `createTask()` and `async/await` for query endpoints.
4. **End-to-End Async Flow:** Complete lifecycle trace when clicking `[✓ Complete]` on a task card.

---

## 📄 Documentation Links
* [Product Requirements Document (PRD)](./PRD.md)
* [High-Level Design (HLD)](./HLD.md)
* [Low-Level Design (LLD)](./LLD.md)
