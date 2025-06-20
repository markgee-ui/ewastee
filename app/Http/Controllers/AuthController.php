<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'role' => 'required|in:consumer,recycler',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['rewards'] = 0;
        User::create($validated);
    
        return response()->json(['message' => 'Registration successful'], 201);
    }

    public function login(Request $request)
    {
          \Log::info('Login attempt details:', [
        'email' => $request->input('email'),
        'has_password' => !empty($request->input('password')),
        'csrf_token_sent' => $request->input('_token') ?? $request->header('X-CSRF-TOKEN'),
        'session_token' => session()->token(),
        'tokens_match' => ($request->input('_token') ?? $request->header('X-CSRF-TOKEN')) === session()->token(),
        'request_headers' => $request->headers->all(),
        'content_type' => $request->header('Content-Type'),
        'all_input' => $request->all()
    ]);

        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }
         // Regenerate session for security
        $request->session()->regenerate();
        $user = Auth::user();

        $redirect = match ($user->role) {
            'consumer' => '/dashboard/consumer',
            'recycler' => '/dashboard/recycler',
            'admin'    => '/dashboard/admin',
            default    => '/dashboard',
        };

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'redirect' => $redirect,
            'sidebar' => $this->getSidebarLinks($user->role)
        ]);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out successfully']);
    }

    private function getSidebarLinks($role)
    {
        $links = [
            [
                'href' => '/dashboard',
                'label' => 'Dashboard',
                'icon' => 'layout-dashboard'
            ]
        ];

        if ($role === 'consumer') {
            $links[] = [
                'href' => '/dashboard/requests',
                'label' => 'My Requests',
                'icon' => 'list-checks'
            ];
            $links[] = [
                'href' => '/dashboard/submit-request',
                'label' => 'Submit Request',
                'icon' => 'plus-circle'
            ];
        } elseif ($role === 'recycler') {
            $links[] = [
                'href' => '/dashboard/nearby-requests',
                'label' => 'Nearby Requests',
                'icon' => 'map-pin'
            ];
            $links[] = [
                'href' => '/dashboard/my-pickups',
                'label' => 'My Pickups',
                'icon' => 'package-check'
            ];
        }

        return $links;
    }
}
