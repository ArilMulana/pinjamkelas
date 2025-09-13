<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class UserNotification implements ShouldBroadcast
{
    use SerializesModels;

    public string $title;
    public string $message;
    public string $type;
    public int $userId;

    public function __construct(string $title, string $message, string $type, int $userId)
    {
        $this->title = $title;
        $this->message = $message;
        $this->type = $type;
        $this->userId = $userId;
    }

    public function broadcastOn(): array
    {
        // publik
        return [
            new Channel('public-channel'),

            // private per user
            new PrivateChannel("App.Models.User.{$this->userId}"),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'title'   => $this->title,
            'message' => $this->message,
            'type'    => $this->type,
            'userId'  => $this->userId,
        ];
    }
}


