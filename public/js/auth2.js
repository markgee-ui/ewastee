document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginTabButton = document.getElementById('login-tab-button');
    const registerTabButton = document.getElementById('register-tab-button');
    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');
    const registerSuccess = document.getElementById('register-success');

    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    function switchTab(activeTab) {
        if (activeTab === 'login') {
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
            loginTabButton.classList.add('text-green-600', 'border-green-500');
            loginTabButton.classList.remove('text-gray-500');
            registerTabButton.classList.add('text-gray-500');
            registerTabButton.classList.remove('text-green-600', 'border-green-500');
            registerError.classList.add('hidden');
            registerSuccess.classList.add('hidden');
        } else {
            loginForm.classList.add('hidden');
            registerForm.classList.remove('hidden');
            registerTabButton.classList.add('text-green-600', 'border-green-500');
            registerTabButton.classList.remove('text-gray-500');
            loginTabButton.classList.add('text-gray-500');
            loginTabButton.classList.remove('text-green-600', 'border-green-500');
            loginError.classList.add('hidden');
        }
    }

    loginTabButton.addEventListener('click', () => switchTab('login'));
    registerTabButton.addEventListener('click', () => switchTab('register'));

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        loginError.classList.add('hidden');

        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            },
            body: JSON.stringify({
                email: document.getElementById('login-email').value,
                password: document.getElementById('login-password').value,
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.redirect) {
                    window.location.href = data.redirect;
                }
            })
            .catch(err => {
                loginError.textContent = 'Invalid email or password.';
                loginError.classList.remove('hidden');
            });
    });

    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();
        registerError.classList.add('hidden');
        registerSuccess.classList.add('hidden');

        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            },
            body: JSON.stringify({
                name: document.getElementById('register-name').value,
                email: document.getElementById('register-email').value,
                password: document.getElementById('register-password').value,
                role: document.getElementById('register-role').value,
            })
        })
            .then(res => res.json())
            .then(data => {
                registerSuccess.textContent = data.message;
                registerSuccess.classList.remove('hidden');
                registerForm.reset();
                setTimeout(() => switchTab('login'), 2000);
            })
            .catch(err => {
                registerError.textContent = 'Error during registration.';
                registerError.classList.remove('hidden');
            });
    });
});
