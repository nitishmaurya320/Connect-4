import React, { useState, useEffect } from "react";
import socket from "./socket";
import { useNavigate } from "react-router-dom";

const JoinRoom = ({ setUserName, setRoomId ,setOpponentName,setMyTurn}) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [roomFullMessage, setRoomFullMessage] = useState("");
  const [waitingMessage,setWaitingMessage]=useState("")
  
  const navigate = useNavigate();

  useEffect(() => {
    const roomFullHandler = (message) => setRoomFullMessage(message);
    const joinedHandler = () =>{ 
      
      navigate("/game")};
     const waitingHandler = ({ message }) => {
        setWaitingMessage(message); 
  };
    socket.on("room-full", roomFullHandler);
    socket.on("joined", joinedHandler);
    socket.on("your-turn",(ismyturn)=>{
        setMyTurn(ismyturn)
      })
    socket.on("waiting",(waitingHandler))
  socket.on("opponent-joined", ({ opponentName }) => {
    console.log(opponentName)

   setOpponentName(opponentName)
    navigate("/game"); // now navigate after opponent info received
});
    return () => {
      socket.off("room-full", roomFullHandler);
      socket.off("joined", joinedHandler);
    };
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !room) {
      alert("Please enter both name and room code");
      return;
    }

    setUserName(name);
    setRoomId(room);

    // Emit to join the room
    socket.emit("join-room", name, room);
    
  };

  return (
   <>
  {/* Waiting Modal */}
 {waitingMessage && (
  <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-purple-300 via-pink-300 to-blue-300 bg-opacity-40 z-50 backdrop-blur-sm">
    <div className="bg-white/30 backdrop-blur-md rounded-3xl shadow-2xl p-10 w-96 text-center border border-white/30 animate-fadeIn">
      <h2 className="text-2xl font-bold mb-4 text-purple-700 drop-shadow-lg">
        Waiting for Players...
      </h2>
      <p className="text-purple-600 mb-6">
        Share this Room ID with your friend:
      </p>
      <div className="bg-white/50 rounded-lg p-3 font-mono text-lg mb-6 text-purple-800 text-center">
        {room}
      </div>
      <div className="flex justify-center space-x-3">
        <span className="w-3 h-3 bg-purple-700 rounded-full animate-bounce"></span>
        <span className="w-3 h-3 bg-pink-500 rounded-full animate-bounce delay-200"></span>
        <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-400"></span>
      </div>
    </div>
  </div>
)}


  {/* Main Join Room Form */}
  <div className="flex items-center justify-center h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-4">
  <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
    <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">🎮 Join a Room</h1>

    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name Input */}
      <div>
        <label className="block text-purple-600 mb-1 font-medium">Your Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full p-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 bg-purple-50"
        />
      </div>

      {/* Room Code Input */}
      <div>
        <label className="block text-purple-600 mb-1 font-medium">Room Code</label>
        <input
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Enter room code"
          className="w-full p-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 bg-purple-50"
        />
      </div>

      {/* Error Message */}
      {roomFullMessage && (
        <p className="text-red-500 text-center">{roomFullMessage}</p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white font-semibold rounded-lg hover:from-purple-500 hover:to-pink-500 transition"
      >
        🚀 Join Room
      </button>
    </form>
  </div>
</div>


</>

  );
};

export default JoinRoom;
