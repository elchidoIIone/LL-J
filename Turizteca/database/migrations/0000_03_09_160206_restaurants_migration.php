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
        Schema::create('restaurants', function(Blueprint $table){
            $table->id();
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
            $table->string('name',120);
            $table->text('description')->nullable();
            $table->enum('cuisine_type',[ 'mexican','seafood','italian','bbq','steakhouse','vegan','vegetarian','asian','japanese','chinese','thai','indian','mediterranean','fast_food','cafe','bakery','tacos','pizza','burgers','bar','fusion','local']);
            $table->integer('average_price')->nullable();
            $table->decimal('location_lat',9,6);
            $table->decimal('location_lng',9,6);
            $table->enum('opening_hours_type',['all_day','breakfast_lunch','lunch_dinner','dinner_only','weekdays_only','weekends_only','custom'])->default('all_day');
            $table->time('opens_at')->nullable();
            $table->time('closes_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('restaurants');
    }
};