<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\EwasteRequest;
use Illuminate\Support\Facades\DB;

class AdminOverviewController extends Controller
{
    public function overview()
    {
        return response()->json([
            'totalUsers' => User::count(),
            'totalRecyclers' => User::where('role', 'recycler')->count(),
            'totalRequests' => EwasteRequest::count(),
            'totalRewardsPaid' => DB::table('reward_redemptions')->sum('amount'),
            'monthlyRequests' => $this->getMonthlyRequestStats(),
        ]);
    }

    private function getMonthlyRequestStats()
    {
        return EwasteRequest::selectRaw('MONTH(created_at) as month, COUNT(*) as total')
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($row) {
                return [
                    'label' => date('F', mktime(0, 0, 0, $row->month, 1)),
                    'value' => $row->total,
                ];
            });
    }
}
