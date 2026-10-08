# Cash-Flow — Sprint 02: Logic & Data

A clean, responsive, and fully interactive **Salary & Expense Tracker** built strictly with **Vanilla JavaScript**, modern HTML5, and CSS3. No frameworks, compilers, or Node.js runtime required.

---

## 🚀 Live Features

- **Salary Management**: Set and update your monthly budget/salary anytime.
- **Expense Logging**: Add itemized expenses with descriptive labels and amounts.
- **Input Validation**: Strict error handling rejecting blank names, negative numbers, or invalid inputs.
- **Dynamic DOM Rendering**: Instant list rendering with smooth addition and deletion.
- **Financial Calculations**: Real-time evaluation of Total Expenses and Remaining Balance.
- **Browser Persistence**: Automatic sync with `localStorage` — refresh the browser without losing any data.
- **Visual Analytics**: Interactive pie chart powered by **Chart.js**, visually comparing Remaining Balance vs Total Expenses.
- **Proactive Budget Alerts**:
  - Overspending warning when total expenses exceed salary.
  - Critical warning whenever remaining balance drops below **10%** of total salary.
- **PDF Report Generation**: Instant export of a branded summary and expense report using **jsPDF**.
- **Data Reset**: One-click confirmation prompt to clear all local data and start fresh.
- **Responsive Design**: Mobile-friendly layout adapting effortlessly from mobile phones to widescreen desktops.

---

## 📁 Project Structure

```text
Cash-Flow/
├── index.html       # Semantic UI markup & CDN imports (Chart.js, jsPDF)
├── style.css        # Responsive styling with modern CSS variables
├── script.js        # Core business logic, DOM manipulation & state management
├── README.md        # Project guide, testing walkthrough & specifications
└── Prompts.md       # Development engineering prompts & technical decisions
```

---

## 🛠️ How to Run

1. Clone or download this folder to your machine.
2. Open `index.html` directly in any modern web browser (Google Chrome, Microsoft Edge, Firefox, Safari).
3. Alternatively, right-click `index.html` and select **"Open with Live Server"** in VS Code.

> **Note**: An active internet connection is required on initial load to fetch the CDN dependencies for Chart.js and jsPDF.

---

## 🧪 QA Walkthrough & Test Data

To verify all calculations, alerts, and charts, follow this recommended test procedure:

### Step 1: Set Monthly Salary
- Enter `30000` into **Total Monthly Salary** and click **Save Salary**.
- **Result**: Total Salary shows `₹30,000.00`, Remaining Balance shows `₹30,000.00`.

### Step 2: Add Expenses
Add the following items one by one:
1. Name: `Rent` | Amount: `10000`
2. Name: `Food` | Amount: `5000`
3. Name: `Transport` | Amount: `2000`

### Step 3: Verify Output
| Metric | Expected Value |
|---|---|
| **Total Salary** | `₹30,000.00` |
| **Total Expenses** | `₹17,000.00` |
| **Remaining Balance** | `₹13,000.00` |

- **Chart**: Displays a green slice for Remaining Balance (`₹13,000.00`) and a red slice for Total Expenses (`₹17,000.00`).
- **Alert**: No warnings displayed (balance is above 10% of salary).

### Step 4: Test Threshold Warning (< 10%)
- Add an expense: `Gadgets` with amount `11000`.
- New Total Expenses: `₹28,000.00` | New Balance: `₹2,000.00`.
- Since `₹2,000.00` is less than 10% of `₹30,000.00` (`₹3,000.00`), the banner displays:  
  `"Critical warning: Remaining balance is below 10% of your salary."`

### Step 5: Test Overspending Alert
- Add an expense: `Dinner` with amount `3000`.
- New Balance: `-₹1,000.00`.
- The banner displays:  
  `"Warning: Your expenses are greater than your salary."`

### Step 6: Test Persistence & Deletion
- Press `F5` / Refresh the browser page. All data, cards, and charts remain intact from `localStorage`.
- Click the **🗑 Delete** button next to `Dinner` and `Gadgets`.
- All cards, balance, and chart instantly recalculate back to normal.

### Step 7: Export PDF
- Click **Download Report**.
- A file named `cash-flow-report.pdf` is downloaded containing the itemized ledger and financial summary.

---

## 📋 QA Checklist

- [x] Salary form validates non-negative and non-empty values
- [x] Expense form validates non-empty name and positive amount
- [x] Reactive DOM updates on expense addition and deletion
- [x] Real-time remaining balance calculation
- [x] LocalStorage persistence persists across page reloads
- [x] Chart.js pie chart destroys previous instances before rendering
- [x] 10% salary threshold warning triggers correctly
- [x] Negative balance deficit warning triggers correctly
- [x] jsPDF report export formats and downloads properly
- [x] Clear Data modal dialog safely resets state and localStorage
