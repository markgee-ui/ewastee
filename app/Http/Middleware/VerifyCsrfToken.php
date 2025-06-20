<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * Indicates whether the XSRF-TOKEN cookie should be set on the response.
     */
    protected $addHttpCookie = true;

    /**
     * The URIs that should be excluded from CSRF verification.
     */
   protected $except = [
    '/api/*',      // All API routes excluded
    '/login',      // AJAX login POST
    '/register',   // ✅ Add this line to fix your registration 419s
    '/logout',     // Optional if using AJAX for logout
    '/mpesa/*',    // Mpesa callbacks
];


}
