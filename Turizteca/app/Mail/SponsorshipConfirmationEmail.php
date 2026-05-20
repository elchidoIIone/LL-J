<?php

namespace App\Mail;

use App\Models\Sponsorship;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SponsorshipConfirmationEmail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly User $user,
        public readonly Sponsorship $sponsorship
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: '¡Tu plan en Turizteca está activo!');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.sponsorship_confirmation');
    }
}
