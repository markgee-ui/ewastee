<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Password;
use App\Http\Controllers\EwasteRequestController;
use App\Http\Controllers\MpesaController;
use App\Http\Controllers\RewardController;
use App\Http\Controllers\RecyclerController;
use App\Http\Controllers\AdminRequestController;
use App\Http\Controllers\AdminOverviewController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\PaymentController;
use App\Models\EwasteRequest;
use App\Models\Payment;
use App\Http\Controllers\AdminController;
// Public Web Routes
Route::get('/', fn () => view('home'))->name('home');
Route::get('/login', fn () => view('auth.login'))->name('login');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/forgot-password', function () {
    return view('auth.login'); // since forgot form is embedded inside login
})->middleware('guest')->name('password.request');

Route::post('/forgot-password', function (Request $request) {
    $request->validate(['email' => 'required|email']);

    $status = Password::sendResetLink(
        $request->only('email')
    );

    return response()->json(['status' => __($status)], $status === Password::RESET_LINK_SENT ? 200 : 422);
})->middleware('guest')->name('password.email');

Route::get('/reset-password/{token}', function ($token, Illuminate\Http\Request $request) {
    $email = $request->query('email');
    return redirect("/login?reset=true&token=$token&email=$email");
})->middleware('guest')->name('password.reset');


Route::post('/reset-password', function (Illuminate\Http\Request $request) {
    $request->validate([
        'token' => 'required',
        'email' => 'required|email',
        'password' => 'required|confirmed|min:6',
    ]);

    $status = Password::reset(
        $request->only('email', 'password', 'password_confirmation', 'token'),
        function ($user, $password) {
            $user->forceFill([
                'password' => bcrypt($password)
            ])->save();
        }
    );

    if ($status === Password::PASSWORD_RESET) {
        return response()->json(['message' => __($status)], 200);
    }

    return response()->json([
        'message' => 'Password reset failed.',
        'errors' => ['email' => [__($status)]]
    ], 422);
});


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
    $user = Auth::user();

    return response()->json([
        'rewards' => [
            [
                'user_id' => $user->id,
                'points' => $user->rewards, // actual value from DB
            ]
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
    $user = Auth::user();

    // Get completed jobs for this recycler
    $completedJobs = EwasteRequest::where('recycler_id', $user->id)
        ->where('status', 'completed')
        ->get();

    $requestIds = $completedJobs->pluck('id');

    // Get successful payments related to these jobs
    $payments = Payment::whereIn('request_id', $requestIds)
        ->where('status', 'Completed')
        ->get();

    $totalEarned = $payments->sum('amount');

    // Format job descriptions
    $jobDescriptions = $completedJobs->map(function ($job) {
        return [
            'item_description' => $job->description,
        ];
    });

    return response()->json([
        'total_earned' => $totalEarned,
        'completed_jobs' => $jobDescriptions,
    ]);
});
    });
});

// Mpesa (No auth because these are callbacks)
Route::post('/mpesa/stkpush', [MpesaController::class, 'stkPush']);
Route::post('/mpesa/callback', [PaymentController::class, 'mpesaCallback'])->name('mpesa.callback');

Route::get('/api/payments/{requestId}/status', [PaymentController::class, 'checkPaymentStatus']);


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
Route::get('/admin/payments', [AdminController::class, 'getPayments']);

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

Route::post('/payment/initiate', [PaymentController::class, 'initiate']);
Route::post('/mpesa/callback', [PaymentController::class, 'mpesaCallback']);
Route::get('/api/payment/status/{requestId}', [PaymentController::class, 'checkPaymentStatus']);

Route::get('/csrf-token', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});

//Route::get('/change-admin-password', function () {
    //$user = User::where('email', 'admin@etaka.com')->first();
 //   $user->password = Hash::make('newpassword123');
   // $user->save();
   // return "Password updated!";
//});