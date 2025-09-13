import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: "pusher",
    key: import.meta.env.REVERB_APP_KEY,        // sesuai PUSHER_APP_KEY di .env
    wsHost: import.meta.env.REVERB_APP_HOST, // atau "pinjamkelas.test"
    wsPort: import.meta.env.REVERB_PORT,        // sesuai REVERB_PORT
    forceTLS: false,
    disableStats: true,
    enabledTransports: ["ws"], // penting biar ga coba wss
});

export default echo;
