/**
 * Cash-Flow — Sprint 02: Logic & Data
 * Salary & Expense Tracker (Vanilla JavaScript)
 * 
 * Manages reactive financial state, form validation, dynamic DOM rendering,
 * LocalStorage data persistence, Chart.js visualization, and jsPDF reporting.
 */

// Key used for saving data in browser LocalStorage
const STORAGE_KEY = "cashFlowState";

// Core application state
let state = {
  salary: 0,
  expenses: []
};

// Global reference to Chart.js instance (to allow destroy before rerender)
let expenseChart = null;

/* --------------------------------------------------------------------------
   DOM Element Selectors (Cached for quick access & performance)
   -------------------------------------------------------------------------- */
const salaryForm = document.getElementById("salaryForm");
const expenseForm = document.getElementById("expenseForm");
const salaryInput = document.getElementById("salary");
const expenseNameInput = document.getElementById("expenseName");
const expenseAmountInput = document.getElementById("expenseAmount");
const salaryError = document.getElementById("salaryError");
const expenseError = document.getElementById("expenseError");

const salaryDisplay = document.getElementById("salaryDisplay");
const expenseDisplay = document.getElementById("expenseDisplay");
const balanceDisplay = document.getElementById("balanceDisplay");

const expenseList = document.getElementById("expenseList");
const emptyState = document.getElementById("emptyState");
const alertBanner = document.getElementById("alertBanner");

const clearDataBtn = document.getElementById("clearDataBtn");
const downloadBtn = document.getElementById("downloadBtn");
const expenseChartCanvas = document.getElementById("expenseChart");

/* --------------------------------------------------------------------------
   Helper & Calculation Functions
   -------------------------------------------------------------------------- */

/**
 * Formats a numeric value into INR currency string (₹xx,xxx.xx)
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
function currency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Computes the total sum of all logged expenses.
 * @returns {number} Total expense amount
 */
function totalExpenses() {
  return state.expenses.reduce((sum, expense) => sum + expense.amount, 0);
}

/**
 * Computes remaining balance (Salary minus total expenses).
 * @returns {number} Remaining balance
 */
function balance() {
  return state.salary - totalExpenses();
}

/* --------------------------------------------------------------------------
   LocalStorage Persistence
   -------------------------------------------------------------------------- */

/**
 * Serializes and writes state to LocalStorage.
 */
function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Unable to save data to localStorage:", error);
  }
}

/**
 * Reads and restores state from LocalStorage on page load.
 */
function load() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;

  try {
    const data = JSON.parse(saved);
    state.salary = Number(data.salary) || 0;
    state.expenses = Array.isArray(data.expenses)
      ? data.expenses
          .map(expense => ({
            id: expense.id,
            name: String(expense.name).trim(),
            amount: Number(expense.amount)
          }))
          .filter(expense => Number.isFinite(expense.amount) && expense.amount >= 0)
      : [];
  } catch (error) {
    console.error("Unable to load saved data, resetting storage:", error);
    localStorage.removeItem(STORAGE_KEY);
  }
}

/* --------------------------------------------------------------------------
   Render Functions
   -------------------------------------------------------------------------- */

/**
 * Updates financial summary cards (Salary, Total Expenses, Balance).
 */
function renderSummary() {
  salaryDisplay.textContent = currency(state.salary);
  expenseDisplay.textContent = currency(totalExpenses());
  balanceDisplay.textContent = currency(balance());
}

/**
 * Dynamically renders the expense list items with delete buttons.
 */
function renderExpenses() {
  expenseList.innerHTML = "";

  if (state.expenses.length === 0) {
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";

  state.expenses.forEach(expense => {
    const li = document.createElement("li");
    li.className = "expense-item";

    const info = document.createElement("div");
    info.className = "expense-info";

    const name = document.createElement("strong");
    name.textContent = expense.name;

    const amount = document.createElement("small");
    amount.textContent = currency(expense.amount);

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.type = "button";
    deleteButton.dataset.id = expense.id;
    deleteButton.setAttribute("aria-label", `Delete expense: ${expense.name}`);
    deleteButton.textContent = "🗑 Delete";

    info.append(name, amount);
    li.append(info, deleteButton);
    expenseList.appendChild(li);
  });
}

/**
 * Visualizes Remaining Balance vs Total Expenses using Chart.js Pie Chart.
 */
function renderChart() {
  // Always destroy previous chart instance before rerendering to prevent canvas memory leaks & glitches
  if (expenseChart) {
    expenseChart.destroy();
  }

  if (typeof Chart === "undefined" || !expenseChartCanvas) {
    return;
  }

  const currentBalance = balance();
  const currentExpenses = totalExpenses();

  expenseChart = new Chart(expenseChartCanvas, {
    type: "pie",
    data: {
      labels: ["Remaining Balance", "Total Expenses"],
      datasets: [
        {
          data: [Math.max(currentBalance, 0), currentExpenses],
          backgroundColor: ["#10b981", "#f87171"],
          hoverBackgroundColor: ["#059669", "#ef4444"],
          borderColor: ["#ffffff", "#ffffff"],
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 14,
            padding: 16,
            font: {
              size: 13,
              family: "Arial, sans-serif"
            }
          }
        },
        tooltip: {
          callbacks: {
            label: context => {
              const label = context.label || "";
              const value = context.parsed || 0;
              return ` ${label}: ${currency(value)}`;
            }
          }
        }
      }
    }
  });
}

/**
 * Checks balance and shows alert banner if balance is negative or below 10% threshold.
 */
function renderAlert() {
  const currentBalance = balance();
  const threshold = state.salary * 0.10;

  if (currentBalance < 0) {
    alertBanner.textContent = "Warning: Your expenses are greater than your salary.";
    alertBanner.classList.remove("hidden");
  } else if (state.salary > 0 && currentBalance < threshold) {
    alertBanner.textContent = "Critical warning: Remaining balance is below 10% of your salary.";
    alertBanner.classList.remove("hidden");
  } else {
    alertBanner.textContent = "";
    alertBanner.classList.add("hidden");
  }
}

/**
 * Orchestrates a complete rerender of the UI.
 */
function render() {
  renderSummary();
  renderExpenses();
  renderChart();
  renderAlert();
}

/* --------------------------------------------------------------------------
   Event Listeners
   -------------------------------------------------------------------------- */

// Handle Salary submission
salaryForm.addEventListener("submit", event => {
  event.preventDefault();
  salaryError.textContent = "";

  const value = Number(salaryInput.value);

  // Validate non-empty and non-negative
  if (salaryInput.value.trim() === "" || !Number.isFinite(value) || value < 0) {
    salaryError.textContent = "Please enter a valid non-negative salary.";
    salaryInput.focus();
    return;
  }

  state.salary = value;
  save();
  render();
  salaryForm.reset();
});

// Handle Expense submission
expenseForm.addEventListener("submit", event => {
  event.preventDefault();
  expenseError.textContent = "";

  const name = expenseNameInput.value.trim();
  const amount = Number(expenseAmountInput.value);

  // Validate name and amount
  if (
    !name ||
    expenseAmountInput.value.trim() === "" ||
    !Number.isFinite(amount) ||
    amount < 0
  ) {
    expenseError.textContent = "Enter an expense name and a non-negative amount.";
    if (!name) {
      expenseNameInput.focus();
    } else {
      expenseAmountInput.focus();
    }
    return;
  }

  // Add new item with unique timestamp ID
  state.expenses.push({
    id: Date.now(),
    name,
    amount
  });

  save();
  render();
  expenseForm.reset();
  expenseNameInput.focus();
});

// Event delegation for deleting expenses
expenseList.addEventListener("click", event => {
  const button = event.target.closest(".delete-btn");
  if (!button) return;

  const targetId = Number(button.dataset.id);
  state.expenses = state.expenses.filter(expense => expense.id !== targetId);

  save();
  render();
});

// Clear all data
clearDataBtn.addEventListener("click", () => {
  const isConfirmed = confirm("Clear salary and all expenses?");
  if (!isConfirmed) return;

  state = {
    salary: 0,
    expenses: []
  };

  localStorage.removeItem(STORAGE_KEY);
  render();
});

// Download PDF report
downloadBtn.addEventListener("click", () => {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert("PDF library is still loading or unavailable. Please check your internet connection.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Document Title Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Cash-Flow Report", 20, 22);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}`, 20, 29);

  // Summary Metrics Section
  doc.setFontSize(12);
  doc.setTextColor(20);
  doc.text(`Total Salary: ${currency(state.salary)}`, 20, 42);
  doc.text(`Total Expenses: ${currency(totalExpenses())}`, 20, 52);
  doc.text(`Remaining Balance: ${currency(balance())}`, 20, 62);

  // Divider Line
  doc.setDrawColor(220, 220, 220);
  doc.line(20, 68, 190, 68);

  // Expenses Section
  doc.setFont("helvetica", "bold");
  doc.text("Itemized Expenses:", 20, 78);

  doc.setFont("helvetica", "normal");
  let yPosition = 88;

  if (state.expenses.length === 0) {
    doc.setTextColor(120);
    doc.text("No expenses recorded.", 25, yPosition);
  } else {
    state.expenses.forEach((expense, index) => {
      doc.setTextColor(30);
      doc.text(
        `${index + 1}. ${expense.name} - ${currency(expense.amount)}`,
        25,
        yPosition
      );
      yPosition += 8;

      // Handle multi-page pagination if list is long
      if (yPosition > 275) {
        doc.addPage();
        yPosition = 25;
      }
    });
  }

  // Save the generated document
  doc.save("cash-flow-report.pdf");
});

/* --------------------------------------------------------------------------
   Initialization
   -------------------------------------------------------------------------- */
load();
render();
