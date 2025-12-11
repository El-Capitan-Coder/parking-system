<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ParkingSlot extends Model
{
    protected $fillable = ['slot_number', 'description'];

    public function bookings()
    {
        return $this->hasMany(Booking::class, 'slot_id');
    }

    public function isOccupied($date)
    {
        return $this->bookings()->where('date', $date)->exists();
    }
}

