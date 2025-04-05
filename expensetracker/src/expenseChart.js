import React, { useState, useEffect } from "react";
import './App.css';

function ExpenseChart() {
  const [balance, setBalance] = useState(() =>
    parseFloat(localStorage.getItem("walletBalance")) || 5000
  );

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
    localStorage.setItem("walletBalance", balance);
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [balance, expenses]);

  const handleAddIncome = (e) => {
    e.preventDefault();
    if (!incomeAmount || parseFloat(incomeAmount) <= 0) return;

    setBalance((prev) => prev + parseFloat(incomeAmount));
    setIncomeAmount("");
    setShowBalanceForm(false);
  };

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    const { title, price, category, date } = expenseData;

    if (!title || !price || !category || !date) return;

    const priceNum = parseFloat(price);
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
    const toDelete = expenses.find((e) => e.id === id);
    if (toDelete) {
      setBalance((prev) => prev + toDelete.price);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    }
  };

  return (
    <div className="container">
      <h1>Expense Tracker</h1>

      <div className="balance-section">
        <h2>Wallet Balance: ₹{balance}</h2>
        <button type="button" onClick={() => setShowBalanceForm(true)}>+ Add Income</button>
        <button type="button" onClick={() => setShowExpenseForm(true)}>+ Add Expense</button>
      </div>

      {showBalanceForm && (
        <form onSubmit={handleAddIncome} className="modal">
          <input
            type="number"
            placeholder="Income Amount"
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
            value={expenseData.title}
            onChange={(e) =>
              setExpenseData({ ...expenseData, title: e.target.value })
            }
          />
          <input
            name="price"
            type="number"
            placeholder="Amount"
            value={expenseData.price}
            onChange={(e) =>
              setExpenseData({ ...expenseData, price: e.target.value })
            }
          />
          <select
            name="category"
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
          </select>
          <input
            name="date"
            type="date"
            value={expenseData.date}
            onChange={(e) =>
              setExpenseData({ ...expenseData, date: e.target.value })
            }
          />
          <button type="submit">Add Expense</button>
          <button type="button" onClick={() => setShowExpenseForm(false)}>Cancel</button>
        </form>
      )}

      <div className="expense-list">
        <h2>Recent Transactions</h2>
        {expenses.length === 0 && <p>No expenses yet.</p>}
        {expenses.map((exp) => (
          <div key={exp.id} className="expense-card">
            <p><strong>{exp.title}</strong></p>
            <p>₹{exp.price}</p>
            <p>{exp.category}</p>
            <p>{exp.date}</p>
            <button onClick={() => handleDelete(exp.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExpenseChart;
