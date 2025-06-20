// dashboard.js

const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

const user = JSON.parse(localStorage.getItem('etaka_session'));

if (!user) {
    window.location.href = '/login';
}

const sidebarNav = document.getElementById('sidebar-nav');
const pageTitle = document.getElementById('page-title');
const userName = document.getElementById('user-name');
const userRole = document.getElementById('user-role');
const userAvatar = document.getElementById('user-avatar');
const logoutButton = document.getElementById('logout-button');
const notificationBell = document.getElementById('notification-bell');
const notificationPanel = document.getElementById('notification-panel');
const notificationDot = document.getElementById('notification-dot');
const notificationList = document.getElementById('notification-list');
const clearNotifications = document.getElementById('clear-notifications');

userName.textContent = user.name;
userRole.textContent = user.role;
userAvatar.textContent = user.name.charAt(0).toUpperCase();

fetch('/api/user/sidebar', {
    headers: {
        'X-CSRF-TOKEN': csrfToken,
        'Accept': 'application/json'
    },
    credentials: 'same-origin'
})
.then(res => res.json())
.then(data => {
    sidebarNav.innerHTML = data.sidebar.map(link => `
        <a href="${link.href}" class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 text-gray-700">
            <i data-lucide="${link.icon}" class="w-5 h-5"></i>
            <span>${link.label}</span>
        </a>
    `).join('');
    lucide.createIcons();
});

fetch('/api/notifications', {
    headers: {
        'X-CSRF-TOKEN': csrfToken,
        'Accept': 'application/json'
    },
    credentials: 'same-origin'
})
.then(res => res.json())
.then(data => {
    if (data.notifications.length > 0) {
        notificationDot.classList.remove('hidden');
        notificationList.innerHTML = data.notifications.map(n => `
            <div class="bg-gray-50 border border-gray-200 rounded p-2 text-sm">
                ${n.message}
                <div class="text-xs text-gray-400 mt-1">${new Date(n.timestamp).toLocaleString()}</div>
            </div>
        `).join('');
    }
});

notificationBell.addEventListener('click', () => {
    notificationPanel.classList.toggle('hidden');
});

clearNotifications.addEventListener('click', () => {
    fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
            'Accept': 'application/json'
        },
        credentials: 'same-origin'
    }).then(() => {
        notificationDot.classList.add('hidden');
        notificationList.innerHTML = '<div class="text-sm text-gray-500">No new notifications.</div>';
    });
});

logoutButton.addEventListener('click', () => {
    fetch('/logout', {
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': csrfToken,
            'Accept': 'application/json'
        },
        credentials: 'same-origin'
    }).then(() => {
        localStorage.removeItem('etaka_session');
        window.location.href = '/login';
    });
});
