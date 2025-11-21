<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Resources\ProductResource;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Lekérdezzük a query paramétereket (alapértelmezett értékekkel)
        $pagination = $request->query('per_page', 9); // Hány termék oldalanként (alap 9)

        $search = $request->query('search', ''); // Keresési szöveg (név vagy leírás)

        $allowedSorts = ['name', 'price', 'created_at']; // Engedélyezett rendezési mezők (rating kihagyva egyszerűség kedvéért)

        $sortBy = in_array($request->query('sort_by'), $allowedSorts) ? $request->query('sort_by') : 'name'; // Rendezés alapja (alap név)

        $direction = in_array($request->query('direction'), ['asc', 'desc']) ? $request->query('direction') : 'asc'; // Irány (alap növekvő)

        // Kezdjük a query-t eager loading-gal, hozzáadva a kategóriát és a képeket (kapcsolatok betöltése N+1 elkerülésére)
        $query = Product::with(['category', 'images' => fn ($q) => $q->ordered()]); // Betöltjük a kategóriát és képeket (sorrendben)

        // Ha van keresés, szűrjük a neveket és leírásokat (LIKE keresés)
        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        // Csak aktív termékeket mutatunk
        $products = $query->where('is_active', true);

        // Rendezés a kiválasztott mező szerint
        $products = $products->orderBy($sortBy, $direction);

        // Paginate: oldalakra osztás
        $products = $products->paginate($pagination);

        // Válasz JSON formában pagination meta adatokkal
        return [
            'data' => ProductResource::collection($products->items()), // Termékek listája Resource-kal
            'current_page' => $products->currentPage(), // Aktuális oldal
            'last_page' => $products->lastPage(), // Utolsó oldal
            'per_page' => $products->perPage(), // Oldalankénti szám
            'total' => $products->total(), // Összes termék
            'first_item' => $products->firstItem(), // Első elem index
            'last_item' => $products->lastItem(), // Utolsó elem index
        ];
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'category_id' => 'required|exists:categories,id',
                'name' => 'required|string|min:5|max:255',
                'description' => 'required|string',
                'price' => 'required|integer|min:0',
                'stock' => 'required|integer|min:0',
                'is_active' => 'boolean',
                'images' => 'array', // Tömb képekből
                'images.*' => 'image|mimes:jpeg,png,jpg,gif,avif|max:2048', // Minden kép validáció
            ]);

            // Slug generálás a név alapján (egyedi)
            // Ha már létezik ugyanaz a slug, counter-rel bővítjük (pl. "ora" -> "ora-1" -> "ora-2")
            $slug = Str::slug($validated['name']);
            $originalSlug = $slug;
            $counter = 1;
            while (Product::where('slug', $slug)->exists()) {
                $slug = $originalSlug . '-' . $counter;
                $counter++;
            }

            $product = Product::create([
                'category_id' => $validated['category_id'],
                'name' => $validated['name'],
                'slug' => $slug,
                'description' => $validated['description'],
                'price' => $validated['price'],
                'stock' => $validated['stock'],
                'is_active' => $validated['is_active'] ?? true,
            ]);

            // Képek feltöltése
            if ($request->hasFile('images')) {
                // Minden feltöltött képfájlt feldolgozunk, mivel több kép van így tömbben "érkeznek"
                foreach ($request->file('images') as $index => $file) {
                    // Kép mentése a storage/app/public/products/ mappába egyedi névvel
                    $path = $file->store('products', 'public');
                    // ProductImage rekord létrehozása az adatbázisban
                    ProductImage::create([
                        'product_id' => $product->id,  // Kapcsolódás a termékhez
                        'image_path' => $path,         // Elérési út a storage-ban
                        'is_primary' => $index === 0, // Az első kép elsődleges (true/false)
                        'order' => $index,            // Sorrend (0, 1, 2...)
                    ]);
                }
            }

            return new ProductResource($product->load(['category', 'images']));
        } catch (\Exception $e) {
            Log::error('Product creation failed: '.$e->getMessage());
            return response()->json(['error' => 'Nem sikerült létrehozni a terméket'], 500);
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        // Eager loading: Betöltjük a kapcsolatokat (category, images, reviews) a termékkel együtt,
        // hogy elkerüljük az N+1 query problémát. Az images-hez ordered scope-ot használunk a sorrendhez.
        $product->load(['category', 'images' => fn ($q) => $q->ordered(), 'reviews']);

        return new ProductResource($product);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        try {
            $validated = $request->validate([
                'category_id' => 'sometimes|exists:categories,id', // Opcionális, csak ha változik
                'name' => 'sometimes|string|min:5|max:255',
                'description' => 'sometimes|string',
                'price' => 'sometimes|integer|min:0',
                'stock' => 'sometimes|integer|min:0',
                'is_active' => 'sometimes|boolean',
                'images' => 'array', // Új képek hozzáadása
                'images.*' => 'image|mimes:jpeg,png,jpg,gif,avif|max:2048',
            ]);

            // Ha name változott, új slug generálás (egyedi)
            // Ha már létezik ugyanaz a slug, counter-rel bővítjük (pl. "ora" -> "ora-1" -> "ora-2")
            if (isset($validated['name']) && $validated['name'] !== $product->name) {
                $slug = Str::slug($validated['name']);
                $originalSlug = $slug;
                $counter = 1;
                while (Product::where('slug', $slug)->where('id', '!=', $product->id)->exists()) {
                    $slug = $originalSlug . '-' . $counter;
                    $counter++;
                }
                $validated['slug'] = $slug;
            }

            $product->update($validated);

            // Új képek hozzáadása, ha vannak
            if ($request->hasFile('images')) {
                $currentOrder = $product->images()->max('order') ?? -1; // Utolsó order
                // Minden új képfájlt feldolgozunk és hozzáadunk a meglévőkhöz
                foreach ($request->file('images') as $index => $file) {
                    // Kép mentése a storage/app/public/products/ mappába egyedi névvel
                    $path = $file->store('products', 'public');
                    // ProductImage rekord létrehozása az adatbázisban
                    ProductImage::create([
                        'product_id' => $product->id,  // Kapcsolódás a termékhez
                        'image_path' => $path,         // Elérési út a storage-ban
                        'is_primary' => false,         // Új képek alapértelmezetten nem elsődlegesek
                        'order' => $currentOrder + $index + 1, // Sorrend folytatása (pl. ha volt 2 kép, ez 3, 4...)
                    ]);
                }
            }

            return new ProductResource($product->load(['category', 'images']));
        } catch (\Exception $e) {
            Log::error('Product update failed: ' . $e->getMessage());
            return response()->json(['error' => 'Nem sikerült frissíteni a terméket'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(product $product)
    {
        $product->delete();
    }
}
