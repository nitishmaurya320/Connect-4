import React from 'react';
import { useNavigate } from 'react-router-dom';

function GameStartPage() {
  const navigate = useNavigate();

  const handlePlayWithFriend = () => {
    console.log('Navigating to "Play with Friend" setup...');
  };

  const handleCreateRoom = () => {
    navigate("/join-room");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-4">
      
      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-purple-700 mb-2">
          Connect 4
        </h1>
        <p className="text-purple-600 text-lg sm:text-xl">
          Challenge your friends online or locally!
        </p>
      </header>

      {/* Card */}
      <main className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
        <h2 className="text-3xl font-bold text-purple-700 text-center mb-6">
          Choose Your Mode
        </h2>

        {/* Buttons */}
        <div className="flex flex-col space-y-4 w-full">
          <button
            onClick={handlePlayWithFriend}
            className="w-full py-3 px-6 text-lg font-semibold rounded-lg bg-gradient-to-r from-purple-400 to-pink-400 
                       text-white hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-md hover:shadow-purple-400/50"
          >
            Play With Friend (Local)
          </button>

          <button
            onClick={handleCreateRoom}
            className="w-full py-3 px-6 text-lg font-semibold rounded-lg bg-gradient-to-r from-blue-400 to-indigo-400 
                       text-white hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-md hover:shadow-blue-400/50"
          >
            Play With Friend (Online)
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-10 text-sm text-purple-700 text-center">
        <p>Made with ❤️ using React & Tailwind CSS</p>
      </footer>
    </div>
  );
}

export default GameStartPage;
