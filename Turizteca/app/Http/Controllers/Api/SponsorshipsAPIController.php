<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Sponsorship;

class SponsorshipsAPIController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        
        $sponsorships = Sponsorship::with('restaurant')->get();
        return response()->json([
            "data" => $sponsorships,
            "status" => "success"
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        
        $request->validate([
            'restaurant_id' => 'required|numeric',
            'visibility_level' => 'required|string',
            'label' => 'nullable|string'
        ]);

        $sponsorship = Sponsorship::create($request->all());

        return response()->json([
            "data" => $sponsorship,
            "status" => "success"
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $sponsorship = Sponsorship::with('restaurant')->find($id);
        
        if ($sponsorship == null) {
            return response()->json([
                "message" => "Patrocinio no encontrado",
                "status" => "error"
            ], 404);
        }

        return response()->json([
            "data" => $sponsorship,
            "status" => "success"
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $sponsorship = Sponsorship::find($id);
        
        if ($sponsorship == null) {
            return response()->json([
                "message" => "Patrocinio no encontrado",
                "status" => "error"
            ], 404);
        }

        $sponsorship->update($request->all());

        return response()->json([
            "data" => $sponsorship,
            "status" => "success"
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $sponsorship = Sponsorship::find($id);
        
        if ($sponsorship == null) {
            return response()->json([
                "message" => "Patrocinio no encontrado",
                "status" => "error"
            ], 404);
        }

        $sponsorship->delete();

        return response()->json([
            "message" => "Patrocinio eliminado",
            "status" => "success"
        ], 204);
    }
}