// src/socket.js
import { io } from "socket.io-client";

// Configure your backend socket URL here
const socket = io(import.meta.env.VITE_BACKEND_URL, {
  withCredentials: true,
});

export default socket;
