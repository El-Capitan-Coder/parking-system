<?php
namespace App\Http\Controllers;

use App\Models\ParkingSlot;
use App\Models\Booking;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ParkingSlotController extends Controller
{
    // Get all slots with occupied status for today
    public function index()
    {
        $today = Carbon::today();

        $slots = ParkingSlot::all()->map(function ($slot) use ($today) {
            $occupied = Booking::where('slot_id', $slot->id)
                               ->where('date', $today)
                               ->exists();
            return [
                'id' => $slot->id,
                'slot_number' => $slot->slot_number,
                'description' => $slot->description,
                'occupied' => $occupied
            ];
        });

        return response()->json($slots);
    }

    // Add new slot
    public function store(Request $request)
    {
        $request->validate([
            'slot_number' => 'required|string|unique:parking_slots,slot_number',
            'description' => 'nullable|string',
        ]);

        $slot = ParkingSlot::create([
            'slot_number' => $request->slot_number,
            'description' => $request->description,
        ]);

        return response()->json(['message' => 'Slot added successfully', 'slot' => $slot], 201);
    }

    // Update slot
    public function update(Request $request, $id)
    {
        $slot = ParkingSlot::findOrFail($id);

        $request->validate([
            'slot_number' => 'required|string|unique:parking_slots,slot_number,' . $slot->id,
            'description' => 'nullable|string',
        ]);

        $slot->update([
            'slot_number' => $request->slot_number,
            'description' => $request->description,
        ]);

        return response()->json(['message' => 'Slot updated successfully', 'slot' => $slot]);
    }

    // Delete slot
    public function destroy($id)
    {
        $slot = ParkingSlot::findOrFail($id);

        // Optional: prevent deleting if slot is occupied today
        $today = Carbon::today();
        $occupied = Booking::where('slot_id', $slot->id)->where('date', $today)->exists();
        if ($occupied) {
            return response()->json(['message' => 'Cannot delete occupied slot'], 400);
        }

        $slot->delete();
        return response()->json(['message' => 'Slot deleted successfully']);
    }
}
