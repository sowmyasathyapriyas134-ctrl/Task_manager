// src/pages/JavaScriptLab.jsx
// Interactive learning lab for JavaScript core fundamentals
// Demonstrates Hoisting, Event Loop, Callbacks vs Promises, and Real App Flow

import React, { useState } from "react";

function JavaScriptLab() {
  // ─── State for Interactive Demos ───────────────────────────────────────────
  
  // 1. Hoisting state
  const [hoistingLogs, setHoistingLogs] = useState([]);
  const [hoistingRunning, setHoistingRunning] = useState(false);

  // 2. Event Loop state
  const [eventLoopLogs, setEventLoopLogs] = useState([]);
  const [eventLoopRunning, setEventLoopRunning] = useState(false);
  const [activeStep, setActiveStep] = useState(null); // 'Start' | 'End' | 'Promise' | 'Timeout'

  // 3. Callback / Promise / Async state
  const [asyncDemoLogs, setAsyncDemoLogs] = useState([]);
  const [asyncDemoRunning, setAsyncDemoRunning] = useState(false);
  const [activePattern, setActivePattern] = useState(null);

  // ─── 1. Run Hoisting Demo ──────────────────────────────────────────────────
  function runHoistingDemo() {
    setHoistingRunning(true);
    setHoistingLogs([]);

    const steps = [];

    // Simulate Step 1: var hoisting
    steps.push("Step 1: Evaluating `console.log(a); var a = 10;`");
    steps.push("→ Output: undefined");
    steps.push("  (Reason: `var a` declaration was hoisted to the top, but value 10 was not assigned yet)");

    // Simulate Step 2: function declaration hoisting
    steps.push("\nStep 2: Evaluating `sayHello(); function sayHello() { return 'Hello'; }`");
    steps.push("→ Output: Hello");
    steps.push("  (Reason: Entire function declaration is hoisted, so it can be called before its line)");

    // Simulate Step 3: let / const TDZ
    steps.push("\nStep 3: Evaluating `console.log(b); let b = 20;`");
    steps.push("→ Output: ReferenceError: Cannot access 'b' before initialization");
    steps.push("  (Reason: `let` and `const` reside in Temporal Dead Zone (TDZ) until evaluated)");

    setHoistingLogs(steps);
    setHoistingRunning(false);
  }

  // ─── 2. Run Event Loop Demo ────────────────────────────────────────────────
  function runEventLoopDemo() {
    setEventLoopRunning(true);
    setEventLoopLogs([]);
    setActiveStep(null);

    // We run the actual sequence and display logs with visible timing delays
    // Order of execution: Start (Sync) -> End (Sync) -> Promise (Microtask) -> Timeout (Macrotask)
    
    // Step 1: Synchronous 'Start'
    setTimeout(() => {
      setActiveStep("Start");
      setEventLoopLogs((prev) => [
        ...prev,
        { text: "1. Start", type: "info", queue: "Call Stack (Synchronous)" }
      ]);
    }, 400);

    // Step 2: Synchronous 'End'
    setTimeout(() => {
      setActiveStep("End");
      setEventLoopLogs((prev) => [
        ...prev,
        { text: "2. End", type: "info", queue: "Call Stack (Synchronous)" }
      ]);
    }, 1100);

    // Step 3: Microtask 'Promise'
    setTimeout(() => {
      setActiveStep("Promise");
      setEventLoopLogs((prev) => [
        ...prev,
        { text: "3. Promise", type: "success", queue: "Microtask Queue (Resolved Promise)" }
      ]);
    }, 1800);

    // Step 4: Macrotask 'Timeout'
    setTimeout(() => {
      setActiveStep("Timeout");
      setEventLoopLogs((prev) => [
        ...prev,
        { text: "4. Timeout", type: "warn", queue: "Task Queue (setTimeout callback)" }
      ]);
      setEventLoopRunning(false);
    }, 2500);
  }

  // ─── 3. Run Async Comparison Demos ─────────────────────────────────────────
  
  // Callback demo
  function runCallbackDemo() {
    setAsyncDemoRunning(true);
    setActivePattern("callback");
    setAsyncDemoLogs(["[Callback] Initiating getTask(callback)..."]);

    // Simulated callback execution
    function getTask(cb) {
      setTimeout(() => {
        cb("Task received via Callback!");
      }, 1000);
    }

    getTask((result) => {
      setAsyncDemoLogs((prev) => [
        ...prev,
        `[Callback Completed] → ${result}`,
        "Note: Callback passed as an argument was invoked after 1000ms delay."
      ]);
      setAsyncDemoRunning(false);
    });
  }

  // Promise demo
  function runPromiseDemo() {
    setAsyncDemoRunning(true);
    setActivePattern("promise");
    setAsyncDemoLogs(["[Promise] Calling getTask().then()..."]);

    // Simulated Promise execution
    function getTask() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve("Task received via Promise!");
        }, 1000);
      });
    }

    getTask()
      .then((result) => {
        setAsyncDemoLogs((prev) => [
          ...prev,
          `[Promise Resolved] → ${result}`,
          "Note: .then() registered callback on the Microtask Queue when resolved."
        ]);
      })
      .catch((err) => {
        setAsyncDemoLogs((prev) => [...prev, `[Promise Error] → ${err}`]);
      })
      .finally(() => {
        setAsyncDemoRunning(false);
      });
  }

  // async/await demo
  async function runAsyncAwaitDemo() {
    setAsyncDemoRunning(true);
    setActivePattern("async-await");
    setAsyncDemoLogs(["[async/await] Calling const result = await getTask()..."]);

    function getTask() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve("Task received via async/await!");
        }, 1000);
      });
    }

    try {
      const result = await getTask();
      setAsyncDemoLogs((prev) => [
        ...prev,
        `[await Resumed] → ${result}`,
        "Note: async/await paused execution cleanly until Promise settled."
      ]);
    } catch (err) {
      setAsyncDemoLogs((prev) => [...prev, `[Catch Error] → ${err.message}`]);
    } finally {
      setAsyncDemoRunning(false);
    }
  }

  return (
    <div className="lab-page">
      <div className="page">
        {/* Header */}
        <header className="lab-header">
          <h1 className="lab-title">🧪 JavaScript Learning Lab</h1>
          <p className="lab-subtitle">
            Interactive, visual demonstrations of core JavaScript execution concepts
          </p>

          {/* Quick navigation table of contents */}
          <nav className="lab-toc" aria-label="Lab navigation">
            <a href="#hoisting" className="lab-toc-link">1. Hoisting</a>
            <a href="#event-loop" className="lab-toc-link">2. Event Loop & Queues</a>
            <a href="#async-patterns" className="lab-toc-link">3. Callbacks vs Promises</a>
            <a href="#real-app-flow" className="lab-toc-link">4. TaskFlow Request Flow</a>
          </nav>
        </header>

        {/* ─── SECTION 1: HOISTING ────────────────────────────────────────── */}
        <section id="hoisting" className="lab-section">
          <div className="lab-section-title">
            <span>1. Hoisting (var vs let/const & Functions)</span>
            <span className="lab-badge">Execution Context</span>
          </div>
          <p className="lab-section-subtitle">
            Hoisting is JavaScript's default behavior of moving variable and function declarations
            to the top of their containing scope during the compilation phase before execution.
          </p>

          {/* Code example */}
          <div className="code-block">
            <pre>
{`// 1. var hoisting (declaration hoisted, initialized to undefined)
console.log(a);   // Output: undefined
var a = 10;

// 2. Function declaration hoisting (entire function hoisted)
sayHello();       // Output: "Hello"
function sayHello() {
  console.log("Hello");
}

// 3. let/const hoisting (Hoisted into Temporal Dead Zone - TDZ)
console.log(b);   // Throws ReferenceError: Cannot access 'b' before initialization
let b = 20;`}
            </pre>
          </div>

          <button
            id="run-hoisting-btn"
            className="btn-run"
            onClick={runHoistingDemo}
            disabled={hoistingRunning}
          >
            ▶ Run Hoisting Example
          </button>

          {/* Output panel */}
          <div className="output-panel" style={{ marginTop: "16px" }}>
            <div className="output-label">Console Output</div>
            {hoistingLogs.length === 0 ? (
              <span className="output-empty">Click "Run Hoisting Example" to test</span>
            ) : (
              hoistingLogs.map((log, idx) => (
                <div key={idx} className="output-line" style={{ whiteSpace: "pre-wrap" }}>
                  {log}
                </div>
              ))
            )}
          </div>

          {/* Detailed explanation */}
          <div className="explanation-box">
            <h4>Why does this happen?</h4>
            <ul>
              <li>
                <strong>Creation Phase:</strong> The JS engine scans the code, allocates memory for variables and functions. <code>var</code> is initialized with <code>undefined</code>. Function declarations are stored in their entirety.
              </li>
              <li>
                <strong>Execution Phase:</strong> Code executes line-by-line. When <code>console.log(a)</code> runs, <code>a</code> holds <code>undefined</code>.
              </li>
              <li>
                <strong>Temporal Dead Zone (TDZ):</strong> <code>let</code> and <code>const</code> are also hoisted, but they remain uninitialized in the TDZ until execution reaches their declaration line. Accessing them earlier triggers a <code>ReferenceError</code>.
              </li>
            </ul>
          </div>
        </section>

        {/* ─── SECTION 2: EVENT LOOP ──────────────────────────────────────── */}
        <section id="event-loop" className="lab-section">
          <div className="lab-section-title">
            <span>2. The Event Loop & Microtask Queue</span>
            <span className="lab-badge">Concurrency Model</span>
          </div>
          <p className="lab-section-subtitle">
            JavaScript is single-threaded. The Event Loop continuously coordinates between
            the Call Stack, Microtask Queue (Promises), and Task/Macrotask Queue (setTimeout).
          </p>

          <div className="code-block">
            <pre>
{`console.log("Start");

setTimeout(() => {
  console.log("Timeout");
}, 0);

Promise.resolve().then(() => {
  console.log("Promise");
});

console.log("End");`}
            </pre>
          </div>

          <button
            id="run-event-loop-btn"
            className="btn-run"
            onClick={runEventLoopDemo}
            disabled={eventLoopRunning}
          >
            {eventLoopRunning ? "Running Event Loop..." : "▶ Run Event Loop Example"}
          </button>

          {/* Sequence visual indicator */}
          <div className="sequence-display">
            <span style={{ fontSize: "0.8rem", color: "var(--color-lab-text-muted)", marginRight: 8 }}>
              Execution Order:
            </span>
            <div className={`sequence-step ${activeStep === "Start" ? "active" : ""}`}>1</div>
            <span className="sequence-arrow">→</span>
            <div className={`sequence-step ${activeStep === "End" ? "active" : ""}`}>2</div>
            <span className="sequence-arrow">→</span>
            <div className={`sequence-step ${activeStep === "Promise" ? "active" : ""}`}>3</div>
            <span className="sequence-arrow">→</span>
            <div className={`sequence-step ${activeStep === "Timeout" ? "active" : ""}`}>4</div>
          </div>

          {/* Output Panel with Queue tags */}
          <div className="output-panel">
            <div className="output-label">Live Output Stream (Simulated Event Loop Timing)</div>
            {eventLoopLogs.length === 0 ? (
              <span className="output-empty">Click "Run Event Loop Example" to view execution order</span>
            ) : (
              eventLoopLogs.map((item, idx) => (
                <div key={idx} className={`output-line ${item.type}`}>
                  <strong>{item.text}</strong>{" "}
                  <span style={{ fontSize: "0.75rem", opacity: 0.7, marginLeft: 8 }}>
                    [{item.queue}]
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Architecture diagram */}
          <div className="event-loop-diagram">
            <div className="diagram-box">
              <div className="diagram-box-title">Call Stack (Sync)</div>
              <div className="diagram-stack-item">1. console.log("Start")</div>
              <div className="diagram-stack-item">2. console.log("End")</div>
            </div>

            <div className="diagram-box">
              <div className="diagram-box-title">Microtask Queue (Higher Priority)</div>
              <div className="diagram-stack-item" style={{ color: "#34d399" }}>
                3. Promise.then callback ("Promise")
              </div>
            </div>

            <div className="diagram-box">
              <div className="diagram-box-title">Task / Macrotask Queue (Lower Priority)</div>
              <div className="diagram-stack-item" style={{ color: "#fbbf24" }}>
                4. setTimeout callback ("Timeout")
              </div>
            </div>

            <div className="diagram-box">
              <div className="diagram-box-title">Event Loop Rule</div>
              <p style={{ fontSize: "0.8rem", color: "var(--color-lab-text-muted)" }}>
                Run all Call Stack items → Drain ALL Microtasks → Pick ONE Macrotask → Repeat.
              </p>
            </div>
          </div>

          <div className="explanation-box">
            <h4>Execution Sequence Breakdown</h4>
            <ol>
              <li><code>console.log("Start")</code> runs immediately on the Call Stack (Prints: <strong>Start</strong>).</li>
              <li><code>setTimeout(..., 0)</code> passes callback to Web APIs. After 0ms, callback enters the <strong>Task Queue (Macrotask)</strong>.</li>
              <li><code>Promise.resolve().then(...)</code> resolves immediately; callback is queued in the <strong>Microtask Queue</strong>.</li>
              <li><code>console.log("End")</code> runs synchronously on the Call Stack (Prints: <strong>End</strong>).</li>
              <li>Call Stack is now empty. Event Loop checks the <strong>Microtask Queue first</strong> and executes the Promise callback (Prints: <strong>Promise</strong>).</li>
              <li>Microtask Queue is empty. Event Loop takes the next macrotask from the <strong>Task Queue</strong> (Prints: <strong>Timeout</strong>).</li>
            </ol>
          </div>
        </section>

        {/* ─── SECTION 3: CALLBACKS VS PROMISES VS ASYNC/AWAIT ─────────────── */}
        <section id="async-patterns" className="lab-section">
          <div className="lab-section-title">
            <span>3. Callbacks vs Promises vs async/await</span>
            <span className="lab-badge">Async Evolution</span>
          </div>
          <p className="lab-section-subtitle">
            Explore how JavaScript evolved from nested callbacks to Promises and modern async/await syntax.
          </p>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
            <button
              id="run-callback-btn"
              className="btn-run"
              onClick={runCallbackDemo}
              disabled={asyncDemoRunning}
            >
              ▶ Test Callback
            </button>
            <button
              id="run-promise-btn"
              className="btn-run"
              onClick={runPromiseDemo}
              disabled={asyncDemoRunning}
            >
              ▶ Test Promise
            </button>
            <button
              id="run-async-btn"
              className="btn-run"
              onClick={runAsyncAwaitDemo}
              disabled={asyncDemoRunning}
            >
              ▶ Test async/await
            </button>
          </div>

          {/* Async Demo Output */}
          <div className="output-panel">
            <div className="output-label">
              Async Output {activePattern ? `(${activePattern})` : ""}
            </div>
            {asyncDemoLogs.length === 0 ? (
              <span className="output-empty">Select any button above to test asynchronous flow</span>
            ) : (
              asyncDemoLogs.map((msg, i) => (
                <div key={i} className="output-line">
                  {msg}
                </div>
              ))
            )}
          </div>

          {/* Comparison Table */}
          <table className="concept-table">
            <thead>
              <tr>
                <th>Pattern</th>
                <th>How it works</th>
                <th>Pros</th>
                <th>Cons</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Callback</strong></td>
                <td>Pass a function as an argument to be invoked upon completion.</td>
                <td>Simple for single small operations.</td>
                <td>Can lead to "Callback Hell" and unreadable nested pyramids.</td>
              </tr>
              <tr>
                <td><strong>Promise</strong></td>
                <td>Object representing eventual completion (Pending, Fulfilled, Rejected).</td>
                <td>Chaining with <code>.then()</code> and <code>.catch()</code>, handles errors cleanly.</td>
                <td>Can still get verbose with many chained handlers.</td>
              </tr>
              <tr>
                <td><strong>async/await</strong></td>
                <td>Syntactic sugar built directly on top of Promises.</td>
                <td>Reads like clean synchronous code, supports standard <code>try/catch</code> blocks.</td>
                <td>Must be wrapped inside an <code>async</code> function.</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* ─── SECTION 4: REAL TASKFLOW APPLICATION FLOW ──────────────────── */}
        <section id="real-app-flow" className="lab-section">
          <div className="lab-section-title">
            <span>4. End-to-End TaskFlow Request Flow</span>
            <span className="lab-badge">Viva Concept</span>
          </div>
          <p className="lab-section-subtitle">
            How clicking <strong>Complete</strong> in TaskFlow connects every concept together:
          </p>

          <div className="code-block">
            <pre>
{`1. User clicks "[✓ Complete]" button in UI
      ↓
2. React triggers onClick event listener
      ↓
3. handleComplete() handler is called
      ↓
4. fetch('/api/tasks/:id/status', { method: 'PATCH' }) is invoked
      ↓
5. Browser offloads network call (Web API); returns a Pending Promise
      ↓
6. Express Router matches PATCH /api/tasks/:id/status
      ↓
7. taskController.updateTaskStatus() validates input & invokes service
      ↓
8. taskService calls prisma.task.update()
      ↓
9. Prisma executes SQL UPDATE on PostgreSQL database
      ↓
10. Express sends JSON HTTP response (Status 200 OK)
      ↓
11. Promise resolves; callback placed in Microtask Queue
      ↓
12. Event Loop processes callback → React setTasks() updates state
      ↓
13. React re-renders TaskCard with COMPLETED status and strikethrough!`}
            </pre>
          </div>

          <div className="explanation-box">
            <h4>In this codebase:</h4>
            <ul>
              <li>
                <strong>taskApi.js → <code>createTask()</code></strong> uses explicit <code>fetch().then().catch()</code> to demonstrate Promise chaining.
              </li>
              <li>
                <strong>taskApi.js → <code>getTasks()</code></strong> and <code>updateTaskStatus()</code> use modern <code>async/await</code>.
              </li>
              <li>
                <strong>server.js & taskController.js</strong> use <code>async/await</code> for clean Express route handling.
              </li>
              <li>
                <strong>taskService.js</strong> uses Prisma Client to query PostgreSQL reliably without raw SQL vulnerabilities.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

export default JavaScriptLab;
