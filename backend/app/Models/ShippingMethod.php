<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * ShippingMethod modell - Szállítási módok kezelése
 * Ez a modell reprezentálja a rendelkezésre álló szállítási opciókat.
 */
class ShippingMethod extends Model
{
    /** @use HasFactory<\Database\Factories\ShippingMethodFactory> */
    use HasFactory;

    /**
     * Tömeges kitöltés engedélyezett mezők
     */
    protected $fillable = [
        'name',           // Szállítási mód neve
        'price',          // Ár (forintban)
        'estimated_days', // Becsült szállítási idő (nap)
        'is_active',      // Aktív-e
    ];

    /**
     * Adattípus konverziók
     */
    protected function casts(): array
    {
        return [
            'price' => 'decimal:0',     // Egész szám (forint)
            'estimated_days' => 'integer', // Pozitív egész szám
            'is_active' => 'boolean',   // Logikai érték
        ];
    }

    /**
     * Kapcsolat a rendelésekhez
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Scope az aktív szállítási módokhoz
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
