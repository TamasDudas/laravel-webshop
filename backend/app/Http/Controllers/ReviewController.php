<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\ReviewResource;

class ReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reviews = Review::all();

        return ReviewResource::collection($reviews);
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
                'user_id' => 'required|exists:users,id',
                'product_id' => 'required|exists:products,id',
                'rating' => 'required|integer|min:1|max:5',
                'title' => 'nullable|string|max:255',
                'comment' => 'nullable|string|max:1000',
                'is_verified_purchase' => 'boolean'
            ]);

            $review = Review::create([
                'user_id' => $validated['user_id'],
                'product_id' => $validated['product_id'],
                'rating' => $validated['rating'],
                'title' => $validated['title'],
                'comment' => $validated['comment'],
                'is_verified_purchase' => $validated['is_verified_purchase'],
            ]);

            return new ReviewResource($review->load(['user', 'product']));

        } catch (\Exception $e) {
            Log::error('Review Creation failed: ' . $e->getMessage());
            return response()->json(['error' => 'Nem sikerült létrehozni a kommentet'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Review $review)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Review $review)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Review $review)
    {
        // Csak saját review módosítható
        if ($review->user_id !== auth()->id()) {
            return response()->json(['error' => 'Csak a saját értékelésedet módosíthatod'], 403);
        }

        try {
            $validated = $request->validate([
                'rating' => 'sometimes|integer|min:1|max:5',
                'title' => 'nullable|string|max:255',
                'comment' => 'nullable|string|max:1000',
                'is_verified_purchase' => 'sometimes|boolean'
            ]);

            $review->update($validated);

            return new ReviewResource($review->load(['user', 'product']));

        } catch (\Exception $e) {
            Log::error('Review update failed: ' . $e->getMessage());
            return response()->json(['error' => 'Nem sikerült frissíteni a kommentet'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Review $review)
    {
        // Csak saját review törölhető
        if ($review->user_id !== auth()->id()) {
            return response()->json(['error' => 'Csak a saját értékelésedet törölheted'], 403);
        }

        try {
            $review->delete();

            return response()->json(['message' => 'Értékelés törölve'], 200);
        } catch (\Exception $e) {
            Log::error('Review deletion failed: ' . $e->getMessage());
            return response()->json(['error' => 'Nem sikerült törölni az értékelést'], 500);
        }
    }
}
