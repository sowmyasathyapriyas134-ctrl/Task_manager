// src/components/TaskList.jsx
// Renders the list of tasks using .map()
//
// Demonstrates:
//   - Rendering lists with .map()
//   - Passing props to child components
//   - Conditional rendering (empty state)
//
// Props:
//   tasks         - array of task objects
//   isLoading     - boolean, show spinner when true
//   onStatusChange - passed down to each TaskCard
//   onDelete      - passed down to each TaskCard

import React from "react";
import TaskCard from "./TaskCard";

function TaskList({ tasks, isLoading, onStatusChange, onDelete }) {
  // Show loading spinner while fetching from API
  if (isLoading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <span>Loading tasks...</span>
      </div>
    );
  }

  return (
    <div>
      <h2 className="section-title">
        📋 Tasks
        <span
          style={{
            fontSize: "0.8rem",
            fontWeight: 400,
            color: "var(--color-text-muted)",
          }}
        >
          ({tasks.length} {tasks.length === 1 ? "task" : "tasks"})
        </span>
      </h2>

      <div className="task-grid">
        {/* Conditional rendering: show empty state if no tasks */}
        {tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <p className="empty-state-text">No tasks found</p>
            <p className="empty-state-sub">
              Create a task above or try a different filter
            </p>
          </div>
        ) : (
          /* .map() creates a TaskCard for each task in the array */
          /* key prop is required by React to efficiently update the list */
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default TaskList;
