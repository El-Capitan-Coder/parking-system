<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\ParkingSlot;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use App\Mail\BookingConfirmation;

class BookingController extends Controller
{
    // Fetch all slots with occupancy status
    public function getSlots()
    {
        $today = Carbon::today();
        $slots = ParkingSlot::all();

        $slotsWithStatus = $slots->map(function($slot) use ($today) {
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

    // Book a parking slot
    public function store(Request $request)
    {
        $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'slot_id' => 'required|exists:parking_slots,id',
            'date' => 'required|date',
            'time_in' => 'required',
            'time_out' => 'required',
        ]);

        $user = $request->user();

        // Prevent double booking
        $exists = Booking::where('slot_id', $request->slot_id)
            ->where('date', $request->date)
            ->where(function($q) use ($request) {
                $q->whereBetween('time_in', [$request->time_in, $request->time_out])
                  ->orWhereBetween('time_out', [$request->time_in, $request->time_out]);
            })->exists();

        if ($exists) {
            return response()->json(['error' => 'Slot already booked for this time.'], 400);
        }

        // Create booking
        $booking = Booking::create([
            'user_id' => $user->id,
            'vehicle_id' => $request->vehicle_id,
            'slot_id' => $request->slot_id,
            'date' => $request->date,
            'time_in' => $request->time_in,
            'time_out' => $request->time_out,
            'status' => 'Pending',
        ]);

        // Eager load relations
        $booking->load(['user', 'vehicle', 'slot']);

        // --------------------------
        // Send confirmation email to booking user
        // --------------------------
        try {
            Mail::to($booking->user->email)->queue(new BookingConfirmation($booking));
        } catch (\Exception $e) {
            \Log::error("Failed to send booking confirmation email: " . $e->getMessage());
        }

        return response()->json([
            'message' => 'Booking created successfully. A confirmation email has been sent.',
            'booking' => $booking,
        ]);
    }

    // Manual send booking email
    public function sendBookingEmail(Request $request)
    {
        $request->validate([
            'booking_id' => 'required|exists:bookings,id',
        ]);

        $booking = Booking::with(['user', 'vehicle', 'slot'])->findOrFail($request->booking_id);

        try {
            Mail::to($booking->user->email)->queue(new BookingConfirmation($booking));

            return response()->json([
                'message' => 'Booking email sent successfully.'
            ]);
        } catch (\Exception $e) {
            \Log::error("Failed to send booking email: " . $e->getMessage());
            return response()->json([
                'error' => 'Failed to send booking email.'
            ], 500);
        }
    }

    // Booking history for logged-in user
    public function history(Request $request)
    {
        $user = $request->user();

        $bookings = Booking::with(['slot', 'vehicle'])
            ->where('user_id', $user->id)
            ->orderBy('date', 'desc')
            ->orderBy('time_in', 'desc')
            ->get();

        $history = $bookings->map(function($b) {
            return [
                'id' => $b->id,
                'slot_number' => $b->slot->slot_number,
                'vehicle' => $b->vehicle->plate_number . " (" . $b->vehicle->vehicle_type . ")",
                'date' => $b->date,
                'time_in' => $b->time_in,
                'time_out' => $b->time_out,
                'status' => strtotime($b->date . ' ' . $b->time_out) < time() ? 'Completed' : 'Upcoming',
            ];
        });

        return response()->json($history);
    }

    // Admin: Get all bookings
    public function getAllBookings()
    {
        $bookings = Booking::with(['user', 'vehicle', 'slot'])
            ->orderBy('date', 'desc')
            ->orderBy('time_in', 'desc')
            ->get();

        return response()->json($bookings);
    }

    // Admin: Update booking
    public function update(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);

        $request->validate([
            'vehicle_id' => 'sometimes|exists:vehicles,id',
            'slot_id' => 'sometimes|exists:parking_slots,id',
            'date' => 'sometimes|date',
            'time_in' => 'sometimes',
            'time_out' => 'sometimes',
            'status' => 'sometimes|in:Pending,Completed,Cancelled',
        ]);

        $booking->update($request->only(['vehicle_id', 'slot_id', 'date', 'time_in', 'time_out', 'status']));

        return response()->json([
            'message' => 'Booking updated successfully',
            'booking' => $booking,
        ]);
    }

    // Admin: Delete booking
    public function destroy($id)
    {
        $booking = Booking::findOrFail($id);
        $booking->delete();

        return response()->json([
            'message' => 'Booking deleted successfully',
        ]);
    }
}
