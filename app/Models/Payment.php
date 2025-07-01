<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    //
    protected $fillable = [
        'request_id', 'transaction_id', 'phone', 'amount', 'status',
    ];
}
