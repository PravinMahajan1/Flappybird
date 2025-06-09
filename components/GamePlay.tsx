
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Bird from './Bird';
import PipeComponent from './Pipe';
import CloudComponent from './Cloud';
import ScoreDisplay from './ScoreDisplay';
import LevelIndicator from './LevelIndicator';
import { useKeyAction } from '../hooks/useKeyAction';
import type { BirdState, Pipe, Cloud, LevelConfig } from '../types';
import {
  GAME_WIDTH, GAME_HEIGHT, BIRD_SIZE, BIRD_FLAP_STRENGTH, BIRD_GRAVITY,
  BIRD_MAX_ROTATION, BIRD_MIN_ROTATION, BIRD_ROTATION_SPEED_FACTOR,
  BIRD_INITIAL_X, BIRD_INITIAL_Y, PIPE_WIDTH, MIN_PIPE_HEIGHT,
  CLOUD_COUNT, CLOUD_MIN_SPEED, CLOUD_MAX_SPEED, CLOUD_MIN_Y, CLOUD_MAX_Y, GROUND_HEIGHT, FLAP_KEY
} from '../constants';

interface GamePlayProps {
  onGameOver: (score: number, level: number) => void;
  currentLevel: number;
  levelConfig: LevelConfig;
  onScoreUpdate: (newScore: number) => void;
}

const GamePlay: React.FC<GamePlayProps> = ({ onGameOver, currentLevel, levelConfig, onScoreUpdate }) => {
  const [bird, setBird] = useState<BirdState>({
    y: BIRD_INITIAL_Y,
    velocity: 0,
    rotation: 0,
  });
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [clouds, setClouds] = useState<Cloud[]>([]);
  const [score, setScore] = useState(0);
  const [isFlapping, setIsFlapping] = useState(false);
  
  const gameTimeRef = useRef(0);
  const pipeSpawnTimerRef = useRef(0);
  const gameLoopRef = useRef<number>();
  const gameAreaRef = useRef<HTMLDivElement>(null);


  const resetGame = useCallback(() => {
    setBird({ y: BIRD_INITIAL_Y, velocity: 0, rotation: 0 });
    setPipes([]);
    setScore(0);
    onScoreUpdate(0); // Ensure score in App.tsx is also reset
    gameTimeRef.current = 0;
    pipeSpawnTimerRef.current = 0;
    
    const initialClouds: Cloud[] = [];
    for (let i = 0; i < CLOUD_COUNT; i++) {
      initialClouds.push({
        id: `cloud-${Date.now()}-${i}`,
        x: Math.random() * GAME_WIDTH,
        y: CLOUD_MIN_Y + Math.random() * (CLOUD_MAX_Y - CLOUD_MIN_Y),
        width: 60 + Math.random() * 60,
        height: 30 + Math.random() * 30,
        speed: CLOUD_MIN_SPEED + Math.random() * (CLOUD_MAX_SPEED - CLOUD_MIN_SPEED),
        style: Math.floor(Math.random() * 3)
      });
    }
    setClouds(initialClouds);
  }, [onScoreUpdate]);

  useEffect(() => {
    resetGame();
  }, [resetGame, currentLevel]); // Reset game if level changes (e.g. from restart)

  const flap = useCallback(() => {
    setBird(prev => ({ ...prev, velocity: BIRD_FLAP_STRENGTH }));
    setIsFlapping(true);
    setTimeout(() => setIsFlapping(false), 120); 
  }, []);

  useKeyAction(FLAP_KEY, flap, true); 

  // Touch to flap
  useEffect(() => {
    const gameArea = gameAreaRef.current;
    if (!gameArea) return;

    const handleTouchStart = (event: TouchEvent) => {
      event.preventDefault(); // Prevent scrolling/zooming
      flap();
    };

    gameArea.addEventListener('touchstart', handleTouchStart, { passive: false });
    return () => {
      gameArea.removeEventListener('touchstart', handleTouchStart);
    };
  }, [flap]);


  const gameLoop = useCallback(() => {
    gameTimeRef.current += 16; 

    setBird(prevBird => {
      const newVelocity = prevBird.velocity + BIRD_GRAVITY;
      const newY = prevBird.y + newVelocity;
      let newRotation = newVelocity * BIRD_ROTATION_SPEED_FACTOR;
      newRotation = Math.max(BIRD_MIN_ROTATION, Math.min(BIRD_MAX_ROTATION, newRotation));
      return { y: newY, velocity: newVelocity, rotation: newRotation };
    });

    setPipes(prevPipes => prevPipes.map(p => ({ ...p, x: p.x - levelConfig.pipeSpeed })).filter(p => p.x + PIPE_WIDTH > 0));

    pipeSpawnTimerRef.current += 16;
    if (pipeSpawnTimerRef.current >= levelConfig.pipeSpawnInterval) {
      pipeSpawnTimerRef.current = 0;
      const topPipeHeight = MIN_PIPE_HEIGHT + Math.random() * (GAME_HEIGHT - MIN_PIPE_HEIGHT * 2 - levelConfig.pipeGap - GROUND_HEIGHT); // Ensure gap for ground
      setPipes(prevPipes => [
        ...prevPipes,
        { id: `pipe-${Date.now()}`, x: GAME_WIDTH, topHeight: topPipeHeight, passed: false },
      ]);
    }

    setClouds(prevClouds => 
      prevClouds.map(c => {
        let newX = c.x - c.speed;
        if (newX + c.width < 0) { 
          newX = GAME_WIDTH; 
          c.y = CLOUD_MIN_Y + Math.random() * (CLOUD_MAX_Y - CLOUD_MIN_Y); 
        }
        return { ...c, x: newX };
      })
    );

    const birdRect = { x: BIRD_INITIAL_X + (BIRD_SIZE*1.5 - BIRD_SIZE)/2, y: bird.y, width: BIRD_SIZE, height: BIRD_SIZE }; // Adjusted for new bird visual center

    if (bird.y < 0 || bird.y + BIRD_SIZE > GAME_HEIGHT - GROUND_HEIGHT) {
      onGameOver(score, currentLevel);
      return;
    }

    for (let i = 0; i < pipes.length; i++) {
      const p = pipes[i];
      const topPipeRect = { x: p.x, y: 0, width: PIPE_WIDTH, height: p.topHeight };
      const bottomPipeRect = { x: p.x, y: p.topHeight + levelConfig.pipeGap, width: PIPE_WIDTH, height: GAME_HEIGHT - (p.topHeight + levelConfig.pipeGap) };

      const collidesWithTop = birdRect.x < topPipeRect.x + topPipeRect.width &&
                              birdRect.x + birdRect.width > topPipeRect.x &&
                              birdRect.y < topPipeRect.y + topPipeRect.height &&
                              birdRect.y + birdRect.height > topPipeRect.y;
      
      const collidesWithBottom = birdRect.x < bottomPipeRect.x + bottomPipeRect.width &&
                                 birdRect.x + birdRect.width > bottomPipeRect.x &&
                                 birdRect.y < bottomPipeRect.y + bottomPipeRect.height &&
                                 birdRect.y + birdRect.height > bottomPipeRect.y;

      if (collidesWithTop || collidesWithBottom) {
        onGameOver(score, currentLevel);
        return;
      }

      if (!p.passed && p.x + PIPE_WIDTH < birdRect.x) { // Check against bird's X position
        setPipes(prev => prev.map(pipeL => pipeL.id === p.id ? { ...pipeL, passed: true } : pipeL));
        setScore(s => {
            const newScore = s + 1;
            onScoreUpdate(newScore);
            return newScore;
        });
      }
    }
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [bird.y, pipes, score, currentLevel, levelConfig, onGameOver, onScoreUpdate, flap]);


  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameLoop]);


  return (
    <div 
      ref={gameAreaRef}
      className="relative overflow-hidden bg-gradient-to-b from-blue-400 to-blue-600 shadow-2xl rounded-lg border-4 border-blue-700"
      style={{ width: `${GAME_WIDTH}px`, height: `${GAME_HEIGHT}px` }}
      role="main"
      aria-label="Flappy Bird game area"
    >
      {clouds.map(cloud => <CloudComponent key={cloud.id} cloud={cloud} />)}
      
      {pipes.map(pipe => <PipeComponent key={pipe.id} pipe={pipe} gap={levelConfig.pipeGap} />)}
      
      <Bird y={bird.y} rotation={bird.rotation} isFlapping={isFlapping} />

      <div 
        className="absolute bottom-0 left-0 w-full bg-green-600 border-t-4 border-green-800 z-10" // z-10 to be above clouds but below bird/pipes if they overlap ground visually
        style={{ height: `${GROUND_HEIGHT}px` }}
      >
        <div className="absolute -top-1 left-0 w-full h-2 bg-yellow-800/30"/>
      </div>
      
      <ScoreDisplay score={score} />
      <LevelIndicator level={currentLevel} />
    </div>
  );
};

export default GamePlay;
