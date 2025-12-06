<?php

namespace App\Http\Controllers;

use Carbon\Traits\Cast;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\CartItemResource;

class CartItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if (auth('sanctum')->check()) {
            // Bejelentkezett user kosara
            $cartItems = CartItem::where('user_id', auth('sanctum')->id())->with(['product.images'])->get();
        } else {
            // Vendég kosara session alapján
            $sessionId = session()->getId();
            $cartItems = CartItem::where('session_id', $sessionId)->with(['product.images'])->get();
        }

        return CartItemResource::collection($cartItems);
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
        try {
            $validated = $request->validate([
                'product_id' => 'required|exists:products,id',
                'quantity' => 'required|integer|min:1',
            ]);

            $productId = $validated['product_id'];
            $quantity = $validated['quantity'];

            if (auth('sanctum')->check()) {
                // Bejelentkezett user: keresd meg, van-e már ilyen termék
                $existingItem = CartItem::where('user_id', auth('sanctum')->id())
                    ->where('product_id', $productId)
                    ->first();

                if ($existingItem) {
                    // Növeld a mennyiséget
                    $existingItem->update(['quantity' => $existingItem->quantity + $quantity]);
                    return new CartItemResource($existingItem->load(['product']));
                } else {
                    // Új tétel
                    $cartItem = CartItem::create([
                        'user_id' => auth('sanctum')->id(),
                        'product_id' => $productId,
                        'quantity' => $quantity,
                        'session_id' => null,
                    ]);
                }
            } else {
                // Vendég: session alapján
                $sessionId = session()->getId();
                $existingItem = CartItem::where('session_id', $sessionId)
                    ->where('product_id', $productId)
                    ->first();

                if ($existingItem) {
                    // Növeld a mennyiséget
                    $existingItem->update(['quantity' => $existingItem->quantity + $quantity]);
                    return new CartItemResource($existingItem->load(['product']));
                } else {
                    // Új tétel
                    $cartItem = CartItem::create([
                        'user_id' => null,
                        'session_id' => $sessionId,
                        'product_id' => $productId,
                        'quantity' => $quantity,
                    ]);
                }
            }

            return new CartItemResource($cartItem->load(['product']));

        } catch (\Exception $e) {
            Log::error('Error with cart item: ' . $e->getMessage());
            return response()->json(['error' => 'Nem sikerült a terméket a kosárba helyezni'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(CartItem $cartItem)
    {
        // Ellenőrzés: csak saját kosár tétel
        if (!$this->isOwnCartItem($cartItem)) {
            return response()->json(['error' => 'Nincs jogosultságod megnézni ezt a kosár tételt'], 403);
        }

        return new CartItemResource($cartItem->load(['product']));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CartItem $cartItem)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CartItem $cartItem)
    {
        // Ellenőrzés: csak saját kosár tétel
        if (!$this->isOwnCartItem($cartItem)) {
            return response()->json(['error' => 'Nincs jogosultságod módosítani ezt a kosár tételt'], 403);
        }

        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        try {
            $cartItem->update($validated);

            return new CartItemResource($cartItem->load(['product']));

        } catch (\Exception $e) {

            return response()->json(['error' => 'Nem sikerült frissíteni a kosár tételt'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CartItem $cartItem)
    {
        // Ellenőrzés: csak saját kosár tétel
        if (!$this->isOwnCartItem($cartItem)) {
            return response()->json(['error' => 'Nincs jogosultságod törölni ezt a kosár tételt'], 403);
        }

        try {
            $cartItem->delete();

            return response()->json(['message' => 'Kosár tétel törölve'], 200);
        } catch (\Exception $e) {

            return response()->json(['error' => 'Nem sikerült törölni a kosár tételt'], 500);
        }
    }

    /**
     * Segédmetódus: ellenőrzi, hogy a kosár tétel saját-e (user vagy session alapján)
     */
    private function isOwnCartItem(CartItem $cartItem): bool
    {
        if (auth('sanctum')->check()) {
            return $cartItem->user_id === auth('sanctum')->id();
        } else {
            return $cartItem->session_id === session()->getId();
        }
    }
}
