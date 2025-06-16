<?php

namespace App\Http\Controllers;

use App\Models\EwasteRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EwasteRequestController extends Controller
{
    public function index()
    {
        return EwasteRequest::where('consumer_id', Auth::id())->orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|max:255',
            'quantity' => 'required|integer|min:1',
            'pickup_location' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000'
        ]);

        $validated['consumer_id'] = Auth::id();
        $validated['status'] = 'pending';

        $requestModel = EwasteRequest::create($validated);

        return response()->json($requestModel, 201);
    }
}
// This controller handles e-waste requests for consumers.
// It allows consumers to view their requests and create new ones.
// The index method retrieves all requests made by the authenticated consumer, ordered by creation date.    