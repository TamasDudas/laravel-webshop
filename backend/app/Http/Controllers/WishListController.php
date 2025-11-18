<?php

namespace App\Http\Controllers;

use App\Models\WishList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\WishListResource;

class WishListController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'A lista megtekintéséhez be kell jelentkezned']);
        }

        $wishLists = WishList::where('user_id', auth()->id())->with(['user', 'product'])->get();

        return WishListResource::collection($wishLists);
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

            if (!auth()->check()) {
                return response()->json(['message' => 'A lista készítéséhez be kell jelentkezned']);
            }

            $validated = $request->validate([
                'product_id' => 'required|exists:products,id',
            ]);

            // Ellenőrzés: már hozzá van-e adva
            $existing = WishList::where('user_id', auth()->id())
                ->where('product_id', $validated['product_id'])
                ->first();

            if ($existing) {
                return response()->json(['message' => 'Ez a termék már szerepel a kívánságlistádban'], 409);
            }

            $wishList = WishList::create([
                'user_id' => auth()->id(),
                'product_id' => $validated['product_id'],
            ]);

            return new WishListResource($wishList->load(['user', 'product']));

        } catch (\Exception $e) {
            Log::error('Error with WishList: ' . $e->getMessage());
            return response()->json(['error' => 'Nem sikerült a kívánság lista mentése'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(WishList $wishList)
    {
        // Ellenőrzés: csak saját
        if ($wishList->user_id !== auth()->id()) {
            return response()->json(['error' => 'Nincs jogosultságod megnézni ezt a kívánságlista tételt'], 403);
        }

        return new WishListResource($wishList->load(['user', 'product']));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(WishList $wishList)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, WishList $wishList)
    {
        // Wishlist tétel általában nem frissíthető, csak törölhető vagy hozzáadható
        return response()->json(['error' => 'A kívánságlista tétel nem frissíthető'], 405);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WishList $wishList)
    {
        // Ellenőrzés: csak saját
        if ($wishList->user_id !== auth()->id()) {
            return response()->json(['error' => 'Nincs jogosultságod törölni ezt a kívánságlista tételt'], 403);
        }

        try {
            $wishList->delete();

            return response()->json(['message' => 'Kívánságlista tétel törölve'], 200);
        } catch (\Exception $e) {
            Log::error('Error deleting wishlist item: ' . $e->getMessage());
            return response()->json(['error' => 'Nem sikerült törölni a kívánságlista tételt'], 500);
        }
    }
}
