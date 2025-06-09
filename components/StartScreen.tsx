import React from 'react';
import { FLAP_KEY } from '../constants';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const handleInteraction = () => {
    onStart();
  };

  return (
    <div 
      className="absolute inset-0 flex flex-col items-center justify-center text-center bg-blue-400 bg-opacity-70 backdrop-blur-sm z-50 p-4 cursor-pointer"
      onClick={handleInteraction} // Allow clicking anywhere on screen to start
      onTouchStart={handleInteraction} // Allow touching anywhere on screen to start
      role="button" // Make it act like a button for accessibility
      tabIndex={0} // Make it focusable
      onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') handleInteraction() }} // Allow keyboard interaction
      aria-label="Start Game Screen"
    >
      <h1 className="text-6xl sm:text-7xl font-fredoka text-yellow-400 mb-4 sm:mb-6" style={{ WebkitTextStroke: '3px orange' }}>
        Flappy Fun Adventure!
      </h1>
      <img src="https://picsum.photos/seed/flappybirdgameicon/120/120" alt="Cute Bird Icon" className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-yellow-300 shadow-xl mb-6 sm:mb-8 animate-bounce"/>
      <button
        // onClick and onTouchStart are handled by the parent div now
        // onClick={onStart}
        // onTouchStart={onStart} 
        className="px-6 py-3 sm:px-8 sm:py-4 bg-green-500 text-white text-2xl sm:text-3xl font-fredoka rounded-lg shadow-xl hover:bg-green-600 transition-colors transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
        aria-label="Start Game Button"
      >
        Tap or Press <span className="font-bold text-yellow-300">{FLAP_KEY.toUpperCase()}</span> to Start!
      </button>
      <p className="mt-6 text-lg sm:text-xl text-white font-fredoka" style={{ WebkitTextStroke: '0.5px black' }}>
        Help the bird fly through the pipes!
      </p>
    </div>
  );
};

export default StartScreen;