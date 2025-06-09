
import React from 'react';

interface ScoreDisplayProps {
  score: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score }) => {
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 text-center">
      <p className="text-5xl font-fredoka text-white" style={{ WebkitTextStroke: '2px black' }}>
        {score}
      </p>
    </div>
  );
};

export default ScoreDisplay;
