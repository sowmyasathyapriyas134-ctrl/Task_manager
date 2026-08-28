// src/pages/DatabaseLab.jsx
// Interactive learning lab for SQL JOIN concepts with PostgreSQL & Prisma
// Demonstrates INNER JOIN, LEFT JOIN, and GROUP BY + COUNT Aggregations

import React, { useState } from "react";
import {
  getTasksWithUsers,
  getLeftJoinTasks,
  getUserTaskCounts,
} from "../services/taskApi";

function DatabaseLab() {
  // ─── States for Live SQL Query Results ──────────────────────────────────────
  
  // 1. INNER JOIN state
  const [innerJoinData, setInnerJoinData] = useState([]);
  const [innerJoinLoading, setInnerJoinLoading] = useState(false);
  const [innerJoinError, setInnerJoinError] = useState("");

  // 2. LEFT JOIN state
  const [leftJoinData, setLeftJoinData] = useState([]);
  const [leftJoinLoading, setLeftJoinLoading] = useState(false);
  const [leftJoinError, setLeftJoinError] = useState("");

  // 3. GROUP BY COUNT state
  const [taskCountData, setTaskCountData] = useState([]);
  const [taskCountLoading, setTaskCountLoading] = useState(false);
  const [taskCountError, setTaskCountError] = useState("");

  // ─── 1. Run Live INNER JOIN ────────────────────────────────────────────────
  async function handleRunInnerJoin() {
    setInnerJoinLoading(true);
    setInnerJoinError("");
    try {
      // Calls backend: GET /api/tasks/with-users
      const data = await getTasksWithUsers();
      setInnerJoinData(data);
    } catch (err) {
      setInnerJoinError(err.message || "Failed to fetch INNER JOIN results.");
    } finally {
      setInnerJoinLoading(false);
    }
  }

  // ─── 2. Run Live LEFT JOIN ─────────────────────────────────────────────────
  async function handleRunLeftJoin() {
    setLeftJoinLoading(true);
    setLeftJoinError("");
    try {
      // Calls backend: GET /api/tasks/left-join
      const data = await getLeftJoinTasks();
      setLeftJoinData(data);
    } catch (err) {
      setLeftJoinError(err.message || "Failed to fetch LEFT JOIN results.");
    } finally {
      setLeftJoinLoading(false);
    }
  }

  // ─── 3. Run Live JOIN + GROUP BY + COUNT ───────────────────────────────────
  async function handleRunTaskCountJoin() {
    setTaskCountLoading(true);
    setTaskCountError("");
    try {
      // Calls backend: GET /api/users/task-count
      const data = await getUserTaskCounts();
      setTaskCountData(data);
    } catch (err) {
      setTaskCountError(err.message || "Failed to fetch Task Count statistics.");
    } finally {
      setTaskCountLoading(false);
    }
  }

  return (
    <div className="lab-page">
      <div className="page">
        {/* Header */}
        <header className="lab-header">
          <h1 className="lab-title">🗄️ SQL JOIN Database Lab</h1>
          <p className="lab-subtitle">
            Interactive demonstrations of relational SQL JOINs with PostgreSQL and Prisma ORM
          </p>

          <nav className="lab-toc" aria-label="Database Lab navigation">
            <a href="#inner-join" className="lab-toc-link">1. INNER JOIN</a>
            <a href="#left-join" className="lab-toc-link">2. LEFT JOIN</a>
            <a href="#group-by" className="lab-toc-link">3. JOIN + GROUP BY</a>
            <a href="#prisma-vs-sql" className="lab-toc-link">4. SQL vs Prisma</a>
            <a href="#viva-questions" className="lab-toc-link">5. Viva Q&A</a>
          </nav>
        </header>

        {/* ─── SECTION 1: INNER JOIN ──────────────────────────────────────── */}
        <section id="inner-join" className="lab-section">
          <div className="lab-section-title">
            <span>1. INNER JOIN (Tasks ⨝ Users)</span>
            <span className="lab-badge">Relational Matching</span>
          </div>
          <p className="lab-section-subtitle">
            An <strong>INNER JOIN</strong> returns only rows where a matching record exists in
            <strong> both</strong> tables (where <code>Task."userId" = User.id</code>).
            Unassigned tasks or users without tasks are excluded.
          </p>

          {/* SQL Code */}
          <div className="code-block">
            <pre>
{`-- Conceptual SQL Query
SELECT
    tasks.id,
    tasks.title,
    tasks.status,
    tasks.priority,
    users.name AS assigned_to
FROM "Task" tasks
INNER JOIN "User" users
    ON tasks."userId" = users.id
ORDER BY tasks.id ASC;`}
            </pre>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <button
              id="run-inner-join-btn"
              className="btn-run"
              onClick={handleRunInnerJoin}
              disabled={innerJoinLoading}
            >
              {innerJoinLoading ? "Querying PostgreSQL..." : "▶ Run INNER JOIN (Live Database)"}
            </button>
            <span style={{ fontSize: "0.8rem", color: "var(--color-lab-text-muted)" }}>
              Calls endpoint: <code>GET /api/tasks/with-users</code>
            </span>
          </div>

          {innerJoinError && (
            <div className="output-line error" style={{ marginBottom: "12px" }}>
              ⚠️ {innerJoinError}
            </div>
          )}

          {/* Results Table */}
          <div className="output-panel">
            <div className="output-label">Live PostgreSQL Result Table (INNER JOIN)</div>
            {innerJoinData.length === 0 ? (
              <span className="output-empty">
                Click "Run INNER JOIN" to execute the real database query.
              </span>
            ) : (
              <table className="concept-table" style={{ margin: 0 }}>
                <thead>
                  <tr>
                    <th>Task ID</th>
                    <th>Task Title</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Assigned User</th>
                  </tr>
                </thead>
                <tbody>
                  {innerJoinData.map((row) => (
                    <tr key={row.id}>
                      <td>#{row.id}</td>
                      <td><strong>{row.title}</strong></td>
                      <td>
                        <span style={{ color: row.status === "COMPLETED" ? "#34d399" : "#fbbf24" }}>
                          {row.status}
                        </span>
                      </td>
                      <td>{row.priority}</td>
                      <td><span style={{ color: "#818cf8" }}>👤 {row.assignedTo}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="explanation-box">
            <h4>How INNER JOIN Works:</h4>
            <ul>
              <li>The database compares <code>Task."userId"</code> with <code>User.id</code>.</li>
              <li>Only matching row pairs are joined and included in the output.</li>
              <li>In Prisma ORM, this is queried using <code>prisma.task.findMany({`{ include: { user: true } }`})</code> with non-null foreign keys.</li>
            </ul>
          </div>
        </section>

        {/* ─── SECTION 2: LEFT JOIN ───────────────────────────────────────── */}
        <section id="left-join" className="lab-section">
          <div className="lab-section-title">
            <span>2. LEFT JOIN (Users ⟕ Tasks)</span>
            <span className="lab-badge">Preserve Left Table</span>
          </div>
          <p className="lab-section-subtitle">
            A <strong>LEFT JOIN</strong> keeps <strong>every record from the LEFT table</strong> (Users),
            even if a user has no assigned tasks. If there is no match, the right side returns <code>NULL</code>.
          </p>

          <div className="code-block">
            <pre>
{`-- Conceptual SQL Query
SELECT
    users.name AS user_name,
    users.email AS user_email,
    tasks.title AS task_title,
    tasks.status AS task_status
FROM "User" users
LEFT JOIN "Task" tasks
    ON users.id = tasks."userId"
ORDER BY users.id ASC;`}
            </pre>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <button
              id="run-left-join-btn"
              className="btn-run"
              onClick={handleRunLeftJoin}
              disabled={leftJoinLoading}
            >
              {leftJoinLoading ? "Querying PostgreSQL..." : "▶ Run LEFT JOIN (Live Database)"}
            </button>
            <span style={{ fontSize: "0.8rem", color: "var(--color-lab-text-muted)" }}>
              Calls endpoint: <code>GET /api/tasks/left-join</code>
            </span>
          </div>

          {leftJoinError && (
            <div className="output-line error" style={{ marginBottom: "12px" }}>
              ⚠️ {leftJoinError}
            </div>
          )}

          {/* Results Table */}
          <div className="output-panel">
            <div className="output-label">Live PostgreSQL Result Table (LEFT JOIN)</div>
            {leftJoinData.length === 0 ? (
              <span className="output-empty">
                Click "Run LEFT JOIN" to observe how users without tasks (e.g. Arun) appear with NULL values.
              </span>
            ) : (
              <table className="concept-table" style={{ margin: 0 }}>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Task Title</th>
                    <th>Task Status</th>
                    <th>JOIN Result</th>
                  </tr>
                </thead>
                <tbody>
                  {leftJoinData.map((row, idx) => (
                    <tr
                      key={idx}
                      style={
                        row.taskId === null
                          ? { background: "rgba(239, 68, 68, 0.12)" }
                          : {}
                      }
                    >
                      <td><strong>👤 {row.userName}</strong></td>
                      <td>{row.userEmail}</td>
                      <td>
                        {row.taskTitle ? (
                          row.taskTitle
                        ) : (
                          <span style={{ color: "#f87171", fontStyle: "italic" }}>
                            NULL (No task assigned)
                          </span>
                        )}
                      </td>
                      <td>
                        {row.taskStatus ? (
                          <span style={{ color: row.taskStatus === "COMPLETED" ? "#34d399" : "#fbbf24" }}>
                            {row.taskStatus}
                          </span>
                        ) : (
                          <span style={{ color: "#94a3b8" }}>NULL</span>
                        )}
                      </td>
                      <td>
                        {row.taskId === null ? (
                          <span className="lab-badge" style={{ color: "#f87171", borderColor: "#f87171" }}>
                            NULL ROW PRESERVED
                          </span>
                        ) : (
                          <span className="lab-badge" style={{ color: "#34d399", borderColor: "#34d399" }}>
                            MATCHED
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="explanation-box">
            <h4>Why Arun Appears in LEFT JOIN:</h4>
            <ul>
              <li>In our database, <strong>Arun</strong> has 0 tasks assigned.</li>
              <li>An <strong>INNER JOIN</strong> completely omits Arun because there is no matching record in the Task table.</li>
              <li>A <strong>LEFT JOIN</strong> preserves Arun from the left table and populates the task columns with <code>NULL</code>.</li>
            </ul>
          </div>
        </section>

        {/* ─── SECTION 3: JOIN + GROUP BY + COUNT ─────────────────────────── */}
        <section id="group-by" className="lab-section">
          <div className="lab-section-title">
            <span>3. JOIN + GROUP BY + COUNT()</span>
            <span className="lab-badge">Aggregation Query</span>
          </div>
          <p className="lab-section-subtitle">
            Combining a <strong>LEFT JOIN</strong> with <strong>GROUP BY</strong> and <strong>COUNT()</strong>
            aggregates data across tables — for example, calculating the total number of tasks assigned to each user.
          </p>

          <div className="code-block">
            <pre>
{`-- Conceptual SQL Query
SELECT
    users.name,
    COUNT(tasks.id) AS task_count
FROM "User" users
LEFT JOIN "Task" tasks
    ON users.id = tasks."userId"
GROUP BY users.id, users.name
ORDER BY task_count DESC;`}
            </pre>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <button
              id="run-task-count-btn"
              className="btn-run"
              onClick={handleRunTaskCountJoin}
              disabled={taskCountLoading}
            >
              {taskCountLoading ? "Querying PostgreSQL..." : "▶ Run Task Count JOIN (Live Database)"}
            </button>
            <span style={{ fontSize: "0.8rem", color: "var(--color-lab-text-muted)" }}>
              Calls endpoint: <code>GET /api/users/task-count</code>
            </span>
          </div>

          {taskCountError && (
            <div className="output-line error" style={{ marginBottom: "12px" }}>
              ⚠️ {taskCountError}
            </div>
          )}

          {/* Results Table */}
          <div className="output-panel">
            <div className="output-label">Live PostgreSQL Result Table (GROUP BY COUNT)</div>
            {taskCountData.length === 0 ? (
              <span className="output-empty">
                Click "Run Task Count JOIN" to see live aggregated metrics from PostgreSQL.
              </span>
            ) : (
              <table className="concept-table" style={{ margin: 0 }}>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Total Tasks Assigned</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {taskCountData.map((u) => (
                    <tr key={u.id}>
                      <td><strong>👤 {u.name}</strong></td>
                      <td>{u.email}</td>
                      <td>
                        <span
                          style={{
                            fontSize: "1.1rem",
                            fontWeight: 700,
                            color: u.task_count > 0 ? "#818cf8" : "#94a3b8",
                          }}
                        >
                          {u.task_count}
                        </span>{" "}
                        {u.task_count === 1 ? "task" : "tasks"}
                      </td>
                      <td>
                        {u.task_count === 0 ? (
                          <span style={{ color: "#fbbf24", fontSize: "0.75rem" }}>
                            ⚠️ 0 Tasks (LEFT JOIN preserved)
                          </span>
                        ) : (
                          <span style={{ color: "#34d399", fontSize: "0.75rem" }}>
                            ✓ Active Assignee
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* ─── SECTION 4: SQL vs PRISMA ───────────────────────────────────── */}
        <section id="prisma-vs-sql" className="lab-section">
          <div className="lab-section-title">
            <span>4. SQL vs Prisma ORM Mapping</span>
            <span className="lab-badge">ORM Abstraction</span>
          </div>
          <p className="lab-section-subtitle">
            Prisma ORM generates SQL queries under the hood while providing a type-safe JavaScript API.
          </p>

          <table className="concept-table">
            <thead>
              <tr>
                <th>SQL Concept</th>
                <th>Raw SQL Syntax</th>
                <th>Prisma Equivalent in JS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>INNER JOIN</strong></td>
                <td><code>SELECT * FROM "Task" INNER JOIN "User" ON Task."userId" = User.id</code></td>
                <td><code>prisma.task.findMany({`{ include: { user: true } }`})</code></td>
              </tr>
              <tr>
                <td><strong>LEFT JOIN</strong></td>
                <td><code>SELECT * FROM "User" LEFT JOIN "Task" ON User.id = Task."userId"</code></td>
                <td><code>prisma.user.findMany({`{ include: { tasks: true } }`})</code></td>
              </tr>
              <tr>
                <td><strong>GROUP BY + COUNT</strong></td>
                <td><code>SELECT name, COUNT(tasks.id) FROM ... GROUP BY id, name</code></td>
                <td><code>prisma.user.findMany({`{ select: { name: true, _count: { select: { tasks: true } } } }`})</code></td>
              </tr>
              <tr>
                <td><strong>Raw SQL Escape Hatch</strong></td>
                <td>Direct PostgreSQL execution</td>
                <td><code>prisma.$queryRaw`SELECT ...`</code></td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* ─── SECTION 5: VIVA QUESTIONS ─────────────────────────────────── */}
        <section id="viva-questions" className="lab-section">
          <div className="lab-section-title">
            <span>5. Viva / Interview Questions on SQL JOINs</span>
            <span className="lab-badge">Viva Prep</span>
          </div>

          <div className="explanation-box" style={{ marginBottom: "16px" }}>
            <h4>Q1: What is a SQL JOIN?</h4>
            <p>
              A JOIN clause is used to combine rows from two or more tables based on a related column between them (such as a Foreign Key <code>Task.userId = User.id</code>).
            </p>
          </div>

          <div className="explanation-box" style={{ marginBottom: "16px" }}>
            <h4>Q2: Why do we separate data into tables and use JOINs instead of one large table?</h4>
            <p>
              To follow database <strong>normalization principles</strong>, prevent data redundancy (e.g. repeating user name and email on every single task), avoid update anomalies, and maintain data integrity with foreign keys.
            </p>
          </div>

          <div className="explanation-box">
            <h4>Q3: What is the key difference between INNER JOIN and LEFT JOIN?</h4>
            <p>
              <strong>INNER JOIN</strong> returns only rows where there is a match in <em>both</em> tables. If a user has no tasks, they do not appear in the result.
              <br />
              <strong>LEFT JOIN</strong> returns <em>all</em> rows from the left table (Users), regardless of whether there is a matching row in the right table (Tasks). Missing values from the right table are returned as <code>NULL</code>.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default DatabaseLab;
