// src/utils/hoistingExamples.js
// ─────────────────────────────────────────────────────────────────────────────
// JAVASCRIPT CONCEPT: HOISTING
//
// Hoisting is JavaScript's behavior of moving declarations to the top of their
// scope BEFORE code executes. Only declarations are hoisted, NOT initializations.
//
// Think of it like this: JS reads your file twice.
//   Pass 1: Collect all declarations (var, function)
//   Pass 2: Execute code line by line
// ─────────────────────────────────────────────────────────────────────────────

// EXAMPLE 1: var hoisting
// You might expect this to throw an error, but it doesn't!
// JavaScript hoists the var declaration to the top.

console.log(taskCount); // Output: undefined (NOT an error!)
var taskCount = 5;
console.log(taskCount); // Output: 5

// What JavaScript actually sees (after hoisting):
//   var taskCount;       ← declaration moved to top
//   console.log(taskCount); → undefined
//   taskCount = 5;       ← assignment stays here
//   console.log(taskCount); → 5

// ─────────────────────────────────────────────────────────────────────────────

// EXAMPLE 2: Function Declaration hoisting
// Function declarations are fully hoisted - you can call them before they appear!

// This works! The function declaration is hoisted before execution begins.
const result = sayHello();
console.log(result); // Output: "Hello from TaskFlow!"

function sayHello() {
  return "Hello from TaskFlow!";
}

// ─────────────────────────────────────────────────────────────────────────────

// EXAMPLE 3: let and const - NOT hoisted the same way
// let and const exist in a "Temporal Dead Zone" (TDZ) until their declaration.
// Accessing them before declaration throws a ReferenceError.

try {
  console.log(appName); // ❌ ReferenceError: Cannot access 'appName' before initialization
  let appName = "TaskFlow";
} catch (error) {
  console.log("Error caught:", error.message);
}

// ─────────────────────────────────────────────────────────────────────────────

// EXAMPLE 4: Function Expression - NOT hoisted as a function
// A function expression assigned to var is hoisted as undefined.

try {
  greetUser(); // ❌ TypeError: greetUser is not a function
} catch (error) {
  console.log("Error:", error.message);
}

var greetUser = function () {
  return "Hello, User!";
};

// After hoisting, JavaScript sees:
//   var greetUser;        ← declaration hoisted (value is undefined)
//   greetUser();          ← calling undefined() throws TypeError
//   greetUser = function() {...}; ← assignment stays here

// ─────────────────────────────────────────────────────────────────────────────
// SUMMARY TABLE:
//
// Declaration Type    | Hoisted? | Initial Value | TDZ?
// --------------------|----------|---------------|------
// var                 | Yes      | undefined     | No
// let                 | Yes*     | N/A           | Yes (TDZ)
// const               | Yes*     | N/A           | Yes (TDZ)
// function declaration| Yes      | Full function | No
// function expression | Yes*     | undefined     | No (if var)
//
// * Technically hoisted but not usable before declaration (TDZ)
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { sayHello };
