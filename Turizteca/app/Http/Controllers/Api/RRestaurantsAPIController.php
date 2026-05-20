<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Restaurant;

class RRestaurantsAPIController extends Controller
{
    private function authorizeOwnership(Restaurant $restaurant): void
    {
        $user = Auth::user();
        if (!$user) {
            abort(401, 'No autenticado.');
        }
        if ($user->account_type === 'admin') {
            return;
        }
        if ($restaurant->owner_id !== $user->id) {
            abort(403, 'No tienes permiso para modificar este restaurante.');
        }
    }

    public function index()
    {
        $restaurants = Restaurant::with(['owner', 'sponsorship'])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->get();
        return response()->json([
            "data" => $restaurants,
            "status" => "success"
        ]);
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        if (!in_array($user->account_type, ['owner', 'admin'], true)) {
            return response()->json([
                "message" => "Solo los dueños pueden registrar un restaurante.",
                "status"  => "error"
            ], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'cuisine_type' => 'nullable|string',
            'average_price' => 'nullable|numeric',
            'location_lat' => 'nullable|numeric',
            'location_lng' => 'nullable|numeric',
            'opening_hours_type' => 'nullable|string',
            'opens_at' => 'nullable|string',
            'closes_at' => 'nullable|string'
        ]);

        $validated['owner_id'] = $user->id;

        $restaurant = Restaurant::create($validated);

        return response()->json([
            "data" => $restaurant,
            "status" => "success"
        ], 201);
    }

    public function show(string $id)
    {
        $restaurant = Restaurant::with(['owner', 'sponsorship'])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->find($id);

        if ($restaurant == null) {
            return response()->json([
                "message" => "Restaurante no encontrado",
                "status" => "error"
            ], 404);
        }

        return response()->json([
            "data" => $restaurant,
            "status" => "success"
        ]);
    }

    public function edit(string $id)
    {
        //
    }

    public function update(Request $request, string $id)
    {
        $restaurant = Restaurant::find($id);

        if ($restaurant == null) {
            return response()->json([
                "message" => "Restaurante no encontrado",
                "status" => "error"
            ], 404);
        }

        $this->authorizeOwnership($restaurant);

        $validated = $request->validate([
            'name' => 'sometimes|required|string',
            'description' => 'nullable|string',
            'cuisine_type' => 'nullable|string',
            'average_price' => 'nullable|numeric',
            'location_lat' => 'nullable|numeric',
            'location_lng' => 'nullable|numeric',
            'opening_hours_type' => 'nullable|string',
            'opens_at' => 'nullable|string',
            'closes_at' => 'nullable|string'
        ]);

        $restaurant->update($validated);

        return response()->json([
            "data" => $restaurant,
            "status" => "success"
        ]);
    }

    public function destroy(string $id)
    {
        $restaurant = Restaurant::find($id);

        if ($restaurant == null) {
            return response()->json([
                "message" => "Restaurante no encontrado",
                "status" => "error"
            ], 404);
        }

        $this->authorizeOwnership($restaurant);

        $restaurant->delete();

        return response()->json([
            "message" => "Restaurante eliminado",
            "status" => "success"
        ], 204);
    }
}
