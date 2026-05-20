<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
     * Sponsorships are created exclusively through the PayPal capture flow.
     * Direct creation without payment verification is not allowed.
     */
    public function store(Request $request)
    {
        return response()->json([
            'message' => 'Los patrocinios deben crearse a través del flujo de pago PayPal.',
            'status'  => 'error',
        ], 403);
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
        $sponsorship = Sponsorship::with('restaurant')->find($id);

        if ($sponsorship == null) {
            return response()->json([
                "message" => "Patrocinio no encontrado",
                "status" => "error"
            ], 404);
        }

        $user = Auth::user();
        $ownerId = $sponsorship->restaurant?->owner_id;
        if ($ownerId !== $user->id && $user->account_type !== 'admin') {
            return response()->json([
                "message" => "No tienes permiso para cancelar este patrocinio.",
                "status"  => "error"
            ], 403);
        }

        $sponsorship->delete();

        return response()->json([
            "message" => "Patrocinio eliminado",
            "status" => "success"
        ], 204);
    }
}