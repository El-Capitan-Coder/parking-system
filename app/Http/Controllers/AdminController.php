<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Booking;
use App\Models\ParkingSlot;

class AdminController extends Controller
{
    public function dashboard(Request $request)
    {
        try {
            $totalUsers = User::count();
            $totalBookings = Booking::count();
            $totalSlots = ParkingSlot::count();

            // Calculate occupied slots dynamically
            $occupiedSlots = Booking::whereDate('date', '<=', now())
                ->whereTime('time_out', '>=', now()->format('H:i:s'))
                ->count();

            $availableSlots = $totalSlots - $occupiedSlots;

            $recentBookings = Booking::with(['user', 'vehicle', 'slot'])
                ->orderBy('created_at', 'desc')
                ->take(10)
                ->get()
                ->map(function ($b) {
                    return [
                        'user' => $b->user ? $b->user->first_name . ' ' . $b->user->last_name : 'N/A',
                        'plateNumber' => $b->vehicle->plate_number ?? 'N/A',
                        'slot' => $b->slot->slot_number ?? 'N/A',
                        'status' => strtotime($b->date . ' ' . $b->time_out) < time() ? 'Completed' : 'Upcoming',
                        'date' => $b->created_at->toDateString(),
                    ];
                });

            return response()->json([
                'stats' => [
                    'totalUsers' => $totalUsers,
                    'totalBookings' => $totalBookings,
                    'availableSlots' => $availableSlots,
                    'occupiedSlots' => $occupiedSlots,
                ],
                'recentBookings' => $recentBookings
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to load dashboard',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // ===== Manage Users =====
    public function getUsers()
    {
        try {
            $users = User::all(); // Fetch all users
            return response()->json($users);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch users',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateUser(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            $request->validate([
                'first_name' => 'required|string|max:255',
                'last_name'  => 'required|string|max:255',
                'email'      => 'required|email|unique:users,email,' . $id,
            ]);

            $user->update($request->only(['first_name', 'last_name', 'email']));

            return response()->json($user);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function deleteUser($id)
    {
        try {
            $user = User::findOrFail($id);
            $user->delete();

            return response()->json(['message' => 'User deleted successfully']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete user',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
