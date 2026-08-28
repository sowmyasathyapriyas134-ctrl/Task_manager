// src/utils/eventLoopExamples.js
// ─────────────────────────────────────────────────────────────────────────────
// JAVASCRIPT CONCEPT: EVENT LOOP
//
// JavaScript is SINGLE-THREADED - it can only do one thing at a time.
// The Event Loop allows JS to perform non-blocking operations by offloading
// work to the browser/Node.js Web APIs and processing results later.
//
// The key components:
//
//  ┌─────────────┐
//  │  Call Stack │  ← Where JS executes code (one frame at a time)
//  └─────────────┘
//         ↓
//  ┌─────────────┐
//  │   Web APIs  │  ← setTimeout, fetch, DOM events (handled by browser/Node)
//  └─────────────┘
//         ↓ (when ready)
//  ┌─────────────────────┐   ┌────────────────────┐
//  │ Microtask Queue     │   │ Task Queue         │
//  │ (Promise callbacks) │   │ (setTimeout, etc.) │
//  └─────────────────────┘   └────────────────────┘
//
// EVENT LOOP RULE:
//   1. Run all synchronous code (empty the Call Stack)
//   2. Process ALL microtasks (Promises, queueMicrotask)
//   3. Process ONE macrotask (setTimeout, setInterval)
//   4. Repeat from step 2
// ─────────────────────────────────────────────────────────────────────────────

// THE CLASSIC EXAMPLE - What is the output?

console.log("1"); // Synchronous → Call Stack → runs immediately

setTimeout(() => {
  console.log("2"); // Macrotask → goes to Task Queue
}, 0); // Even with 0ms delay, it waits for Call Stack to clear!

Promise.resolve().then(() => {
  console.log("3"); // Microtask → goes to Microtask Queue
});

console.log("4"); // Synchronous → Call Stack → runs immediately

// OUTPUT ORDER: 1 → 4 → 3 → 2
//
// WHY?
// Step 1: console.log("1") → synchronous → prints "1"
// Step 2: setTimeout(...) → sends callback to Web APIs → scheduled after 0ms
// Step 3: Promise.resolve().then(...) → Promise is already resolved,
//         callback goes to Microtask Queue immediately
// Step 4: console.log("4") → synchronous → prints "4"
// [Call Stack is now empty]
// Step 5: Event Loop checks Microtask Queue → finds Promise callback → prints "3"
// Step 6: Event Loop checks Task Queue → finds setTimeout callback → prints "2"

// ─────────────────────────────────────────────────────────────────────────────

// EXAMPLE 2: Multiple microtasks and macrotasks

console.log("Start");

setTimeout(() => console.log("Timeout 1"), 0); // Macrotask 1
setTimeout(() => console.log("Timeout 2"), 0); // Macrotask 2

Promise.resolve()
  .then(() => console.log("Promise 1")) // Microtask 1
  .then(() => console.log("Promise 2")); // Microtask 2 (chained)

console.log("End");

// OUTPUT: Start → End → Promise 1 → Promise 2 → Timeout 1 → Timeout 2
//
// KEY INSIGHT: ALL microtasks run before ANY macrotask!

// ─────────────────────────────────────────────────────────────────────────────
// WHAT THIS MEANS FOR TASKFLOW:
//
// When a user clicks "Complete Task":
//   1. The onClick handler (synchronous) runs first
//   2. fetch() is called → browser handles HTTP request (Web API)
//   3. When response arrives, the .then() callback goes to Microtask Queue
//   4. Event Loop picks it up → state is updated → React re-renders
//
// This is why the UI updates "magically" after an API call!
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {};
