<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EwasteRequestController;
use App\Http\Controllers\MpesaController;
use App\Http\Controllers\RewardController;
use App\Http\Controllers\RecyclerController;
use App\Http\Controllers\AdminRequestController;
use App\Http\Controllers\AdminOverviewController;
use App\Http\Controllers\ChatbotController;

// Public Web Routes
Route::get('/', fn () => view('home'))->name('home');
Route::get('/login', fn () => view('auth.login'))->name('login');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Authenticated Web Routes
Route::middleware('auth')->group(function () {

    // Logout
    Route::post('/logout', function () {
        Auth::logout();
        return redirect('/login');
    })->name('logout');

    // Dashboards based on roles
    Route::get('/dashboard', fn () => view('dashboard'))->name('dashboard');
    Route::get('/dashboard/consumer', fn () => view('dashboard-consumer'));
    Route::get('/dashboard/recycler', fn () => view('dashboard-recycler'));

    // Profile Routes (API)
    Route::get('/api/profile', fn (Request $request) => $request->user());
    Route::put('/api/profile', function (Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $request->user()->id,
            'password' => 'nullable|min:6|confirmed',
        ]);

        $user = $request->user();
        $user->name = $validated['name'];
        $user->email = $validated['email'];

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return response()->json(['message' => 'Profile updated successfully']);
    });

    // E-Waste Requests
    Route::get('/api/requests', [EwasteRequestController::class, 'index']);
    Route::post('/api/requests', [EwasteRequestController::class, 'store']);

    // Rewards
    Route::get('/api/rewards', function (Request $request) {
        return response()->json([
            'rewards' => [
                ['user_id' => $request->user()->id, 'points' => 100] // Replace with real data
            ]
        ]);
    });
    Route::post('/api/rewards/redeem', [RewardController::class, 'redeem']);

    // Recycler Endpoints
    Route::prefix('/api/recycler')->group(function () {
        Route::get('/available-jobs', [RecyclerController::class, 'availableJobs']);
        Route::get('/jobs', [RecyclerController::class, 'myJobs']);
        Route::post('/jobs/{id}/accept', [RecyclerController::class, 'acceptJob']);
        Route::post('/jobs/{id}/complete', [RecyclerController::class, 'markComplete']);
        Route::post('/jobs/{id}/in-progress', [RecyclerController::class, 'markInProgress']);
        Route::get('/payments', function (Request $request) {
            return response()->json([
                'total_earned' => 2750, // Example data
                'completed_jobs' => [
                    ['item_description' => 'Laptop Battery'],
                    ['item_description' => 'Old Mobile Phone'],
                ]
            ]);
        });
    });
});

// Mpesa (No auth because these are callbacks)
Route::post('/mpesa/stkpush', [MpesaController::class, 'stkPush']);



// for debugging purposes, you can add a route to check session and CSRF token
Route::get('/debug-session', function(Request $request) {
    return response()->json([
        'session_id' => session()->getId(),
        'csrf_token' => csrf_token(),
        'session_data' => session()->all(),
        'has_csrf' => session()->has('_token'),
    ]);
});


//admin
Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/dashboard/admin', fn () => view('dashboard-admin'))->name('admin.dashboard');
});

Route::get('/api/admin/users', function () {
    return \App\Models\User::select('id', 'name', 'email', 'role', 'created_at')->get();
});

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/api/users', fn () => \App\Models\User::all());
    Route::put('/api/users/{id}', function (Request $request, $id) {
        $user = \App\Models\User::findOrFail($id);
        $user->update($request->only('name', 'email', 'role'));
        return response()->json(['message' => 'User updated successfully']);
    });
    Route::delete('/api/users/{id}', function ($id) {
        \App\Models\User::findOrFail($id)->delete();
        return response()->json(['message' => 'User deleted successfully']);
    });
});

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/api/admin/requests', [AdminRequestController::class, 'index']);
    Route::delete('/api/admin/requests/{id}', [AdminRequestController::class, 'destroy']);
});
Route::delete('/admin/requests/{id}', [AdminRequestController::class, 'deleteRequest']);
Route::middleware(['auth', 'admin'])->group(function () {
    Route::post('/api/admin/change-password', [AdminRequestController::class, 'changePassword']);
});

Route::middleware(['auth', 'admin'])->get('/api/admin/overview', [AdminOverviewController::class, 'overview']);
//Route::post('/chatbot/message', [ChatbotController::class, 'chat']);
Route::post('/chatbot/message', [ChatbotController::class, 'handle']);

