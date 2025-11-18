<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\OrderController;

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

// Authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

// Product routes
Route::apiResource('products', ProductController::class)->except(['store', 'update', 'destroy']);
Route::middleware('auth:sanctum')->apiResource('products', ProductController::class)->only(['store', 'update', 'destroy']);

// Category routes
Route::apiResource('categories', CategoryController::class)->except(['store', 'update', 'destroy']);
Route::middleware('auth:sanctum')->apiResource('categories', CategoryController::class)->only(['store', 'update', 'destroy']);

// Review routes
Route::apiResource('reviews', ReviewController::class)->except(['store', 'update', 'destroy']);
Route::middleware('auth:sanctum')->apiResource('reviews', ReviewController::class)->only(['store', 'update', 'destroy']);

// Order routes
Route::apiResource('orders', OrderController::class)->except(['store', 'update', 'destroy']);
Route::middleware('auth:sanctum')->apiResource('orders', OrderController::class)->only(['store']);
