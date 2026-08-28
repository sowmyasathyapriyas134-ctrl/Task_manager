// src/components/Stats.jsx
// Displays aggregate task statistics at the top of the dashboard
//
// Props:
//   tasks - array of all task objects

import React from "react";

function Stats({ tasks }) {
  // JavaScript .filter() creates a new array with only matching items
  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === "PENDING").length;
  const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const completed = tasks.filter((t) => t.status === "COMPLETED").length;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-number">{total}</div>
        <div className="stat-label">Total Tasks</div>
      </div>

      <div className="stat-card pending">
        <div className="stat-number">{pending}</div>
        <div className="stat-label">Pending</div>
      </div>

      <div className="stat-card in-progress">
        <div className="stat-number">{inProgress}</div>
        <div className="stat-label">In Progress</div>
      </div>

      <div className="stat-card completed">
        <div className="stat-number">{completed}</div>
        <div className="stat-label">Completed</div>
      </div>
    </div>
  );
}

export default Stats;
