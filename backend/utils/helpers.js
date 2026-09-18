function createId(prefix = 'exp') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function monthTotal(expenses, month = new Date().toISOString().slice(0, 7)) {
  return expenses
    .filter((expense) => expense.date.startsWith(month))
    .reduce((total, expense) => total + Number(expense.amount), 0);
}

module.exports = { createId, monthTotal };
