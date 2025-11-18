<?php

namespace App\Http\Controllers;

use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\AddressResource;

class AddressController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $addresses = Address::where('user_id', auth()->id())->with(['user'])->get();

        return AddressResource::collection($addresses);
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
            'type' => 'required|in:shipping,billing',
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'country' => 'required|string|max:100',
            'city' => 'required|string|max:100',
            'zip' => 'required|string|max:20',
            'address_line1' => 'required|string|max:255',
            'address_line2' => 'nullable|string|max:255',
            'is_default' => 'boolean',
        ]);

        try {
            // Ha alapértelmezett, akkor a többi címet nem alapértelmezetté tesszük
            if ($validated['is_default'] ?? false) {
                Address::where('user_id', auth()->id())
                    ->where('type', $validated['type'])
                    ->update(['is_default' => false]);
            }

            $address = Address::create([
                'user_id' => auth()->id(),
                ...$validated,
            ]);

            return new AddressResource($address->load(['user']));

        } catch (\Exception $e) {
            Log::error('Error creating address: ' . $e->getMessage());
            return response()->json(['error' => 'Nem sikerült létrehozni a címet'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Address $address)
    {
        // Ellenőrzés: csak saját
        if ($address->user_id !== auth()->id()) {
            return response()->json(['error' => 'Nincs jogosultságod megnézni ezt a címet'], 403);
        }

        return new AddressResource($address->load(['user']));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Address $address)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Address $address)
    {
        // Ellenőrzés: csak saját
        if ($address->user_id !== auth()->id()) {
            return response()->json(['error' => 'Nincs jogosultságod módosítani ezt a címet'], 403);
        }

        $validated = $request->validate([
            'type' => 'sometimes|in:shipping,billing',
            'name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:20',
            'country' => 'sometimes|string|max:100',
            'city' => 'sometimes|string|max:100',
            'zip' => 'sometimes|string|max:20',
            'address_line1' => 'sometimes|string|max:255',
            'address_line2' => 'nullable|string|max:255',
            'is_default' => 'boolean',
        ]);

        try {
            // Ha alapértelmezett, akkor a többi címet nem alapértelmezetté tesszük
            if (isset($validated['is_default']) && $validated['is_default']) {
                Address::where('user_id', auth()->id())
                    ->where('type', $validated['type'] ?? $address->type)
                    ->where('id', '!=', $address->id)
                    ->update(['is_default' => false]);
            }

            $address->update($validated);

            return new AddressResource($address->load(['user']));

        } catch (\Exception $e) {
            Log::error('Error updating address: ' . $e->getMessage());
            return response()->json(['error' => 'Nem sikerült frissíteni a címet'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Address $address)
    {
        // Ellenőrzés: csak saját
        if ($address->user_id !== auth()->id()) {
            return response()->json(['error' => 'Nincs jogosultságod törölni ezt a címet'], 403);
        }

        try {
            $address->delete();

            return response()->json(['message' => 'Cím törölve'], 200);
        } catch (\Exception $e) {
            Log::error('Error deleting address: ' . $e->getMessage());
            return response()->json(['error' => 'Nem sikerült törölni a címet'], 500);
        }
    }
}
