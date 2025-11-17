<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Category modell - Kategóriák kezelése
 * Ez a modell reprezentálja a termékkategóriákat, fa-struktúrában (parent_id self-referencing).
 */
class Category extends Model
{
    /** @use HasFactory<\Database\Factories\CategoryFactory> */
    use HasFactory;

    /**
     * Tömeges kitöltés engedélyezett mezők
     */
    protected $fillable = [
        'parent_id',  // Szülő kategória ID (nullable, fa-struktúra)
        'name',       // Kategória neve
        'slug',       // URL-barát azonosító
    ];

    /**
     * Adattípus konverziók
     */
    protected function casts(): array
    {
        return [
            'parent_id' => 'integer',  // Egész szám vagy null
        ];
    }

    /**
     * Kapcsolat a szülő kategóriához (self-referencing)
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    /**
     * Kapcsolat a gyermek kategóriákhoz (self-referencing)
     */
    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    /**
     * Kapcsolat a termékekhez
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Ellenőrzi, hogy gyökér kategória-e (nincs szülője)
     */
    public function isRoot(): bool
    {
        return is_null($this->parent_id);
    }

    /**
     * Rekurzívan visszaadja az összes leszármazottat
     */
    public function descendants()
    {
        return $this->children()->with('descendants');
    }
}
