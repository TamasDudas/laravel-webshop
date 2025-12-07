<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->foreignId('shipping_method_id')->constrained('shipping_methods')->cascadeOnDelete();
            $table->string('status');
            $table->decimal('total_amount', 10, 0);
            $table->string('guest_email')->nullable();
            $table->string('guest_name')->nullable();
            $table->string('guest_phone')->nullable();
            $table->string('session_id')->nullable();
            $table->text('shipping_address');
            $table->text('billing_address');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
