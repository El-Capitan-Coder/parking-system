<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens; // ✅ add this line
use Illuminate\Notifications\Notifiable; // optional but recommended if you send emails

class User extends Authenticatable
{
    use HasApiTokens, Notifiable; // ✅ include the trait here

    protected $fillable = [
        'email',
        'password',
        'otp_code',
        'otp_expires_at',
        'email_verified_at',
        'account_status',
        'approval_status',
        'password_reset_token',
        'password_reset_expires_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'otp_code',
        'password_reset_token',
    ];

    protected $casts = [
        'otp_expires_at'             => 'datetime',
        'email_verified_at'          => 'datetime',
        'password_reset_expires_at'  => 'datetime',
    ];

    /**
     * Relationship: user → user_info
     */
    public function info()
    {
        return $this->hasOne(UserInfo::class, 'user_id');
    }
}
