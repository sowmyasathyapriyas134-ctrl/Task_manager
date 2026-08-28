// src/components/TaskForm.jsx
// Controlled form for creating new tasks with user assignment
//
// Demonstrates:
//   - useState for controlled inputs
//   - useEffect for loading assignee users
//   - onChange and onSubmit event handlers
//   - Basic validation
//
// Props:
//   onTaskCreated - callback called with the new task after successful creation

import React, { useState, useEffect } from "react";
import { createTask, getUsers } from "../services/taskApi";

function TaskForm({ onTaskCreated }) {
  // Controlled input states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [userId, setUserId] = useState("");

  // Assignee users list from database
  const [users, setUsers] = useState([]);

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch available users on mount for assignee dropdown
  useEffect(() => {
    getUsers()
      .then((data) => setUsers(data))
      .catch((err) => console.error("Could not load users for dropdown:", err));
  }, []);

  // ── onSubmit event handler ──
  async function handleSubmit(event) {
    event.preventDefault();

    if (title.trim().length < 3) {
      setError("Title must be at least 3 characters long");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // createTask() uses explicit Promise chaining in taskApi.js
      const newTask = await createTask({
        title,
        description,
        priority,
        userId: userId ? parseInt(userId) : null,
      });

      onTaskCreated(newTask);

      // Reset form fields
      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      setUserId("");
    } catch (err) {
      setError(err.message || "Failed to create task");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="form-card">
      <h2 className="form-card-title">➕ Create New Task</h2>

      <form onSubmit={handleSubmit} id="create-task-form">
        <div className="form-grid">
          {/* Title input */}
          <div className="form-group full-width">
            <label className="form-label" htmlFor="task-title">
              Task Title *
            </label>
            <input
              id="task-title"
              type="text"
              className="form-input"
              placeholder="e.g. Learn SQL JOIN Concepts"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Description textarea */}
          <div className="form-group full-width">
            <label className="form-label" htmlFor="task-description">
              Description (optional)
            </label>
            <textarea
              id="task-description"
              className="form-textarea"
              placeholder="What does this task involve?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              rows={2}
            />
          </div>

          {/* Priority select dropdown */}
          <div className="form-group">
            <label className="form-label" htmlFor="task-priority">
              Priority
            </label>
            <select
              id="task-priority"
              className="form-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              disabled={isLoading}
            >
              <option value="LOW">🟢 Low</option>
              <option value="MEDIUM">🟡 Medium</option>
              <option value="HIGH">🔴 High</option>
            </select>
          </div>

          {/* Assignee select dropdown (Demonstrates 1:Many User to Task relation) */}
          <div className="form-group">
            <label className="form-label" htmlFor="task-assignee">
              Assign To (User)
            </label>
            <select
              id="task-assignee"
              className="form-select"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              disabled={isLoading}
            >
              <option value="">👤 Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  👤 {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="form-error" style={{ marginTop: "12px" }}>
            ⚠️ {error}
          </div>
        )}

        <div className="form-actions">
          <button
            id="add-task-btn"
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                Adding...
              </>
            ) : (
              "➕ Add Task"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;
