<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ShippingMethod;

class ShippingMethodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $shippingMethods = [
            [
                'name' => 'Házhozszállítás',
                'price' => 1500,
                'estimated_days' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Postázás',
                'price' => 800,
                'estimated_days' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Express szállítás',
                'price' => 2500,
                'estimated_days' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Személyes átvétel',
                'price' => 0,
                'estimated_days' => 0,
                'is_active' => true,
            ],
        ];

        foreach ($shippingMethods as $method) {
            ShippingMethod::create($method);
        }
    }
}