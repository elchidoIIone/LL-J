<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sponsorships', function (Blueprint $table) {
            // Fix: original enum used 'low/medium/high' but app uses 'basic/featured/premium'
            $table->string('visibility_level', 30)->change();
            $table->string('paypal_order_id', 100)->nullable()->after('label');
            $table->unique('paypal_order_id', 'sponsorships_paypal_order_id_unique');
            $table->unique('restaurant_id', 'sponsorships_restaurant_id_unique');
        });
    }

    public function down(): void
    {
        Schema::table('sponsorships', function (Blueprint $table) {
            $table->dropUnique('sponsorships_restaurant_id_unique');
            $table->dropUnique('sponsorships_paypal_order_id_unique');
            $table->dropColumn('paypal_order_id');
            $table->enum('visibility_level', ['low', 'medium', 'high'])->change();
        });
    }
};
