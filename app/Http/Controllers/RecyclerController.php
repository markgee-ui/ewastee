<?php

namespace App\Http\Controllers;

use App\Models\EwasteRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\Payment;

class RecyclerController extends Controller
{
    // GET /api/recycler/available-jobs
    public function availableJobs()
    {
        Log::info('Fetching available jobs.', ['user_id' => auth()->id()]);

        $jobs = EwasteRequest::where('status', 'pending')->get();

        Log::info('Available jobs retrieved.', ['count' => $jobs->count()]);
        return response()->json($jobs);
    }

    // POST /api/recycler/jobs/{id}/accept
    public function acceptJob($id)
    {
        Log::info('Accept Job Request received.', ['job_id' => $id, 'user_id' => auth()->id()]);

        if (!auth()->check()) {
            Log::warning('Unauthenticated attempt to accept job.', ['job_id' => $id]);
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $job = EwasteRequest::find($id);

        if (!$job) {
            Log::warning('Job not found.', ['job_id' => $id]);
            return response()->json(['error' => 'Job not found'], 404);
        }

        if ($job->status !== 'pending') {
            Log::warning('Attempt to accept a non-pending job.', ['job_id' => $id, 'status' => $job->status]);
            return response()->json(['error' => 'Job is not available for acceptance'], 400);
        }

        $job->recycler_id = auth()->id();
        $job->status = 'accepted';
        $job->save();

        Log::info('Job accepted successfully.', ['job_id' => $id, 'recycler_id' => $job->recycler_id]);
        return response()->json(['message' => 'Job accepted successfully.']);
    }

    // POST /api/recycler/jobs/{id}/in-progress
    public function markInProgress($id)
    {
        Log::info('Mark In Progress request.', ['job_id' => $id, 'user_id' => auth()->id()]);

        $job = EwasteRequest::where('id', $id)->where('recycler_id', Auth::id())->first();

        if (!$job) {
            Log::warning('Job not found or not owned by recycler.', ['job_id' => $id]);
            return response()->json(['error' => 'Job not found or unauthorized'], 404);
        }

        $job->status = 'in_progress';
        $job->save();

        Log::info('Job marked as in progress.', ['job_id' => $id]);
        return response()->json(['message' => 'Job marked as In Progress.']);
    }

    // POST /api/recycler/jobs/{id}/complete
    public function markComplete($id)
    {
        Log::info('Mark Complete request.', ['job_id' => $id, 'user_id' => auth()->id()]);

        $job = EwasteRequest::where('id', $id)->where('recycler_id', Auth::id())->first();

        if (!$job) {
            Log::warning('Job not found or not owned by recycler.', ['job_id' => $id]);
            return response()->json(['error' => 'Job not found or unauthorized'], 404);
        }

        $job->status = 'completed';
        $job->save();

        $consumer = $job->consumer;
        $consumer->rewards += 10;
        $consumer->save();

        Log::info('Job marked as completed and consumer rewarded.', ['job_id' => $id, 'consumer_id' => $consumer->id, 'reward_added' => 10]);

        return response()->json(['message' => 'Job marked as Completed and consumer rewarded.']);
    }

    // GET /api/recycler/jobs
    public function myJobs()
    {
        Log::info('Fetching recycler jobs.', ['user_id' => auth()->id()]);

        $jobs = EwasteRequest::where('recycler_id', Auth::id())->get();

        Log::info('Recycler jobs retrieved.', ['count' => $jobs->count()]);
        return response()->json($jobs);
    }

    // GET /api/recycler/payments
    public function payments(Request $request)
    {
        $recyclerId = auth()->id();

        // Get payments for jobs assigned to this recycler
        $payments = Payment::whereHas('request', function ($q) use ($recyclerId) {
            $q->where('recycler_id', $recyclerId);
        })->with(['request' => function ($q) {
            $q->select('id', 'type', 'quantity', 'location', 'created_at');
        }])->get([
            'id',
            'request_id', 
            'phone', 
            'mpesa_receipt', 
            'amount', 
            'status', 
            'checkout_request_id',
            'created_at',
            'updated_at'
        ]);

        $totalEarned = $payments->sum('amount');

        // Format the payments data for the frontend
        $formattedPayments = $payments->map(function ($payment) {
            return [
                'id' => $payment->id,
                'request_id' => $payment->request_id,
                'phone' => $payment->phone,
                'mpesa_receipt' => $payment->mpesa_receipt,
                'amount' => $payment->amount,
                'status' => $payment->status,
                'checkout_request_id' => $payment->checkout_request_id,
                'created_at' => $payment->created_at,
                'updated_at' => $payment->updated_at,
                'item_description' => $payment->request ? $payment->request->type : 'N/A', // Using request type as description
                'item_quantity' => $payment->request ? $payment->request->quantity : 'N/A',
                'item_location' => $payment->request ? $payment->request->location : 'N/A',
            ];
        });

        Log::info('Payments retrieved for recycler.', ['recycler_id' => $recyclerId, 'count' => $payments->count()]);

        return response()->json([
            'total_earned' => $totalEarned,
            'payments' => $formattedPayments,
        ]);
    }
}