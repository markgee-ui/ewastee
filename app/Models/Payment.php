<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    //
    protected $fillable = [
        'request_id', 'phone','mpesa_receipt', 'amount', 'status', 'checkout_request_id'
    ];

    public function request()
{
    return $this->belongsTo(EwasteRequest::class, 'request_id');
}
}
