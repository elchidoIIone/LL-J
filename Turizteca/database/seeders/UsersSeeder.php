<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class UsersSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();
        $users = [];
        $budgets = ['low', 'medium', 'high'];

        // Admin fijo
        $users[] = [
            'id' => 1,
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'account_type' => 'admin',
            'preferred_budget' => null
        ];

        // Owners (IDs 2–5)
        for ($i = 2; $i <= 5; $i++) {
            $users[] = [
                'id' => $i,
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'password' => Hash::make('password'),
                'account_type' => 'owner',
                'preferred_budget' => $faker->randomElement($budgets)
            ];
        }

        // Customers (IDs 6–25)
        for ($i = 6; $i <= 25; $i++) {
            $users[] = [
                'id' => $i,
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'password' => Hash::make('password'),
                'account_type' => 'customer',
                'preferred_budget' => $faker->randomElement($budgets)
            ];
        }

        DB::table('users')->insert($users);
    }
}