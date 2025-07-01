<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    /**
     * Initiates the payment process based on method.
     */
    public function initiate(Request $request)
    {
        $request->validate([
            'method' => 'required|in:mpesa,card,airtime',
            'phone' => 'required_if:method,mpesa',
            'amount' => 'required|numeric|min:1',
            'request_id' => 'required|exists:ewaste_requests,id',
        ]);

        if ($request->method === 'mpesa') {
            try {
                $phone = $this->normalizePhoneNumber($request->phone);
            } catch (\Exception $e) {
                return response()->json(['message' => $e->getMessage()], 400);
            }

            return $this->sendStkPush($phone, $request->amount,$request->request_id); // Use normalized phone
        }

        if ($request->method === 'card') {
            return response()->json(['message' => 'Card payment option coming soon.']);
        }

        if ($request->method === 'airtime') {
            return response()->json(['message' => 'Airtime payment option coming soon.']);
        }

        return response()->json(['message' => 'Unsupported payment method.'], 400);
    }

    /**
     * Sends an STK Push to the provided phone number.
     */
    private function sendStkPush($phone, $amount, $requestId)
    {
        $amount = 1; //  replace  dynamic reward-based calculation
        $shortcode = env('MPESA_STK_SHORTCODE');
        $passkey = env('MPESA_STK_PASSKEY');
        $timestamp = now()->format('YmdHis');
        $password = base64_encode($shortcode . $passkey . $timestamp);
        $callbackUrl = env('MPESA_CALLBACK_URL');

        $accessToken = $this->generateAccessToken();

        $response = Http::withToken($accessToken)->post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', [
            'BusinessShortCode' => $shortcode,
            'Password' => $password,
            'Timestamp' => $timestamp,
            'TransactionType' => 'CustomerPayBillOnline',
            'Amount' => $amount,
            'PartyA' => $phone,
            'PartyB' => $shortcode,
            'PhoneNumber' => $phone,
            'CallBackURL' => $callbackUrl,
            'AccountReference' => $requestId,
            'TransactionDesc' => 'Payment for E-taka Job',
        ]);

        if ($response->successful()) {
            return response()->json([
                'message' => 'M-Pesa STK push sent successfully.',
                'response' => $response->json()
            ]);
        }

        return response()->json([
            'message' => 'Failed to initiate M-Pesa STK push.',
            'error' => $response->json()
        ], 500);
    }

    /**
     * Converts Kenyan phone number to correct format (2547... or 2541...).
     */
    private function normalizePhoneNumber($phone)
    {
        $phone = preg_replace('/\D/', '', $phone);

        if (Str::startsWith($phone, '07') || Str::startsWith($phone, '01')) {
            return '254' . substr($phone, 1);
        }

        if (Str::startsWith($phone, '254')) {
            return $phone;
        }

        throw new \Exception('Invalid Kenyan phone number format. Use 07xx xxx xxx or 011x xxx xxx.');
    }

    /**
     * Generates M-Pesa access token.
     */
    private function generateAccessToken()
    {
        $consumerKey = env('MPESA_CONSUMER_KEY');
        $consumerSecret = env('MPESA_CONSUMER_SECRET');

        $response = Http::withBasicAuth($consumerKey, $consumerSecret)
            ->get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials');

        if ($response->successful()) {
            return $response->json()['access_token'];
        }

        abort(500, 'Failed to generate M-Pesa access token.');
    }

    public function mpesaCallback(Request $request)
{
    $data = $request->all();
    \Log::info('M-Pesa Callback Received:', $data);

    $stk = $data['Body']['stkCallback'] ?? null;
    if (!$stk) return response()->json(['message' => 'Invalid callback'], 400);

    $resultCode = $stk['ResultCode'];
    $requestId = $stk['CheckoutRequestID'] ?? null;

    if ($resultCode == 0) {
        $items = $stk['CallbackMetadata']['Item'];
        $amount = collect($items)->firstWhere('Name', 'Amount')['Value'] ?? null;
        $mpesaReceipt = collect($items)->firstWhere('Name', 'MpesaReceiptNumber')['Value'] ?? null;
        $phone = collect($items)->firstWhere('Name', 'PhoneNumber')['Value'] ?? null;

        // Save the payment to DB
        \App\Models\Payment::create([
            'request_id' => $stk['MerchantRequestID'], // or map this using AccountReference
            'phone' => $phone,
            'mpesa_receipt' => $mpesaReceipt,
            'amount' => $amount,
            'status' => 'success',
        ]);

        // Mark the e-waste request as paid
        \App\Models\EwasteRequest::where('id', $stk['MerchantRequestID'])->update([
            'payment_status' => 'paid'
        ]);
    }

    return response()->json(['message' => 'Callback processed'], 200);
}
 public function checkPaymentStatus($requestId)
{
    $payment = \App\Models\Payment::where('request_id', $requestId)->first();

    if ($payment && $payment->status === 'Completed') {
        return response()->json(['paid' => true]);
    }

    return response()->json(['paid' => false]);
}

}
