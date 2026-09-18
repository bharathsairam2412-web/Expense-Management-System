async function loadDashboard() {
  const summary = await api("/summary");
  document.getElementById("totalSpent").textContent = money(summary.total);
  document.getElementById("remainingBudget").textContent = money(
    summary.budget - summary.total,
  );
  document.getElementById("budgetTotal").textContent = money(summary.budget);
  document.getElementById("transactionCount").textContent = summary.count;
  const recent = document.getElementById("recentExpenses");
  recent.innerHTML = summary.recent.length
    ? summary.recent
        .map(
          (expense) =>
            `<div class="expense-row"><span class="category-dot">${categoryIcon[expense.category] || "•"}</span><div class="expense-meta"><div class="expense-title">${expense.title}</div><div class="expense-sub">${expense.category} · ${new Date(expense.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div></div><div class="expense-amount">${money(expense.amount)}</div></div>`,
        )
        .join("")
    : '<div class="empty">No expenses yet.</div>';
  const categories = Object.entries(summary.byCategory).sort(
    (a, b) => b[1] - a[1],
  );
  const max = categories[0]?.[1] || 1;
  document.getElementById("categoryBars").innerHTML = categories.length
    ? categories
        .map(
          ([category, value]) =>
            `<div><div class="bar-line"><span>${category}</span><span>${money(value)}</span></div><div class="bar-track"><div class="bar-fill" style="width:${Math.max(8, (value / max) * 100)}%"></div></div></div>`,
        )
        .join("")
    : '<div class="empty">Category data appears here.</div>';
}
loadDashboard().catch((error) => console.error(error));
