<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;


// API Routes

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public read-only routes (no auth required to browse)
Route::get('/restaurants', [\App\Http\Controllers\Api\RRestaurantsAPIController::class, 'index']);
Route::get('/restaurants/{restaurant}', [\App\Http\Controllers\Api\RRestaurantsAPIController::class, 'show']);
Route::get('/reviews', [\App\Http\Controllers\Api\ReviewsAPIController::class, 'index']);
Route::get('/sponsorships', [\App\Http\Controllers\Api\SponsorshipsAPIController::class, 'index']);

Route::middleware('jwt')->group(function () {
    Route::get('/user', [AuthController::class, 'getUser']);
    Route::put('/user', [AuthController::class, 'updateUser']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('/user_cuisines', \App\Http\Controllers\Api\UserCuisinesAPIController::class);
    Route::apiResource('/users', \App\Http\Controllers\Api\UsersAPIController::class);
    // Restaurants: authenticated users can create/update/delete
    Route::post('/restaurants', [\App\Http\Controllers\Api\RRestaurantsAPIController::class, 'store']);
    Route::put('/restaurants/{restaurant}', [\App\Http\Controllers\Api\RRestaurantsAPIController::class, 'update']);
    Route::patch('/restaurants/{restaurant}', [\App\Http\Controllers\Api\RRestaurantsAPIController::class, 'update']);
    Route::delete('/restaurants/{restaurant}', [\App\Http\Controllers\Api\RRestaurantsAPIController::class, 'destroy']);
    // Reviews: authenticated users can create/delete
    Route::post('/reviews', [\App\Http\Controllers\Api\ReviewsAPIController::class, 'store']);
    Route::delete('/reviews/{review}', [\App\Http\Controllers\Api\ReviewsAPIController::class, 'destroy']);
    // Sponsorships: only authenticated owners can create
    Route::post('/sponsorships', [\App\Http\Controllers\Api\SponsorshipsAPIController::class, 'store']);
    Route::delete('/sponsorships/{sponsorship}', [\App\Http\Controllers\Api\SponsorshipsAPIController::class, 'destroy']);
});