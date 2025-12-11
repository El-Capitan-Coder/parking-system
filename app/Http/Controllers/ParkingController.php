<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\ParkingSlot;
use App\Models\Vehicle;
use Carbon\Carbon;

class ParkingController extends Controller
{
    /**
     * Get all parking slots with availability status
     */
    public function getAvailableSlots(Request $request)
    {
        $today = Carbon::today();
        $slots = ParkingSlot::all();

        $slotsWithStatus = $slots->map(function ($slot) use ($today) {
            $occupied = Booking::where('slot_id', $slot->id)
                ->where('date', '>=', $today)
                ->exists();

            return [
                'id' => $slot->id,
                'slot_number' => $slot->slot_number,
                'description' => $slot->description,
                'occupied' => $occupied
            ];
        });

        return response()->json($slotsWithStatus);
    }

    /**
     * Book a parking slot
     */
    public function bookSlot(Request $request)
    {
        $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'slot_id' => 'required|exists:parking_slots,id',
            'date' => 'required|date',
            'time_in' => 'required',
            'time_out' => 'required',
        ]);

        $user = $request->user();

        // Prevent double booking for the same slot & time
        $exists = Booking::where('slot_id', $request->slot_id)
            ->where('date', $request->date)
            ->where(function ($q) use ($request) {
                $q->whereBetween('time_in', [$request->time_in, $request->time_out])
                  ->orWhereBetween('time_out', [$request->time_in, $request->time_out]);
            })->exists();

        if ($exists) {
            return response()->json(['error' => 'Slot already booked for this time.'], 400);
        }

        $booking = Booking::create([
            'user_id' => $user->id,
            'vehicle_id' => $request->vehicle_id,
            'slot_id' => $request->slot_id,
            'date' => $request->date,
            'time_in' => $request->time_in,
            'time_out' => $request->time_out,
            'status' => 'Upcoming', // Optional: default status
        ]);

        return response()->json($booking);
    }

    /**
     * Get the authenticated user's booking history
     */
    public function getBookingHistory(Request $request)
    {
        $user = $request->user();

        // Ensure Booking model has slot() and vehicle() relationships
        $bookings = Booking::with(['slot', 'vehicle'])
            ->where('user_id', $user->id)
            ->orderBy('date', 'desc')
            ->get();

        // Format response for frontend
        $history = $bookings->map(function ($b) {
            return [
                'id' => $b->id,
                'slot_number' => $b->slot->slot_number ?? 'N/A',
                'vehicle' => $b->vehicle->plate_number ?? 'N/A',
                'date' => $b->date,
                'time_in' => $b->time_in,
                'time_out' => $b->time_out,
                'status' => $b->status ?? ($b->date < now() ? 'Completed' : 'Upcoming'),
            ];
        });

        return response()->json($history);
    }
}
