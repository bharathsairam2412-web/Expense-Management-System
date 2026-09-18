function saveUser(name, email) { localStorage.setItem('ledgerlyUser', JSON.stringify({ name, email })); window.location.href = 'dashboard.html'; }

document.getElementById('loginForm')?.addEventListener('submit', (event) => { event.preventDefault(); saveUser('Alex Morgan', document.getElementById('email').value); });
document.getElementById('registerForm')?.addEventListener('submit', (event) => { event.preventDefault(); saveUser(document.getElementById('name').value, document.getElementById('email').value); });
