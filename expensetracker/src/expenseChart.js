import React, { useState, useEffect } from "react";
import './App.css';

function ExpenseChart() {
  const [balance, setBalance] = useState(() => {
    const stored = localStorage.getItem("walletBalance");
    return stored !== null ? parseFloat(stored) : 5000;
  });

  const [expenses, setExpenses] = useState(() =>
    JSON.parse(localStorage.getItem("expenses")) || []
  );

  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showBalanceForm, setShowBalanceForm] = useState(false);

  const [expenseData, setExpenseData] = useState({
    title: "",
    price: "",
    category: "",
    date: "",
  });

  const [incomeAmount, setIncomeAmount] = useState("");

  useEffect(() => {
    localStorage.setItem("walletBalance", balance.toString());
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [balance, expenses]);

  const handleAddIncome = (e) => {
    e.preventDefault();
    const amount = parseFloat(incomeAmount);
    if (!amount || amount <= 0) {
      alert("Please enter a valid income amount greater than 0.");
      return;
    }

    setBalance((prev) => prev + amount);
    setIncomeAmount("");
    setShowBalanceForm(false);
  };

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    const { title, price, category, date } = expenseData;

    if (!title || !price || !category || !date) {
      alert("Please fill out all the fields before submitting.");
      return;
    }

    const priceNum = parseFloat(price);
    if (priceNum <= 0) {
      alert("Expense amount should be greater than 0.");
      return;
    }

    if (priceNum > balance) {
      alert("You cannot spend more than your wallet balance!");
      return;
    }

    const newExpense = {
      id: Date.now(),
      ...expenseData,
      price: priceNum,
    };

    setExpenses((prev) => [...prev, newExpense]);
    setBalance((prev) => prev - priceNum);

    setExpenseData({ title: "", price: "", category: "", date: "" });
    setShowExpenseForm(false);
  };

  const handleDelete = (id) => {
    setExpenses((prev) => {
      const toDelete = prev.find((e) => e.id === id);
      if (!toDelete) return prev;
      setBalance((bal) => bal + toDelete.price);
      return prev.filter((e) => e.id !== id);
    });
  };
  return (
    <div className="container" data-testid="app-root">
      <main>
        <h1 data-testid="app-title">Expense Tracker</h1>
  

      <div className="balance-section">
        <h2 className="wallet-balance" data-testid="wallet-balance">
          Wallet Balance: ₹{balance}
        </h2>
        <button type="button" onClick={() => setShowBalanceForm(true)}>+ Add Income</button>
        <button type="button" onClick={() => setShowExpenseForm(true)}>+ Add Expense</button>
      </div>

      {showBalanceForm && (
        <form onSubmit={handleAddIncome} className="modal">
          <input
            name="incomeAmount"
            type="number"
            min="1"
            placeholder="Income Amount"
            required
            value={incomeAmount}
            onChange={(e) => setIncomeAmount(e.target.value)}
          />
          <button type="submit">Add Balance</button>
          <button type="button" onClick={() => setShowBalanceForm(false)}>Cancel</button>
        </form>
      )}

      {showExpenseForm && (
        <form onSubmit={handleExpenseSubmit} className="modal">
          <input
            name="title"
            placeholder="Title"
            required
            value={expenseData.title}
            onChange={(e) =>
              setExpenseData({ ...expenseData, title: e.target.value })
            }
          />
          <input
            name="price"
            type="number"
            placeholder="Amount"
            required
            min="1"
            value={expenseData.price}
            onChange={(e) =>
              setExpenseData({ ...expenseData, price: e.target.value })
            }
          />
          <select
            name="category"
            required
            value={expenseData.category}
            onChange={(e) =>
              setExpenseData({ ...expenseData, category: e.target.value })
            }
          >
            <option value="">Select Category</option>
            <option value="Food">Food</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Travel">Travel</option>
            <option value="Entertainment">Entertainment</option>
          </select>
          <input
            name="date"
            type="date"
            required
            value={expenseData.date}
            onChange={(e) =>
              setExpenseData({ ...expenseData, date: e.target.value })
            }
          />
          <button type="submit">Add Expense</button>
          <button type="button" onClick={() => setShowExpenseForm(false)}>Cancel</button>
        </form>
      )}

      <div className="expense-list" data-testid="expense-list">
        <h2>Recent Transactions</h2>
        {expenses.length === 0 && <p>No expenses yet.</p>}
        {[...expenses]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((exp) => (
            <div key={exp.id} className="expense-card">
              <p><strong>{exp.title}</strong></p>
              <p>₹{exp.price}</p>
              <p>{exp.category}</p>
              <p>{new Date(exp.date).toLocaleDateString()}</p>
              <button onClick={() => handleDelete(exp.id)}>Delete</button>
            </div>
          ))}
      </div>
      </main>
      </div>
  );
}

export default ExpenseChart;
