<?php

namespace App\Models;

use App\Enums\AddressType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Address modell - Címek kezelése
 * Ez a modell reprezentálja a felhasználók címeit (szállítási, számlázási).
 */
class Address extends Model
{
    /** @use HasFactory<\Database\Factories\AddressFactory> */
    use HasFactory;

    /**
     * Tömeges kitöltés engedélyezett mezők
     */
    protected $fillable = [
        'user_id',       // Felhasználó ID
        'type',          // Cím típusa (shipping/billing)
        'name',          // Név
        'phone',         // Telefonszám
        'country',       // Ország
        'city',          // Város
        'zip',           // Irányítószám
        'address_line1', // Cím sor 1
        'address_line2', // Cím sor 2 (opcionális)
        'is_default',    // Alapértelmezett cím-e
    ];

    /**
     * Adattípus konverziók
     */
    protected function casts(): array
    {
        return [
            'user_id' => 'integer',
            'type' => AddressType::class,  // Enum cast-olás
            'phone' => 'string',           // Telefonszám string (nem integer)
            'is_default' => 'boolean',
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
     * Scope az alapértelmezett címekhez
     */
    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }

    /**
     * Scope típus alapján
     */
    public function scopeOfType($query, AddressType $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Ellenőrzi, hogy a cím teljes-e
     */
    public function isComplete(): bool
    {
        return !empty($this->address_line1) && !empty($this->city) && !empty($this->zip);
    }
}
