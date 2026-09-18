const fs = require('fs/promises');
const path = require('path');

const dataFile = path.join(__dirname, '..', 'data', 'expenses.json');

async function readExpenses() {
  const content = await fs.readFile(dataFile, 'utf8');
  return JSON.parse(content);
}

async function writeExpenses(expenses) {
  await fs.writeFile(dataFile, JSON.stringify(expenses, null, 2));
  return expenses;
}

module.exports = { readExpenses, writeExpenses };
