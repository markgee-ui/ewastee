<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RewardController extends Controller
{
    public function redeem(Request $request)
    {
        $user = $request->user();

        // Check if user has enough points to redeem
        if ($user->rewards < 10) {
            return response()->json(['message' => 'You need at least 10 points to redeem.'], 400);
        }

        // Calculate payout amount: Every 10 points = 50 KES
        $amount = ($user->rewards / 10) * 50;

        // Sandbox only allows this test phone number
        $phoneNumber = '254708374149';

        // M-Pesa B2C Configuration
        $initiatorName = env('MPESA_INITIATOR_NAME', 'testapi');
        $securityCredential = env('MPESA_SECURITY_CREDENTIAL', 'Safaricom123!');
        $shortcode = env('MPESA_SHORTCODE', '600977');
        $commandId = "BusinessPayment";
        $remarks = "E-Taka Reward Redemption";
        $queueTimeOutURL = env('MPESA_QUEUE_TIMEOUT_URL');
        $resultURL = env('MPESA_RESULT_URL');
        $occasion = "E-Taka";

        // Step 1: Get access token from M-Pesa
        $accessToken = $this->getAccessToken();

        if (!$accessToken) {
            return response()->json(['message' => 'Failed to authenticate with M-Pesa.'], 500);
        }

        // Step 2: Send B2C Payment Request
        $response = Http::withToken($accessToken)->post(env('MPESA_B2C_URL'), [
            "InitiatorName" => $initiatorName,
            "SecurityCredential" => $securityCredential,
            "CommandID" => $commandId,
            "Amount" => $amount,
            "PartyA" => $shortcode,
            "PartyB" => $phoneNumber,
            "Remarks" => $remarks,
            "QueueTimeOutURL" => $queueTimeOutURL,
            "ResultURL" => $resultURL,
            "Occasion" => $occasion,
        ]);

        Log::info('B2C Request Response', ['response' => $response->json()]);

        if ($response->successful()) {
            // OPTIONAL: Reset or deduct the user's reward points
            // Example:
            // $user->rewards = 0;
            // $user->save();

            return response()->json([
                'message' => "🎉 Payment of KES {$amount} initiated successfully. You will receive it shortly."
            ]);
        } else {
            Log::error('B2C Payment initiation failed', ['response' => $response->body()]);

            return response()->json([
                'message' => 'Payment initiation failed.',
                'error' => $response->body(),
            ], 400);
        }
    }

    private function getAccessToken()
    {
        $response = Http::withBasicAuth(env('MPESA_CONSUMER_KEY'), env('MPESA_CONSUMER_SECRET'))
            ->get(env('MPESA_AUTH_URL'));

        if ($response->failed()) {
            Log::error('Failed to get M-Pesa access token', ['response' => $response->body()]);
            return null;
        }

        return $response['access_token'] ?? null;
    }

    private function formatPhoneNumber($phone)
    {
        $phone = preg_replace('/^0/', '254', $phone);
        return preg_replace('/^\+/', '', $phone);
    }
}
// This controller handles the redemption of rewards for users.
// It checks if the user has enough points, calculates the payout amount,
// and initiates a B2C payment to the user's phone number using M-Pesa.
// It also includes methods to get an access token from M-Pesa and format phone numbers.
// The controller logs all requests and responses for debugging purposes.
// The redeem method is the main entry point for redeeming rewards.
// It expects the user to be authenticated and have a 'rewards' attribute.
// The access token is fetched using the consumer key and secret from the environment variables.
// The B2C payment request is sent to M-Pesa with the necessary parameters.
// The response is logged, and if successful, a success message is returned.
// If the payment initiation fails, an error message is returned with the response details.
// The controller uses Laravel's HTTP client for making API requests and logging for debugging.
// The `getAccessToken` method retrieves the M-Pesa access token using basic authentication.
// The `formatPhoneNumber` method ensures the phone number is in the correct format for M-Pesa.
// The controller is designed to be used in a Laravel application with M-Pesa integration.
// It assumes the necessary environment variables are set for M-Pesa credentials and URLs.
// The controller is part of a larger application that handles e-waste management and rewards redemption.
// It is designed to be secure, logging errors and responses for troubleshooting.
// The controller can be extended to include more features like viewing transaction history or managing rewards.but not their points.
// The controller is structured to follow Laravel's best practices for controllers and API endpoints.
// It uses dependency injection for the Request object and leverages Laravel's built-in features.   