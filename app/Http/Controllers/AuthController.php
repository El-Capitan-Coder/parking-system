<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserInfo;
use App\Models\Official;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AuthController extends Controller
{
    /**
     * Signup
     */
    public function signup(Request $request)
    {
        $requestData = $request->all();

        $validator = Validator::make($requestData, [
            'official_id' => 'required|string',
            'first_name'  => 'required|string|max:50',
            'last_name'   => 'required|string|max:50',
            'department'  => 'required|string|max:100',
            'role'        => 'required|in:professor,staff',
            'email'       => 'required|email',
            'password'    => [
                'required',
                'min:8',
                'regex:/^(?=.*[0-9])(?=.*[!@#$%^&*]).+$/',
            ],
        ], [
            'official_id.required' => 'ID Number is required.',
            'first_name.required'  => 'First name is required.',
            'last_name.required'   => 'Last name is required.',
            'department.required'  => 'Department is required.',
            'role.required'        => 'Role is required.',
            'email.required'       => 'Email is required.',
            'email.email'          => 'Email must be a valid email address.',
            'password.required'    => 'Password is required.',
            'password.min'         => 'Password must be at least 8 characters long.',
            'password.regex'       => 'Password must contain at least one number and one special character.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
            ], 422);
        }

        $alreadyVerified = User::where('email', $request->email)
            ->whereNotNull('email_verified_at')
            ->first();

        if ($alreadyVerified) {
            return response()->json([
                'success' => false,
                'message' => 'This email is already registered and verified. Please log in instead.',
            ], 422);
        }

        $existing = User::where('email', $request->email)
            ->whereNull('email_verified_at')
            ->first();

        if ($existing) {
            if ($existing->otp_expires_at && now()->greaterThan($existing->otp_expires_at)) {
                $existing->delete();
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'An OTP has already been sent to this email. Please check your inbox or wait for it to expire before trying again.'
                ], 422);
            }
        }

        $official = Official::where('official_id', $request->official_id)->first();
        if (!$official || $official->status !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'Your ID is not in the official list. Please contact admin.'
            ], 403);
        }

        $otp = rand(100000, 999999);
        $otpExpiresAt = now()->addMinutes(10);

        $user = User::create([
            'email'           => $request->email,
            'password'        => Hash::make($request->password),
            'otp_code'        => $otp,
            'otp_expires_at'  => $otpExpiresAt,
            'account_status'  => 'active',
            'approval_status' => 'pending',
        ]);

        UserInfo::create([
            'user_id'     => $user->id,
            'official_id' => $request->official_id,
            'first_name'  => $request->first_name,
            'last_name'   => $request->last_name,
            'department'  => $request->department,
            'role'        => $request->role,
        ]);

        try {
            Mail::send('emails.otp', ['otp' => $otp], function ($msg) use ($user) {
                $msg->to($user->email)->subject("Email Verification Code");
            });
        } catch (\Exception $e) {
            $user->delete();
            return response()->json([
                'success' => false,
                'message' => 'Failed to send OTP email. Please try again later.',
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Account created. Please verify your email with the OTP sent.',
            'email'   => $user->email,
            'dev_otp' => app()->environment('local') ? $otp : null,
        ]);
    }

    /**
     * Verify OTP
     */
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp'   => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || $user->otp_code !== $request->otp || now()->greaterThan($user->otp_expires_at)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired OTP.',
            ], 400);
        }

        $user->update([
            'email_verified_at' => now(),
            'otp_code'          => null,
            'otp_expires_at'    => null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Email verified successfully.',
        ]);
    }

    /**
     * Resend OTP
     */
    public function resendOtp(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found.',
            ], 404);
        }

        if ($user->email_verified_at) {
            return response()->json([
                'success' => false,
                'message' => 'Email is already verified.',
            ], 400);
        }

        $otp = rand(100000, 999999);
        $user->update([
            'otp_code'       => $otp,
            'otp_expires_at' => now()->addMinutes(5),
        ]);

        Mail::send('emails.otp', ['otp' => $otp], function ($msg) use ($user) {
            $msg->to($user->email)->subject("Email Verification Code");
        });

        return response()->json([
            'success' => true,
            'message' => 'A new OTP has been sent to your email.',
            'dev_otp' => app()->environment('local') ? $otp : null,
        ]);
    }

    /**
     * Login
     */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials.',
            ], 401);
        }

        if (!$user->email_verified_at) {
            return response()->json([
                'success' => false,
                'message' => 'Please verify your email before logging in.',
            ], 403);
        }

        if ($user->account_status !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'Your account is not active. Contact admin.',
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful.',
            'token'   => $token,
            'user'    => $user,
        ]);
    }

    /**
     * Forgot Password
     */
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        // ✅ Check if user exists first
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'No user found with that email address.',
            ], 404);
        }

        // ✅ Check verification and account status
        if (!$user->email_verified_at || $user->account_status !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'Password reset not allowed. Please verify your account or contact admin.',
            ], 403);
        }

        // ✅ If a valid reset token already exists, reuse it
        if ($user->password_reset_token && $user->password_reset_expires_at > now()) {
            $resetToken = $user->password_reset_token;
            $minutesLeft = now()->diffInMinutes($user->password_reset_expires_at);
            $message = "A reset link was already sent. Please check your email. The link will expire in {$minutesLeft} minute(s).";
        } else {
            // ✅ Generate a new reset token
            $resetToken = Str::random(64);
            $user->update([
                'password_reset_token'      => $resetToken,
                'password_reset_expires_at' => now()->addMinutes(30),
            ]);
            $message = 'Password reset link sent to your email.';
        }

        // ✅ Generate password reset URL
        $resetUrl = URL::to('/') . '/reset-password/' . $resetToken;

        // ✅ Send reset email
        Mail::send('emails.reset-password', ['resetUrl' => $resetUrl], function ($msg) use ($user) {
            $msg->to($user->email)->subject("Password Reset Request");
        });

        return response()->json([
            'success' => true,
            'message' => $message,
        ]);
    }

    /**
     * Reset Password
     */
    public function resetPassword(Request $request, $token)
    {
        $requestData = $request->all();

        $validator = Validator::make($requestData, [
            'password' => [
                'required',
                'min:8',
                'confirmed',
                'regex:/^(?=.*[0-9])(?=.*[!@#$%^&*]).+$/',
            ],
        ], [
            'password.required'  => 'Password is required.',
            'password.min'       => 'Password must be at least 8 characters long.',
            'password.confirmed' => 'Password confirmation does not match.',
            'password.regex'     => 'Password must contain at least one number and one special character.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
            ], 422);
        }

        $user = User::where('password_reset_token', $token)
                    ->where('password_reset_expires_at', '>', now())
                    ->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired reset token.',
            ], 400);
        }

        // Check if the new password is the same as the current one
        if (Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'New password cannot be the same as the previous password.',
            ], 422);
        }

        // Update the password
        $user->update([
            'password'                  => Hash::make($request->password),
            'password_reset_token'      => null,
            'password_reset_expires_at' => null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Password has been reset successfully.',
        ]);
    }
}
