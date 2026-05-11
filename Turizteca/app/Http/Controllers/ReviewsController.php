<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Review;

class ReviewsController extends Controller
{
    public function index()
    {
        $reviews = Review::with(['restaurant','user'])
            ->latest('id')
            ->paginate(10);

        return view('admin.reviews', compact('reviews'));
    }

    public function destroy(Review $review)
    {
        $review->delete();

        return back()->with('success', 'Reseña eliminada.');
    }
}