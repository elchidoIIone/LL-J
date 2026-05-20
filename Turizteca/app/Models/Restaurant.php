<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Restaurant extends Model
{
    use HasFactory;

    protected $fillable = [
        'owner_id',
        'name',
        'description',
        'cuisine_type',
        'average_price',
        'location_lat',
        'location_lng',
        'opening_hours_type',
        'opens_at',
        'closes_at'
    ];

    protected $appends = ['avg_rating', 'review_count'];

    public function getAvgRatingAttribute()
    {
        $value = $this->attributes['reviews_avg_rating'] ?? null;
        return $value === null ? null : (float) $value;
    }

    public function getReviewCountAttribute()
    {
        $value = $this->attributes['reviews_count'] ?? null;
        return $value === null ? null : (int) $value;
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function managers()
    {
        return $this->belongsToMany(User::class, 'restaurant_managers');
    }

    public function sponsorships()
    {
        return $this->hasMany(Sponsorship::class);
    }

    public function sponsorship()
    {
        return $this->hasOne(Sponsorship::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
