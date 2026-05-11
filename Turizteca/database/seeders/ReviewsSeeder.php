<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class ReviewsSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();
        $reviews = [];

        for ($i = 1; $i <= 40; $i++) {

            $reviews[] = [
                'id' => $i,
                'restaurant_id' => $faker->numberBetween(1,15),
                'user_id' => $faker->numberBetween(6,25),
                'rating' => strval($faker->numberBetween(1,5)),
                'comment' => $faker->sentence(12)
            ];
        }

        DB::table('reviews')->insert($reviews);
    }
}