<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OverviewController;
use App\Http\Controllers\RestaurantsController;
use App\Http\Controllers\SponsorshipsController;
use App\Http\Controllers\ReviewsController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\SettingsController;

// Login
Route::view('/login', 'auth.login')->name('login');

// Dashboard
Route::middleware(['auth', 'can:access-admin'])
    ->prefix('admin')
    ->group(function () {

        Route::get('/', [OverviewController::class, 'index'])->name('admin');

        Route::get('/restaurants',    [RestaurantsController::class,   'index'])->name('admin.restaurants');
        Route::post('/restaurants',   [RestaurantsController::class,   'store'])->name('admin.restaurants.store');
        Route::put('/restaurants/{restaurant}', [RestaurantsController::class, 'update'])->name('admin.restaurants.update');
        Route::delete('/restaurants/{restaurant}', [RestaurantsController::class, 'destroy'])->name('admin.restaurants.destroy');

        Route::get('/sponsorships',   [SponsorshipsController::class,  'index'])->name('admin.sponsorships');
        Route::post('/sponsorships',  [SponsorshipsController::class,  'store'])->name('admin.sponsorships.store');
        Route::delete('/sponsorships/{sponsorship}', [SponsorshipsController::class, 'destroy'])->name('admin.sponsorships.destroy');

        Route::get('/reviews',        [ReviewsController::class,       'index'])->name('admin.reviews');
        Route::delete('/reviews/{review}', [ReviewsController::class,  'destroy'])->name('admin.reviews.destroy');

        Route::get('/users',          [UsersController::class,         'index'])->name('admin.users');
        Route::post('/users',         [UsersController::class,         'store'])->name('admin.users.store');
        Route::put('/users/{user}',   [UsersController::class,         'update'])->name('admin.users.update');
        Route::delete('/users/{user}', [UsersController::class,         'destroy'])->name('admin.users.destroy');

        Route::get('/settings',       [SettingsController::class,      'index'])->name('admin.settings');
        
        
    });

Route::get('/docs', function() {
            return view('docs');
        })->name('docs');

Route::get('/', fn() => redirect('/login'));


Auth::routes();


Route::get('/dashboard', [App\Http\Controllers\HomeController::class, 'index'])->name('dashboard');
