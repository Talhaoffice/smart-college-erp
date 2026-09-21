<?php

namespace App\Notifications;

use App\Models\Assignment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewAssignmentNotification extends Notification
{
    use Queueable;

    public function __construct(
        private readonly Assignment $assignment,
    ) {
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => $this->assignment->title,
            'message' => 'A new assignment has been posted for your department.',
            'meta' => [
                'assignment_id' => $this->assignment->id,
                'subject' => $this->assignment->subject?->name,
                'deadline_at' => optional($this->assignment->deadline)->toDateTimeString(),
            ],
        ];
    }
}
