<?php

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class PaymentSuccessful extends Notification
{
    protected $amount, $receipt;

    public function __construct($amount, $receipt)
    {
        $this->amount = $amount;
        $this->receipt = $receipt;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Payment Successful')
            ->line("Your payment of KES {$this->amount} was received.")
            ->line("Receipt: {$this->receipt}")
            ->line('Thank you for recycling with E-Taka!');
    }
}
