// src/components/TaskCard.jsx
// Displays a single task with its details, assigned user, and action buttons
//
// Demonstrates:
//   - Props usage
//   - Relational display (User assignee)
//   - onClick event handlers
//   - Conditional rendering based on task status
//
// Props:
//   task          - the task object from the API (includes nested user relation)
//   onStatusChange - callback to update task status
//   onDelete      - callback to delete the task

import React, { useState } from "react";
import { updateTaskStatus, deleteTask } from "../services/taskApi";

// Helper: map status string to badge CSS class
function getStatusClass(status) {
  if (status === "PENDING") return "badge badge-pending";
  if (status === "IN_PROGRESS") return "badge badge-in-progress";
  if (status === "COMPLETED") return "badge badge-completed";
  return "badge";
}

// Helper: map priority to badge CSS class
function getPriorityClass(priority) {
  if (priority === "HIGH") return "badge badge-high";
  if (priority === "MEDIUM") return "badge badge-medium";
  if (priority === "LOW") return "badge badge-low";
  return "badge";
}

// Helper: format date string for display
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function TaskCard({ task, onStatusChange, onDelete }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── onClick handler: Mark task as complete ──────────────────────────────
  async function handleComplete() {
    setIsUpdating(true);
    try {
      const updatedTask = await updateTaskStatus(task.id, "COMPLETED");
      onStatusChange(updatedTask);
    } catch (err) {
      console.error("Failed to update task:", err.message);
    } finally {
      setIsUpdating(false);
    }
  }

  // ── onClick handler: Set to In Progress ────────────────────────────────
  async function handleInProgress() {
    setIsUpdating(true);
    try {
      const updatedTask = await updateTaskStatus(task.id, "IN_PROGRESS");
      onStatusChange(updatedTask);
    } catch (err) {
      console.error("Failed to update task:", err.message);
    } finally {
      setIsUpdating(false);
    }
  }

  // ── onClick handler: Delete task ────────────────────────────────────────
  async function handleDelete() {
    if (!window.confirm(`Delete "${task.title}"?`)) return;

    setIsDeleting(true);
    try {
      await deleteTask(task.id);
      onDelete(task.id);
    } catch (err) {
      console.error("Failed to delete task:", err.message);
      setIsDeleting(false);
    }
  }

  const isCompleted = task.status === "COMPLETED";
  const isPending = task.status === "PENDING";
  const assigneeName = task.user?.name || (task.assignedTo ? task.assignedTo : "Unassigned");

  return (
    <div className={`task-card ${isCompleted ? "completed" : ""}`} id={`task-${task.id}`}>
      {/* Card Header: title + status */}
      <div className="task-card-header">
        <h3 className="task-title">{task.title}</h3>
      </div>

      {/* Description */}
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      {/* Assigned User Info (Demonstrates JOINed User entity) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "0.825rem",
          color: task.user ? "var(--color-primary)" : "var(--color-text-muted)",
          fontWeight: 500,
          background: task.user ? "var(--color-primary-light)" : "var(--color-surface-2)",
          padding: "4px 8px",
          borderRadius: "6px",
          width: "fit-content",
        }}
      >
        <span>👤 Assigned to:</span>
        <strong>{assigneeName}</strong>
      </div>

      {/* Status and Priority badges */}
      <div className="task-badges">
        <span className={getStatusClass(task.status)}>
          {task.status === "IN_PROGRESS"
            ? "In Progress"
            : task.status.charAt(0) + task.status.slice(1).toLowerCase()}
        </span>
        <span className={getPriorityClass(task.priority)}>
          {task.priority} Priority
        </span>
      </div>

      {/* Creation date */}
      <div className="task-meta">Created {formatDate(task.createdAt)}</div>

      {/* Action buttons */}
      <div className="task-actions">
        {!isCompleted && (
          <button
            id={`complete-task-${task.id}`}
            className="btn btn-success btn-sm"
            onClick={handleComplete}
            disabled={isUpdating || isDeleting}
          >
            {isUpdating ? "..." : "✓ Complete"}
          </button>
        )}

        {isPending && (
          <button
            id={`start-task-${task.id}`}
            className="btn btn-ghost btn-sm"
            onClick={handleInProgress}
            disabled={isUpdating || isDeleting}
          >
            ▶ Start
          </button>
        )}

        <button
          id={`delete-task-${task.id}`}
          className="btn btn-danger btn-sm"
          onClick={handleDelete}
          disabled={isUpdating || isDeleting}
        >
          {isDeleting ? "..." : "🗑 Delete"}
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
