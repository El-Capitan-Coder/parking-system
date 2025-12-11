<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Vehicle;

class VehicleController extends Controller
{
    // Fetch all vehicles of logged-in user
    public function getUserVehicles(Request $request)
    {
        $user = $request->user();

        $vehicles = Vehicle::where('user_id', $user->id)
            ->get(['id', 'plate_number', 'vehicle_type', 'color', 'model']);

        return response()->json($vehicles);
    }

    // Register new vehicle
    public function registerVehicle(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'vehicle_type' => 'required|string|max:50',
            'plate_number' => 'required|string|max:50',
            'color' => 'required|string|max:50',
            'model' => 'required|string|max:50',
        ]);

        $vehicle = Vehicle::create([
            'user_id' => $user->id,
            'vehicle_type' => $request->vehicle_type,
            'plate_number' => $request->plate_number,
            'color' => $request->color,
            'model' => $request->model,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Vehicle registered successfully',
            'vehicle' => $vehicle
        ]);
    }

    // Update existing vehicle
    public function updateVehicle(Request $request, $id)
    {
        $user = $request->user();
        $vehicle = Vehicle::where('id', $id)->where('user_id', $user->id)->first();

        if (!$vehicle) {
            return response()->json(['status' => 'error', 'message' => 'Vehicle not found'], 404);
        }

        $request->validate([
            'vehicle_type' => 'sometimes|required|string|max:50',
            'plate_number' => 'sometimes|required|string|max:50',
            'color' => 'sometimes|required|string|max:50',
            'model' => 'sometimes|required|string|max:50',
        ]);

        $vehicle->update($request->only(['vehicle_type', 'plate_number', 'color', 'model']));

        return response()->json([
            'status' => 'success',
            'message' => 'Vehicle updated successfully',
            'vehicle' => $vehicle
        ]);
    }

    // Delete a vehicle
    public function deleteVehicle(Request $request, $id)
    {
        $user = $request->user();
        $vehicle = Vehicle::where('id', $id)->where('user_id', $user->id)->first();

        if (!$vehicle) {
            return response()->json(['status' => 'error', 'message' => 'Vehicle not found'], 404);
        }

        $vehicle->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Vehicle deleted successfully'
        ]);
    }
}
