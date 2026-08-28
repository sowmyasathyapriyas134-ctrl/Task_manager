// src/utils/callbackExamples.js
// ─────────────────────────────────────────────────────────────────────────────
// JAVASCRIPT CONCEPT: CALLBACKS
//
// A callback is a function passed as an argument to another function.
// The receiving function calls the callback when it has finished its work.
//
// Callbacks were the original way to handle asynchronous operations in JS.
// ─────────────────────────────────────────────────────────────────────────────

// EXAMPLE 1: Simple callback
// fetchTask receives a function called 'callback' as a parameter.
// After 1 second (simulating a DB call), it calls that function with the result.
function fetchTaskWithCallback(callback) {
  console.log("Fetching task... (with callback)");

  setTimeout(() => {
    // Simulate getting data from a database
    const task = { id: 1, title: "Learn Callbacks", status: "PENDING" };

    // Call the callback with (error, result) - Node.js convention
    callback(null, task);
  }, 1000);
}

// Usage: pass a function as the argument
fetchTaskWithCallback(function (error, task) {
  if (error) {
    console.log("Error:", error);
    return;
  }
  console.log("Task received:", task.title); // "Task received: Learn Callbacks"
});

// ─────────────────────────────────────────────────────────────────────────────

// EXAMPLE 2: Callback Hell (the problem with deeply nested callbacks)
// Imagine you need to: fetch user → fetch user's tasks → fetch task details

function fetchUser(userId, callback) {
  setTimeout(() => callback(null, { id: userId, name: "Alice" }), 500);
}

function fetchUserTasks(userId, callback) {
  setTimeout(() => callback(null, [{ id: 1, title: "Learn JS" }]), 500);
}

function fetchTaskDetails(taskId, callback) {
  setTimeout(
    () => callback(null, { id: taskId, description: "Study hard!" }),
    500
  );
}

// This is "callback hell" - each operation requires another level of nesting
fetchUser(1, function (err, user) {
  fetchUserTasks(user.id, function (err, tasks) {
    fetchTaskDetails(tasks[0].id, function (err, details) {
      console.log("Task details:", details);
      // Imagine MORE nesting here... it gets very hard to read and maintain
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// KEY TAKEAWAY:
// Callbacks work, but deeply nested callbacks become hard to read and maintain.
// This is why Promises and async/await were introduced.
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { fetchTaskWithCallback };
