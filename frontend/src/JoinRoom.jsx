import React, { useState } from "react";
import socket from "./socket";
import { useNavigate } from "react-router-dom";
const JoinRoom = ({setUserName,setRoomId}) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  
    const navigate=useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !room) {
      alert("Please enter both name and room code");
      return;
    }
    
    setUserName(name);
    setRoomId(room)
    socket.emit("join-room",name,room)
    navigate("/game")
    
    
    
    
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          🎮 Join a Room
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-gray-700 mb-2">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your name"
            />
          </div>

          {/* Room Code Input */}
          <div>
            <label className="block text-gray-700 mb-2">Room Code</label>
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter room code"
            />
          </div>

          {/* Join Button */}
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white p-3 rounded-xl font-semibold hover:bg-indigo-600 transition"
          >
            🚀 Join Room
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinRoom;
