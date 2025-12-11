<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserInfo;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    /**
     * 🟢 Get logged-in user's profile
     */
    public function getProfile(Request $request)
    {
        $user = Auth::user();
        $profile = UserInfo::where('user_id', $user->id)->first();

        if (!$profile) {
            return response()->json([
                'success' => false,
                'message' => 'Profile not found.',
            ], 404);
        }

        if ($profile->profile_picture) {
            $profile->profile_picture = asset('storage/' . $profile->profile_picture);
        }

        return response()->json([
            'success' => true,
            'message' => 'Profile retrieved successfully.',
            'data' => $profile,
        ]);
    }

    /**
     * 🟡 Update profile details
     */
    public function updateProfile(Request $request)
    {
        $user = Auth::user();
        $profile = UserInfo::where('user_id', $user->id)->first();

        if (!$profile) {
            return response()->json([
                'success' => false,
                'message' => 'Profile not found.',
            ], 404);
        }

        if ($request->_method === 'POST' || $request->isMethod('post')) {
            $validated = $request->validate([
                'first_name' => 'nullable|string|max:50',
                'last_name'  => 'nullable|string|max:50',
                'phone'      => 'nullable|string|max:20',
                'department' => 'nullable|string|max:100',
                'role'       => 'nullable|in:professor,staff',
                'profile_picture' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            ]);

            if ($request->hasFile('profile_picture')) {
                if ($profile->profile_picture && Storage::exists('public/' . $profile->profile_picture)) {
                    Storage::delete('public/' . $profile->profile_picture);
                }

                $path = $request->file('profile_picture')->store('profile_pictures', 'public');
                $validated['profile_picture'] = $path;
            }

            $profile->update($validated);

            if ($profile->profile_picture) {
                $profile->profile_picture = asset('storage/' . $profile->profile_picture);
            }

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully.',
                'data' => $profile,
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Invalid request method.',
        ], 405);
    }

    /**
     * 🔐 Change Password API
     */
    public function changePassword(Request $request)
    {
        $user = Auth::user();

        // ✅ Validate input
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:6',
            'confirm_password' => 'required|same:new_password'
        ]);

        // ❌ Incorrect current password
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Current password is incorrect.'
            ], 400);
        }

        // ✅ Update password
        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Password changed successfully!'
        ]);
    }
}
