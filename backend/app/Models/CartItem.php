<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * CartItem modell - Kosár tételek kezelése
 * Ez a modell reprezentálja a felhasználók kosarában lévő termékeket és mennyiségeket.
 */
class CartItem extends Model
{
    /** @use HasFactory<\Database\Factories\CartItemFactory> */
    use HasFactory;

    /**
     * Tömeges kitöltés engedélyezett mezők
     */
    protected $fillable = [
        'user_id',   // Felhasználó ID (nullable)
        'session_id', // Session ID vendég kosárhoz (nullable)
        'product_id', // Termék ID
        'quantity',   // Mennyiség
    ];

    /**
     * Adattípus konverziók
     */
    protected function casts(): array
    {
        return [
            'user_id' => 'integer',
            'product_id' => 'integer',
            'quantity' => 'integer',  // Pozitív egész szám
        ];
    }

    /**
     * Kapcsolat a felhasználóhoz
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class)->nullable();
    }

    /**
     * Kapcsolat a termékhez
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Számított mező: teljes ár (mennyiség * termék ár)
     */
    public function getTotalPriceAttribute(): int
    {
        return $this->quantity * ($this->product?->price ?? 0);
    }
}
