<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CartItemController;
use App\Http\Controllers\WishListController;
use App\Http\Controllers\AddressController;

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
Route::middleware('auth:sanctum')->post('products', [ProductController::class, 'store']);
Route::middleware('auth:sanctum')->post('products/{product}/update', [ProductController::class, 'update']);
Route::middleware('auth:sanctum')->delete('products/{product}', [ProductController::class, 'destroy']);

// Category routes
Route::apiResource('categories', CategoryController::class)->except(['store', 'update', 'destroy']);
Route::middleware('auth:sanctum')->post('categories', [CategoryController::class, 'store']);
Route::middleware('auth:sanctum')->post('categories/{category}/update', [CategoryController::class, 'update']);
Route::middleware('auth:sanctum')->delete('categories/{category}', [CategoryController::class, 'destroy']);

// Review routes
Route::apiResource('reviews', ReviewController::class)->except(['store', 'update', 'destroy']);
Route::middleware('auth:sanctum')->post('reviews', [ReviewController::class, 'store']);
Route::middleware('auth:sanctum')->post('reviews/{review}/update', [ReviewController::class, 'update']);
Route::middleware('auth:sanctum')->delete('reviews/{review}', [ReviewController::class, 'destroy']);

// Order routes
Route::apiResource('orders', OrderController::class)->except(['store', 'update', 'destroy']);
Route::middleware('auth:sanctum')->post('orders', [OrderController::class, 'store']);

// Cart routes
Route::apiResource('cart-items', CartItemController::class);

// Wishlist routes
Route::middleware('auth:sanctum')->apiResource('wish-lists', WishListController::class);

// Address routes
Route::middleware('auth:sanctum')->apiResource('addresses', AddressController::class);
