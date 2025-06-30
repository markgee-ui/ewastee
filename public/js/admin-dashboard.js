import { translations, currentLang, translatePage } from './translation.js';

document.addEventListener('DOMContentLoaded', () => {
    const apiBase = '/api/admin';
    const mainContent = document.getElementById('main-content');
    const pageTitle = document.getElementById('page-title');

    function generateSidebarNav() {
        const sidebarNav = document.getElementById('sidebar-nav');
sidebarNav.innerHTML = `
  <a href="#" id="nav-overview" class="nav-link flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
      <i data-lucide="layout-dashboard" class="w-5 h-5"></i><span>Overview</span>
  </a>
  <a href="#" id="nav-users" class="nav-link flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
      <i data-lucide="users" class="w-5 h-5"></i><span>Users</span>
  </a>
  <a href="#" id="nav-requests" class="nav-link flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
      <i data-lucide="list" class="w-5 h-5"></i><span>Requests</span>
  </a>
  <a href="#" id="nav-payments" class="nav-link flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
      <i data-lucide="credit-card" class="w-5 h-5"></i><span>Payments</span>
  </a>
  <a href="#" id="nav-notifications" class="nav-link flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
      <i data-lucide="bell" class="w-5 h-5"></i><span>Notifications</span>
  </a>
  <a href="#" id="nav-settings" class="nav-link flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
      <i data-lucide="settings" class="w-5 h-5"></i><span>Settings</span>
  </a>
`;

        lucide.createIcons();
    }

    function attachNavEvents() {
        document.getElementById('nav-overview').addEventListener('click', e => { e.preventDefault(); pageTitle.textContent = 'Overview'; renderOverview(); });
        document.getElementById('nav-users').addEventListener('click', e => { e.preventDefault(); pageTitle.textContent = 'Users'; renderUsers(); });
        document.getElementById('nav-requests').addEventListener('click', e => { e.preventDefault(); pageTitle.textContent = 'Requests'; renderRequests(); });
        document.getElementById('nav-payments').addEventListener('click', e => { e.preventDefault(); pageTitle.textContent = 'Payments'; renderPayments(); });
        document.getElementById('nav-notifications').addEventListener('click', e => { e.preventDefault(); pageTitle.textContent = 'Notifications'; renderNotifications(); });
        document.getElementById('nav-settings').addEventListener('click', e => { e.preventDefault(); pageTitle.textContent = 'Settings'; renderSettings(); });
    }

    function setPage(title, content) {
        document.title = title;
        mainContent.innerHTML = content;
    }

    function renderOverview() {
    setPage('Overview', '<div>Loading...</div>');

    fetch('/api/admin/overview', {
        credentials: 'include'  // This line is important for authenticated routes
    })
    .then(res => res.json())
    .then(data => {
        setPage('Overview', `
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div class="p-4 bg-white rounded-lg shadow text-center">
                    <div class="text-2xl font-bold text-gray-800">${data.totalUsers}</div>
                    <div class="text-sm text-gray-500">Users</div>
                </div>
                <div class="p-4 bg-white rounded-lg shadow text-center">
                    <div class="text-2xl font-bold text-gray-800">${data.totalRecyclers}</div>
                    <div class="text-sm text-gray-500">Recyclers</div>
                </div>
                <div class="p-4 bg-white rounded-lg shadow text-center">
                    <div class="text-2xl font-bold text-gray-800">${data.totalRequests}</div>
                    <div class="text-sm text-gray-500">E-Waste Requests</div>
                </div>
                <div class="p-4 bg-white rounded-lg shadow text-center">
                    <div class="text-2xl font-bold text-green-600">KES ${data.totalRewardsPaid}</div>
                    <div class="text-sm text-gray-500">Rewards Paid</div>
                </div>
            </div>

            <div class="bg-white p-6 rounded-lg shadow">
                <h2 class="text-lg font-semibold text-gray-700 mb-4">Monthly E-Waste Requests</h2>
                <canvas id="requestsChart" class="w-full h-64"></canvas>
            </div>
        `);

            renderRequestsChart(data.monthlyRequests);
        })
        .catch(error => {
            setPage('Overview', `<div class="text-red-500">Failed to load overview: ${error.message}</div>`);
        });
}
 function renderRequestsChart(chartData) {
    const ctx = document.getElementById('requestsChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'Requests per Month',
                data: chartData.data,
                borderColor: 'rgb(34,197,94)',
                backgroundColor: 'rgba(34,197,94,0.1)',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}


    // Example placeholder functions:
    function renderUsers() {
    setPage('Users', `<div>Loading...</div>`);
    fetch('/api/users')
        .then(res => res.json())
        .then(users => {
            const tableRows = users.map(user => `
                <tr class="border-t hover:bg-gray-50 transition">
                    <td class="p-2 text-sm">${user.id}</td>
                    <td class="p-2 text-sm">${user.name}</td>
                    <td class="p-2 text-sm">${user.email}</td>
                    <td class="p-2 text-sm">
                        <span class="inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                            user.role === 'recycler' ? 'bg-blue-100 text-blue-700' :
                            'bg-green-100 text-green-700'
                        }">${user.role}</span>
                    </td>
                    <td class="p-2 text-sm space-x-2">
                        <button data-id="${user.id}" data-user='${JSON.stringify(user)}' class="edit-user bg-yellow-500 text-white text-xs px-2 py-1 rounded hover:bg-yellow-600">Edit</button>
                        <button data-id="${user.id}" class="delete-user bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600">Delete</button>
                    </td>
                </tr>
            `).join('');

            setPage('Users', `
                <div class="overflow-x-auto bg-white p-4 rounded shadow">
                    <h2 class="text-lg font-semibold mb-4">Manage Users</h2>
                    <table class="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr class="border-b bg-gray-100">
                                <th class="p-2">ID</th>
                                <th class="p-2">Name</th>
                                <th class="p-2">Email</th>
                                <th class="p-2">Role</th>
                                <th class="p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>${tableRows}</tbody>
                    </table>
                </div>

                <!-- Edit Modal -->
                <div id="edit-modal" class="fixed inset-0 bg-black/40 flex items-center justify-center hidden z-50">
                    <div class="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg">
                        <h3 class="text-lg font-bold mb-4">Edit User</h3>
                        <form id="edit-user-form" class="space-y-4">
                            <input type="hidden" name="id" />
                            <div>
                                <label class="block text-sm font-medium mb-1">Name</label>
                                <input type="text" name="name" class="w-full border p-2 rounded" placeholder="Name" required />
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">Email</label>
                                <input type="email" name="email" class="w-full border p-2 rounded" placeholder="Email" required />
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">Role</label>
                                <select name="role" class="w-full border p-2 rounded">
                                    <option value="admin">Admin</option>
                                    <option value="consumer">Consumer</option>
                                    <option value="recycler">Recycler</option>
                                </select>
                            </div>
                            <div class="flex justify-end space-x-2 pt-2">
                                <button type="button" id="cancel-edit" class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                                <button type="submit" class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            `);

            // Attach Delete button handlers
            document.querySelectorAll('.delete-user').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.dataset.id;
                    if (confirm("Are you sure you want to delete this user?")) {
                        fetch(`/api/users/${id}`, {
                            method: 'DELETE',
                            headers: {
                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                            }
                        }).then(() => renderUsers());
                    }
                });
            });

            // Show Edit Modal with user data
            document.querySelectorAll('.edit-user').forEach(btn => {
                btn.addEventListener('click', () => {
                    const user = JSON.parse(btn.dataset.user);
                    const form = document.getElementById('edit-user-form');
                    form.id.value = user.id;
                    form.name.value = user.name;
                    form.email.value = user.email;
                    form.role.value = user.role;
                    document.getElementById('edit-modal').classList.remove('hidden');
                });
            });

            // Cancel modal
            document.getElementById('cancel-edit').addEventListener('click', () => {
                document.getElementById('edit-modal').classList.add('hidden');
            });

            // Submit edit
            document.getElementById('edit-user-form').addEventListener('submit', e => {
                e.preventDefault();
                const form = e.target;
                const id = form.id.value;

                fetch(`/api/users/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                    },
                    body: JSON.stringify({
                        name: form.name.value,
                        email: form.email.value,
                        role: form.role.value
                    })
                }).then(() => {
                    document.getElementById('edit-modal').classList.add('hidden');
                    renderUsers();
                });
            });
        });
}

    
    
  function renderRequests() {
    setPage('Requests', '<div>Loading...</div>');
    fetch(`${apiBase}/requests`)
        .then(res => res.json())
        .then(requests => {
            const filterOptions = `
                <div class="mb-4 flex items-center justify-between">
                    <label class="text-sm font-medium">Filter by status:</label>
                    <select id="statusFilter" class="border px-3 py-2 text-sm rounded">
                        <option value="">All</option>
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>`;

            const rows = requests.map(r => renderRequestRow(r)).join('');

            setPage('Requests', `
                ${filterOptions}
                <div class="overflow-auto">
                    <table class="min-w-full bg-white border rounded shadow text-sm">
                        <thead class="bg-gray-100 text-left">
                            <tr>
                                <th class="px-4 py-2">ID</th>
                                <th class="px-4 py-2">Type</th>
                                <th class="px-4 py-2">Qty</th>
                                <th class="px-4 py-2">Location</th>
                                <th class="px-4 py-2">Status</th>
                                <th class="px-4 py-2">Consumer</th>
                                <th class="px-4 py-2">Recycler</th>
                                <th class="px-4 py-2">Created</th>
                                <th class="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="request-table-body">${rows}</tbody>
                    </table>
                </div>
                <div class="mt-4 text-center">
                    <button class="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm">Load More</button>
                </div>

                <!-- Modal -->
                <div id="editModal" class="fixed inset-0 bg-black/50 hidden items-center justify-center z-50">
                    <div class="bg-white p-6 rounded shadow-lg w-full max-w-md">
                        <h2 class="text-lg font-semibold mb-4">Edit Request</h2>
                        <form id="editRequestForm">
                            <input type="hidden" id="edit-id">
                            <div class="mb-3">
                                <label class="block text-sm">Type</label>
                                <input type="text" id="edit-type" class="w-full border px-3 py-2 rounded text-sm">
                            </div>
                            <div class="mb-3">
                                <label class="block text-sm">Quantity</label>
                                <input type="number" id="edit-quantity" class="w-full border px-3 py-2 rounded text-sm">
                            </div>
                            <div class="mb-3">
                                <label class="block text-sm">Location</label>
                                <input type="text" id="edit-location" class="w-full border px-3 py-2 rounded text-sm">
                            </div>
                            <div class="mb-3">
                                <label class="block text-sm">Status</label>
                                <select id="edit-status" class="w-full border px-3 py-2 rounded text-sm">
                                    <option value="pending">Pending</option>
                                    <option value="accepted">Accepted</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                            <div class="flex justify-end space-x-2">
                                <button type="button" id="cancelEdit" class="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                                <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            `);

            document.getElementById('statusFilter').addEventListener('change', e => {
                const status = e.target.value;
                const filtered = status ? requests.filter(r => r.status === status) : requests;
                document.getElementById('request-table-body').innerHTML = filtered.map(renderRequestRow).join('');
            });

            document.getElementById('cancelEdit').addEventListener('click', () => {
                document.getElementById('editModal').classList.add('hidden');
            });

            document.getElementById('editRequestForm').addEventListener('submit', e => {
                e.preventDefault();
                const id = document.getElementById('edit-id').value;
                const payload = {
                    type: document.getElementById('edit-type').value,
                    quantity: document.getElementById('edit-quantity').value,
                    location: document.getElementById('edit-location').value,
                    status: document.getElementById('edit-status').value
                };

                fetch(`${apiBase}/requests/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    },
                    body: JSON.stringify(payload)
                }).then(() => {
                    document.getElementById('editModal').classList.add('hidden');
                    renderRequests(); // reload
                });
            });
        });
}

function renderRequestRow(r) {
    return `
        <tr class="border-b hover:bg-gray-50">
            <td class="p-3 text-sm text-gray-700">${r.id}</td>
            <td class="p-3 text-sm text-gray-700">${r.type}</td>
            <td class="p-3 text-sm text-gray-700">${r.quantity}</td>
            <td class="p-3 text-sm text-gray-700">${r.location}</td>
            <td class="p-3 text-sm">
                <span class="inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    r.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    r.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                }">${r.status}</span>
            </td>
            <td class="p-3 text-sm text-gray-700">${r.consumer_name}</td>
            <td class="p-3 text-sm text-gray-700">${r.recycler_name ?? '-'}</td>
            <td class="p-3 text-sm text-gray-500">${new Date(r.created_at).toLocaleString()}</td>
            <td class="p-3 text-sm text-right space-x-2">
                <button class="text-blue-500 hover:underline" onclick="editRequest(${encodeURIComponent(JSON.stringify(r))})">Edit</button>
                <button class="text-red-500 hover:underline" onclick="deleteRequest(${r.id})">Delete</button>
            </td>
        </tr>
    `;
}

window.editRequest = function(rJson) {
    const r = JSON.parse(decodeURIComponent(rJson));
    document.getElementById('edit-id').value = r.id;
    document.getElementById('edit-type').value = r.type;
    document.getElementById('edit-quantity').value = r.quantity;
    document.getElementById('edit-location').value = r.location;
    document.getElementById('edit-status').value = r.status;
    document.getElementById('editModal').classList.remove('hidden');
};

window.deleteRequest = function(id) {
    if (confirm('Are you sure you want to delete this request?')) {
        fetch(`${apiBase}/requests/${id}`, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            }
        }).then(() => renderRequests());
    }
};

    function renderPayments() { setPage('Payments', '<div>Payments & Rewards Here</div>'); }
    function renderNotifications() { setPage('Notifications', '<div>Send Notifications</div>'); }
    //function renderSettings() { setPage('Settings', '<div>Settings Page</div>'); }
    function renderSettings() {
    setPage('Settings', `
        <div class="max-w-2xl mx-auto bg-white p-6 rounded shadow">
            <h2 class="text-xl font-semibold mb-4">Admin Settings</h2>

            <!-- Profile Info -->
            <div class="mb-6">
                <h3 class="text-lg font-medium mb-2">Profile Information</h3>
                <div class="text-sm text-gray-700">
                    <p><strong>Name:</strong> Administrator</p>
                    <p><strong>Email:</strong> admin@etaka.com</p>
                    <p><strong>Role:</strong> Admin</p>
                </div>
            </div>

            <!-- Change Password -->
            <div class="mb-6">
                <h3 class="text-lg font-medium mb-2">Change Password</h3>
                <form id="changePasswordForm" class="space-y-4">
                    <div>
                        <label class="block text-sm">Current Password</label>
                        <input type="password" id="current-password" class="w-full border px-3 py-2 rounded text-sm" required>
                    </div>
                    <div>
                        <label class="block text-sm">New Password</label>
                        <input type="password" id="new-password" class="w-full border px-3 py-2 rounded text-sm" required>
                    </div>
                    <div>
                        <label class="block text-sm">Confirm New Password</label>
                        <input type="password" id="confirm-password" class="w-full border px-3 py-2 rounded text-sm" required>
                    </div>
                    <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded">Update Password</button>
                </form>
                <p id="passwordMessage" class="text-sm mt-2"></p>
            </div>
        </div>
    `);

    // Handle password change
    document.getElementById('changePasswordForm').addEventListener('submit', e => {
        e.preventDefault();
        const current = document.getElementById('current-password').value;
        const newPass = document.getElementById('new-password').value;
        const confirm = document.getElementById('confirm-password').value;

        if (newPass !== confirm) {
            document.getElementById('passwordMessage').textContent = '❌ New passwords do not match.';
            return;
        }

        fetch('/api/admin/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            credentials: 'same-origin',
            body: JSON.stringify({ current_password: current, new_password: newPass })
        })
        .then(res => res.json())
        .then(data => {
    const msg = document.getElementById('passwordMessage');
    msg.textContent = data.message || '✅ Password updated successfully.';
    msg.className = 'bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg text-sm mt-4 flex items-center space-x-2';
    msg.innerHTML = `
        <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <span>${data.message || 'Password updated successfully.'}</span>
    `;
        });
    });

}


    document.getElementById('notification-bell')?.addEventListener('click', () => {
        document.getElementById('notification-panel').classList.toggle('hidden');
    });

    document.getElementById('logout-button')?.addEventListener('click', () => {
        fetch('/logout', { method: 'POST' }).then(() => window.location.href = '/login');
    });

    generateSidebarNav();
    attachNavEvents();
    translatePage(currentLang);
    renderOverview(); // Load default
});
