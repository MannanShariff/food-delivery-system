const apiBase = 'http://localhost:5000/api/auth';

document.getElementById('show-login').onclick = function() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('auth-message').textContent = '';
};
document.getElementById('show-register').onclick = function() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
    document.getElementById('auth-message').textContent = '';
};

document.getElementById('login-form').onsubmit = async function(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const role = document.getElementById('login-role').value;
    try {
        const res = await fetch(apiBase + '/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role })
        });
        const data = await res.json();
        if (res.ok) {
            document.getElementById('auth-message').style.color = '#28a745';
            document.getElementById('auth-message').textContent = data.message;
            // Redirect based on role
            if (data.role === 'admin') {
                window.location.href = 'admin/dashboard.html';
            } else {
                window.location.href = 'customer/dashboard.html';
            }
        } else {
            document.getElementById('auth-message').style.color = '#d9534f';
            document.getElementById('auth-message').textContent = data.message;
        }
    } catch (err) {
        document.getElementById('auth-message').style.color = '#d9534f';
        document.getElementById('auth-message').textContent = 'Login failed. Try again.';
    }
};

document.getElementById('register-form').onsubmit = async function(e) {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const role = document.getElementById('register-role').value;
    try {
        const res = await fetch(apiBase + '/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role })
        });
        const data = await res.json();
        if (res.ok) {
            document.getElementById('auth-message').style.color = '#28a745';
            document.getElementById('auth-message').textContent = data.message + ' Please login.';
            document.getElementById('show-login').click();
        } else {
            document.getElementById('auth-message').style.color = '#d9534f';
            document.getElementById('auth-message').textContent = data.message;
        }
    } catch (err) {
        document.getElementById('auth-message').style.color = '#d9534f';
        document.getElementById('auth-message').textContent = 'Registration failed. Try again.';
    }
}; 