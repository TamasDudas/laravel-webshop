<?php

namespace App\Enums;

use function PHPUnit\Framework\matches;

/**
 * UserRoleEnum - Felhasználói szerepkörök enumja
 * Ez az enum definiálja a rendszerben használt felhasználói szerepköröket,
 * string értékekkel a könnyebb tároláshoz és megjelenítéshez.
 */
enum UserRoleEnum: string
{
    // Normál felhasználó szerepkör
    case USER = 'user';

    // Adminisztrátori szerepkör, teljes hozzáféréssel
    case ADMIN = 'admin';

    /**
     * Visszaadja a szerepkör magyar címkéjét
     * Használható UI-ban vagy üzenetekben a szerepkör megjelenítéséhez.
     */
    public function label()
    {
        return match($this) {
            self::USER => 'felhasználó',
            self::ADMIN => 'adminisztrátor',
        };
    }

    /**
     * Ellenőrzi, hogy az adott szerepkör admin-e
     * Visszaad true-t, ha ADMIN, különben false.
     */
    public function isAdmin()
    {
        return $this === self::ADMIN;
    }
}
