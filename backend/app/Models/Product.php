<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Product modell - Termékek kezelése
 * Ez a modell reprezentálja a webshop termékeket, kapcsolatokkal a kategóriákhoz,
 * képekhez, értékelésekhez és rendelési tételekhez.
 */
class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;

    /**
     * Tömeges kitöltés engedélyezett mezők
     */
    protected $fillable = [
        'category_id',  // Kategória ID
        'name',         // Termék neve
        'slug',         // URL-barát azonosító
        'description',  // Leírás
        'price',        // Ár (forintban, egész szám)
        'stock',        // Készlet
        'is_active',    // Aktív-e
    ];

    /**
     * Adattípus konverziók
     */
    protected function casts(): array
    {
        return [
            'price' => 'decimal:0',  // Egész szám (forint)
            'stock' => 'integer',    // Egész szám
            'is_active' => 'boolean', // Logikai érték
        ];
    }

    /**
     * Kapcsolat a kategóriához
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Kapcsolat a termék képekhez
     */
    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }

    /**
     * Kapcsolat az értékelésekhez
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Kapcsolat a kosár tételekhez
     */
    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    /**
     * Kapcsolat a rendelési tételekhez
     */
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Kapcsolat a kívánságlistákhoz
     */
    public function wishLists(): HasMany
    {
        return $this->hasMany(WishList::class);
    }
}
