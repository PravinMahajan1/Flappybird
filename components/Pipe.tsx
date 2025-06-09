
import React from 'react';
import { PIPE_WIDTH, GAME_HEIGHT, PIPE_COLOR, PIPE_BORDER_COLOR } from '../constants';
import type { Pipe as PipeType } from '../types';

interface PipeProps {
  pipe: PipeType;
  gap: number;
}

const Pipe: React.FC<PipeProps> = ({ pipe, gap }) => {
  const topPipeHeight = pipe.topHeight;
  const bottomPipeY = pipe.topHeight + gap;
  const bottomPipeHeight = GAME_HEIGHT - bottomPipeY;

  return (
    <div style={{ position: 'absolute', left: `${pipe.x}px`, top: 0, width: `${PIPE_WIDTH}px`, height: `${GAME_HEIGHT}px` }} className="z-10">
      {/* Top Pipe */}
      <div 
        className={`${PIPE_COLOR} ${PIPE_BORDER_COLOR} border-4 rounded-b-lg shadow-xl`}
        style={{ 
          position: 'absolute', 
          top: 0, 
          width: '100%', 
          height: `${topPipeHeight}px` 
        }}
      >
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-6 bg-green-600 rounded-b-md border-x-4 border-b-4 border-green-800" style={{width: PIPE_WIDTH + 8, left: -4}}/>
      </div>
      
      {/* Bottom Pipe */}
      <div 
        className={`${PIPE_COLOR} ${PIPE_BORDER_COLOR} border-4 rounded-t-lg shadow-xl`}
        style={{ 
          position: 'absolute', 
          top: `${bottomPipeY}px`, 
          width: '100%', 
          height: `${bottomPipeHeight}px`
        }}
      >
         <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-6 bg-green-600 rounded-t-md border-x-4 border-t-4 border-green-800" style={{width: PIPE_WIDTH + 8, left: -4}}/>
      </div>
    </div>
  );
};

export default Pipe;
