<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class RestaurantsController extends Controller
{
    public function index(Request $request)
    {
        $restaurants = Restaurant::with(['owner', 'sponsorships'])
            ->withAvg('reviews', 'rating') // promedio rating (rating es enum string, MySQL lo promedia bien)
            ->latest('id')
            ->paginate(10);

        $owners = User::where('account_type', 'owner')
            ->orderBy('name')
            ->get(['id', 'name']);

        return view('admin.restaurants', compact('restaurants', 'owners'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'owner_id'           => ['required', 'exists:users,id'],
            'name'               => ['required', 'string', 'max:120'],
            'description'        => ['nullable', 'string'],
            'cuisine_type'       => ['required', Rule::in([
                'mexican','seafood','italian','bbq','steakhouse','vegan','vegetarian','asian',
                'japanese','chinese','thai','indian','mediterranean','fast_food','cafe','bakery',
                'tacos','pizza','burgers','bar','fusion','local'
            ])],
            'average_price'      => ['nullable', 'integer', 'min:0'],
            'location_lat'       => ['required', 'numeric', 'between:-90,90'],
            'location_lng'       => ['required', 'numeric', 'between:-180,180'],
            'opening_hours_type' => ['required', Rule::in([
                'all_day','breakfast_lunch','lunch_dinner','dinner_only',
                'weekdays_only','weekends_only','custom'
            ])],
            'opens_at'           => ['nullable', 'date_format:H:i'],
            'closes_at'          => ['nullable', 'date_format:H:i'],
        ]);

        Restaurant::create($data);

        return back()->with('success', 'Restaurante creado correctamente.');
    }

    public function update(Request $request, Restaurant $restaurant)
    {
        $data = $request->validate([
            'owner_id'           => ['required', 'exists:users,id'],
            'name'               => ['required', 'string', 'max:120'],
            'description'        => ['nullable', 'string'],
            'cuisine_type'       => ['required', Rule::in([
                'mexican','seafood','italian','bbq','steakhouse','vegan','vegetarian','asian',
                'japanese','chinese','thai','indian','mediterranean','fast_food','cafe','bakery',
                'tacos','pizza','burgers','bar','fusion','local'
            ])],
            'average_price'      => ['nullable', 'integer', 'min:0'],
            'location_lat'       => ['required', 'numeric', 'between:-90,90'],
            'location_lng'       => ['required', 'numeric', 'between:-180,180'],
            'opening_hours_type' => ['required', Rule::in([
                'all_day','breakfast_lunch','lunch_dinner','dinner_only',
                'weekdays_only','weekends_only','custom'
            ])],
            'opens_at'           => ['nullable', 'date_format:H:i'],
            'closes_at'          => ['nullable', 'date_format:H:i'],
        ]);

        $restaurant->update($data);

        return back()->with('success', 'Restaurante actualizado.');
    }

    public function destroy(Restaurant $restaurant)
    {
        $restaurant->delete();

        return back()->with('success', 'Restaurante eliminado.');
    }
}
