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

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
