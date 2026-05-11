<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class SponsorshipsSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        $visibility = ['low','medium','high'];
        $recs = [];

        for ($i = 1; $i <= 8; $i++) {

            $recs[] = [
                'id' => $i,
                'restaurant_id' => $i,
                'visibility_level' => $faker->randomElement($visibility),
                'label' => 'Patrocinado'
            ];
        }

        DB::table('sponsorships')->insert($recs);
    }
}