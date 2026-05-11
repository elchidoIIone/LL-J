<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Sponsorship extends Model
{
    use HasFactory;

    protected $fillable = ['restaurant_id', 'visibility_level', 'label'];

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }
}
