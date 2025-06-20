<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RewardRedemption extends Model
{
    //
    protected $fillable = [
        'user_id',
        'points_redeemed',
        'amount',
        'status', // pending | paid | failed
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
