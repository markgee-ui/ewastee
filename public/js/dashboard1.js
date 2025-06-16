// dashboard.js (Fully Laravel + AJAX based)
document.addEventListener('DOMContentLoaded', () => {
    const user = window.etakaUser; // Provided via Blade template
    const notificationList = document.getElementById('notification-list');

    // Initialize
    populateUserInfo();
    loadNotifications();
    loadRequests();

    // Sidebar
    document.getElementById('menu-toggle')?.addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('-translate-x-full');
    });

    // Logout
    document.getElementById('logout-button').addEventListener('click', () => {
        fetch('/logout', {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            }
        }).then(() => window.location.href = '/login');
    });

    function populateUserInfo() {
        document.getElementById('user-name').textContent = user.name;
        document.getElementById('user-role').textContent = user.role;
        document.getElementById('user-avatar').textContent = user.name.charAt(0).toUpperCase();
    }

    function loadNotifications() {
        fetch('/api/notifications')
            .then(res => res.json())
            .then(notifications => {
                notificationList.innerHTML = '';
                notifications.forEach(n => {
                    const item = document.createElement('div');
                    item.className = 'p-2 rounded hover:bg-gray-50';
                    item.innerHTML = `
                        <p class="text-sm">${n.message}</p>
                        <p class="text-xs text-gray-400">${new Date(n.timestamp).toLocaleString()}</p>
                    `;
                    notificationList.appendChild(item);
                });
                document.getElementById('notification-dot').classList.toggle('hidden', notifications.length === 0);
            });

        document.getElementById('notification-bell').addEventListener('click', () => {
            document.getElementById('notification-panel').classList.toggle('hidden');
        });

        document.getElementById('clear-notifications').addEventListener('click', () => {
            fetch('/api/notifications/mark-read', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            }).then(loadNotifications);
        });
    }

    function loadRequests() {
        fetch('/api/requests')
            .then(res => res.json())
            .then(data => {
                renderRequests(data);
            });
    }

    function renderRequests(requests) {
        const main = document.getElementById('main-content');
        main.innerHTML = `<h2 class="text-xl font-bold mb-4">Your Requests</h2>`;

        if (requests.length === 0) {
            main.innerHTML += '<p class="text-gray-600">No requests yet.</p>';
            return;
        }

        const list = document.createElement('div');
        list.className = 'space-y-3';
        requests.forEach(req => {
            const card = document.createElement('div');
            card.className = 'p-4 bg-white rounded shadow border';
            card.innerHTML = `
                <h3 class="font-semibold">${req.type} (${req.quantity})</h3>
                <p class="text-gray-600 text-sm">${req.description || 'No description'}</p>
                <p class="text-xs text-gray-400">${new Date(req.created_at).toLocaleString()}</p>
                <p class="text-xs mt-1">Status: <span class="font-medium">${req.status}</span></p>
            `;
            list.appendChild(card);
        });
        main.appendChild(list);
    }
});
