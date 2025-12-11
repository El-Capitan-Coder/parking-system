<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Official extends Model
{
    protected $table = 'officials_list';

    protected $fillable = [
        'first_name',
        'last_name',
        'official_id',
        'department',
        'role',
        'status',
    ];

    public function user()
    {
        // Link via id_number instead of email
        return $this->hasOne(User::class, 'id_number', 'id_number');
    }
}
