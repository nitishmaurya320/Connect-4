// src/socket.js
import { io } from "socket.io-client";

// create socket connection
const socket = io("https://connect-4-nkhc.onrender.com/");

export default socket;
