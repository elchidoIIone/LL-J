<?php

namespace App\Http\Controllers;

use App\Models\Restaurant;
use App\Models\Review;
use App\Models\Sponsorship;
use App\Models\User;

class OverviewController extends Controller
{
    public function index()
    {
        // KPIs
        $totalRestaurants   = Restaurant::count();
        $activeSponsorships = Sponsorship::count();
        $averageRating      = Review::avg('rating');
        $registeredUsers    = User::count();

        // Distribución por tipo de cocina (doughnut)
        $cuisineDistribution = Restaurant::selectRaw('cuisine_type, COUNT(*) as total')
            ->groupBy('cuisine_type')
            ->orderBy('total', 'desc')
            ->get();

        // Datos mínimos para el mapa
        $restaurantsForMap = Restaurant::select(
                'name',
                'cuisine_type',
                'average_price',
                'location_lat',
                'location_lng'
            )
            ->whereNotNull('location_lat')
            ->whereNotNull('location_lng')
            ->get();

        // Composición de patrocinios por nivel (sin fechas)
        // Acepta 1/2/3 y 'low'/'medium'/'high'
        $levelMap = [
            '1' => 1, '2' => 2, '3' => 3,
            'low' => 1, 'medium' => 2, 'high' => 3,
        ];

        $levelCounts = [1 => 0, 2 => 0, 3 => 0];

        foreach (Sponsorship::select('visibility_level')->get() as $row) {
            $key = strtolower((string) $row->visibility_level);
            $bucket = $levelMap[$key] ?? null;
            if ($bucket) {
                $levelCounts[$bucket]++;
            }
        }

        return view('admin.overview', [
            'totalRestaurants'    => $totalRestaurants,
            'activeSponsorships'  => $activeSponsorships,
            'averageRating'       => $averageRating,
            'registeredUsers'     => $registeredUsers,

            // charts + map
            'cuisineDistribution' => $cuisineDistribution,
            'restaurantsForMap'   => $restaurantsForMap,
            'sponsorshipLevels'   => $levelCounts,  // {1: N, 2: N, 3: N}
        ]);
    }
}