<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public $resetUrl;

    /**
     * Create a new message instance.
     */
    public function __construct($resetUrl)
    {
        $this->resetUrl = $resetUrl;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('PASOK - Reset Your Password')
                    ->view('emails.reset-password') // ✅ use HTML view instead of markdown
                    ->with([
                        'resetUrl' => $this->resetUrl,
                    ]);
    }
}
