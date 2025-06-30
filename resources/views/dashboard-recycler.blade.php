<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recycler Dashboard - Etaka</title>
    <link rel="icon" href="{{ secure_asset('fav.png') }}" type="image/png">
    <script src="https://cdn.tailwindcss.com?plugins=typography"></script>
    <link rel="stylesheet" href="{{ secure_asset('css/style.css') }}">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="bg-gray-100/50">
    <div id="app" class="flex h-screen bg-gray-100 font-sans">
        <!-- Sidebar -->
        <aside id="sidebar" class="w-64 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col transition-all duration-300 -translate-x-full md:translate-x-0">
            <div class="h-16 flex items-center px-6 border-b border-gray-200">
                <a href="/recycler" class="flex items-center space-x-2">
                    <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <i data-lucide="recycle" class="text-white w-5 h-5"></i>
                    </div>
                    <span class="text-xl font-bold text-gray-900">Etaka</span>
                </a>
            </div>
            <nav id="sidebar-nav" class="flex-1 px-4 py-4 space-y-2"></nav>
            <div class="px-6 py-4 border-t border-gray-200">
                <button id="logout-button" class="w-full flex items-center space-x-2 text-gray-600 hover:bg-red-50 hover:text-red-600 p-2 rounded-lg transition-colors">
                    <i data-lucide="log-out" class="w-5 h-5"></i>
                    <span class="font-medium">Logout</span>
                </button>
            </div>
        </aside>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col overflow-hidden">
            <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
                <div class="flex items-center space-x-4">
                    <button id="menu-toggle" class="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100">
                        <i data-lucide="menu" class="w-6 h-6"></i>
                    </button>
                    <h1 id="page-title" class="text-xl font-semibold text-gray-800">Dashboard</h1>
                </div>
                <div class="flex items-center space-x-4">
                    <button id="lang-toggle" class="font-semibold text-sm text-gray-600 hover:text-green-600 p-2 rounded-md hover:bg-gray-100">EN / SW</button>
                  <div id="notification-bell" class="relative cursor-pointer">
                        <i data-lucide="bell" class="text-gray-600"></i>
                        <span id="notification-dot" class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white hidden"></span>
                    </div>
                                        <div class="flex items-center space-x-3">
                        <div id="user-avatar" class="w-9 h-9 rounded-full bg-green-200 text-green-700 font-bold flex items-center justify-center text-sm"></div>
                        <div>
                            <p id="user-name" class="font-semibold text-sm text-gray-800"></p>
                            <p id="user-role" class="text-xs text-gray-500 capitalize">Recycler</p>
                        </div>
                    </div>
                </div>
            </header>

            <main id="main-content" class="flex-1 overflow-x-hidden overflow-y-auto p-6"></main>
        </div>
    </div>

    <div id="notification-panel" class="fixed top-16 right-6 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4 hidden z-50">
        <div class="flex justify-between items-center mb-2">
            <h3 class="font-semibold text-gray-800">Notifications</h3>
            <button id="clear-notifications" class="text-sm text-green-600 hover:underline">Mark all as read</button>
        </div>
        <div id="notification-list" class="max-h-80 overflow-y-auto space-y-2"></div>
    </div>
                        <div class="flex items-center space-x-3">
                        <div id="user-avatar" class="w-9 h-9 rounded-full bg-green-200 text-green-700 font-bold flex items-center justify-center text-sm"></div>
                        <div>
                            <p id="user-name" class="font-semibold text-sm text-gray-800"></p>
                            <p id="user-role" class="text-xs text-gray-500 capitalize">Recycler</p>
                        </div>
                    </div>
    <script src="https://unpkg.com/lucide@latest"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script type="module" src="https://esm.run/framer-motion"></script>

    <script type="module" src="{{ secure_asset('js/translation.js') }}"></script>
    <script type="module" src="{{ secure_asset('js/recycler-dashboard.js') }}"></script>
</body>
</html>
