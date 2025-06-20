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
        fetch(`${apiBase}/overview`)
            .then(res => res.json())
            .then(data => {
                setPage('Overview', `
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div class="p-4 bg-white rounded shadow text-center"><div class="text-lg font-bold">${data.totalUsers}</div><div class="text-gray-500 text-xs">Users</div></div>
                        <div class="p-4 bg-white rounded shadow text-center"><div class="text-lg font-bold">${data.totalRequests}</div><div class="text-gray-500 text-xs">Requests</div></div>
                        <div class="p-4 bg-white rounded shadow text-center"><div class="text-lg font-bold">KES ${data.totalRewardsPaid}</div><div class="text-gray-500 text-xs">Rewards Paid</div></div>
                        <div class="p-4 bg-white rounded shadow text-center"><div class="text-lg font-bold">${data.totalRecyclers}</div><div class="text-gray-500 text-xs">Recyclers</div></div>
                    </div>

                    <canvas id="requestsChart" class="mt-8"></canvas>
                `);

                renderChart(data.monthlyRequests);
            });
    }

    function renderChart(chartData) {
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
                    fill: true
                }]
            }
        });
    }

    // Example placeholder functions:
    function renderUsers() { setPage('Users', '<div>Users Table Here</div>'); }
    function renderRequests() { setPage('Requests', '<div>Requests Management Here</div>'); }
    function renderPayments() { setPage('Payments', '<div>Payments & Rewards Here</div>'); }
    function renderNotifications() { setPage('Notifications', '<div>Send Notifications</div>'); }
    function renderSettings() { setPage('Settings', '<div>Settings Page</div>'); }

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
