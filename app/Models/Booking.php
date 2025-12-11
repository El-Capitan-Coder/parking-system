<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'user_id', 'vehicle_id', 'slot_id', 'date', 'time_in', 'time_out', 'status'
    ];

    public function slot()
    {
        return $this->belongsTo(\App\Models\ParkingSlot::class, 'slot_id');
    }

    public function vehicle()
    {
        return $this->belongsTo(\App\Models\Vehicle::class, 'vehicle_id');
    }

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class, 'user_id');
    }
}
