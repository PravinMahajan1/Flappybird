
import React, { useState, useEffect } from 'react';
import { BIRD_SIZE, BIRD_INITIAL_X } from '../constants';

interface BirdProps {
  y: number;
  rotation: number;
  isFlapping: boolean;
}

const Bird: React.FC<BirdProps> = ({ y, rotation, isFlapping }) => {
  const [wingRotation, setWingRotation] = useState(10); // Initial down position

  useEffect(() => {
    if (isFlapping) {
      setWingRotation(-45); // Flap up
      const timer = setTimeout(() => setWingRotation(20), 120); // Return to a more neutral/down position
      return () => clearTimeout(timer);
    } else {
      // Gentle idle wing movement when not actively flapping
      const idleTimer = setTimeout(() => {
        setWingRotation(prev => (prev === 20 ? 15 : 20));
      }, 500);
      return () => clearTimeout(idleTimer);
    }
  }, [isFlapping]);
  
  const birdContainerStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${BIRD_INITIAL_X}px`, // Bird X is fixed based on constant
    top: `${y}px`,
    width: `${BIRD_SIZE * 1.5}px`, // Increased width for new design
    height: `${BIRD_SIZE}px`,
    transform: `rotate(${rotation}deg)`,
    transformOrigin: 'center center', // Rotate around the center of the new dimensions
    transition: 'transform 0.1s linear', 
    zIndex: 20,
  };

  // Adjusted positions to center the visual bird within the larger container
  const birdBodyXOffset = BIRD_SIZE * 0.1; 
  const birdBodyYOffset = BIRD_SIZE * 0.05;

  return (
    <div style={birdContainerStyle} role="img" aria-label="Flappy bird">
      {/* Tail */}
      <div 
        className="absolute bg-red-500 rounded-sm border border-red-700"
        style={{
          width: BIRD_SIZE * 0.5,
          height: BIRD_SIZE * 0.3,
          left: `${birdBodyXOffset - BIRD_SIZE * 0.25}px`,
          top: `${birdBodyYOffset + BIRD_SIZE * 0.35}px`,
          transform: 'rotate(20deg)',
          clipPath: 'polygon(0 20%, 100% 0, 100% 100%, 0 80%)',
        }}
      />

      {/* Bird Body */}
      <div 
        className="absolute bg-yellow-400 rounded-full border-2 border-yellow-600 shadow-lg"
        style={{ 
            width: BIRD_SIZE, 
            height: BIRD_SIZE * 0.9, 
            left: `${birdBodyXOffset}px`,
            top: `${birdBodyYOffset}px`,
        }}
      >
        {/* Body Shine/Highlight */}
         <div
          className="absolute opacity-30 bg-white rounded-full"
          style={{
            width: '60%',
            height: '30%',
            left: '20%',
            top: '15%',
            transform: 'rotate(-10deg)',
          }}
        />
      </div>

      {/* Wing */}
      <div 
        className="absolute bg-yellow-500 border-2 border-yellow-700 rounded-lg shadow-md"
        style={{
          width: BIRD_SIZE * 0.8,
          height: BIRD_SIZE * 0.5,
          left: `${birdBodyXOffset + BIRD_SIZE * 0.1}px`,
          top: `${birdBodyYOffset + BIRD_SIZE * 0.15}px`,
          transformOrigin: '20% 90%', // Pivot point for wing flap (base of wing)
          transform: `rotate(${wingRotation}deg)`,
          transition: 'transform 0.12s ease-in-out',
          clipPath: 'ellipse(45% 50% at 50% 50%)', // More wing-like shape
        }}
      >
        {/* Wing Detail */}
        <div 
          className="absolute w-full h-full opacity-20"
          style={{
            backgroundImage: 'linear-gradient(to bottom right, transparent, rgba(0,0,0,0.2))',
            borderRadius: 'inherit'
          }}
        />
      </div>

      {/* Head */}
      <div 
        className="absolute bg-yellow-300 rounded-full border-2 border-yellow-500 shadow-md"
        style={{
          width: BIRD_SIZE * 0.7,
          height: BIRD_SIZE * 0.7,
          left: `${birdBodyXOffset + BIRD_SIZE * 0.5}px`,
          top: `${birdBodyYOffset - BIRD_SIZE * 0.1}px`,
        }}
      >
        {/* Eye */}
        <div 
          className="absolute bg-white rounded-full border border-black"
          style={{ 
            width: BIRD_SIZE * 0.25, 
            height: BIRD_SIZE * 0.25, 
            top: BIRD_SIZE * 0.15, 
            left: BIRD_SIZE * 0.35,
          }}
        >
          <div 
            className="absolute bg-black rounded-full"
            style={{ 
              width: BIRD_SIZE * 0.12, 
              height: BIRD_SIZE * 0.12, 
              top: '50%', 
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
           {/* Eye Highlight */}
          <div 
            className="absolute bg-white rounded-full"
            style={{ 
              width: BIRD_SIZE * 0.05, 
              height: BIRD_SIZE * 0.05, 
              top: '25%', 
              left: '25%',
            }}
          />
        </div>
      </div>
       {/* Beak */}
      <div 
        className="absolute bg-orange-500 border-r-2 border-b-2 border-orange-700 shadow-sm"
        style={{
          width: BIRD_SIZE * 0.45,
          height: BIRD_SIZE * 0.3,
          left: `${birdBodyXOffset + BIRD_SIZE * 0.95}px`,
          top: `${birdBodyYOffset + BIRD_SIZE * 0.2}px`,
          clipPath: 'polygon(0 20%, 100% 50%, 0 80%)', // Triangle shape
          transform: 'rotate(5deg)',
        }}
      />
    </div>
  );
};

export default Bird;
