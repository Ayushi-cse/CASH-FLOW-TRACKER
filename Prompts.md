# Prompts.md — Sprint 02: Logic & Data

## 1. Architectural Prompt
> "Build a lightweight, clean, and fully responsive salary and expense tracking web application called 'Cash-Flow' using only HTML5, modern CSS3, and Vanilla JavaScript (ES6+). Avoid all JavaScript frameworks, external state libraries, or build bundlers."

### Design Rationale:
- Keeps the application barrier-to-entry zero: works natively in any browser without needing `npm install` or local server setups.
- Separates structural markup (`index.html`), presentation styles (`style.css`), and business/DOM logic (`script.js`).

---

## 2. State & Data Flow Prompt
> "Establish a central predictable in-memory state object holding numeric `salary` and an `expenses` array containing `{ id, name, amount }` objects. Maintain derived properties mathematically where `Total Expenses = Σ(expenses.amount)` and `Remaining Balance = salary - Total Expenses`."

### Implementation Notes:
- Avoid storing duplicate derived values in state to prevent stale data sync bugs.
- Single source of truth feeds into four render pipelines: Summary Cards, Expense List, Pie Chart, and Alerts.

---

## 3. Validation & Sanitization Prompt
> "Implement client-side form validation that intercepts submit events. Disallow negative numbers, non-numeric values, or empty strings. Provide visual inline error messages under each field and clear them upon successful submission."

### Key Constraints:
- Salary cannot be empty or negative: `!Number.isFinite(value) || value < 0`.
- Expense names are trimmed of whitespace: `!name.trim()`.
- Expense amounts must be non-negative finite numbers.

---

## 4. LocalStorage Persistence Prompt
> "Persist the state object into browser LocalStorage under the key 'cashFlowState'. On initial page load, deserialize and restore the state with defensive fallbacks and `try/catch` error handling against corrupted data."

### Safety Mechanisms:
- On load error or corrupted JSON, log error to console and cleanly reset state to defaults without crashing the UI.

---

## 5. Dynamic DOM Manipulation Prompt
> "Generate expense list rows dynamically using native DOM APIs (`document.createElement`). Attach unique ID data attributes (`data-id`) and use event delegation on the parent container (`<ul>`) to handle expense deletions safely."

### Benefits:
- Minimizes event listener count by listening at the parent container level (`event.target.closest('.delete-btn')`).
- Eliminates memory leaks and simplifies DOM rebuilding.

---

## 6. Chart.js Integration Prompt
> "Import Chart.js via CDN. Render a responsive Pie Chart displaying Remaining Balance vs Total Expenses. Ensure previous chart instances are explicitly destroyed via `expenseChart.destroy()` before creating new instances."

### Visual Logic:
- Remaining balance is bounded at `Math.max(balance, 0)` so the chart does not receive negative values for canvas arcs.
- The chart updates reactively whenever salary or expenses change.

---

## 7. jsPDF Report Export Prompt
> "Integrate jsPDF via CDN to generate a clean, formatted PDF financial report when the user clicks 'Download Report'. Include total salary, total expenses, remaining balance, and an itemized breakdown with pagination support."

---

## 8. QA & Edge Case Prompts
- **Zero Values**: How does the UI behave when salary is 0 and expenses are 0?
- **Deficit Alert**: Trigger overspending banner when `Remaining Balance < 0`.
- **Threshold Alert**: Trigger low balance warning when `0 <= Remaining Balance < (0.10 * Salary)`.
- **Clean Reset**: Confirm dialog before wiping state and LocalStorage via `clearDataBtn`.
