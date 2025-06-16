<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EwasteRequestController;
use App\Http\Controllers\NotificationController;


Route::get('/', function () {
    return view('home');
});

Route::get('/login', function () {
    return view('auth.login');
})->name('login');

//Route::get('/', function () {
 ///   return view('dashboard');
//});

//Route::get('/dashboard', function () {
   // return view('dashboard');
//})->middleware(['auth'])->name('dashboard');
Route::get('/dashboard', function () {
    return view('dashboard');
})->name('dashboard');

//controllers
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

//api routes
//Route::middleware('auth')->group(function () {
    //Route::get('/api/requests', [EwasteRequestController::class, 'index']);
    //Route::post('/api/requests', [EwasteRequestController::class, 'store']);

    ///Route::get('/api/notifications', [NotificationController::class, 'index']);
   // Route::post('/api/notifications/mark-read', [NotificationController::class, 'markRead']);
//});

