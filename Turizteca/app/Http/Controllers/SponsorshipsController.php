<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Sponsorship;
use App\Models\Restaurant;
use Illuminate\Http\Request;

class SponsorshipsController extends Controller
{
    public function index()
    {
        $sponsorships = Sponsorship::with('restaurant')->latest('id')->paginate(10);
        $restaurants  = Restaurant::orderBy('name')->get(['id','name']);

        return view('admin.sponsorships', compact('sponsorships','restaurants'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'restaurant_id'   => ['required','exists:restaurants,id'],
            'visibility_level'=> ['required','in:basic,featured,premium'],
            'label'           => ['nullable','string','max:30'],
        ]);

        $defaultLabels = [
            'basic'    => 'Básico',
            'featured' => 'Destacado',
            'premium'  => 'Premium',
        ];

        if (empty($data['label'])) {
            $data['label'] = $defaultLabels[$data['visibility_level']] ?? 'Patrocinado';
        }

        Sponsorship::updateOrCreate(
            ['restaurant_id' => $data['restaurant_id']],
            [
                'visibility_level' => $data['visibility_level'],
                'label'            => $data['label'],
            ]
        );

        return back()->with('success', 'Patrocinio creado correctamente.');
    }

    public function destroy(Sponsorship $sponsorship)
    {
        $sponsorship->delete();

        return back()->with('success', 'Patrocinio eliminado.');
    }
}