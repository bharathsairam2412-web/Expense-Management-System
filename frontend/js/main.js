const API = '/api';
const money = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value) || 0);
const categoryIcon = { Food: '◉', Transport: '↗', Bills: '▣', Shopping: '◇', Health: '+', Fun: '✦', Other: '•' };

function ensureUser() {
  const user = JSON.parse(localStorage.getItem('ledgerlyUser') || 'null');
  if (!user) { window.location.href = 'login.html'; return null; }
  document.querySelectorAll('.user-display').forEach((element) => element.textContent = user.name);
  document.querySelectorAll('.user-initial').forEach((element) => element.textContent = user.name.charAt(0).toUpperCase());
  return user;
}

async function api(path, options) {
  const response = await fetch(`${API}${path}`, { headers: { 'Content-Type': 'application/json' }, ...options });
  if (!response.ok) throw new Error((await response.json()).message || 'Something went wrong.');
  return response.status === 204 ? null : response.json();
}

if (!location.pathname.endsWith('login.html') && !location.pathname.endsWith('register.html')) ensureUser();
