<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Review;

class ReviewsAPIController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reviews = Review::with(['restaurant', 'user'])->get();
        return response()->json([
            "data" => $reviews,
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
            'user_id' => 'required|numeric',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string'
        ]);

        $review = Review::create($request->all());

        return response()->json([
            "data" => $review,
            "status" => "success"
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $review = Review::with(['restaurant', 'user'])->find($id);
        
        if ($review == null) {
            return response()->json([
                "message" => "Reseña no encontrada",
                "status" => "error"
            ], 404);
        }

        return response()->json([
            "data" => $review,
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
        $review = Review::find($id);
        
        if ($review == null) {
            return response()->json([
                "message" => "Reseña no encontrada",
                "status" => "error"
            ], 404);
        }

        $request->validate([
            'rating' => 'sometimes|required|integer|min:1|max:5',
        ]);

        $review->update($request->all());

        return response()->json([
            "data" => $review,
            "status" => "success"
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $review = Review::find($id);
        
        if ($review == null) {
            return response()->json([
                "message" => "Reseña no encontrada",
                "status" => "error"
            ], 404);
        }

        $review->delete();

        return response()->json([
            "message" => "Reseña eliminada",
            "status" => "success"
        ], 204);
    }
}