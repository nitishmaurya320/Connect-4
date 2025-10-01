// src/socket.js
import { io } from "socket.io-client";

// create socket connection
const socket = io("http://localhost:8000/");

export default socket;
