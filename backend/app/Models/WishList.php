<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * WishList modell - Kívánságlisták kezelése
 * Ez a modell reprezentálja a felhasználók kívánságlistáit, termékekkel.
 */
class WishList extends Model
{
    /** @use HasFactory<\Database\Factories\WishListFactory> */
    use HasFactory;

    /**
     * Tömeges kitöltés engedélyezett mezők
     */
    protected $fillable = [
        'user_id',    // Felhasználó ID
        'product_id', // Termék ID
    ];

    /**
     * Adattípus konverziók
     */
    protected function casts(): array
    {
        return [
            'user_id' => 'integer',
            'product_id' => 'integer',
        ];
    }

    /**
     * Kapcsolat a felhasználóhoz
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Kapcsolat a termékhez
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
