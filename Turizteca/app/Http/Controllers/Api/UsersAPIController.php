<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UsersAPIController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::orderBy('id', 'DESC')->get();

        return response()->json([
            'data' => $users,
            'status' => 'success'
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:3|max:120',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:4',
            'account_type' => 'required|in:customer,owner,admin',
            'preferred_budget' => 'nullable|in:low,medium,high'
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'account_type' => $validated['account_type'],
            'preferred_budget' => $validated['preferred_budget'] ?? null,
        ]);

        return response()->json([
            'data' => $user,
            'status' => 'success'
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::find($id);

        if ($user === null) {
            return response()->json([
                'message' => 'User not found',
                'status' => 'error'
            ], 404);
        }

        return response()->json([
            'data' => $user,
            'status' => 'success'
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::find($id);

        if ($user === null) {
            return response()->json([
                'message' => 'User not found',
                'status' => 'error'
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|min:3|max:120',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'password' => 'sometimes|min:4',
            'account_type' => 'sometimes|in:customer,owner,admin',
            'preferred_budget' => 'nullable|in:low,medium,high'
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'data' => $user,
            'status' => 'success'
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::find($id);

        if ($user === null) {
            return response()->json([
                'message' => 'User not found',
                'status' => 'error'
            ], 404);
        }

        $user->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'User deleted successfully'
        ], 204);
    }
}