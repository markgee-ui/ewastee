<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;

class AdminController extends Controller
{
    /**
     * Return a list of all payments for admin.
     */
    public function getPayments()
    {
        $payments = Payment::orderBy('created_at', 'desc')->get([
            'id',
            'request_id',
            'phone',
            'amount',
            'status',
            'mpesa_receipt',
            'created_at'
        ]);

        return response()->json($payments);
    }
}
