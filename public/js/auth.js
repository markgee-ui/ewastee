document.addEventListener('DOMContentLoaded', () => {

    if (localStorage.getItem('etaka_session')) {
        window.location.href = '/dashboard';
        return;
    }

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginTabButton = document.getElementById('login-tab-button');
    const registerTabButton = document.getElementById('register-tab-button');
    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');
    const registerSuccess = document.getElementById('register-success');

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

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        loginError.classList.add('hidden');
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const users = JSON.parse(localStorage.getItem('etaka_users')) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem('etaka_session', JSON.stringify(user));
            window.location.href = '/dashboard';
        } else {
            loginError.textContent = 'Invalid email or password.';
            loginError.classList.remove('hidden');
        }
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        registerError.classList.add('hidden');
        registerSuccess.classList.add('hidden');

        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const role = document.getElementById('register-role').value;

        const users = JSON.parse(localStorage.getItem('etaka_users')) || [];
        if (users.some(u => u.email === email)) {
            registerError.textContent = 'An account with this email already exists.';
            registerError.classList.remove('hidden');
            return;
        }
        
        const newUser = {
            id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
            name,
            email,
            password, // In a real app, this would be hashed
            role
        };
        
        users.push(newUser);
        localStorage.setItem('etaka_users', JSON.stringify(users));


        const notifications = JSON.parse(localStorage.getItem('etaka_notifications')) || [];
        const newNotifId = notifications.length > 0 ? Math.max(...notifications.map(n => n.id)) + 1 : 1;
        notifications.push({
            id: newNotifId,
            user_id: newUser.id,
            message: 'Welcome to Etaka! Get started by submitting your first e-waste pickup request.',
            is_read: false,
            timestamp: new Date().toISOString()
        });


        const admin = users.find(u => u.role === 'admin');
        if (admin) {
            const adminNotifId = newNotifId + 1;
             notifications.push({
                id: adminNotifId,
                user_id: admin.id,
                message: `A new ${role} has registered: ${name}.`,
                is_read: false,
                timestamp: new Date().toISOString()
            });
        }
        localStorage.setItem('etaka_notifications', JSON.stringify(notifications));

        registerSuccess.classList.remove('hidden');
        registerForm.reset();
        setTimeout(() => switchTab('login'), 2000);
    });
    
});
