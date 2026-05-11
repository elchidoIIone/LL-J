<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UserCuisine;

class UserCuisinesAPIController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userCuisines = UserCuisine::with('user')
            ->orderBy('id', 'DESC')
            ->get();

        return response()->json([
            'data' => $userCuisines,
            'status' => 'success'
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'cuisine' => 'required|in:mexican,seafood,italian,bbq,steakhouse,vegan,vegetarian,asian,japanese,chinese,thai,indian,mediterranean,fast_food,cafe,bakery,tacos,pizza,burgers,bar,fusion,local'
        ]);

        // Prevent duplicate cuisines per user (extra safety)
        $exists = UserCuisine::where('user_id', $validated['user_id'])
            ->where('cuisine', $validated['cuisine'])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Cuisine already assigned to this user',
                'status' => 'error'
            ], 422);
        }

        $userCuisine = UserCuisine::create($validated);

        return response()->json([
            'data' => $userCuisine,
            'status' => 'success'
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $userCuisine = UserCuisine::with('user')->find($id);

        if ($userCuisine === null) {
            return response()->json([
                'message' => 'User cuisine not found',
                'status' => 'error'
            ], 404);
        }

        return response()->json([
            'data' => $userCuisine,
            'status' => 'success'
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $userCuisine = UserCuisine::find($id);

        if ($userCuisine === null) {
            return response()->json([
                'message' => 'User cuisine not found',
                'status' => 'error'
            ], 404);
        }

        $validated = $request->validate([
            'cuisine' => 'required|in:mexican,seafood,italian,bbq,steakhouse,vegan,vegetarian,asian,japanese,chinese,thai,indian,mediterranean,fast_food,cafe,bakery,tacos,pizza,burgers,bar,fusion,local'
        ]);

        // Ensure unique (user_id, cuisine)
        $exists = UserCuisine::where('user_id', $userCuisine->user_id)
            ->where('cuisine', $validated['cuisine'])
            ->where('id', '!=', $id)
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Cuisine already assigned to this user',
                'status' => 'error'
            ], 422);
        }

        $userCuisine->update($validated);

        return response()->json([
            'data' => $userCuisine,
            'status' => 'success'
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $userCuisine = UserCuisine::find($id);

        if ($userCuisine === null) {
            return response()->json([
                'message' => 'User cuisine not found',
                'status' => 'error'
            ], 404);
        }

        $userCuisine->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'User cuisine deleted successfully'
        ], 204);
    }
}