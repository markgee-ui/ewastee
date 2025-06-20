<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MpesaController extends Controller
{
    public function handleResult(Request $request)
    {
        Log::info('M-PESA Result:', $request->all());

        // Example: You can extract transaction details and update database
        // Example payload: $result = $request->input('Result');

        return response()->json([
            'ResultCode' => 0,
            'ResultDesc' => 'Result Received Successfully'
        ]);
    }

    public function handleTimeout(Request $request)
    {
        Log::warning('M-PESA Timeout:', $request->all());

        return response()->json([
            'ResultCode' => 0,
            'ResultDesc' => 'Timeout Received Successfully'
        ]);
    }
}
