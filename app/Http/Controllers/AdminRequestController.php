<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EwasteRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AdminRequestController extends Controller
{
    public function index()
    {
        $requests = EwasteRequest::with(['consumer', 'recycler'])->latest()->get();

        return response()->json($requests->map(function ($req) {
            return [
                'id' => $req->id,
                'type' => $req->type,
                'quantity' => $req->quantity,
                'location' => $req->location,
                'description' => $req->description,
                'status' => $req->status,
                'consumer_name' => optional($req->consumer)->name ?? 'N/A',
                'recycler_name' => optional($req->recycler)->name ?? 'N/A',
                'created_at' => $req->created_at->toDateTimeString(),
                'updated_at' => $req->updated_at->toDateTimeString(),
            ];
        }));
    }

    public function destroy($id)
    {
        $req = EwasteRequest::findOrFail($id);
        $req->delete();

        return response()->json(['message' => 'Request deleted successfully']);
    }
    public function deleteRequest($id)
{
    $request = EwasteRequest::findOrFail($id);
    $request->delete();
    return response()->json(['message' => 'Request deleted successfully.']);
}
public function changePassword(Request $request)
{
    $request->validate([
        'current_password' => 'required',
        'new_password' => 'required|min:6'
    ]);

    $user = $request->user(); // or Auth::user()

    if (!$user) {
        return response()->json(['message' => 'User not authenticated'], 401);
    }

    if (!Hash::check($request->current_password, (string) $user->password)) {
        return response()->json(['message' => 'Current password is incorrect.'], 422);
    }

    $user->password = Hash::make($request->new_password);
    // If your User model expects a Hashed object, use:
    // $user->password = new \Illuminate\Auth\Passwords\Password(Hash::make($request->new_password));
    $user->save();

    return response()->json(['message' => 'Password updated successfully.']);
}
}
