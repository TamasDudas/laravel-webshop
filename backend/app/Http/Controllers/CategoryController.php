<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\CategoryResource;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Category::all();

        return CategoryResource::collection($categories);
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
                'parent_id' => 'nullable|integer',
                'name' => 'required|string|min:2|max:255',
            ]);

            $slug = Str::slug($validated['name']);
            $counter = 1;

            while (Category::where('slug', $slug)->exists()) {
                $slug = $slug .'-'. $counter;
                $counter++;
            }

            $category = Category::create([
                'parent_id' => $validated['parent_id'] ?? null,
                'name' => $validated['name'],
                'slug' => $slug
            ]);

            return new CategoryResource($category);

        } catch (\Exception $e) {
            Log::error('Category creation failed: '. $e->getMessage());
            return response()->json(['error' => 'Nem siokerült létrehozni a kategóriát'], 500);

        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        return new CategoryResource($category->load(['parent', 'children', 'products']));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        // Fejlesztés közben bárki módosíthatja a kategóriákat
        // if (!auth()->user()->isAdmin()) {
        //     return response()->json(['error' => 'Nincs jogosultságod módosítani a kategóriákat'], 403);
        // }
        try {
            $validated = $request->validate([
                'parent_id' => 'nullable|integer',
                'name' => 'required|string|min:2|max:255',
            ]);

            if (isset($validated['name']) && $validated['name'] !== $category->name) {
                $slug = Str::slug($validated['name']);
                $counter = 1;
                while (Category::where('slug', $slug)->where('id', '!=', $category->id)->exists()) {
                    $slug = $slug . '-' . $counter;
                    $counter++;
                }
                $validated['slug'] = $slug;
            }

            $category->update($validated);

            return new CategoryResource($category);

        } catch (\Exception $e) {
            Log::error('Category creation failed: '. $e->getMessage());
            return response()->json(['error' => 'Nem siokerült létrehozni a kategóriát'], 500);

        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Fejlesztés közben bárki törölheti a kategóriákat
        // if (!auth()->user()->isAdmin()) {
        //     return response()->json(['error' => 'Nincs jogosultságod törölni a kategóriákat'], 403);
        // }

        try {
            $category = Category::find($id);

            if (!$category) {
                return response()->json(['error' => 'Kategória nem található'], 404);
            }

            $category->delete();

            return response()->json(['message' => 'Kategória törölve'], 200);
        } catch (\Exception $e) {
            Log::error('Category deletion failed: ' . $e->getMessage());
            return response()->json(['error' => 'Nem sikerült törölni a kategóriát'], 500);
        }
    }
}
