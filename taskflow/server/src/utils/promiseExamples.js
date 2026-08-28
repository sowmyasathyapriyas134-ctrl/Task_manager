// src/utils/promiseExamples.js
// ─────────────────────────────────────────────────────────────────────────────
// JAVASCRIPT CONCEPT: PROMISES & ASYNC/AWAIT
//
// A Promise represents a value that will be available in the future.
// It can be in one of three states:
//   - PENDING   → waiting for result
//   - FULFILLED → operation succeeded, result is available
//   - REJECTED  → operation failed, error is available
// ─────────────────────────────────────────────────────────────────────────────

// EXAMPLE 1: Creating a Promise
// The Promise constructor takes a function with two parameters: resolve and reject

function fetchTaskWithPromise() {
  console.log("Fetching task... (with Promise)");

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const task = { id: 1, title: "Learn Promises", status: "PENDING" };

      // resolve() moves the Promise to FULFILLED state
      resolve(task);

      // If something went wrong, we would call:
      // reject(new Error("Failed to fetch task"));
    }, 1000);
  });
}

// Usage: .then() receives the resolved value, .catch() receives any error
fetchTaskWithPromise()
  .then((task) => {
    console.log("Task received:", task.title); // "Task received: Learn Promises"
  })
  .catch((error) => {
    console.log("Error:", error.message);
  });

// ─────────────────────────────────────────────────────────────────────────────

// EXAMPLE 2: Promise Chaining - solving callback hell
// Instead of nesting, we can chain .then() calls

function fetchUser(userId) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id: userId, name: "Alice" }), 300);
  });
}

function fetchUserTasks(userId) {
  return new Promise((resolve) => {
    setTimeout(() => resolve([{ id: 1, title: "Learn JS" }]), 300);
  });
}

function fetchTaskDetails(taskId) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id: taskId, description: "Study hard!" }), 300);
  });
}

// Clean chaining instead of nesting - much more readable!
fetchUser(1)
  .then((user) => fetchUserTasks(user.id))
  .then((tasks) => fetchTaskDetails(tasks[0].id))
  .then((details) => console.log("Details:", details.description))
  .catch((error) => console.log("Something went wrong:", error));

// ─────────────────────────────────────────────────────────────────────────────

// EXAMPLE 3: async/await - the cleanest syntax for Promises
// async/await is "syntactic sugar" on top of Promises.
// It makes asynchronous code look like synchronous code.

async function loadTaskData() {
  try {
    // await pauses execution until the Promise resolves
    const user = await fetchUser(1);
    const tasks = await fetchUserTasks(user.id);
    const details = await fetchTaskDetails(tasks[0].id);

    console.log("Task details (async/await):", details.description);
    return details;
  } catch (error) {
    // catch() for Promises becomes try/catch with async/await
    console.log("Error:", error.message);
  }
}

loadTaskData();

// ─────────────────────────────────────────────────────────────────────────────
// KEY TAKEAWAYS:
// • Promises have 3 states: pending, fulfilled, rejected
// • .then() handles success, .catch() handles errors
// • Promises can be chained to avoid callback hell
// • async/await is built on Promises but reads like synchronous code
// • All Express route handlers in this project use async/await!
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { fetchTaskWithPromise, loadTaskData };
