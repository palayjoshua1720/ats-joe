<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SampleController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ApplicantController;
use App\Http\Controllers\AuthController;

// Public Routes
Route::get('/version', function () {
    return response()->json([
        'laravel_version' => app()->version(),
        'php_version' => phpversion(),
    ]);
});

// Auth Routes (Token-based login using Sanctum)
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/keycode', [AuthController::class, 'verifyKeycode']);
    Route::get('/applicants', [ApplicantController::class, 'index']);

// Route::post('/auth/logout', [AuthController::class, 'logout']);

// Protected Routes (require token via Authorization: Bearer)
Route::middleware('auth:sanctum')->group(function () {
     Route::post('/auth/logout', [AuthController::class, 'logout']); // moved here
    Route::get('/auth/me', [AuthController::class, 'user']);
    Route::get('/sample', [SampleController::class, 'index']);
    Route::get('/my-profile', [ProfileController::class, 'index']);
});
