document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');
    const registerSuccess = document.getElementById('register-success');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        loginError.classList.add('hidden');

        const formData = new FormData(loginForm);

        fetch('/login', {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            },
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === 'Login successful') {
                window.location.href = '/dashboard';
            } else {
                loginError.textContent = data.message;
                loginError.classList.remove('hidden');
            }
        })
        .catch(() => {
            loginError.textContent = 'An error occurred.';
            loginError.classList.remove('hidden');
        });
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        registerError.classList.add('hidden');
        registerSuccess.classList.add('hidden');

        const formData = new FormData(registerForm);

        fetch('/register', {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            },
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === 'Registration successful') {
                registerSuccess.classList.remove('hidden');
                registerForm.reset();
                setTimeout(() => window.location.reload(), 2000);
            } else {
                registerError.textContent = data.message;
                registerError.classList.remove('hidden');
            }
        })
        .catch(() => {
            registerError.textContent = 'An error occurred.';
            registerError.classList.remove('hidden');
        });
    });
    $.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    }
});

});
