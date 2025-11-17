<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Review modell - Értékelések kezelése
 * Ez a modell reprezentálja a termékek értékeléseit, felhasználóktól.
 */
class Review extends Model
{
    /** @use HasFactory<\Database\Factories\ReviewFactory> */
    use HasFactory;

    /**
     * Tömeges kitöltés engedélyezett mezők
     */
    protected $fillable = [
        'user_id',              // Felhasználó ID
        'product_id',           // Termék ID
        'rating',               // Értékelés (15)
        'title',                // Cím
        'comment',              // Megjegyzés
        'is_verified_purchase', // Ellenőrzött vásárlás-e
    ];

    /**
     * Adattípus konverziók
     */
    protected function casts(): array
    {
        return [
            'user_id' => 'integer',
            'product_id' => 'integer',
            'rating' => 'integer',           // 1-5 csillag
            'is_verified_purchase' => 'boolean',
        ];
    }

    /**
     * Kapcsolat a termékhez
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Kapcsolat a felhasználóhoz
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope az ellenőrzött értékelésekhez
     */
    public function scopeVerified($query)
    {
        return $query->where('is_verified_purchase', true);
    }

    /**
     * Ellenőrzi, hogy az értékelés érvényes-e (1-5)
     */
    public function isValidRating(): bool
    {
        return $this->rating >= 1 && $this->rating <= 5;
    }
}
