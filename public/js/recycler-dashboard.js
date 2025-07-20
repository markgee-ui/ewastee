document.addEventListener('DOMContentLoaded', () => {
    const apiBase = 'https://3ba83a4cf5ab.ngrok-free.app/api';
    let user = null;

    fetchWithErrorHandling(`${apiBase}/profile`, {
        credentials: 'include',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            'Accept': 'application/json'
        }
    }).then(profile => {
        user = profile;
        document.getElementById('nav-overview').click(); // Trigger default view
    }).catch(() => {
        setPage('Error', '<div class="text-red-600">❌ Failed to load user. Please log in again.</div>');
    });

    const sidebarLinks = [
        { id: 'overview', icon: 'layout-dashboard', label: 'Overview' },
        { id: 'available_requests', icon: 'search', label: 'Available Requests' },
        { id: 'my_jobs', icon: 'truck', label: 'My Jobs' },
        { id: 'payments', icon: 'wallet', label: 'Payments' },
        { id: 'profile', icon: 'user', label: 'Profile' }
    ];

    const sidebarNav = document.getElementById('sidebar-nav');
    sidebarLinks.forEach(link => {
        const item = document.createElement('a');
        item.href = `#${link.id}`;
        item.id = `nav-${link.id}`;
        item.className = 'flex items-center space-x-2 p-2 rounded-lg text-gray-600 hover:bg-gray-100';
        item.innerHTML = `<i data-lucide="${link.icon}" class="w-5 h-5"></i><span>${link.label}</span>`;
        sidebarNav.appendChild(item);
    });

    lucide.createIcons();

    function setPage(title, content) {
        document.getElementById('page-title').textContent = title;
        document.getElementById('main-content').innerHTML = content;
    }

    function setActiveLink(id) {
        document.querySelectorAll('#sidebar-nav a').forEach(link => {
            link.classList.remove('bg-gray-200', 'text-blue-600', 'font-semibold');
        });
        const active = document.getElementById(`nav-${id}`);
        if (active) {
            active.classList.add('bg-gray-200', 'text-blue-600', 'font-semibold');
        }
    }

    function fetchWithErrorHandling(url, options = {}) {
        return fetch(url, options)
            .then(res => {
                if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
                return res.json();
            })
            .catch(err => {
                console.error('Fetch error:', err);
                setPage('Error', `<div class="text-red-500">❌ ${err.message}</div>`);
                throw err;
            });
    }

    // Navigation handlers
    document.addEventListener('click', (e) => {
        if (e.target.closest('#nav-overview')) {
            e.preventDefault();
            setActiveLink('overview');
            renderRecyclerOverview();
        }

        if (e.target.closest('#nav-available_requests')) {
            e.preventDefault();
            setActiveLink('available_requests');
            setPage('Available Requests', '<div>Loading available requests...</div>');
            fetchWithErrorHandling(`${apiBase}/recycler/available-jobs`)
                .then(data => {
                    if (data.length === 0) {
                        setPage('Available Requests', '<div>No available requests at the moment.</div>');
                    } else {
                        const html = data.map(r => `
                            <div class="p-3 bg-white rounded-lg shadow mb-2">
                                <div class="font-medium">${r.type}</div>
                                <div class="text-gray-400 text-xs">Location: ${r.location}</div>
                                <div class="text-gray-400 text-xs">Quantity: ${r.quantity}</div>
                                <div class="text-xs text-gray-400">${new Date(r.created_at).toLocaleString()}</div>
                                <button data-id="${r.id}" class="accept-btn bg-green-600 text-white px-3 py-1 rounded text-sm mt-2">Accept Job</button>
                            </div>
                        `).join('');
                        setPage('Available Requests', html);
                    }
                });
        }
// Handle My Jobs
        if (e.target.closest('#nav-my_jobs')) {
            e.preventDefault();
            setActiveLink('my_jobs');
            setPage('My Jobs', '<div class="flex items-center justify-center py-8"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div><span class="ml-2 text-gray-600">Loading your jobs...</span></div>');
            fetchWithErrorHandling(`${apiBase}/recycler/jobs`)
                .then(data => {
                    if (data.length === 0) {
                        setPage('My Jobs', `
                            <div class="text-center py-12">
                                <div class="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                    <i data-lucide="briefcase" class="w-12 h-12 text-gray-400"></i>
                                </div>
                                <h3 class="text-lg font-medium text-gray-900 mb-2">No jobs assigned yet</h3>
                                <p class="text-gray-500">Check available requests to start earning!</p>
                            </div>
                        `);
                        lucide.createIcons();
                    } else {
                        const getStatusBadge = (status) => {
                            const statusMap = {
                                'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
                                'accepted': 'bg-blue-100 text-blue-800 border-blue-200',
                                'in_progress': 'bg-indigo-100 text-indigo-800 border-indigo-200',
                                'completed': 'bg-green-100 text-green-800 border-green-200'
                            };
                            return statusMap[status] || 'bg-gray-100 text-gray-800 border-gray-200';
                        };

                        const getActionButtons = (job) => {
                            if (job.status === 'completed') {
                                return `<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                    <i data-lucide="check-circle" class="w-4 h-4 mr-1"></i>
                                    Completed
                                </span>`;
                            }
                            
                            let buttons = '';
                            if (job.status === 'accepted') {
                                buttons += `<button data-id="${job.id}" class="progress-btn inline-flex items-center px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors mr-2">
                                    <i data-lucide="play" class="w-4 h-4 mr-1"></i>
                                    Start Work
                                </button>`;
                            }
                            if (job.status === 'in_progress') {
                                buttons += `<button data-id="${job.id}" class="complete-btn inline-flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors">
                                    <i data-lucide="check" class="w-4 h-4 mr-1"></i>
                                    Mark Complete
                                </button>`;
                            }
                            return buttons;
                        };
// Render My Jobs
                        const html = `
                            <div class="space-y-4">
                                <div class="flex items-center justify-between mb-6">
                                    <h2 class="text-2xl font-bold text-gray-900">My Jobs</h2>
                                    <div class="flex items-center space-x-4 text-sm text-gray-600">
                                        <span class="flex items-center">
                                            <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                                            ${data.filter(j => j.status === 'accepted').length} Accepted
                                        </span>
                                        <span class="flex items-center">
                                            <div class="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
                                            ${data.filter(j => j.status === 'in_progress').length} In Progress
                                        </span>
                                        <span class="flex items-center">
                                            <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                            ${data.filter(j => j.status === 'completed').length} Completed
                                        </span>
                                    </div>
                                </div>
                                <div class="grid gap-4">
                                    ${data.map(job => `
                                        <div class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6">
                                            <div class="flex items-start justify-between mb-4">
                                                <div class="flex-1">
                                                    <div class="flex items-center mb-2">
                                                        <h3 class="text-lg font-semibold text-gray-900 mr-3">${job.type}</h3>
                                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(job.status)}">
                                                            ${job.status.replace('_', ' ').toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                                        <div class="flex items-center">
                                                            <i data-lucide="map-pin" class="w-4 h-4 mr-2 text-gray-400"></i>
                                                            <span>${job.location}</span>
                                                        </div>
                                                        <div class="flex items-center">
                                                            <i data-lucide="package" class="w-4 h-4 mr-2 text-gray-400"></i>
                                                            <span>${job.quantity}</span>
                                                        </div>
                                                        <div class="flex items-center">
                                                            <i data-lucide="calendar" class="w-4 h-4 mr-2 text-gray-400"></i>
                                                            <span>${new Date(job.created_at).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                                                <div class="text-sm text-gray-500">
                                                    Job ID: #${job.id}
                                                </div>
                                                <div class="flex items-center space-x-2">
                                                    ${getActionButtons(job)}
                                                </div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `;
                        setPage('My Jobs', html);
                        lucide.createIcons();
                    }
                });
        }
// Handle Payments
        if (e.target.closest('#nav-payments')) {
            e.preventDefault();
            setActiveLink('payments');
            setPage('Payments', '<div>Loading payments...</div>');

            fetchWithErrorHandling(`${apiBase}/recycler/payments`)
                .then(data => {
                    let paymentRows = '';

                    if (data.payments && data.payments.length > 0) {
                        paymentRows = data.payments.map((payment, index) => {
                            const statusBadge = payment.status === 'Pending' 
                                ? '<span class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Pending</span>'
                                : '<span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Completed</span>';
                            
                            return `
                                <tr class="hover:bg-gray-50">
                                    <td class="px-4 py-3 text-gray-800">${index + 1}</td>
                                    <td class="px-4 py-3 text-gray-800">${payment.item_description || 'N/A'}</td>
                                    <td class="px-4 py-3 text-gray-800">${payment.item_quantity || 'N/A'}</td>
                                    <td class="px-4 py-3 text-gray-800">${payment.item_location || 'N/A'}</td>
                                    <td class="px-4 py-3 text-gray-800">KES ${payment.amount}</td>
                                    <td class="px-4 py-3">${statusBadge}</td>
                                    <td class="px-4 py-3 text-gray-600 text-sm">${payment.phone || 'N/A'}</td>
                                    <td class="px-4 py-3 text-gray-600 text-sm">${payment.mpesa_receipt || 'N/A'}</td>
                                    <td class="px-4 py-3 text-gray-600 text-sm">${new Date(payment.created_at).toLocaleDateString()}</td>
                                </tr>
                            `;
                        }).join('');
                    } else {
                        paymentRows = `
                            <tr>
                                <td colspan="9" class="text-center py-8 text-gray-500">No payment data available.</td>
                            </tr>
                        `;
                    }
// Render Payments
                    const html = `
                        <div class="space-y-6">
                            <div class="p-6 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-xl shadow-lg">
                                <h2 class="text-2xl font-bold mb-2">Total Earnings</h2>
                                <div class="text-4xl font-bold">KES ${data.total_earned || 0}</div>
                                <p class="text-green-100 mt-2">From ${data.payments ? data.payments.length : 0} transaction(s)</p>
                            </div>

                            <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                                <div class="px-6 py-4 bg-gray-50 border-b">
                                    <h3 class="text-lg font-semibold text-gray-800">Payment History</h3>
                                </div>
                                <div class="overflow-x-auto">
                                    <table class="min-w-full divide-y divide-gray-200">
                                        <thead class="bg-gray-50">
                                            <tr>
                                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">M-Pesa Receipt</th>
                                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody class="bg-white divide-y divide-gray-200">
                                            ${paymentRows}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    `;

                    setPage('Payments', html);
                })
                .catch(err => {
                    console.error('Payment fetch error:', err);
                    setPage('Payments', `<div class="text-red-600">❌ Failed to load payments: ${err.message}</div>`);
                });
        }
// Profile
        if (e.target.closest('#nav-profile')) {
            e.preventDefault();
            setActiveLink('profile');
            setPage('Profile', '<div>Loading profile...</div>');
            fetchWithErrorHandling(`${apiBase}/profile`, {
                credentials: 'include',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Accept': 'application/json'
                }
            }).then(user => {
                // Render Profile
                const html = `
                    <div class="bg-white rounded-lg shadow p-6 max-w-lg mx-auto space-y-4">
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">Manage Profile</h2>
                        <form id="profile-form" class="space-y-3">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input type="text" name="name" value="${user.name}" class="w-full border border-gray-300 rounded px-3 py-2">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input type="email" name="email" value="${user.email}" class="w-full border border-gray-300 rounded px-3 py-2">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">New Password (Optional)</label>
                                <input type="password" name="password" class="w-full border border-gray-300 rounded px-3 py-2">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                <input type="password" name="password_confirmation" class="w-full border border-gray-300 rounded px-3 py-2">
                            </div>
                            <button type="submit" class="w-full bg-green-600 text-white rounded px-4 py-2 font-semibold">Save Changes</button>
                        </form>
                        <div id="profile-message" class="text-sm mt-3"></div>
                    </div>
                `;
                setPage('Profile', html);
            });
        }

        if (e.target.classList.contains('accept-btn')) {
            const id = e.target.dataset.id;
            fetchWithErrorHandling(`${apiBase}/recycler/jobs/${id}/accept`, {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content') },
            }).then(() => document.getElementById('nav-my_jobs').click());
        }

        if (e.target.classList.contains('progress-btn') || e.target.classList.contains('complete-btn')) {
            const id = e.target.dataset.id;
            const action = e.target.classList.contains('progress-btn') ? 'in-progress' : 'complete';

            fetch(`${apiBase}/recycler/jobs/${id}/${action}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                credentials: 'include',
            })
                .then(async (response) => {
                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        throw new Error(errorData.message || `Error ${response.status}`);
                    }
                    return response.json();
                })
                .then(() => document.getElementById('nav-my_jobs').click())
                .catch(err => {
                    alert(`❌ ${err.message}`);
                    console.error(err);
                });
        }

        if (e.target.id === 'logout-button') {
            fetch('/logout', { method: 'POST' }).then(() => window.location.href = '/login');
        }
    });

    document.addEventListener('submit', (e) => {
        if (e.target.id === 'profile-form') {
            e.preventDefault();
            const formData = new FormData(e.target);

            fetchWithErrorHandling(`${apiBase}/profile`, {
                method: 'PUT',
                body: formData,
                credentials: 'include',
            })
                .then(() => {
                    document.getElementById('profile-message').innerHTML = `<div class="text-green-600">✅ Profile updated successfully!</div>`;
                })
                .catch(err => {
                    document.getElementById('profile-message').innerHTML = `<div class="text-red-600">${err.message}</div>`;
                });
        }
    });

    function renderRecyclerOverview() {
        setPage('Overview', '<div>Loading overview...</div>');

        Promise.all([
            fetchWithErrorHandling(`${apiBase}/recycler/jobs`, {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Accept': 'application/json'
                }
            }),
            fetchWithErrorHandling(`${apiBase}/recycler/available-jobs`, {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Accept': 'application/json'
                }
            })
        ]).then(([myJobs, availableJobs]) => {
            const completedCount = myJobs.filter(r => r.status === 'completed').length;
            setPage('Overview', `
                <div class="space-y-6">
                    <div class="text-2xl font-bold text-gray-800">Welcome back, ${user.name} 👋!</div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="p-4 bg-white rounded shadow border text-center">
                            <div class="text-blue-500 text-lg">${availableJobs.length}</div>
                            <div class="text-gray-500 text-sm">Available Requests</div>
                        </div>
                        <div class="p-4 bg-white rounded shadow border text-center">
                            <div class="text-indigo-500 text-lg">${myJobs.length}</div>
                            <div class="text-gray-500 text-sm">My Jobs</div>
                        </div>
                        <div class="p-4 bg-white rounded shadow border text-center">
                            <div class="text-green-500 text-lg">${completedCount}</div>
                            <div class="text-gray-500 text-sm">Completed Jobs</div>
                        </div>
                    </div>
                </div>
            `);
        });
    }
});