document.addEventListener('DOMContentLoaded', async () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginTabButton = document.getElementById('login-tab-button');
    const registerTabButton = document.getElementById('register-tab-button');
    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');
    const registerSuccess = document.getElementById('register-success');
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const forgotError = document.getElementById('forgot-error');
    const forgotSuccess = document.getElementById('forgot-success');
    const backToLoginLink = document.getElementById('back-to-login');
    const resetPasswordForm = document.getElementById('reset-password-form');
    const resetError = document.getElementById('reset-error');
    const resetSuccess = document.getElementById('reset-success');

    // Get CSRF token from meta tag or form
    function getCsrfToken() {
        const metaToken = document.querySelector('meta[name="csrf-token"]');
        if (metaToken) {
            return metaToken.getAttribute('content');
        }
        
        // Fallback: try to get from any form's CSRF input
        const csrfInput = document.querySelector('input[name="_token"]');
        if (csrfInput) {
            return csrfInput.value;
        }
        
        return null;
    }

    // Enhanced CSRF token refresh
    async function refreshCsrfToken() {
        try {
            const response = await fetch('/csrf-token', { 
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.csrf_token) {
                    // Update meta tag
                    let metaTag = document.querySelector('meta[name="csrf-token"]');
                    if (!metaTag) {
                        metaTag = document.createElement('meta');
                        metaTag.name = 'csrf-token';
                        document.head.appendChild(metaTag);
                    }
                    metaTag.setAttribute('content', data.csrf_token);
                    
                    // Update all CSRF inputs in forms
                    document.querySelectorAll('input[name="_token"]').forEach(input => {
                        input.value = data.csrf_token;
                    });
                    
                    return data.csrf_token;
                }
            }
        } catch (err) {
            console.error('Failed to refresh CSRF token:', err);
        }
        return getCsrfToken();
    }

    // Make request with automatic CSRF token refresh on 419 errors
    async function makeAuthenticatedRequest(url, options = {}) {
        let token = getCsrfToken();
        
        // First attempt
        let response = await fetch(url, {
            ...options,
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'X-CSRF-TOKEN': token,
                ...options.headers
            }
        });

        // If we get a 419 (CSRF token mismatch), refresh token and retry
        if (response.status === 419) {
            console.log('CSRF token mismatch, refreshing token...');
            token = await refreshCsrfToken();
            
            response = await fetch(url, {
                ...options,
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': token,
                    ...options.headers
                }
            });
        }

        return response;
    }

    function switchTab(activeTab) {
        if (activeTab === 'login') {
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
            forgotPasswordForm.classList.add('hidden');
            resetPasswordForm.classList.add('hidden');
            loginTabButton.classList.add('text-green-600', 'border-green-500');
            loginTabButton.classList.remove('text-gray-500');
            registerTabButton.classList.add('text-gray-500');
            registerTabButton.classList.remove('text-green-600', 'border-green-500');
            registerError.classList.add('hidden');
            registerSuccess.classList.add('hidden');
        } else {
            loginForm.classList.add('hidden');
            registerForm.classList.remove('hidden');
            forgotPasswordForm.classList.add('hidden');
            resetPasswordForm.classList.add('hidden');
            registerTabButton.classList.add('text-green-600', 'border-green-500');
            registerTabButton.classList.remove('text-gray-500');
            loginTabButton.classList.add('text-gray-500');
            loginTabButton.classList.remove('text-green-600', 'border-green-500');
            loginError.classList.add('hidden');
        }
    }

    loginTabButton.addEventListener('click', () => switchTab('login'));
    registerTabButton.addEventListener('click', () => switchTab('register'));

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        loginError.classList.add('hidden');

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await makeAuthenticatedRequest('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (err) {
                throw new Error('Invalid response from server.');
            }

            if (!response.ok) {
                throw new Error(data.message || `Login failed (${response.status})`);
            }

            window.location.replace(data.redirect || '/dashboard');
        } catch (err) {
            loginError.textContent = err.message;
            loginError.classList.remove('hidden');
        }
    });

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        registerError.classList.add('hidden');
        registerSuccess.classList.add('hidden');

        try {
            const response = await makeAuthenticatedRequest('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: document.getElementById('register-name').value,
                    email: document.getElementById('register-email').value,
                    phone: document.getElementById('register-phone').value,
                    password: document.getElementById('register-password').value,
                    role: document.getElementById('register-role').value
                })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || `Registration failed (${response.status})`);
            }

            registerSuccess.textContent = data.message;
            registerSuccess.classList.remove('hidden');
            registerForm.reset();
            setTimeout(() => switchTab('login'), 2000);
        } catch (err) {
            registerError.textContent = err.message;
            registerError.classList.remove('hidden');
        }
    });

    document.querySelector('a[href="/forgot-password"]')?.addEventListener('click', function(e) {
        e.preventDefault();
        loginForm.classList.add('hidden');
        registerForm.classList.add('hidden');
        forgotPasswordForm.classList.remove('hidden');
        resetPasswordForm.classList.add('hidden');
        loginError.classList.add('hidden');
        forgotError.classList.add('hidden');
        forgotSuccess.classList.add('hidden');
    });

    backToLoginLink?.addEventListener('click', function(e) {
        e.preventDefault();
        forgotPasswordForm.classList.add('hidden');
        resetPasswordForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });

    forgotPasswordForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        forgotError.classList.add('hidden');
        forgotSuccess.classList.add('hidden');

        const email = document.getElementById('forgot-email').value;

        try {
            const response = await makeAuthenticatedRequest('/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to send reset email.');
            }

            forgotSuccess.textContent = data.status || 'Reset link sent!';
            forgotSuccess.classList.remove('hidden');
            forgotPasswordForm.reset();
        } catch (err) {
            forgotError.textContent = err.message;
            forgotError.classList.remove('hidden');
        }
    });

    resetPasswordForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        resetError.classList.add('hidden');
        resetSuccess.classList.add('hidden');

        const token = document.getElementById('reset-token').value;
        const email = document.getElementById('reset-email').value;
        const password = document.getElementById('reset-password').value;
        const password_confirmation = document.getElementById('reset-password-confirm').value;

        try {
            const response = await makeAuthenticatedRequest('/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, email, password, password_confirmation })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Password reset failed.');
            }

            resetSuccess.textContent = data.message || 'Password reset successfully.';
            resetSuccess.classList.remove('hidden');
            setTimeout(() => {
                resetPasswordForm.classList.add('hidden');
                loginForm.classList.remove('hidden');
            }, 2000);
        } catch (err) {
            resetError.textContent = err.message;
            resetError.classList.remove('hidden');
        }
    });

    function showResetFormIfTokenPresent() {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const email = params.get('email');

        if (token && email) {
            loginForm?.classList.add('hidden');
            registerForm?.classList.add('hidden');
            forgotPasswordForm?.classList.add('hidden');
            resetPasswordForm?.classList.remove('hidden');

            document.getElementById('reset-token').value = token;
            document.getElementById('reset-email').value = email;
        }
    }

    showResetFormIfTokenPresent();
});