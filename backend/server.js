require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const { readExpenses, writeExpenses } = require('./config/db');
const { createId, monthTotal } = require('./utils/helpers');

const app = express();
const port = process.env.PORT || 3000;
const frontendPath = path.join(__dirname, '..', 'frontend');
let monthlyBudget = 2400;

app.use(cors());
app.use(express.json());
app.use(express.static(frontendPath));

app.get('/api/expenses', async (_req, res) => {
  const expenses = await readExpenses();
  res.json(expenses.sort((a, b) => b.date.localeCompare(a.date)));
});

app.post('/api/expenses', async (req, res) => {
  const { title, category, amount, date, note = '', paymentMethod = 'Card' } = req.body;
  if (!title || !category || !amount || !date) {
    return res.status(400).json({ message: 'Title, category, amount, and date are required.' });
  }
  const expenses = await readExpenses();
  const expense = { id: createId(), title, category, amount: Number(amount), date, note, paymentMethod };
  await writeExpenses([expense, ...expenses]);
  res.status(201).json(expense);
});

app.delete('/api/expenses/:id', async (req, res) => {
  const expenses = await readExpenses();
  const nextExpenses = expenses.filter((expense) => expense.id !== req.params.id);
  if (nextExpenses.length === expenses.length) return res.status(404).json({ message: 'Expense not found.' });
  await writeExpenses(nextExpenses);
  res.status(204).end();
});

app.get('/api/summary', async (_req, res) => {
  const expenses = await readExpenses();
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentExpenses = expenses.filter((expense) => expense.date.startsWith(currentMonth));
  const byCategory = currentExpenses.reduce((groups, expense) => {
    groups[expense.category] = (groups[expense.category] || 0) + Number(expense.amount);
    return groups;
  }, {});
  res.json({ total: monthTotal(expenses), count: currentExpenses.length, byCategory, budget: monthlyBudget, recent: expenses.slice(0, 5) });
});

app.get('/api/budget', async (_req, res) => {
  const expenses = await readExpenses();
  res.json({ budget: monthlyBudget, spent: monthTotal(expenses), remaining: monthlyBudget - monthTotal(expenses) });
});

app.put('/api/budget', (req, res) => {
  const value = Number(req.body.amount);
  if (!value || value < 0) return res.status(400).json({ message: 'Budget must be a positive number.' });
  monthlyBudget = value;
  res.json({ budget: monthlyBudget });
});

app.get('*', (_req, res) => res.sendFile(path.join(frontendPath, 'index.html')));

app.listen(port, () => console.log(`Expense Management System running at http://localhost:${port}`));
