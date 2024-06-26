<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PlayerController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    //    session()->now('success', 'LIVV Stack App Is Running!');
    return Inertia::render('Home');
})->name('home');

Route::get('/verify-email/{token}', [AuthController::class, 'verifyEmail'])
    ->name('auth.verify-email');

Route::get('/reset-password/{token}', [AuthController::class, 'resetPassword'])
    ->name('auth.reset-password');
Route::post('/reset-password', [AuthController::class, 'updatePassword'])
    ->name('auth.update-password');

Route::get('/logout', [AuthController::class, 'logout'])
    ->name('auth.logout');

Route::group(['middleware' => 'guest'], function () {
    Route::inertia('/register', 'Auth/Register')
        ->name('auth.register.home');
    Route::post('/register', [AuthController::class, 'register'])
        ->name('auth.register');
    Route::post('/login', [AuthController::class, 'login'])
        ->name('auth.login');
    Route::post('/forgot-password', [AuthController::class, 'sendResetPasswordEmail'])
        ->name('auth.forgot-password');
});

Route::get('/players', [PlayerController::class, 'index'])
    ->name('player.index');

Route::get('/player/template', [PlayerController::class, 'template'])
    ->name('player.template');

Route::group(['middleware' => 'auth'], function () {

    Route::post('/player', [PlayerController::class, 'store'])
        ->name('player.store');
    Route::put('/player/{player}', [PlayerController::class, 'update'])
        ->name('player.update');

});
