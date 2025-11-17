<?php

namespace App\Enums;

/**
 * AddressType - Cím típusok enumja
 * Ez az enum definiálja a rendszerben használt cím típusokat,
 * string értékekkel a könnyebb tároláshoz és megjelenítéshez.
 */
enum AddressType: string
{
    // Szállítási cím
    case SHIPPING = 'shipping';

    // Számlázási cím
    case BILLING = 'billing';

    /**
     * Visszaadja a cím típus magyar címkéjét
     * Használható UI-ban vagy üzenetekben a típus megjelenítéséhez.
     */
    public function label()
    {
        return match($this) {
            self::SHIPPING => 'szállítási cím',
            self::BILLING => 'számlázási cím',
        };
    }
}
