<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\EwasteRequestController;
use App\Http\Controllers\RewardController;
use App\Http\Controllers\MpesaController;
use App\Http\Controllers\RecyclerController;

// AUTHENTICATED API ROUTES
Route::middleware('auth')->group(function () {
    // Profile Endpoints
    Route::get('/profile', function (Request $request) {
        return response()->json($request->user());
    });

    Route::put('/profile', function (Request $request) {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:6|confirmed',
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return response()->json(['message' => 'Profile updated successfully']);
    });

    // E-Waste Requests Endpoints
    Route::get('/requests', [EwasteRequestController::class, 'index']);
    Route::post('/requests', [EwasteRequestController::class, 'store']);
});

// Rewards Endpoints
Route::middleware('auth')->get('/rewards', function (Request $request) {
    return response()->json([
        'rewards' => [
            ['user_id' => $request->user()->id, 'points' => 100] // Example or from DB
        ]
    ]);
});
Route::middleware('auth')->post('/rewards/redeem', [RewardController::class, 'redeem']);

// Recycler-specific Endpoints
Route::middleware('auth')->prefix('recycler')->group(function () {
    Route::get('/available-jobs', [RecyclerController::class, 'availableJobs']);
    Route::post('/jobs/{id}/accept', [RecyclerController::class, 'acceptJob']);
    Route::post('/jobs/{id}/in-progress', [RecyclerController::class, 'markInProgress']); // ✔ fixed
    Route::post('/jobs/{id}/complete', [RecyclerController::class, 'markComplete']); // ✔ fixed

    Route::get('/jobs', [RecyclerController::class, 'myJobs']);
    Route::get('/payments', [RecyclerController::class, 'payments']);
});


// Mpesa Endpoints
Route::post('/mpesa/stkpush', [MpesaController::class, 'stkPush']);
Route::post('/mpesa/result', [MpesaController::class, 'handleResult']);
Route::post('/mpesa/timeout', [MpesaController::class, 'handleTimeout']);
