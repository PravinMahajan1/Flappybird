
import React from 'react';

interface LevelIndicatorProps {
  level: number;
}

const LevelIndicator: React.FC<LevelIndicatorProps> = ({ level }) => {
  return (
    <div className="absolute top-4 left-4 z-30">
      <p className="text-2xl font-fredoka text-white" style={{ WebkitTextStroke: '1px black' }}>
        Level: {level}
      </p>
    </div>
  );
};

export default LevelIndicator;
