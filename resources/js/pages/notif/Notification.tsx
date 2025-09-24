import { useEffect, useState } from "react";
//import echo from "../../echo"; // file konfigurasi
import echo from '@/echo'; 

type UserNotificationEvent = {
  title: string;
  message: string;
  type: string;
  userId: number;
};

export default function Notifications({ userId }: { userId: number }) {
    const [messages, setMessages] = useState<string[]>([]);

 useEffect(() => {
  const publicChannel = echo.channel("public-channel");
  publicChannel.listen("UserNotification", (e: UserNotificationEvent) => {
    console.log("📢 Publik:", e.message);
    setMessages((prev) => [...prev, `Publik: ${e.message}`]);
  });

  const privateChannel = echo.private(`App.Models.User.${userId}`);
  privateChannel.listen("UserNotification", (e: UserNotificationEvent) => {
    console.log("🔒 Private:", e.message);
    setMessages((prev) => [...prev, `Private: ${e.message}`]);
  });

  return () => {
    echo.leave("public-channel");
    echo.leave(`App.Models.User.${userId}`);
  };
}, [userId]);

    return (
        <div>
            <h2>Notifikasi</h2>
            <ul>
                {messages.map((m, i) => (
                    <li key={i}>{m}</li>
                ))}
            </ul>
        </div>
    );
}
