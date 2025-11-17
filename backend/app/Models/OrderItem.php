<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * OrderItem modell - Rendelési tételek kezelése
 * Ez a modell reprezentálja egy rendelés egyes tételeit (termék + mennyiség + ár).
 */
class OrderItem extends Model
{
    /** @use HasFactory<\Database\Factories\OrderItemFactory> */
    use HasFactory;

    /**
     * Tömeges kitöltés engedélyezett mezők
     */
    protected $fillable = [
        'order_id',   // Rendelés ID
        'product_id', // Termék ID
        'quantity',   // Mennyiség
        'price',      // Egységár (forintban)
    ];

    /**
     * Adattípus konverziók
     */
    protected function casts(): array
    {
        return [
            'order_id' => 'integer',
            'product_id' => 'integer',
            'quantity' => 'integer',    // Pozitív egész szám
            'price' => 'decimal:0',     // Egész szám (forint)
        ];
    }

    /**
     * Kapcsolat a rendeléshez
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Kapcsolat a termékhez
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Számított mező: teljes ár (mennyiség * egységár)
     */
    public function getTotalPriceAttribute(): int
    {
        return $this->quantity * $this->price;
    }
}
