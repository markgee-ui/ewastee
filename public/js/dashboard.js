import { translations, currentLang, translatePage } from './translation.js';
import * as framerMotion from 'https://esm.run/framer-motion';

document.addEventListener('DOMContentLoaded', () => {
    const session = JSON.parse(localStorage.getItem('etaka_session'));

    if (!session) {
        window.location.href = "/login";
        return;
    }
    
    const { animate, stagger } = framerMotion;
    const users = JSON.parse(localStorage.getItem('etaka_users'));
    let ewasteRequests = JSON.parse(localStorage.getItem('etaka_ewaste_requests'));
    let notifications = JSON.parse(localStorage.getItem('etaka_notifications'));

    const sidebar = document.getElementById('sidebar');
    const sidebarNav = document.getElementById('sidebar-nav');
    const mainContent = document.getElementById('main-content');
    const pageTitle = document.getElementById('page-title');
    const userName = document.getElementById('user-name');
    const userRole = document.getElementById('user-role');
    const userAvatar = document.getElementById('user-avatar');
    const logoutButton = document.getElementById('logout-button');
    const menuToggle = document.getElementById('menu-toggle');
    const langToggle = document.getElementById('lang-toggle');
    const notificationBell = document.getElementById('notification-bell');
    const notificationPanel = document.getElementById('notification-panel');
    const notificationList = document.getElementById('notification-list');
    const notificationDot = document.getElementById('notification-dot');
    const clearNotificationsBtn = document.getElementById('clear-notifications');

    const state = {
        currentUser: session,
        currentPage: 'overview'
    };

    const navLinks = {
        consumer: [
            { id: 'overview', icon: 'layout-dashboard', label: 'overview' },
            { id: 'my_requests', icon: 'list-checks', label: 'my_requests' },
            { id: 'submit_request', icon: 'plus-square', label: 'submit_request' },
            { id: 'rewards', icon: 'award', label: 'rewards' },
            { id: 'profile', icon: 'user', label: 'profile' },
        ],
        recycler: [
            { id: 'overview', icon: 'layout-dashboard', label: 'overview' },
            { id: 'available_requests', icon: 'search', label: 'available_requests' },
            { id: 'my_jobs', icon: 'truck', label: 'my_jobs' },
            { id: 'payments', icon: 'wallet', label: 'payments' },
            { id: 'profile', icon: 'user', label: 'profile' },
        ],
        admin: [
            { id: 'overview', icon: 'layout-dashboard', label: 'overview' },
            { id: 'manage_requests', icon: 'list-filter', label: 'manage_requests' },
            { id: 'manage_users', icon: 'users', label: 'manage_users' },
            { id: 'analytics', icon: 'bar-chart-2', label: 'analytics' },
        ]
    };

    function setupUI() {
        userName.textContent = state.currentUser.name;
        userRole.textContent = state.currentUser.role;
        userAvatar.textContent = state.currentUser.name.charAt(0).toUpperCase();
        lucide.createIcons();
        
        renderSidebar();
        renderPage(state.currentPage);
        updateNotifications();

        translatePage(currentLang);
    }
    
    function renderSidebar() {
        const userNav = navLinks[state.currentUser.role];
        sidebarNav.innerHTML = userNav.map(link => `
            <a href="#" id="nav-${link.id}" class="sidebar-link flex items-center space-x-3 text-gray-600 p-3 rounded-lg hover:bg-gray-100 transition-colors ${state.currentPage === link.id ? 'active' : ''}">
                <i data-lucide="${link.icon}" class="w-5 h-5"></i>
                <span data-translate-key="${link.label}">${translations[currentLang][link.label]}</span>
            </a>
        `).join('');
        lucide.createIcons();
        addSidebarListeners();
    }
    
    function addSidebarListeners() {
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = link.id.replace('nav-', '');
                state.currentPage = pageId;
                renderPage(pageId);
                document.querySelector('.sidebar-link.active')?.classList.remove('active');
                link.classList.add('active');
                if (window.innerWidth < 768) {
                   sidebar.classList.add('-translate-x-full');
                }
            });
        });
    }

    function renderPage(pageId) {
        pageTitle.dataset.translateKey = pageId;
        pageTitle.textContent = translations[currentLang][pageId] || pageId.charAt(0).toUpperCase() + pageId.slice(1);
        
        mainContent.innerHTML = '';
        switch(state.currentUser.role) {
            case 'consumer':
                renderConsumerPage(pageId);
                break;
            case 'recycler':
                renderRecyclerPage(pageId);
                break;
            case 'admin':
                renderAdminPage(pageId);
                break;
        }
        animate(
            ".fm-item",
            { opacity: 1, y: 0 },
            { duration: 0.5, delay: stagger(0.07) }
        );
    }
    

    function renderConsumerPage(pageId) {
        switch(pageId) {
            case 'overview':
                const consumerRequests = ewasteRequests.filter(r => r.consumer_id === state.currentUser.id);
                const pending = consumerRequests.filter(r => r.status === 'pending').length;
                const completed = consumerRequests.filter(r => r.status === 'completed').length;
                const rewardsData = JSON.parse(localStorage.getItem('etaka_rewards')).find(r => r.user_id === state.currentUser.id) || { points: 0 };
                
                mainContent.innerHTML = `
                    <div class="space-y-6">
                        <div class="fm-item">
                            <h2 class="text-2xl font-bold text-gray-800" data-translate-key="welcome_back">${translations[currentLang].welcome_back}, ${state.currentUser.name}!</h2>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div class="fm-item bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
                               <div class="p-3 rounded-full bg-blue-100"><i data-lucide="list-checks" class="text-blue-600"></i></div>
                               <div>
                                 <p class="text-sm text-gray-500" data-translate-key="total_requests">${translations[currentLang].total_requests}</p>
                                 <p class="text-2xl font-bold text-gray-900">${consumerRequests.length}</p>
                               </div>
                            </div>
                            <div class="fm-item bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
                                <div class="p-3 rounded-full bg-yellow-100"><i data-lucide="loader" class="text-yellow-600"></i></div>
                               <div>
                                 <p class="text-sm text-gray-500" data-translate-key="pending_requests">${translations[currentLang].pending_requests}</p>
                                 <p class="text-2xl font-bold text-gray-900">${pending}</p>
                               </div>
                            </div>
                            <div class="fm-item bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
                               <div class="p-3 rounded-full bg-green-100"><i data-lucide="award" class="text-green-600"></i></div>
                               <div>
                                 <p class="text-sm text-gray-500" data-translate-key="my_reward_points">${translations[currentLang].my_reward_points}</p>
                                 <p class="text-2xl font-bold text-gray-900">${rewardsData.points}</p>
                               </div>
                            </div>
                        </div>
                         <div class="fm-item bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 class="text-lg font-semibold mb-4" data-translate-key="my_requests">${translations[currentLang].my_requests}</h3>
                            ${renderRequestTable(consumerRequests)}
                        </div>
                    </div>
                `;
                break;
            case 'my_requests':
                const myRequests = ewasteRequests.filter(r => r.consumer_id === state.currentUser.id);
                mainContent.innerHTML = `<div class="fm-item bg-white p-6 rounded-xl border border-gray-200 shadow-sm">${renderRequestTable(myRequests)}</div>`;
                break;
            case 'submit_request':
                mainContent.innerHTML = `
                    <div class="fm-item max-w-2xl mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                        <form id="request-form" class="space-y-6">
                            <div>
                                <label for="type" class="block text-sm font-medium text-gray-700" data-translate-key="ewaste_type">${translations[currentLang].ewaste_type}</label>
                                <input type="text" id="type" required class="mt-1 block w-full input-style" placeholder="e.g., Laptops, Phones">
                            </div>
                            <div>
                                <label for="quantity" class="block text-sm font-medium text-gray-700" data-translate-key="quantity">${translations[currentLang].quantity}</label>
                                <input type="number" id="quantity" required class="mt-1 block w-full input-style" placeholder="e.g., 5">
                            </div>
                            <div>
                                <label for="pickup_location" class="block text-sm font-medium text-gray-700" data-translate-key="pickup_location">${translations[currentLang].pickup_location}</label>
                                <input type="text" id="pickup_location" required class="mt-1 block w-full input-style" placeholder="e.g., Westlands, Nairobi">
                            </div>
                            <div>
                                <label for="description" class="block text-sm font-medium text-gray-700" data-translate-key="description">${translations[currentLang].description}</label>
                                <textarea id="description" rows="4" class="mt-1 block w-full input-style" placeholder="Brief description of items"></textarea>
                            </div>
                            <div>
                                <button type="submit" class="w-full btn-primary" data-translate-key="submit">${translations[currentLang].submit}</button>
                            </div>
                        </form>
                    </div>
                `;
                document.getElementById('request-form').addEventListener('submit', handleRequestSubmit);
                break;
            case 'rewards':
                const consumerRewards = JSON.parse(localStorage.getItem('etaka_rewards')).find(r => r.user_id === state.currentUser.id) || { points: 0 };
                 mainContent.innerHTML = `
                    <div class="fm-item text-center max-w-md mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                         <i data-lucide="award" class="w-16 h-16 text-yellow-400 mx-auto mb-4"></i>
                         <p class="text-lg text-gray-600" data-translate-key="my_reward_points">${translations[currentLang].my_reward_points}</p>
                         <p class="text-6xl font-bold text-gray-900 my-2">${consumerRewards.points}</p>
                         <p class="text-gray-500 mb-6" data-translate-key="points">${translations[currentLang].points}</p>
                         <button class="btn-primary w-full" data-translate-key="redeem_rewards">${translations[currentLang].redeem_rewards}</button>
                         <p class="text-xs text-gray-400 mt-4" data-translate-key="feature_coming_soon">${translations[currentLang].feature_coming_soon}</p>
                    </div>`;
                break;
            case 'profile':
                 renderProfilePage();
                 break;
        }
        lucide.createIcons();
    }
    
    function renderRecyclerPage(pageId) {
         switch(pageId) {
            case 'overview':
                const myJobs = ewasteRequests.filter(r => r.recycler_id === state.currentUser.id);
                const acceptedCount = myJobs.filter(r => r.status === 'accepted').length;
                const inProgressCount = myJobs.filter(r => r.status === 'in_progress').length;
                const completedCount = myJobs.filter(r => r.status === 'completed').length;
                const availableJobs = ewasteRequests.filter(r => r.status === 'pending').length;

                mainContent.innerHTML = `
                    <div class="space-y-6">
                        <div class="fm-item">
                            <h2 class="text-2xl font-bold text-gray-800" data-translate-key="welcome_back">${translations[currentLang].welcome_back}, ${state.currentUser.name}!</h2>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div class="fm-item bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
                               <div class="p-3 rounded-full bg-blue-100"><i data-lucide="search" class="text-blue-600"></i></div>
                               <div>
                                 <p class="text-sm text-gray-500" data-translate-key="available_requests">${translations[currentLang].available_requests}</p>
                                 <p class="text-2xl font-bold text-gray-900">${availableJobs}</p>
                               </div>
                            </div>
                            <div class="fm-item bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
                                <div class="p-3 rounded-full bg-indigo-100"><i data-lucide="truck" class="text-indigo-600"></i></div>
                               <div>
                                 <p class="text-sm text-gray-500" data-translate-key="my_jobs">${translations[currentLang].my_jobs}</p>
                                 <p class="text-2xl font-bold text-gray-900">${myJobs.length}</p>
                               </div>
                            </div>
                             <div class="fm-item bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
                                <div class="p-3 rounded-full bg-green-100"><i data-lucide="check-circle" class="text-green-600"></i></div>
                               <div>
                                 <p class="text-sm text-gray-500" data-translate-key="completed_requests">${translations[currentLang].completed_requests}</p>
                                 <p class="text-2xl font-bold text-gray-900">${completedCount}</p>
                               </div>
                            </div>
                        </div>
                        <div class="fm-item bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 class="text-lg font-semibold mb-4" data-translate-key="my_jobs">${translations[currentLang].my_jobs}</h3>
                            ${renderRequestTable(myJobs, true)}
                        </div>
                    </div>
                `;
                break;
            case 'available_requests':
                const available = ewasteRequests.filter(r => r.status === 'pending');
                mainContent.innerHTML = `<div class="fm-item bg-white p-6 rounded-xl border border-gray-200 shadow-sm">${renderRequestTable(available, true)}</div>`;
                break;
            case 'my_jobs':
                const jobs = ewasteRequests.filter(r => r.recycler_id === state.currentUser.id);
                mainContent.innerHTML = `<div class="fm-item bg-white p-6 rounded-xl border border-gray-200 shadow-sm">${renderRequestTable(jobs, true)}</div>`;
                break;
             case 'payments':
                 mainContent.innerHTML = `
                    <div class="fm-item text-center max-w-md mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                         <i data-lucide="wallet" class="w-16 h-16 text-green-500 mx-auto mb-4"></i>
                         <p class="text-lg text-gray-600" data-translate-key="payments">${translations[currentLang].payments}</p>
                         <p class="text-gray-500 my-4" data-translate-key="feature_coming_soon">${translations[currentLang].feature_coming_soon}</p>
                         <p class="text-sm text-gray-400">Integration with M-Pesa is planned for a future update.</p>
                    </div>`;
                 break;
            case 'profile':
                 renderProfilePage();
                 break;
        }
        lucide.createIcons();
    }
    
    function renderAdminPage(pageId) {
        switch(pageId) {
            case 'overview':
                const totalReqs = ewasteRequests.length;
                const totalPending = ewasteRequests.filter(r => r.status === 'pending').length;
                const totalCompleted = ewasteRequests.filter(r => r.status === 'completed').length;
                const totalUsers = users.length;
                mainContent.innerHTML = `
                    <div class="space-y-6">
                        <div class="fm-item"><h2 class="text-2xl font-bold text-gray-800" data-translate-key="welcome_back">${translations[currentLang].welcome_back}, ${state.currentUser.name}!</h2></div>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                             <div class="fm-item bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <p class="text-sm text-gray-500" data-translate-key="total_requests">${translations[currentLang].total_requests}</p>
                                <p class="text-3xl font-bold text-gray-900">${totalReqs}</p>
                            </div>
                            <div class="fm-item bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <p class="text-sm text-gray-500" data-translate-key="pending_requests">${translations[currentLang].pending_requests}</p>
                                <p class="text-3xl font-bold text-gray-900">${totalPending}</p>
                            </div>
                            <div class="fm-item bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <p class="text-sm text-gray-500" data-translate-key="completed_requests">${translations[currentLang].completed_requests}</p>
                                <p class="text-3xl font-bold text-gray-900">${totalCompleted}</p>
                            </div>
                            <div class="fm-item bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <p class="text-sm text-gray-500" data-translate-key="total_users">${translations[currentLang].total_users}</p>
                                <p class="text-3xl font-bold text-gray-900">${totalUsers}</p>
                            </div>
                        </div>
                        <div class="fm-item bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 class="font-semibold mb-4" data-translate-key="ewaste_trends">${translations[currentLang].ewaste_trends}</h3>
                            <canvas id="ewasteChart" class="h-80"></canvas>
                        </div>
                    </div>`;
                renderChart();
                break;
            case 'manage_requests':
                mainContent.innerHTML = `<div class="fm-item bg-white p-6 rounded-xl border border-gray-200 shadow-sm">${renderRequestTable(ewasteRequests, true, true)}</div>`;
                break;
            case 'manage_users':
                mainContent.innerHTML = `<div class="fm-item bg-white p-6 rounded-xl border border-gray-200 shadow-sm">${renderUserTable()}</div>`;
                break;
            case 'analytics':
                 mainContent.innerHTML = `
                    <div class="space-y-6">
                        <div class="fm-item bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                             <h3 class="font-semibold mb-4" data-translate-key="ewaste_trends">${translations[currentLang].ewaste_trends}</h3>
                             <canvas id="ewasteChart" class="h-96"></canvas>
                        </div>
                    </div>`;
                renderChart();
                break;
        }
        lucide.createIcons();
    }


    function getStatusClass(status) {
        const statusMap = {
            pending: 'status-pending',
            accepted: 'status-accepted',
            in_progress: 'status-in_progress',
            completed: 'status-completed',
            cancelled: 'status-cancelled'
        };
        return statusMap[status] || 'bg-gray-100 text-gray-800';
    }

    function renderRequestTable(requests, showActions = false, showAdminActions = false) {
        if (requests.length === 0) {
            return `<p class="text-gray-500 text-center py-8">No requests found.</p>`;
        }
        return `
            <div class="overflow-x-auto">
                <table class="w-full text-sm text-left text-gray-500">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3" data-translate-key="ewaste_type">${translations[currentLang].ewaste_type}</th>
                            <th scope="col" class="px-6 py-3" data-translate-key="quantity">${translations[currentLang].quantity}</th>
                            <th scope="col" class="px-6 py-3" data-translate-key="pickup_location">${translations[currentLang].pickup_location}</th>
                            <th scope="col" class="px-6 py-3" data-translate-key="status">${translations[currentLang].status}</th>
                            ${(showActions || showAdminActions) ? `<th scope="col" class="px-6 py-3" data-translate-key="actions">${translations[currentLang].actions}</th>` : ''}
                        </tr>
                    </thead>
                    <tbody>
                        ${requests.map(req => `
                            <tr class="bg-white border-b hover:bg-gray-50">
                                <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">${req.type}</td>
                                <td class="px-6 py-4">${req.quantity}</td>
                                <td class="px-6 py-4">${req.pickup_location}</td>
                                <td class="px-6 py-4"><span class="status-badge ${getStatusClass(req.status)}">${req.status.replace('_', ' ')}</span></td>
                                ${(showActions || showAdminActions) ? `
                                <td class="px-6 py-4">
                                    <div class="flex space-x-2">
                                        <button class="btn-icon" onclick="showRequestDetails(${req.id})"><i data-lucide="eye" class="w-4 h-4"></i></button>
                                        ${getActionsForRequest(req, showAdminActions)}
                                    </div>
                                </td>` : ''}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
    
    function renderProfilePage() {
        mainContent.innerHTML = `
            <div class="fm-item max-w-2xl mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <form id="profile-form" class="space-y-6">
                    <div>
                        <label for="profile-name" class="block text-sm font-medium text-gray-700" data-translate-key="name">${translations[currentLang].name}</label>
                        <input type="text" id="profile-name" required class="mt-1 block w-full input-style" value="${state.currentUser.name}">
                    </div>
                    <div>
                        <label for="profile-email" class="block text-sm font-medium text-gray-700" data-translate-key="email">${translations[currentLang].email}</label>
                        <input type="email" id="profile-email" required class="mt-1 block w-full input-style" value="${state.currentUser.email}">
                    </div>
                     <div>
                        <label for="profile-password" class="block text-sm font-medium text-gray-700">New Password</label>
                        <input type="password" id="profile-password" class="mt-1 block w-full input-style" placeholder="Leave blank to keep current password">
                    </div>
                    <div>
                        <button type="submit" class="w-full btn-primary" data-translate-key="save_changes">${translations[currentLang].save_changes}</button>
                    </div>
                </form>
            </div>
        `;
        document.getElementById('profile-form').addEventListener('submit', handleProfileUpdate);
    }
    
    function renderUserTable() {
        return `
            <div class="overflow-x-auto">
                <table class="w-full text-sm text-left text-gray-500">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3" data-translate-key="name">${translations[currentLang].name}</th>
                            <th scope="col" class="px-6 py-3" data-translate-key="email">${translations[currentLang].email}</th>
                            <th scope="col" class="px-6 py-3" data-translate-key="role">${translations[currentLang].role}</th>
                            <th scope="col" class="px-6 py-3" data-translate-key="actions">${translations[currentLang].actions}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${users.map(user => user.id !== state.currentUser.id ? `
                            <tr class="bg-white border-b hover:bg-gray-50">
                                <td class="px-6 py-4 font-medium text-gray-900">${user.name}</td>
                                <td class="px-6 py-4">${user.email}</td>
                                <td class="px-6 py-4 capitalize">${user.role}</td>
                                <td class="px-6 py-4">
                                     <button class="btn-icon-danger" onclick="deleteUser(${user.id})"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                                </td>
                            </tr>
                        `: '').join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    function renderChart() {
        const ctx = document.getElementById('ewasteChart');
        if (!ctx) return;
        
        const typeCounts = ewasteRequests.reduce((acc, req) => {
            acc[req.type] = (acc[req.type] || 0) + req.quantity;
            return acc;
        }, {});

        const chartData = {
            labels: Object.keys(typeCounts),
            datasets: [{
                label: 'Quantity of E-Waste by Type',
                data: Object.values(typeCounts),
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(255, 205, 86, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                ],
                borderColor: [
                    'rgb(75, 192, 192)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                ],
                borderWidth: 1
            }]
        };

        new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }


    
    function getActionsForRequest(req, isAdmin) {
        if(isAdmin) {
             return `<button class="btn-icon-danger" onclick="deleteRequest(${req.id})"><i data-lucide="trash-2" class="w-4 h-4"></i></button>`;
        }
        
        if (state.currentUser.role === 'recycler') {
            if (req.status === 'pending') {
                return `<button class="btn-primary-sm" onclick="acceptJob(${req.id})"><i data-lucide="check" class="w-4 h-4"></i><span data-translate-key="accept_job">${translations[currentLang].accept_job}</span></button>`;
            } else if (req.recycler_id === state.currentUser.id && (req.status === 'accepted' || req.status === 'in_progress')) {
                return `<button class="btn-secondary-sm" onclick="updateStatus(${req.id})"><i data-lucide="edit" class="w-4 h-4"></i><span data-translate-key="update_status">${translations[currentLang].update_status}</span></button>`;
            }
        }
        return '';
    }

    function handleRequestSubmit(e) {
        e.preventDefault();
        const newRequest = {
            id: ewasteRequests.length > 0 ? Math.max(...ewasteRequests.map(r => r.id)) + 1 : 1,
            consumer_id: state.currentUser.id,
            recycler_id: null,
            type: document.getElementById('type').value,
            quantity: parseInt(document.getElementById('quantity').value, 10),
            pickup_location: document.getElementById('pickup_location').value,
            description: document.getElementById('description').value,
            status: 'pending'
        };
        ewasteRequests.push(newRequest);
        localStorage.setItem('etaka_ewaste_requests', JSON.stringify(ewasteRequests));
        
        state.currentPage = 'my_requests';
        renderPage(state.currentPage);
        document.querySelector('.sidebar-link.active')?.classList.remove('active');
        document.getElementById('nav-my_requests')?.classList.add('active');
    }
    
     function handleProfileUpdate(e) {
        e.preventDefault();
        const name = document.getElementById('profile-name').value;
        const email = document.getElementById('profile-email').value;
        const password = document.getElementById('profile-password').value;

        const userIndex = users.findIndex(u => u.id === state.currentUser.id);
        if (userIndex > -1) {
            users[userIndex].name = name;
            users[userIndex].email = email;
            if(password) {
                users[userIndex].password = password;
            }
            
            localStorage.setItem('etaka_users', JSON.stringify(users));
            localStorage.setItem('etaka_session', JSON.stringify(users[userIndex]));
            state.currentUser = users[userIndex];
            setupUI(); // Redraw UI with new name etc
            alert('Profile updated successfully!');
        }
    }

    window.acceptJob = (reqId) => {
        const reqIndex = ewasteRequests.findIndex(r => r.id === reqId);
        if(reqIndex > -1) {
            ewasteRequests[reqIndex].recycler_id = state.currentUser.id;
            ewasteRequests[reqIndex].status = 'accepted';
            localStorage.setItem('etaka_ewaste_requests', JSON.stringify(ewasteRequests));
            renderPage(state.currentPage);
        }
    };
    
     window.updateStatus = (reqId) => {
        const req = ewasteRequests.find(r => r.id === reqId);
        if(!req) return;
        
        const nextStatusMap = {
            'accepted': 'in_progress',
            'in_progress': 'completed'
        };
        
        let statuses = ['accepted', 'in_progress', 'completed', 'cancelled'];
        
        const modalHTML = `
            <div id="modal-backdrop" class="fixed inset-0 bg-black/50 z-40"></div>
            <div id="modal" class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg p-6 w-full max-w-sm z-50">
                <h3 class="text-lg font-semibold mb-4" data-translate-key="update_status">${translations[currentLang].update_status} #${req.id}</h3>
                <select id="status-select" class="w-full input-style">
                    ${statuses.map(s => `<option value="${s}" ${s === req.status ? 'selected' : ''}>${s.replace('_',' ')}</option>`).join('')}
                </select>
                <div class="mt-6 flex justify-end space-x-2">
                    <button id="cancel-update" class="btn-secondary">Cancel</button>
                    <button id="save-update" class="btn-primary" data-translate-key="save_changes">${translations[currentLang].save_changes}</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const closeModal = () => {
            document.getElementById('modal-backdrop')?.remove();
            document.getElementById('modal')?.remove();
        }
        
        document.getElementById('cancel-update').addEventListener('click', closeModal);
        document.getElementById('modal-backdrop').addEventListener('click', closeModal);
        document.getElementById('save-update').addEventListener('click', () => {
             const newStatus = document.getElementById('status-select').value;
             const reqIndex = ewasteRequests.findIndex(r => r.id === reqId);
             if(reqIndex > -1) {
                ewasteRequests[reqIndex].status = newStatus;
                localStorage.setItem('etaka_ewaste_requests', JSON.stringify(ewasteRequests));
                 if (newStatus === 'completed') {

                    let rewards = JSON.parse(localStorage.getItem('etaka_rewards')) || [];
                    let userReward = rewards.find(r => r.user_id === req.consumer_id);
                    if(userReward) {
                        userReward.points += 20; // Example points
                    } else {
                        rewards.push({user_id: req.consumer_id, points: 20});
                    }
                    localStorage.setItem('etaka_rewards', JSON.stringify(rewards));
                }
                renderPage(state.currentPage);
                closeModal();
             }
        });
    };
    
    window.deleteUser = (userId) => {
        if(confirm(`Are you sure you want to delete user #${userId}? This cannot be undone.`)) {
             const userIndex = users.findIndex(u => u.id === userId);
             if (userIndex > -1) {
                users.splice(userIndex, 1);
                localStorage.setItem('etaka_users', JSON.stringify(users));
                renderPage(state.currentPage);
             }
        }
    };

    window.deleteRequest = (reqId) => {
         if(confirm(`Are you sure you want to delete request #${reqId}? This cannot be undone.`)) {
             const reqIndex = ewasteRequests.findIndex(r => r.id === reqId);
             if (reqIndex > -1) {
                ewasteRequests.splice(reqIndex, 1);
                localStorage.setItem('etaka_ewaste_requests', JSON.stringify(ewasteRequests));
                renderPage(state.currentPage);
             }
        }
    }
    
    window.showRequestDetails = (reqId) => {
        const req = ewasteRequests.find(r => r.id === reqId);
        const consumer = users.find(u => u.id === req.consumer_id);
        const recycler = req.recycler_id ? users.find(u => u.id === req.recycler_id) : null;
        if(!req) return;

         const modalHTML = `
            <div id="modal-backdrop" class="fixed inset-0 bg-black/50 z-40" onclick="this.parentElement.remove()"></div>
            <div id="modal" class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg p-6 w-full max-w-lg z-50">
                <div class="flex justify-between items-start">
                    <h3 class="text-lg font-semibold mb-4" data-translate-key="request_details">${translations[currentLang].request_details} #${req.id}</h3>
                    <button onclick="document.getElementById('modal-backdrop').parentElement.remove()" class="text-gray-400 hover:text-gray-600">&times;</button>
                </div>
                <div class="space-y-4 text-sm">
                    <p><strong>${translations[currentLang].ewaste_type}:</strong> ${req.type}</p>
                    <p><strong>${translations[currentLang].quantity}:</strong> ${req.quantity}</p>
                    <p><strong>${translations[currentLang].pickup_location}:</strong> ${req.pickup_location}</p>
                    <p><strong>${translations[currentLang].description}:</strong> ${req.description || 'N/A'}</p>
                    <p><strong>${translations[currentLang].status}:</strong> <span class="status-badge ${getStatusClass(req.status)}">${req.status.replace('_',' ')}</span></p>
                    <hr class="my-4">
                    <p class="font-semibold" data-translate-key="consumer_info">${translations[currentLang].consumer_info}</p>
                    <p>${consumer.name} (${consumer.email})</p>
                    <hr class="my-4">
                     <p class="font-semibold" data-translate-key="recycler_info">${translations[currentLang].recycler_info}</p>
                    <p>${recycler ? `${recycler.name} (${recycler.email})` : `<span data-translate-key="unassigned">${translations[currentLang].unassigned}</span>`}</p>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    };
    

    function updateNotifications() {
        const userNotifications = notifications
            .filter(n => n.user_id === state.currentUser.id)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        const unreadCount = userNotifications.filter(n => !n.is_read).length;

        if (unreadCount > 0) {
            notificationDot.classList.remove('hidden');
        } else {
            notificationDot.classList.add('hidden');
        }

        if (userNotifications.length > 0) {
            notificationList.innerHTML = userNotifications.map(n => `
                <div class="p-2 rounded-md ${n.is_read ? 'text-gray-500' : 'bg-green-50 font-medium text-gray-800'}">
                    <p class="text-sm">${n.message}</p>
                    <p class="text-xs text-gray-400 mt-1">${new Date(n.timestamp).toLocaleString()}</p>
                </div>
            `).join('');
        } else {
            notificationList.innerHTML = `<p class="text-sm text-gray-500 text-center py-4" data-translate-key="no_notifications">${translations[currentLang].no_notifications}</p>`;
        }
    }
    

    
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('etaka_session');
        window.location.href = '/';
    });
    
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('-translate-x-full');
    });

    langToggle.addEventListener('click', () => {
        const newLang = currentLang === 'en' ? 'sw' : 'en';
        translatePage(newLang);
        renderSidebar(); // to translate sidebar
        renderPage(state.currentPage); // to translate main content
    });
    
    notificationBell.addEventListener('click', (e) => {
        e.stopPropagation();
        notificationPanel.classList.toggle('hidden');
        if (!notificationPanel.classList.contains('hidden')) {

            notifications.forEach(n => {
                if (n.user_id === state.currentUser.id) n.is_read = true;
            });
            localStorage.setItem('etaka_notifications', JSON.stringify(notifications));
            updateNotifications();
        }
    });
    
    clearNotificationsBtn.addEventListener('click', () => {
        notifications = notifications.filter(n => n.user_id !== state.currentUser.id);
        localStorage.setItem('etaka_notifications', JSON.stringify(notifications));
        updateNotifications();
    });

    document.addEventListener('click', (e) => {
        if (!notificationPanel.contains(e.target) && !notificationBell.contains(e.target)) {
            notificationPanel.classList.add('hidden');
        }
    });


    setupUI();
});
