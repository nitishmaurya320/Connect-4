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
    {
    waitingMessage&&  <div className="fixed inset-0 flex items-center justify-center bg-blue-500 bg-opacity-60 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-96 text-center">
        <h2 className="text-xl font-bold mb-4">Waiting for Players...</h2>
        <p className="text-gray-600 mb-6">
          Share this Room ID with your friend:
        </p>
        <div className="bg-gray-100 rounded-lg p-3 font-mono text-lg mb-6">
          {room}
        </div>
        <div className="flex justify-center space-x-2">
          <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></span>
          <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-200"></span>
          <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-400"></span>
        </div>
      </div>
    </div>}
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          🎮 Join a Room
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          {roomFullMessage && <h2 className="text-red-400">{roomFullMessage}</h2>}

          <button
            type="submit"
            className="w-full bg-indigo-500 text-white p-3 rounded-xl font-semibold hover:bg-indigo-600 transition"
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
