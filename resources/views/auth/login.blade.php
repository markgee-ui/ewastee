<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Login / Register - Etaka</title>
    <link rel="icon" href="{{ asset('fav.png') }}" type="image/png">
    <script src="https://cdn.tailwindcss.com?plugins=typography"></script>
    <link rel="stylesheet" href= "{{ asset('css/style.css') }}">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="bg-gray-50">
    <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-white p-6">
        <a href="/" class="flex items-center space-x-2 mb-8">
            <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <i data-lucide="recycle" class="text-white w-6 h-6"></i>
            </div>
            <span class="text-3xl font-bold text-gray-900">Etaka</span>
        </a>

        <div class="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200/80 p-8">
            <div class="flex border-b border-gray-200">
                <button id="login-tab-button" class="flex-1 py-3 text-center font-semibold text-green-600 border-b-2 border-green-500">Login</button>
                <button id="register-tab-button" class="flex-1 py-3 text-center font-semibold text-gray-500">Register</button>
            </div>

            <div id="auth-forms" class="mt-8">
                <!-- Login Form -->
                <form id="login-form" class="space-y-6">
                    <div>
                        <label for="login-email" class="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email"  name = "email"id="login-email" required class="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500" placeholder="you@example.com">
                    </div>
                    <div>
                        <label for="login-password" class="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" name = "password" id="login-password" required class="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500" placeholder="••••••••">
                    </div>
                    <div id="login-error" class="text-red-500 text-sm hidden"></div>
                    <div>
                        <button type="submit" class="w-full bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-all shadow-sm">
                            Sign In
                        </button>
                    </div>
                </form>

                <!-- Register Form -->
                <form id="register-form" class="space-y-6 hidden">
                    <div>
                        <label for="register-name" class="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" id="register-name" name = "name" required class="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500">
                    </div>
                    <div>
                        <label for="register-email" class="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="register-email" name = "email" required class="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500">
                    </div>
                    <div>
                        <label for="register-password" class="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" id="register-password" name = "password" required class="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500">
                    </div>
                    <div>
                        <label for="register-role" class="block text-sm font-medium text-gray-700">I am a...</label>
                        <select id="register-role" name = "role" required class="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 bg-white">
                            <option value="consumer">Consumer</option>
                            <option value="recycler">Recycler</option>
                        </select>
                    </div>
                    <div id="register-error" class="text-red-500 text-sm hidden"></div>
                     <div id="register-success" class="text-green-600 text-sm hidden">Registration successful! Please login.</div>
                    <div>
                        <button type="submit" class="w-full bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-all shadow-sm">
                            Create Account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <script src="https://unpkg.com/lucide@latest"></script>
    <script>
        lucide.createIcons();
    </script>
    <script type="module" src="js/data_seeder.js"></script>
    
    <script type="module" src="js/auth.js"></script>

</body>
</html>
