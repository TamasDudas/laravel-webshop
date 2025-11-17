<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Order modell - Rendelések kezelése
 * Ez a modell reprezentálja a felhasználók rendeléseit, tételekkel és szállítással.
 */
class Order extends Model
{
    /** @use HasFactory<\Database\Factories\OrderFactory> */
    use HasFactory;

    /**
     * Tömeges kitöltés engedélyezett mezők
     */
    protected $fillable = [
        'user_id',           // Felhasználó ID (nullable vendég rendeléseknél)
        'shipping_method_id', // Szállítási mód ID
        'status',             // Rendelés státusza (pl. pending, completed)
        'total_amount',       // Teljes összeg (forintban)
        'guest_email',        // Vendég e-mail (nullable)
        'guest_name',         // Vendég név (nullable)
        'guest_phone',        // Vendég telefon (nullable)
        'session_id',         // Session ID vendég kosárhoz
        'shipping_address',   // Szállítási cím (text)
        'billing_address',    // Számlázási cím (text)
    ];

    /**
     * Adattípus konverziók
     */
    protected function casts(): array
    {
        return [
            'user_id' => 'integer',
            'shipping_method_id' => 'integer',
            'total_amount' => 'decimal:0',  // Egész szám (forint)
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
     * Kapcsolat a szállítási módhoz
     */
    public function shippingMethod(): BelongsTo
    {
        return $this->belongsTo(ShippingMethod::class);
    }

    /**
     * Kapcsolat a rendelési tételekhez
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Scope státusz alapján
     */
    public function scopeStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Ellenőrzi, hogy a rendelés teljesített-e
     */
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    /**
     * Számított mező: tételek száma
     */
    public function getItemsCountAttribute(): int
    {
        return $this->items()->count();
    }
}
