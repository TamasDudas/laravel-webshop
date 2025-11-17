<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Enums\UserRoleEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * User modell - Felhasználók kezelése
 * Ez a modell reprezentálja a rendszer felhasználóit, kiterjeszti az Authenticatable osztályt
 * a Laravel hitelesítési rendszeréhez. Tartalmazza a felhasználói adatokat és szerepköröket.
 */
class User extends Authenticatable
{
    use HasApiTokens;
    use HasFactory;
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',      // Felhasználó neve
        'email',     // E-mail cím (egyedi azonosító)
        'password',  // Hashelt jelszó
        'role'       // Szerepkör (UserRoleEnum alapján)
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',        // Jelszó elrejtése a JSON válaszokban
        'remember_token',  // Remember token elrejtése
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',        // E-mail ellenőrzés ideje datetime-ként
            'password' => 'hashed',                   // Jelszó automatikus hashelése
            'role' => UserRoleEnum::class             // Role mező cast-olása UserRoleEnum-ra
        ];
    }

    /**
     * Ellenőrzi, hogy a felhasználó admin-e
     * Visszaad true-t, ha a szerepkör ADMIN, különben false.
     *
     * @return bool
     */
    public function isAdmin()
    {
        return $this->role === UserRoleEnum::ADMIN;
    }
}
