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

        $tiers = [
            'basic'    => 'Básico',
            'featured' => 'Destacado',
            'premium'  => 'Premium',
        ];
        $levels = array_keys($tiers);
        $recs = [];

        for ($i = 1; $i <= 8; $i++) {
            $level = $faker->randomElement($levels);

            $recs[] = [
                'id' => $i,
                'restaurant_id' => $i,
                'visibility_level' => $level,
                'label' => $tiers[$level],
            ];
        }

        DB::table('sponsorships')->insert($recs);
    }
}