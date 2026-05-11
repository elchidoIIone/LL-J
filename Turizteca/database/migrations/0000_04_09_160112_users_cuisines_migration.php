<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_cuisines', function(Blueprint $table){
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->enum('cuisine',[ 'mexican','seafood','italian','bbq','steakhouse','vegan','vegetarian','asian','japanese','chinese','thai','indian','mediterranean','fast_food','cafe','bakery','tacos','pizza','burgers','bar','fusion','local']);
            $table->timestamps();
            $table->unique(['user_id','cuisine']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_cuisines');
    }
};