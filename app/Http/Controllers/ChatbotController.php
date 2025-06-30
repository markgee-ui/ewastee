<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ChatbotController extends Controller
{
    public function chat(Request $request)
    {
        $message = strtolower(trim($request->input('message')));

        $responses = [
            'hello' => 'Jambo! 👋 How can I assist you today with Etaka?',
            'ewaste' => 'E-waste refers to electronic products that are unwanted, not working, or obsolete. You can submit your e-waste via the Submit Request page.',
            'submit' => 'To submit an e-waste request, simply log in and go to the Submit Request tab.',
            'reward' => 'You earn rewards when your e-waste is collected and processed. You can view and redeem them in your dashboard.',
            'pickup' => 'Our certified recyclers will view your request and schedule a pickup from your location.',
            'contact' => 'You can reach us via the Contact section at the bottom of the homepage or fill the contact form.',
        ];

        foreach ($responses as $keyword => $reply) {
            if (str_contains($message, $keyword)) {
                return response()->json(['reply' => $reply]);
            }
        }

        return response()->json([
            'reply' => 'Sorry, I didn’t quite get that. Please ask about e-waste, submitting requests, rewards, or pickups.'
        ]);
    }
}

