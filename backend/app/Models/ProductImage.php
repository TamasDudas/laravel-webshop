<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * ProductImage modell - Termék képek kezelése
 * Ez a modell reprezentálja a termékekhez tartozó képeket, sorrenddel és elsődleges kép jelzéssel.
 */
class ProductImage extends Model
{
    /** @use HasFactory<\Database\Factories\ProductImageFactory> */
    use HasFactory;

    /**
     * Tömeges kitöltés engedélyezett mezők
     */
    protected $fillable = [
        'product_id',  // Termék ID
        'image_path',  // Kép elérési útja
        'is_primary',  // Elsődleges kép-e
        'order',       // Megjelenítési sorrend
    ];

    /**
     * Adattípus konverziók
     */
    protected function casts(): array
    {
        return [
            'is_primary' => 'boolean',  // Logikai érték
            'order' => 'integer',       // Egész szám
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
     * Scope az elsődleges képekhez
     */
    public function scopePrimary($query)
    {
        return $query->where('is_primary', true);
    }

    /**
     * Scope a sorrend szerinti rendezéshez
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }
}
