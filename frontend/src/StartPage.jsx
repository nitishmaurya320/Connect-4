import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * GameStartPage component displays the initial menu for a multiplayer game,
 * styled entirely with Tailwind CSS utility classes.
 */
function GameStartPage() {
  const navigate=useNavigate()
  // Placeholder functions for the button actions.
  const handlePlayWithFriend = () => {
    console.log('Navigating to "Play with Friend" setup...');
    // In a real app, you would use routing or state management here.
  };

  const handleCreateRoom = () => {
    navigate("/join-room")

  };

  const handleJoinRoom = () => {
    console.log('Navigating to "Join Room" prompt...');
  };

  return (
    // Main container: full screen, dark background, centered content
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      
      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-indigo-400 sm:text-6xl">
          Connect 4
        </h1>
      </header>

      {/* Menu Container (The main card) */}
      <main className="bg-gray-800 p-8 sm:p-12 rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-100">
          Choose Your Mode
        </h2>

        {/* Button Group */}
        <div className="flex flex-col space-y-4">
          
          {/* Option 1: Primary Action (Play With Friend) */}
          <button
            onClick={handlePlayWithFriend}
            className="w-full py-4 px-6 text-xl font-semibold rounded-lg text-gray-900 bg-indigo-400 
                       hover:bg-indigo-300 transition duration-200 transform hover:scale-[1.02] 
                       shadow-lg hover:shadow-indigo-500/50"
          >
            Play With Friend(Local)
          </button>

          {/* Option 2: Secondary Action (Create Room) */}
          <button
            onClick={handleCreateRoom}
            className="w-full py-4 px-6 text-xl font-semibold rounded-lg text-white bg-gray-700 
                       border border-indigo-400 hover:bg-gray-600 transition duration-200 
                       transform hover:scale-[1.02] shadow-md"
          >
            Play with Friend(Online)
          </button>

          
         
        </div>
      </main>

      {/* Footer / Info */}
      <footer className="mt-8 text-sm text-gray-500">
        <p>A simple start page powered by React and Tailwind CSS.</p>
      </footer>
    </div>
  );
}

export default GameStartPage;