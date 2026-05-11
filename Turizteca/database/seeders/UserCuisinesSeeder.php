<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class UserCuisinesSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        $cuisines = [
            'mexican','seafood','italian','bbq','steakhouse','vegan','vegetarian',
            'asian','japanese','chinese','thai','indian','mediterranean','fast_food',
            'cafe','bakery','tacos','pizza','burgers','bar','fusion','local'
        ];

        $recs = [];
        $id = 1;

        for ($u = 6; $u <= 25; $u++) {

            // Selecciona 2 cocinas SIN repetir (garantizado)
            $twoUnique = $faker->randomElements($cuisines, 2);

            foreach ($twoUnique as $cuisine) {
                $recs[] = [
                    'id' => $id,
                    'user_id' => $u,
                    'cuisine' => $cuisine
                ];
                $id++;
            }
        }

        DB::table('user_cuisines')->insert($recs);
    }
}