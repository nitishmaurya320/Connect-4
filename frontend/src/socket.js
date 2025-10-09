// src/socket.js
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const socket = io(backendUrl);
// https://connect-4-nkhc.onrender.com/

export default socket;
