<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'vehicle_type',
        'plate_number',
        'color',
        'model',
    ];

    // Optional: link vehicle to user
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
