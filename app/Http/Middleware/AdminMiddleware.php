<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();
        
        // Adjust this logic based on how you determine admin status
        // Option 1: If you have an is_admin field
        // if (!$user->is_admin) {
        //     abort(403, 'Access denied. Admin privileges required.');
        // }

        // Option 2: If you use role field
        if ($user->role !== 'admin') {
            abort(403, 'Access denied. Admin privileges required.');
        }

        // Option 3: If you check by email
        // $adminEmails = ['admin@example.com', 'super@example.com'];
        // if (!in_array($user->email, $adminEmails)) {
        //     abort(403, 'Access denied. Admin privileges required.');
        // }

        return $next($request);
    }
}