// callbacks.js
// Callback vs Promise examples

console.log("=== CALLBACK EXAMPLE ===");

function getTaskWithCallback(callback) {
  setTimeout(() => {
    const task = {
      id: 1,
      title: "Learn JavaScript",
      status: "Completed"
    };

    callback(null, task);
  }, 1000);
}

getTaskWithCallback((error, task) => {
  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Callback result:", task);
});


console.log("\n=== PROMISE EXAMPLE ===");

function getTaskWithPromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const task = {
        id: 2,
        title: "Learn Promises",
        status: "In Progress"
      };

      resolve(task);
    }, 1000);
  });
}

getTaskWithPromise()
  .then((task) => {
    console.log("Promise result:", task);
    return task;
  })
  .then((task) => {
    console.log("Task title:", task.title);
  })
  .catch((error) => {
    console.error("Promise error:", error);
  });


console.log("\n=== PROMISE WITH ERROR ===");

function failedTask() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("Failed to fetch task"));
    }, 1000);
  });
}

failedTask()
  .then((task) => {
    console.log(task);
  })
  .catch((error) => {
    console.error("Caught error:", error.message);
  });


console.log("\n=== ASYNC/AWAIT ===");

async function loadTask() {
  try {
    const task = await getTaskWithPromise();
    console.log("Async/Await result:", task);
  } catch (error) {
    console.error("Async/Await error:", error.message);
  }
}

loadTask();