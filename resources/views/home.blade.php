<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Etaka </title>

    <script src="https://cdn.tailwindcss.com?plugins=typography"></script>
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
    <link rel="icon" href="{{ asset('fav.png') }}" type="image/png">

    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet">
</head>
<body class="bg-gray-50 text-gray-800 font-sans">
    <div id="app-container" class="antialiased">
        <header class="bg-white/80 backdrop-blur-lg fixed top-0 left-0 right-0 z-50 border-b border-gray-200">
            <div class="container mx-auto px-6 py-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                        <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <i data-lucide="recycle" class="text-white w-5 h-5"></i>
                        </div>
                        <span class="text-2xl font-bold text-gray-900">Etaka</span>
                    </div>
                    <nav class="hidden md:flex items-center space-x-8">
                        <a href="#home" class="text-gray-600 hover:text-green-600 transition-colors">Home</a>
                        <a href="#services" class="text-gray-600 hover:text-green-600 transition-colors">Services</a>
                        <a href="#contact" class="text-gray-600 hover:text-green-600 transition-colors">Contact</a>
                    </nav>
                    <div class="flex items-center space-x-4">
                        <a href= "{{ route('login') }}" class="bg-green-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-600 transition-all shadow-sm hover:shadow-md">
                            Login / Register
                        </a>
                        <button id="mobile-menu-button" class="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100">
                            <i data-lucide="menu" class="w-6 h-6"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div id="mobile-menu" class="hidden md:hidden bg-white border-t border-gray-200">
                <a href="#home" class="block px-6 py-3 text-gray-600 hover:bg-gray-50">Home</a>
                <a href="#services" class="block px-6 py-3 text-gray-600 hover:bg-gray-50">Services</a>
                <a href="#contact" class="block px-6 py-3 text-gray-600 hover:bg-gray-50">Contact</a>
            </div>
        </header>

        <main class="pt-20">
            <section id="home" class="relative min-h-[80vh] flex items-center bg-gradient-to-br from-green-50 to-white">
                 <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611270418597-a6c77f72474a?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-5"></div>
                <div class="container mx-auto px-6 text-center z-10">
                    <h1 class="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                        Responsible E-Waste Recycling,<br> Made Simple.
                    </h1>
                    <p class="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10">
                        Join Etaka in building a sustainable future. Easily schedule pickups for your electronic waste and get rewarded for your contribution to a cleaner planet.
                    </p>
                    <a href= "{{ route('login') }}" class="bg-green-500 text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-green-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                        Get Started Now
                    </a>
                </div>
            </section>

            <section id="services" class="py-20 bg-white">
                <div class="container mx-auto px-6">
                    <div class="text-center mb-12">
                        <h2 class="text-3xl md:text-4xl font-bold text-gray-900">Our Services</h2>
                        <p class="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">A seamless process for consumers, recyclers, and our planet.</p>
                    </div>
                    <div class="grid md:grid-cols-3 gap-10 text-center">
                        <div class="p-8 bg-gray-50 rounded-xl border border-gray-200">
                            <div class="flex justify-center mb-4">
                                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                    <i data-lucide="file-pen-line" class="text-green-600 w-8 h-8"></i>
                                </div>
                            </div>
                            <h3 class="text-xl font-bold mb-2">1. Request Pickup</h3>
                            <p class="text-gray-600">Register as a consumer and submit a request detailing your e-waste. It's quick, easy, and free.</p>
                        </div>
                        <div class="p-8 bg-gray-50 rounded-xl border border-gray-200">
                            <div class="flex justify-center mb-4">
                                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                    <i data-lucide="truck" class="text-green-600 w-8 h-8"></i>
                                </div>
                            </div>
                            <h3 class="text-xl font-bold mb-2">2. We Collect</h3>
                            <p class="text-gray-600">Our certified recyclers view and accept your request, scheduling a convenient pickup from your location.</p>
                        </div>
                        <div class="p-8 bg-gray-50 rounded-xl border border-gray-200">
                            <div class="flex justify-center mb-4">
                                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                    <i data-lucide="award" class="text-green-600 w-8 h-8"></i>
                                </div>
                            </div>
                            <h3 class="text-xl font-bold mb-2">3. Get Rewarded</h3>
                            <p class="text-gray-600">Once your e-waste is processed, you earn reward points that can be redeemed for exciting offers.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="contact" class="py-20 bg-gray-50">
                <div class="container mx-auto px-6">
                    <div class="text-center mb-12">
                        <h2 class="text-3xl md:text-4xl font-bold text-gray-900">Get in Touch</h2>
                        <p class="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">Have questions? We're here to help.</p>
                    </div>
                    <div class="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-200">
                        <form class="space-y-6" action="{{ route('contact.store') }}" method="POST">
    @csrf
    <div>
        <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
        <input 
            type="text" 
            id="name" 
            name="name" 
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            required
        >
    </div>

    <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
        <input  type="email"  id="email" name="email" class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
         required
        >
    </div>

    <div>
        <label for="message" class="block text-sm font-medium text-gray-700">Message</label>
        <textarea  id="message"   name="message" rows="4" class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            required
        ></textarea>
    </div>

    <div>
        <button type="submit" class="w-full bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-all shadow-sm">
            Send Message
        </button>
    </div>

    @if(session('success'))
    <div class="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 border border-red-300">
        {{ session('success') }}
    </div>
@endif
</form>

                    </div>
                </div>
            </section>
        </main>

        <footer class="bg-gray-900 text-white">
            <div class="container mx-auto px-6 py-12">
                <div class="grid md:grid-cols-4 gap-8">
                    <div>
                        <h3 class="text-lg font-bold mb-4">Etaka</h3>
                        <p class="text-gray-400">A commitment to a greener planet through responsible e-waste recycling.</p>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul class="space-y-2">
                            <li><a href="#home" class="text-gray-400 hover:text-white">Home</a></li>
                            <li><a href="#services" class="text-gray-400 hover:text-white">Services</a></li>
                            <li><a href="#contact" class="text-gray-400 hover:text-white">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold mb-4">Awareness</h3>
                        <ul class="space-y-2">
                            <li><a href="https://www.nema.go.ke" class="text-gray-400 hover:text-white">E waste Problem</a></li>
                            <li><a href= "{{ asset('docs/Terms of Service.pdf') }}"  class="text-gray-400 hover:text-white">Terms of Service</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold mb-4">Contact Us</h3>
                        <p class="text-gray-400">
    <a href=" https://maps.app.goo.gl/K47PoKzU7JZnk3cn9" target="_blank" class="hover:text-white">
        TUK Kenya, Nairobi, Kenya
    </a>
</p>

                          <p class="text-gray-400">
    <a href="mailto:macgeengugi@gmail.com" class="hover:text-white">
        contact@macgeengugi@gmail.com
    </a>
</p>
                    </div>
                </div>
                <div class="mt-10 pt-8 border-t border-gray-700 text-center text-gray-500">
                    &copy; 2025 Etaka. All Rights Reserved.
                </div>
            </div>
        </footer>
    </div>
    
    <script src="https://unpkg.com/lucide@latest"></script>
    <script>
      lucide.createIcons();
    </script>
    <script type="module"  src="{{ asset('js/main.js') }}"></script>
</body>
</html>
