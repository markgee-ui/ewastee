 
    document.addEventListener('DOMContentLoaded', () => {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const loginTabButton = document.getElementById('login-tab-button');
        const registerTabButton = document.getElementById('register-tab-button');
        const loginError = document.getElementById('login-error');
        const registerError = document.getElementById('register-error');
        const registerSuccess = document.getElementById('register-success');
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
         const meta = document.querySelector('meta[name="csrf-token"]');
          

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

      // Handle login form submission
loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    loginError.classList.add('hidden');

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        // Get fresh CSRF token right before login
        console.log('=== FETCHING FRESH TOKEN ===');
        const tokenResponse = await fetch('/debug-session', {
            credentials: 'include'
        });
        const tokenData = await tokenResponse.json();
        const freshToken = tokenData.csrf_token;
        
        console.log('Fresh token from session:', freshToken);
        console.log('Meta token:', document.querySelector('meta[name="csrf-token"]').getAttribute('content'));
        console.log('Session ID:', tokenData.session_id);

        // Update meta tag with fresh token
        document.querySelector('meta[name="csrf-token"]').setAttribute('content', freshToken);

        const response = await fetch('/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': freshToken,
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify({
                email: email,
                password: password,
                _token: freshToken
            })
        });

        console.log('Login response status:', response.status);
        
        // Handle 419 specifically
        if (response.status === 419) {
            throw new Error('CSRF token mismatch. Please refresh the page and try again.');
        }
        
        const text = await response.text();
        console.log('Raw response:', text);
        
        let data;
        try {
            data = JSON.parse(text);
        } catch (err) {
            console.error('JSON parse error:', err);
            throw new Error(`Invalid JSON response: ${text.slice(0, 200)}...`);
        }

        if (!response.ok) {
            throw new Error(data.error || data.message || `Login failed (status ${response.status})`);
        }

        console.log('Login successful:', data);
        if (data.redirect) {
            setTimeout(() => {
                window.location.href = data.redirect;
            }, 200);
        } else {
            window.location.href = '/dashboard';
        }

    } catch (err) {
        console.error('Login error:', err);
        loginError.textContent = err.message;
        loginError.classList.remove('hidden');
    }
});

        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            registerError.classList.add('hidden');
            registerSuccess.classList.add('hidden');

            fetch('/register', {
                method: 'POST',
                credentials: 'include', // ✅ ADD THIS LINE
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Accept': 'application/json' // this is reRequired to force JSON error responses
                },
                body: JSON.stringify({
                    name: document.getElementById('register-name').value,
                    email: document.getElementById('register-email').value,
                    password: document.getElementById('register-password').value,
                    role: document.getElementById('register-role').value
                })
            })
            .then(async res => {
                if (!res.ok) {
                    const data = await res.json();
                    let message = '';
                    if (data.errors) {
                        for (const key in data.errors) {
                            message += data.errors[key][0] + ' ';
                        }
                    } else {
                        message = data.message || 'Registration failed.';
                    }
                    throw new Error(message);
                }
                return res.json();
            })
            .then(data => {
                registerSuccess.textContent = data.message;
                registerSuccess.classList.remove('hidden');
                registerForm.reset();
                setTimeout(() => switchTab('login'), 2000);
            })
            .catch(err => {
                registerError.textContent = err.message;
                registerError.classList.remove('hidden');
            });
        });
    });
    