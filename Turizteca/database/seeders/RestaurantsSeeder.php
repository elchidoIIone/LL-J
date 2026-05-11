<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class RestaurantsSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        $cuisineTypes = ['mexican', 'seafood', 'italian', 'bbq', 'steakhouse', 'vegan', 'vegetarian', 'asian', 'japanese', 'chinese', 'thai', 'indian', 'mediterranean', 'fast_food', 'cafe', 'bakery', 'tacos', 'pizza', 'burgers', 'bar', 'fusion', 'local'];
        $openingHoursTypes = ['all_day', 'breakfast_lunch', 'lunch_dinner', 'dinner_only', 'weekdays_only', 'weekends_only', 'custom'];

        $restaurants = [];

        for ($i = 0; $i < 20; $i++) {
            $restaurants[] = [
                'owner_id'           => $faker->numberBetween(2, 5),
                'name'               => $faker->company,
                'description'        => $faker->sentence(10),
                'cuisine_type'       => $faker->randomElement($cuisineTypes),
                'average_price'      => $faker->numberBetween(50, 500),
                'location_lat'       => $faker->latitude(14.0, 33.0),
                'location_lng'       => $faker->longitude(-117.0, -87.0),
                'opening_hours_type' => $faker->randomElement($openingHoursTypes),
                'opens_at'           => '08:00',
                'closes_at'          => '22:00',
                'created_at'         => now(),
                'updated_at'         => now(),
            ];
        }

        DB::table('restaurants')->insert($restaurants);
    }
}
