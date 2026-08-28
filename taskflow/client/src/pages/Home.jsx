// src/pages/Home.jsx
// Main Task Manager dashboard page
//
// Demonstrates:
//   - useState for managing task list, filters, loading, and errors
//   - useEffect for fetching tasks on component mount and filter change
//   - Passing state and updater functions down as props
//   - Event-driven state updates across parent/child components

import React, { useState, useEffect } from "react";
import Stats from "../components/Stats";
import TaskForm from "../components/TaskForm";
import TaskFilter from "../components/TaskFilter";
import TaskList from "../components/TaskList";
import { getTasks } from "../services/taskApi";

function Home() {
  // ── State Management with React useState ────────────────────────────────────
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState(""); // "" (all), "PENDING", "IN_PROGRESS", "COMPLETED"
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // ── Fetch tasks when component mounts or filter changes ─────────────────────
  // Demonstrates useEffect hook: runs when dependencies [filter] change
  useEffect(() => {
    let isMounted = true;

    async function loadTasks() {
      setIsLoading(true);
      setError("");

      try {
        // getTasks() uses async/await syntax to fetch from Express REST API
        const data = await getTasks(filter);
        if (isMounted) {
          setTasks(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load tasks. Is the server running?");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadTasks();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [filter]);

  // ── Handler: Task Created ───────────────────────────────────────────────────
  // Passed to TaskForm as a callback prop
  function handleTaskCreated(newTask) {
    // If the new task matches the current filter or filter is "All", prepend it
    if (!filter || newTask.status === filter) {
      setTasks((prevTasks) => [newTask, ...prevTasks]);
    } else {
      // If we are currently filtering for something else, fetch refreshed list
      getTasks(filter).then(setTasks).catch(console.error);
    }
  }

  // ── Handler: Status Updated ─────────────────────────────────────────────────
  // Passed down to TaskList -> TaskCard
  function handleStatusChange(updatedTask) {
    // Update the task in state immutably
    setTasks((prevTasks) =>
      prevTasks
        .map((task) => (task.id === updatedTask.id ? updatedTask : task))
        .filter((task) => (filter ? task.status === filter : true))
    );
  }

  // ── Handler: Task Deleted ───────────────────────────────────────────────────
  // Passed down to TaskList -> TaskCard
  function handleDeleteTask(deletedId) {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== deletedId));
  }

  return (
    <main className="page">
      {/* Header section */}
      <header className="page-header">
        <h1 className="page-title">Task Dashboard</h1>
        <p className="page-subtitle">
          Manage your tasks and learn full-stack JavaScript fundamentals
        </p>
      </header>

      {/* Error Banner if API call fails */}
      {error && (
        <div className="error-banner">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Top Statistics Bar */}
      <Stats tasks={tasks} />

      {/* Task Creation Form */}
      <TaskForm onTaskCreated={handleTaskCreated} />

      {/* Filter Options */}
      <TaskFilter activeFilter={filter} onFilterChange={setFilter} />

      {/* Task Cards List */}
      <TaskList
        tasks={tasks}
        isLoading={isLoading}
        onStatusChange={handleStatusChange}
        onDelete={handleDeleteTask}
      />
    </main>
  );
}

export default Home;
