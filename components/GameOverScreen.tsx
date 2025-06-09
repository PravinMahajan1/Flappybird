
import React from 'react';
import { FLAP_KEY } from '../constants';

interface GameOverScreenProps {
  score: number;
  highScore: number;
  level: number;
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, highScore, level, onRestart }) => {
  const handleInteraction = () => {
    onRestart();
  };
  return (
    <div 
      className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/60 backdrop-blur-sm z-50 p-4 cursor-pointer"
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') handleInteraction() }}
      aria-label="Game Over Screen"
    >
      <h2 className="text-5xl sm:text-6xl font-fredoka text-red-500 mb-4 sm:mb-6" style={{ WebkitTextStroke: '2px darkred' }}>Game Over!</h2>
      <div className="bg-white/80 p-4 sm:p-6 rounded-lg shadow-xl font-fredoka text-gray-700">
        <p className="text-2xl sm:text-3xl">Your Score: <span className="font-bold text-blue-600">{score}</span></p>
        <p className="text-xl sm:text-2xl mt-1 sm:mt-2">High Score: <span className="font-bold text-orange-500">{highScore}</span></p>
        <p className="text-xl sm:text-2xl mt-1 sm:mt-2">Reached Level: <span className="font-bold text-green-500">{level}</span></p>
      </div>
      <button
        // onClick={onRestart}
        // onTouchStart={onRestart}
        className="mt-6 sm:mt-8 px-6 py-3 sm:px-8 sm:py-4 bg-yellow-500 text-white text-2xl sm:text-3xl font-fredoka rounded-lg shadow-xl hover:bg-yellow-600 transition-colors transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300"
        aria-label="Restart Game Button"
      >
        Tap or Press <span className="font-bold text-gray-700">{FLAP_KEY.toUpperCase()}</span> to Restart
      </button>
    </div>
  );
};

export default GameOverScreen;
