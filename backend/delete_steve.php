<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Product;

// Véglegesen töröljük a soft-deleted "steve" termékeket
$deletedProducts = Product::onlyTrashed()->where('slug', 'like', 'steve%')->get();

echo "Found " . $deletedProducts->count() . " deleted products with 'steve' slug\n";

foreach ($deletedProducts as $product) {
    echo "Force deleting: ID={$product->id}, Name={$product->name}, Slug={$product->slug}\n";
    $product->forceDelete();
}

echo "Done!\n";
