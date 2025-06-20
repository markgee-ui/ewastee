<?php
namespace App\Http\Controllers;

use App\Models\EwasteRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EwasteRequestController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $requests = EwasteRequest::where('consumer_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['requests' => $requests]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|max:255',
            'quantity' => 'required|integer|min:1',
            'location' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
        ]);

        $ewaste = EwasteRequest::create([
            'consumer_id' => Auth::id(),
            'type' => $validated['type'],
            'quantity' => $validated['quantity'],
            'location' => $validated['location'],
            'description' => $validated['description'] ?? null,
            'status' => 'pending',
        ]);

        return response()->json(['message' => 'Request submitted successfully.', 'request' => $ewaste]);
    }

    // ✅ NEW: Recycler updates the status of an e-waste request
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,accepted,completed',
        ]);

        $ewasteRequest = EwasteRequest::findOrFail($id);

        // ✅ Only allow recyclers to perform this action
        if (Auth::user()->role !== 'recycler') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // ✅ Update the status
        $ewasteRequest->status = $request->status;
        $ewasteRequest->save();

        // ✅ Award rewards if marked as completed
        if ($request->status === 'completed') {
            $consumer = $ewasteRequest->consumer; // requires ->consumer() relationship on the model
            if ($consumer) {
                $consumer->rewards += 1;
                $consumer->save();
            }
        }

        return response()->json(['message' => 'Request status updated successfully.']);
    }
}
