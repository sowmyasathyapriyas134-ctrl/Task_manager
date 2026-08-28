// src/components/TaskFilter.jsx
// Filter buttons for switching between task status views
//
// Props:
//   activeFilter - current filter value ("" | "PENDING" | "IN_PROGRESS" | "COMPLETED")
//   onFilterChange - callback function called when user clicks a filter

import React from "react";

// Define filters as data to map over (avoids repetitive JSX)
const FILTERS = [
  { label: "All", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Completed", value: "COMPLETED" },
];

function TaskFilter({ activeFilter, onFilterChange }) {
  return (
    <div className="filter-bar">
      <span className="filter-label">Filter:</span>

      {/* .map() iterates the array and returns a button for each filter */}
      {FILTERS.map((filter) => (
        <button
          key={filter.value}
          id={`filter-${filter.value || "all"}`}
          className={`filter-btn ${activeFilter === filter.value ? "active" : ""}`}
          // onClick is a JavaScript event handler — called when user clicks
          onClick={() => onFilterChange(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

export default TaskFilter;
