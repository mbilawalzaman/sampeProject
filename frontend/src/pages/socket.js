import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
    withCredentials: true,  // Allow cookies/session-based auth
    transports: ["websocket", "polling"], // Ensure fallback to polling
    autoConnect: false,  // Prevent auto-connect issues
});

export default socket;
