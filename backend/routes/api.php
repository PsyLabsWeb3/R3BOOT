<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/get-auth-user', [AuthController::class, 'getAuthUser'])
    ->middleware('auth:sanctum');
Route::post('/receive-message', [AuthController::class, 'receiveMessage'])
    ->middleware('auth:sanctum');
Route::post('/edit-wallet', [AuthController::class, 'editWallet'])
    ->middleware('auth:sanctum');
Route::get('/get-balance', [AuthController::class, 'getWalletBalance'])
    ->middleware('auth:sanctum');
Route::get('get-movements', [AuthController::class, 'getWalletMovements'])
    ->middleware('auth:sanctum');
