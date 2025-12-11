<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserInfo extends Model
{
    use HasFactory;

    protected $table = 'user_info';

    protected $fillable = [
        'user_id',
        'official_id',   // 🔹 moved here from users table
        'first_name',
        'last_name',
        'phone',
        'department',
        'role',
        'profile_picture', // 🆕 added to allow mass assignment
    ];

    /**
     * Relationship: user_info → user
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relationship: user_info → officials_list
     */
    public function official()
    {
        return $this->belongsTo(Official::class, 'official_id');
    }
}