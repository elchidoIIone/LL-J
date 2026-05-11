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
            'visibility_level'=> ['required','in:low,medium,high'],
            'label'           => ['nullable','string','max:30'],
        ]);

        if (empty($data['label'])) {
            $data['label'] = 'Patrocinado';
        }

        Sponsorship::create($data);

        return back()->with('success', 'Patrocinio creado correctamente.');
    }

    public function destroy(Sponsorship $sponsorship)
    {
        $sponsorship->delete();

        return back()->with('success', 'Patrocinio eliminado.');
    }
}