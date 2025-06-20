document.addEventListener('DOMContentLoaded', () => {
    const apiBase = 'https://fd57-197-136-42-254.ngrok-free.app/api';
    //const apiBase = window.API_BASE_URL || '/api';


    const sidebarLinks = [
        { id: 'overview', icon: 'layout-dashboard', label: 'Overview' },
        { id: 'available_requests', icon: 'search', label: 'Available Requests' },
        { id: 'my_jobs', icon: 'truck', label: 'My Jobs' },
        { id: 'payments', icon: 'wallet', label: 'Payments' },
        { id: 'profile', icon: 'user', label: 'Profile' },
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

    function fetchWithErrorHandling(url, options = {}) {
        return fetch(url, options)
            .then(res => {
                if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
                return res.json();
            })
            .catch(err => {
                console.error('Fetch error:', err);
                setPage('Error', `<div class="text-red-500">❌ ${err.message}</div>`);
                throw err; // allow catch in calling function if needed
            });
    }
// Overview navigation and dynamic content rendering
    document.getElementById('nav-overview').addEventListener('click', (e) => {
    e.preventDefault();
    renderRecyclerOverview(); // Call the new dynamic overview function
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
                <div class="text-2xl font-bold text-gray-800">Welcome back, Recycler!</div>
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

// Available requests navigation and job acceptance
    document.getElementById('nav-available_requests').addEventListener('click', (e) => {
        e.preventDefault();
        setPage('Available Requests', '<div>Loading available requests...</div>');

        fetchWithErrorHandling(`${apiBase}/recycler/available-jobs`)
            .then(data => {
                if (data.length === 0) {
                    setPage('Available Requests', '<div>No available requests at the moment.</div>');
                } else {
                    console.log(data);
                    const html = data.map(r => `
                        <div class="p-3 bg-white rounded-lg shadow mb-2">
                            <div class="font-medium">${r.type}</div>
                             <div class="text-gray-400 text-xs">Location: ${r.location}</div>
                              <div class="text-gray-400 text-xs">Quantity: ${r.quantity}</div>

                            <div class="text-gray-500 text-sm">Quantity: ${r.quantity}</div>
                            <div class="text-xs text-gray-400">${new Date(r.created_at).toLocaleString()}</div>
                            <button data-id="${r.id}" class="accept-btn bg-green-600 text-white px-3 py-1 rounded text-sm mt-2">Accept Job</button>
                        </div>
                    `).join('');
                    setPage('Available Requests', html);
                }
            });
    });

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('accept-btn')) {
            const id = e.target.dataset.id;
            fetchWithErrorHandling(`${apiBase}/recycler/jobs/${id}/accept`, {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content') },
            }).then(() => document.getElementById('nav-my_jobs').click());
        }
    });
//my jobs navigation and job management
    //my jobs navigation and job management
    document.getElementById('nav-my_jobs').addEventListener('click', (e) => {
        e.preventDefault();
        setPage('My Jobs', '<div>Loading your jobs...</div>');

        fetchWithErrorHandling(`${apiBase}/recycler/jobs`)
            .then(data => {
                if (data.length === 0) {
                    setPage('My Jobs', '<div>No jobs assigned yet.</div>');
                } else {
                    const html = data.map(job => `
                        <div class="p-4 bg-white rounded-lg border shadow mb-3">
                             <div class="font-medium">${job.type}</div>
                             <div class="text-gray-400 text-xs">Location: ${job.location}</div>
                              <div class="text-gray-400 text-xs">Quantity: ${job.quantity}</div>
                            <div class="text-gray-500 text-sm">Status: ${job.status.replace('_', ' ')}</div>
                            <button data-id="${job.id}" class="progress-btn bg-indigo-600 text-white px-2 py-1 rounded text-xs mr-2">In Progress</button>
                            <button data-id="${job.id}" class="complete-btn bg-green-600 text-white px-2 py-1 rounded text-xs">Complete</button>
                        </div>
                    `).join('');
                    setPage('My Jobs', html);
                }
            });
    });

    document.addEventListener('click', (e) => {
    if (e.target.classList.contains('progress-btn') || e.target.classList.contains('complete-btn')) {
        const id = e.target.dataset.id;
        const action = e.target.classList.contains('progress-btn') ? 'in-progress' : 'complete';

        fetch(`${apiBase}/recycler/jobs/${id}/${action}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json', // Tells Laravel to return JSON
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            },
            credentials: 'include', // Important: sends session cookies for authentication
        })
        .then(async (response) => {
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error ${response.status}`);
            }
            return response.json();
        })
        .then(() => {
            document.getElementById('nav-my_jobs').click(); // Reload jobs
        })
        .catch(err => {
            alert(`❌ ${err.message}`);
            console.error(err);
        });
    }
});

// Payments navigation and earnings display
    document.getElementById('nav-payments').addEventListener('click', (e) => {
        e.preventDefault();
        setPage('Payments', '<div>Loading earnings...</div>');

        fetchWithErrorHandling(`${apiBase}/recycler/payments`)
            .then(data => {
                const html = `
                    <div class="text-xl font-bold mb-3">Total Earned: KES ${data.total_earned}</div>
                    <div class="space-y-2">${data.completed_jobs.map(j => `<div class="text-gray-600">${j.item_description} → Completed</div>`).join('')}</div>
                `;
                setPage('Payments', html);
            });
    });
// Profile management navigation and form handling
   document.getElementById('nav-profile').addEventListener('click', (e) => {
    e.preventDefault();
    setPage('Profile', '<div>Loading profile...</div>');

    fetchWithErrorHandling(`${apiBase}/profile`, {
        credentials: 'include',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            'Accept': 'application/json'
        }
    }).then(user => {
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
});
;             document.addEventListener('submit', (e) => {
    if (e.target.id === 'profile-form') {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

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
    // Logout functionality

    document.getElementById('logout-button').addEventListener('click', () => {
        fetch('/logout', { method: 'POST' }).then(() => window.location.href = '/login');
    });

    // Default view
    document.getElementById('nav-overview').click();
});
