import { translations, currentLang,translatePage } from './translation.js';
let previousCompletedRequestIds = new Set();

document.addEventListener('DOMContentLoaded', () => {

    const apiBase = '/api';

    const mainContent = document.getElementById('main-content');
    const pageTitle = document.getElementById('page-title');
    

   function generateSidebarNav() {
    const sidebarNav = document.getElementById('sidebar-nav');
    sidebarNav.innerHTML = `
        <a href="#" id="nav-overview" class="flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-green-50">
            <i data-lucide="layout-dashboard" class="w-5 h-5"></i>
            <span>Overview</span>
        </a>
        <a href="#" id="nav-my-requests" class="flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-green-50">
            <i data-lucide="list-checks" class="w-5 h-5"></i>
            <span>My Requests <span id="request-count" class="ml-1 inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-semibold hidden">(0)</span></span>
        </a>

        <a href="#" id="nav-submit-request" class="flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-green-50">
            <i data-lucide="plus-square" class="w-5 h-5"></i>
            <span>Submit Request</span>
        </a>
        <a href="#" id="nav-rewards" class="flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-green-50">
            <i data-lucide="award" class="w-5 h-5"></i>
            <span>Rewards</span>
        </a>
        <a href="#" id="nav-profile" class="flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-green-50">
            <i data-lucide="user" class="w-5 h-5"></i>
            <span>Profile</span>
        </a>
    `;
     fetchConsumerRequests(false, true); // Don’t show notifications, but update sidebar count

    // Re-initialize Lucide icons after updating the DOM
    lucide.createIcons();
}
   function setPage(title, content) {
    //  main content element
    const mainContent = document.getElementById('main-content'); 
    if (mainContent) {
        mainContent.innerHTML = content;
    }
    
    
    document.title = title;
}
function setActiveNav(linkId) {
    const allLinks = document.querySelectorAll('#sidebar-nav a');
    allLinks.forEach(link => {
        link.classList.remove('bg-green-100', 'text-green-800', 'font-semibold');
    });

    const activeLink = document.getElementById(linkId);
    if (activeLink) {
        activeLink.classList.add('bg-green-100', 'text-green-800', 'font-semibold');
    }
}

//       
    function attachNavEvents() {
        document.getElementById('nav-overview').addEventListener('click', e => {
            e.preventDefault();
            setActiveNav('nav-overview');
            pageTitle.textContent = 'Overview';
            renderOverview();
        });

        document.getElementById('nav-my-requests').addEventListener('click', e => {
            e.preventDefault();
            setActiveNav('nav-my-requests');
            pageTitle.textContent = 'My Requests';
            renderMyRequests();
        });

        document.getElementById('nav-submit-request').addEventListener('click', e => {
            e.preventDefault();
            setActiveNav('nav-submit-request');
            pageTitle.textContent = 'Submit Request';
            renderSubmitRequestForm();
        });

        document.getElementById('nav-rewards').addEventListener('click', e => {
            e.preventDefault();
            setActiveNav('nav-rewards');
            pageTitle.textContent = 'Rewards';
            renderRewards();
        });

        document.getElementById('nav-profile').addEventListener('click', e => {
            e.preventDefault();
            setActiveNav('nav-profile');
            pageTitle.textContent = 'Profile';
            renderProfile();
        });
    }

   function fetchConsumerRequests(showNotification = true, updateSidebarCount = false) {
    return fetch(`${apiBase}/requests`)
        .then(res => res.json())
        .then(data => {
            const requests = data.requests || [];
            

            if (updateSidebarCount) {
                const countBadge = document.getElementById('request-count');
                if (countBadge) {
                    countBadge.textContent = `(${requests.length})`;
                    countBadge.classList.remove('hidden');
                }
            }
            if (showNotification) {
                const newCompletions = requests.filter(r => 
                    r.status === 'completed' && !previousCompletedRequestIds.has(r.id)
                );

                if (newCompletions.length > 0) {
                    newCompletions.forEach(r => {
                        showNotificationMessage(`Your request for ${r.type} has been completed. Please proceed to payment.`);
                        previousCompletedRequestIds.add(r.id);
                    });
                    document.getElementById('notification-dot')?.classList.remove('hidden');
                }

                // Update completed request tracker
                requests
                    .filter(r => r.status === 'completed')
                    .forEach(r => previousCompletedRequestIds.add(r.id));
            }

            return requests;
        });
}


    function fetchRewards() {
        return fetch(`${apiBase}/rewards`)
            .then(res => res.json())
            .then(data => data.rewards || []);
    }

       function fetchNotifications() {
        fetch('/api/notifications')
            .then(res => res.json())
            .then(data => {
                const list = document.getElementById('notification-list');
                const dot = document.getElementById('notification-dot');
                list.innerHTML = '';
                if (data.notifications && data.notifications.length > 0) {
                    dot.classList.remove('hidden');
                    data.notifications.forEach(n => {
                        const item = document.createElement('div');
                        item.className = "bg-green-50 px-3 py-2 rounded text-sm text-gray-700 border border-green-200";
                        item.textContent = n.message;
                        list.appendChild(item);
                    });
                } else {
                    dot.classList.add('hidden');
                    list.innerHTML = '<p class="text-gray-500 text-sm">No notifications.</p>';
                }
            });
    }
    function showNotificationMessage(message) {
    const list = document.getElementById('notification-list');
    const notification = document.createElement('div');
    notification.className = "bg-green-50 text-green-700 p-3 rounded-lg shadow-sm border border-green-200 text-sm";
    notification.innerHTML = `<span>${message}</span>`;
    list.prepend(notification);
}
function pollPaymentStatus(requestId) {
    let attempts = 0;
    const maxAttempts = 10; // check for 30s

    const interval = setInterval(() => {
        attempts++;
        fetch(`/api/payment/status/${requestId}`)
            .then(res => res.json())
            .then(data => {
                if (data.paid) {
                    clearInterval(interval);
                    showNotificationMessage("✅ Payment received successfully!");
                    renderOverview(); // Refresh dashboard
                }
            });

        if (attempts >= maxAttempts) {
            clearInterval(interval);
        }
    }, 3000);
}
fetchConsumerRequests(false, true); // Don’t show notifications, but update sidebar count


//function to render the overview section
   
    function renderOverview() {
        setPage('Overview', '<div>Loading overview...</div>');
        Promise.all([
            fetchConsumerRequests(true),
            fetchRewards(),
            fetch('/api/profile', {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Accept': 'application/json'
                }
            }).then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
        ]).then(([requests, rewards, user]) => {
            const pending = requests.filter(r => r.status === 'pending').length;
            const completed = requests.filter(r => r.status === 'completed').length;
            const total = requests.length;
            const rewardPoints = rewards.length ? rewards[0].points : 0;
            let html = `
                <div class="space-y-6">
                    <div class="text-2xl font-bold text-gray-800">Welcome back, ${user.name} 👋!</div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="p-4 bg-white rounded shadow border text-center">
                            <div class="text-blue-500 text-lg">${total}</div>
                            <div class="text-gray-500 text-sm">Total Requests</div>
                        </div>
                        <div class="p-4 bg-white rounded shadow border text-center">
                            <div class="text-yellow-500 text-lg">${pending}</div>
                            <div class="text-gray-500 text-sm">Pending Requests</div>
                        </div>
                        <div class="p-4 bg-white rounded shadow border text-center">
                            <div class="text-green-500 text-lg">${rewardPoints}</div>
                            <div class="text-gray-500 text-sm">Reward Points</div>
                        </div>
                    </div>
                    <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-8">
                        <h3 class="text-lg font-semibold mb-4">My Recent Requests</h3>
                        ${renderRequestTable(requests.slice(0, 5))}
                    </div>
            `;

            const completedRequest = requests.find(r => r.status === 'completed');
            const requestId = completedRequest?.id;
            if (completedRequest) {
                html += `
                    <div class="mt-6 bg-white p-4 rounded shadow border text-center">
                        <p class="text-gray-700 font-semibold mb-2">You have a completed request.</p>
                        <button id="make-payment" class="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition">
                            Proceed to Payment
                        </button>
                    </div>
                `;
            }
            html += '</div>';
            setPage('Overview', html);
            setTimeout(() => {
                const btn = document.getElementById("make-payment");
                if (btn) {
                    btn.addEventListener('click', () => {
                        renderPaymentOptions(requestId);//paases requestId here
                        // TODO: redirect to actual payment logic or page
                    });
                }
            }, 100);
        }).catch(err => {
            console.error('Error loading overview:', err);
            setPage('Overview', '<div class="text-red-500 text-center mt-6">Failed to load overview data.</div>');
        });
    }
    function renderPaymentOptions(requestId) {
    const html = `
        <div class="max-w-xl mx-auto mt-10 bg-white rounded-xl shadow-lg border border-gray-200 p-8 space-y-6">
            <h2 class="text-2xl font-bold text-center text-gray-800">Select Payment Method</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-1 gap-6">
                <div class="flex flex-col items-center justify-center p-6 bg-green-50 border border-green-200 rounded-xl transition">
                    <i data-lucide="smartphone" class="w-8 h-8 text-green-600 mb-3"></i>
                    <input 
                        type="tel" 
                        id="mpesa-phone" 
                        placeholder="Enter M-Pesa Number (2547XXXXXXX)" 
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 mb-3"
                    />
                    <button id="mpesa-button" class="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700 transition">
                        Pay with M-Pesa
                    </button>
                </div>

                <button id="airtime-button" class="flex flex-col items-center justify-center p-6 bg-yellow-50 border border-yellow-200 rounded-xl hover:bg-yellow-100 transition">
                    <i data-lucide="phone-call" class="w-8 h-8 text-yellow-600 mb-2"></i>
                    <span class="text-yellow-800 font-semibold">Airtel Money</span>
                </button>

                <button id="card-button" class="flex flex-col items-center justify-center p-6 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition">
                    <i data-lucide="credit-card" class="w-8 h-8 text-blue-600 mb-2"></i>
                    <span class="text-blue-800 font-semibold">Cash</span>
                </button>
            </div>

            <div class="text-center pt-4">
                <button id="back-button" class="text-sm text-gray-500 hover:underline">&larr; Back to Overview</button>
            </div>
        </div>
    `;

    setPage("Payment", html);
    lucide.createIcons();

    // Handle M-Pesa click
  document.getElementById("mpesa-button").addEventListener("click", () => {
    const phone = document.getElementById("mpesa-phone").value.trim();

    // Accepts numbers starting with 07, 01, or already normalized 2547/2541
    const valid = phone.match(/^((07\d{8})|(01\d{8})|(2547\d{8})|(2541\d{8}))$/);
    if (!valid) {
        alert("Please enter a valid Kenyan Safaricom number (e.g., 0712345678 or 0112345678)");
        return;
    }

    fetch("/api/payment/initiate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify({ method: "mpesa", phone, amount: 1, request_id: requestId })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message || "M-Pesa STK push initiated.");
        pollPaymentStatus(requestId);
    })
    .catch(err => {
        console.error(err);
        alert("Failed to send STK push. Try again later.");
    });
});


    document.getElementById("airtime-button").addEventListener("click", () => {
        alert("Airtime selected. Coming soon...");
    });

    document.getElementById("card-button").addEventListener("click", () => {
        alert("Proceed to Pay Cash, Usitoe coins!!");
    });

    document.getElementById("back-button").addEventListener("click", () => {
        renderOverview();
    });
}



// Helper to render the requests table 
function renderRequestTable(requests) {
    if (!requests.length) {
        return `<div class="text-gray-500 text-center">No requests yet.</div>`;
    }

    return `
        <table class="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left font-semibold text-gray-700 uppercase text-xs" data-translate-key="ewaste_type">${translations[currentLang].ewaste_type}</th>
                    <th class="px-6 py-3 text-left font-semibold text-gray-700 uppercase text-xs" data-translate-key="quantity">${translations[currentLang].quantity}</th>
                    <th class="px-6 py-3 text-left font-semibold text-gray-700 uppercase text-xs" data-translate-key="pickup_location">${translations[currentLang].pickup_location}</th>
                    <th class="px-6 py-3 text-left font-semibold text-gray-700 uppercase text-xs" data-translate-key="status">${translations[currentLang].status}</th>
                    <th class="px-6 py-3 text-left font-semibold text-gray-700 uppercase text-xs">Date</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
                ${requests.map(r => `
                    <tr>
                        <td class="px-6 py-3 whitespace-nowrap">${r.type}</td>
                        <td class="px-6 py-3 whitespace-nowrap">${r.quantity}</td>
                        <td class="px-6 py-3 whitespace-nowrap">${r.location}</td>
                        <td class="px-6 py-3 whitespace-nowrap">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(r.status)}">${r.status}</span>
                        </td>
                        <td class="px-6 py-3 whitespace-nowrap text-gray-400 text-xs">${new Date(r.created_at).toLocaleString()}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function getStatusClass(status) {
    switch (status) {
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'accepted': return 'bg-blue-100 text-blue-800';
        case 'completed': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}




//function to render the consumeser's requests
function renderMyRequests() {
    fetchConsumerRequests().then(requests => {
        const html = `
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left font-semibold text-gray-700 uppercase tracking-wide text-xs">${translations[currentLang].ewaste_type}</th>
                            <th class="px-6 py-3 text-left font-semibold text-gray-700 uppercase tracking-wide text-xs">${translations[currentLang].quantity}</th>
                            <th class="px-6 py-3 text-left font-semibold text-gray-700 uppercase tracking-wide text-xs">${translations[currentLang].pickup_location}</th>
                            <th class="px-6 py-3 text-left font-semibold text-gray-700 uppercase tracking-wide text-xs">${translations[currentLang].status}</th>
                            <th class="px-6 py-3 text-left font-semibold text-gray-700 uppercase tracking-wide text-xs">${translations[currentLang].date}</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        ${
                            requests.length
                                ? requests.map(r => `
                                    <tr>
                                        <td class="px-6 py-3 whitespace-nowrap">${r.type}</td>
                                        <td class="px-6 py-3 whitespace-nowrap">${r.quantity}</td>
                                        <td class="px-6 py-3 whitespace-nowrap">${r.location}</td>
                                        <td class="px-6 py-3 whitespace-nowrap">
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(r.status)}">${r.status}</span>
                                        </td>
                                        <td class="px-6 py-3 whitespace-nowrap text-gray-400 text-xs">${new Date(r.created_at).toLocaleString()}</td>
                                    </tr>
                                `).join('')
                                : `<tr><td colspan="5" class="px-6 py-4 text-center text-gray-500">No requests found.</td></tr>`
                        }
                    </tbody>
                </table>
            </div>
        `;

        mainContent.innerHTML = html;
        lucide.createIcons();
    });
}

//function to render the form for submitting e-waste requests
    function renderSubmitRequestForm() {
    mainContent.innerHTML = `
        <div class="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-8 space-y-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">Submit E-Waste Request</h2>

            <form id="request-form" class="space-y-6">
                <div>
                    <label for="type" class="block text-sm font-medium text-gray-700">Type of E-Waste</label>
                    <input type="text" id="type" name="type" required 
                        class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500" 
                        placeholder="e.g., Laptops, Phones">
                </div>

                <div>
                    <label for="quantity" class="block text-sm font-medium text-gray-700">Quantity</label>
                    <input type="number" id="quantity" name="quantity" required 
                        class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500" 
                        placeholder="e.g., 5">
                </div>

              <div>
                  <label for="pickup_location" class="block text-sm font-medium text-gray-700">Pickup Location</label>
                  <input type="text" id="pickup_location" name="location"
                     class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
                      placeholder="Search or click on map below to set location" required>
                     <div id="map" class="mt-4 h-64 rounded-lg border border-gray-300"></div>
                </div>


                <div>
                    <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                    <textarea id="description" name="description" rows="4" 
                        class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500" 
                        placeholder="Brief description of items (optional)"></textarea>
                </div>

                <div id="request-message" class="text-sm hidden"></div>

                <div>
                    <button type="submit" class="w-full bg-green-500 text-white py-3 rounded-lg font-semibold shadow hover:bg-green-600 transition">
                        Submit Request
                    </button>
                </div>
            </form>
        </div>
    `;
    // Wait for DOM to load
setTimeout(() => {
    const map = L.map('map').setView([-1.286389, 36.817223], 12); // Default to Nairobi

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Marker to show selected location
    let marker = L.marker(map.getCenter(), { draggable: true }).addTo(map);

    // Reverse geocoding on map click
    async function updateLocation(latlng) {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`);
        const data = await res.json();
        document.getElementById('pickup_location').value = data.display_name || `${latlng.lat}, ${latlng.lng}`;
    }

    // Click on map to select location
    map.on('click', function (e) {
        marker.setLatLng(e.latlng);
        updateLocation(e.latlng);
    });

    // Drag marker to update address
    marker.on('dragend', function (e) {
        updateLocation(marker.getLatLng());
    });

    // Add search control
    const search = new window.GeoSearch.GeoSearchControl({
        provider: new window.GeoSearch.OpenStreetMapProvider(),
        style: 'bar',
        showMarker: false,
        autoClose: true,
        retainZoomLevel: false,
        animateZoom: true
    });
    map.addControl(search);

    // When a location is selected via search
    map.on('geosearch/showlocation', function (result) {
           const latlng = L.latLng(result.location.y, result.location.x);
    marker.setLatLng(latlng);
    updateLocation(latlng);
    });

}, 100); // Delay to ensure map div is rendered


    document.getElementById('request-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const message = document.getElementById('request-message');
    message.classList.add('hidden');
    message.textContent = '';

 fetch(`/api/requests`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    },
    body: JSON.stringify({
        type: document.getElementById('type').value,
        quantity: document.getElementById('quantity').value,
        location: document.getElementById('pickup_location').value,
        description: document.getElementById('description').value,
    }),
    credentials: 'same-origin'  // <-- VERY IMPORTANT: this sends cookies/session
})

    .then(async res => {
        if (!res.ok) {
            const text = await res.text(); // Try get the raw response
            console.error('Error response:', text);
            throw new Error('Failed to submit request. Make sure you are logged in.');
        }
        return res.json();
    })
    .then(data => {
        message.classList.remove('hidden');
        message.classList.add('text-green-600');
        message.textContent = data.message;
        document.getElementById('request-form').reset();
    })
    .catch(err => {
        message.classList.remove('hidden');
        message.classList.add('text-red-500');
        message.textContent = err.message;
    });
});

    }

//function to render the rewards page
//i stopped hereeeeeeeeeeeeeeeee
//rewards page
function renderRewards() {
    fetchRewards().then(rewards => {
        const points = rewards.length ? rewards[0].points : 0;
        const amountKES = points * 50;

        mainContent.innerHTML = `
            <div class="text-center max-w-md mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <i data-lucide="award" class="w-16 h-16 text-yellow-400 mx-auto"></i>
                <h2 class="text-2xl font-bold text-gray-800">My Rewards</h2>
                <p class="text-gray-600">You have <span class="font-semibold text-green-600">${points}</span> Etaka points.</p>
                <p class="text-lg font-medium text-gray-800">Equivalent to <span class="text-green-600 font-bold">KES ${amountKES}</span></p>
                
                <button id="redeem-button" class="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition">Redeem Rewards</button>
            </div>
        `;

        lucide.createIcons();

        // Redeem button click handler (placeholder logic for now)
        document.getElementById("redeem-button").addEventListener("click", () => {
    fetch("/api/rewards/redeem", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
            "Accept": "application/json"
        },
        body: JSON.stringify({})
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
    })
    .catch(err => console.error(err));
});




    });
}



//function to render the profile settings page
    function renderProfile() {
    fetch('/api/profile')
        .then(res => res.json())
        .then(user => {
            mainContent.innerHTML = `
               <div class="max-w-2xl mx-auto bg-white rounded-2xl shadow-md border border-gray-200 p-8 space-y-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">Profile Settings</h2>
            <form id="profile-form" class="space-y-6">
                <div>
                    <label for="profile-name" class="block text-sm font-medium text-gray-700">Full Name</label>
                    <input type="text" id="profile-name" name="name" value="${user.name}" 
                        class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500" required>
                </div>

                <div>
                    <label for="profile-email" class="block text-sm font-medium text-gray-700">Email Address</label>
                    <input type="email" id="profile-email" name="email" value="${user.email}" 
                        class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500" required>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label for="profile-password" class="block text-sm font-medium text-gray-700">New Password</label>
                        <input type="password" id="profile-password" name="password" 
                            class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500" placeholder="Leave blank to keep current password">
                    </div>

                    <div>
                        <label for="profile-password-confirm" class="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input type="password" id="profile-password-confirm" name="password_confirmation" 
                            class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500" placeholder="Confirm new password">
                    </div>
                </div>

                <div id="profile-message" class="text-sm hidden"></div>

                <div>
                    <button type="submit" class="w-full bg-green-500 text-white py-3 rounded-lg font-semibold shadow hover:bg-green-600 transition">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
            `;

            const form = document.getElementById('profile-form');
            form.addEventListener('submit', async e => {
                e.preventDefault();
                document.getElementById('profile-message').textContent = '';
                document.getElementById('profile-message').className = 'mt-3 text-center text-sm';

                const name = document.getElementById('profile-name').value.trim();
                const email = document.getElementById('profile-email').value.trim();
                const password = document.getElementById('profile-password').value;
                const password_confirmation = document.getElementById('profile-password-confirmation').value;

                // for my Client-side Validation //
                if (!name || !email) {
                    showProfileMessage('Name and email are required.', 'text-red-500');
                    return;
                }
                if (password && password !== password_confirmation) {
                    showProfileMessage('Passwords do not match.', 'text-red-500');
                    return;
                }

                try {
                    const response = await fetch('/api/profile', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                        },
                        body: JSON.stringify({ name, email, password, password_confirmation })
                    });

                    const result = await response.json();

                    if (!response.ok) {
                        let message = '';
                        if (result.errors) {
                            // Laravel validation errors
                            for (const key in result.errors) {
                                message += result.errors[key][0] + ' ';
                            }
                        } else {
                            message = result.message || 'Failed to update profile.';
                        }
                        showProfileMessage(message, 'text-red-500');
                    } else {
                        showProfileMessage(result.message || 'Profile updated!', 'text-green-600');
                        form.reset(); // optional
                    }
                } catch (error) {
                    showProfileMessage('An error occurred while updating.', 'text-red-500');
                }
            });

            function showProfileMessage(message, className) {
                const msgDiv = document.getElementById('profile-message');
                msgDiv.textContent = message;
                msgDiv.classList.add(className);
            }
        })
        .catch(() => {
            mainContent.innerHTML = `<div class="text-red-500 text-center">Failed to load profile data.</div>`;
        });
}
  function handlePayment(method) {
    fetch('/api/payment/initiate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            'Accept': 'application/json'
        },
        body: JSON.stringify({ method })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message || "Payment initiated.");
    })
    .catch(err => {
        console.error(err);
        alert("Payment failed. Please try again.");
    });
}


    document.getElementById('notification-bell')?.addEventListener('click', () => {
        const panel = document.getElementById('notification-panel');
        panel.classList.toggle('hidden');
    });
    document.getElementById('clear-notifications')?.addEventListener('click', () => {
    document.getElementById('notification-list').innerHTML = '';
    document.getElementById('notification-dot')?.classList.add('hidden');
});


    document.getElementById('logout-button')?.addEventListener('click', () => {
        fetch('/logout', { method: 'POST' }).then(() => window.location.href = '/login');
    });

    generateSidebarNav();
    attachNavEvents();
    translatePage(currentLang);
    renderOverview();
});
