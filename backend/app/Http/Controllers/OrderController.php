<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if (auth()->check()) {
            $orders = Order::where('user_id', auth()->id())->with(['user', 'shippingMethod', 'items.product'])->get();
        } else {
            // Guest orders - session_id alapján, de ez példa, igazából nem publikus
            return response()->json(['error' => 'Hitelesítés szükséges'], 401);
        }

        return OrderResource::collection($orders);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'shipping_method_id' => 'required|exists:shipping_methods,id',
            'status' => 'required|string|in:pending,processing,shipped,completed,cancelled',
            'total_amount' => 'required|numeric|min:0',
            'guest_email' => 'nullable|email',
            'guest_name' => 'nullable|string|max:255',
            'guest_phone' => 'nullable|string|max:20',
            'session_id' => 'nullable|string',
            'shipping_address' => 'required|string',
            'billing_address' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        try {
            $order = Order::create([
                'user_id' => $validated['user_id'] ?? auth()->id(),
                'shipping_method_id' => $validated['shipping_method_id'],
                'status' => $validated['status'],
                'total_amount' => $validated['total_amount'],
                'guest_email' => $validated['guest_email'],
                'guest_name' => $validated['guest_name'],
                'guest_phone' => $validated['guest_phone'],
                'session_id' => $validated['session_id'],
                'shipping_address' => $validated['shipping_address'],
                'billing_address' => $validated['billing_address'],
            ]);

            // Order items létrehozása
            foreach ($validated['items'] as $itemData) {
                $order->items()->create([
                    'product_id' => $itemData['product_id'],
                    'quantity' => $itemData['quantity'],
                    'price' => $itemData['price'],
                ]);
            }

            return new OrderResource($order->load(['user', 'shippingMethod', 'items.product']));

        } catch (\Exception $e) {
            Log::error('Order Creation failed: ' . $e->getMessage());
            return response()->json(['error' => 'Nem sikerült létrehozni a rendelést'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        // Csak saját rendelés vagy admin
        if ($order->user_id !== auth()->id()) {
            return response()->json(['error' => 'Nincs jogosultságod megnézni ezt a rendelést'], 403);
        }

        return new OrderResource($order->load(['user', 'shippingMethod', 'items.product']));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        // Csak saját rendelés
        if ($order->user_id !== auth()->id()) {
            return response()->json(['error' => 'Csak a saját rendelésedet módosíthatod'], 403);
        }

        $validated = $request->validate([
            'status' => 'sometimes|string|in:pending,processing,shipped,completed,cancelled',
            'shipping_address' => 'sometimes|string',
            'billing_address' => 'sometimes|string',
        ]);

        try {
            $order->update($validated);

            return new OrderResource($order->load(['user', 'shippingMethod', 'items.product']));

        } catch (\Exception $e) {
            return response()->json(['error' => 'Nem sikerült frissíteni a rendelést'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        // Csak saját rendelés és csak bizonyos státuszban (pl. pending)
        if ($order->user_id !== auth()->id() || !in_array($order->status, ['pending', 'cancelled'])) {
            return response()->json(['error' => 'Nem törölheted ezt a rendelést'], 403);
        }

        try {
            $order->delete();

            return response()->json(['message' => 'Rendelés törölve'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Nem sikerült törölni a rendelést'], 500);
        }
    }
}
