<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index()
    {
        return Notification::where('user_id', Auth::id())
            ->orderByDesc('created_at')
            ->get();
    }

    public function markRead()
    {
        Notification::where('user_id', Auth::id())->update(['is_read' => true]);
        return response()->json(['message' => 'Notifications marked as read']);
    }
}
