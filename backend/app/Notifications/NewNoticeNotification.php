<?php

namespace App\Notifications;

use App\Models\Notice;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewNoticeNotification extends Notification
{
    use Queueable;

    public function __construct(
        private readonly Notice $notice,
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
            'title' => $this->notice->title,
            'message' => $this->notice->is_global
                ? 'A new college-wide notice has been published.'
                : 'A new department notice has been published.',
            'meta' => [
                'notice_id' => $this->notice->id,
                'department' => $this->notice->department?->name,
            ],
        ];
    }
}
