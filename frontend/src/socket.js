// src/socket.js
import { io } from "socket.io-client";

// create socket connection
const socket = io("https://connect-4-syxe.vercel.app/");

export default socket;
