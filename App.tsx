
import React, { useState, useEffect, useCallback, CSSProperties } from 'react';
import GamePlay from './components/GamePlay';
import StartScreen from './components/StartScreen';
import GameOverScreen from './components/GameOverScreen';
import ProfileBadge from './components/ProfileBadge';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useKeyAction } from './hooks/useKeyAction';
import { useWindowSize } from './hooks/useWindowSize';
import type { GameStatus as GameStatusType, LevelConfig } from './types';
import { GameStatus } from './types';
import {
  GAME_WIDTH, GAME_HEIGHT,
  MAX_LEVELS, SCORE_TO_LEVEL_UP, FLAP_KEY,
  PIPE_GAP_BASE, PIPE_GAP_REDUCTION_PER_LEVEL, PIPE_GAP_MIN_POSSIBLE,
  PIPE_SPEED_BASE, PIPE_SPEED_INCREMENT_PER_LEVEL, PIPE_SPEED_MAX,
  PIPE_SPAWN_INTERVAL_BASE, PIPE_SPAWN_INTERVAL_REDUCTION_PER_LEVEL, PIPE_SPAWN_INTERVAL_MIN
} from './constants';

const App: React.FC = () => {
  const [gameStatus, setGameStatus] = useState<GameStatusType>(GameStatus.StartScreen);
  const [highScore, setHighScore] = useLocalStorage<number>('flappyFunHighScore', 0);
  const [playerName, setPlayerName] = useLocalStorage<string>('flappyFunPlayerName', 'Player');
  const [currentScore, setCurrentScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [finalScore, setFinalScore] = useState(0);
  const [finalLevel, setFinalLevel] = useState(1);

  const windowSize = useWindowSize();

  const calculateLevelConfig = useCallback((level: number): LevelConfig => {
    const effectiveLevel = Math.min(level, MAX_LEVELS);
    
    const pipeGap = Math.max(
      PIPE_GAP_MIN_POSSIBLE,
      PIPE_GAP_BASE - (effectiveLevel - 1) * PIPE_GAP_REDUCTION_PER_LEVEL
    );
    const pipeSpeed = Math.min(
      PIPE_SPEED_MAX,
      PIPE_SPEED_BASE + (effectiveLevel - 1) * PIPE_SPEED_INCREMENT_PER_LEVEL
    );
    const pipeSpawnInterval = Math.max(
      PIPE_SPAWN_INTERVAL_MIN,
      PIPE_SPAWN_INTERVAL_BASE - (effectiveLevel - 1) * PIPE_SPAWN_INTERVAL_REDUCTION_PER_LEVEL
    );

    return { pipeGap, pipeSpeed, pipeSpawnInterval };
  }, []);

  const [levelConfig, setLevelConfig] = useState<LevelConfig>(calculateLevelConfig(1));

  useEffect(() => {
    setLevelConfig(calculateLevelConfig(currentLevel));
  }, [currentLevel, calculateLevelConfig]);
  
  const handleStartGame = useCallback(() => {
    setCurrentScore(0);
    setCurrentLevel(1);
    setLevelConfig(calculateLevelConfig(1));
    setGameStatus(GameStatus.Playing);
  }, [calculateLevelConfig]);

  const handleGameOver = useCallback((score: number, levelAchieved: number) => {
    setFinalScore(score);
    setFinalLevel(levelAchieved);
    if (score > highScore) {
      setHighScore(score);
    }
    setGameStatus(GameStatus.GameOver);
  }, [highScore, setHighScore]);

  const handleRestart = useCallback(() => {
    handleStartGame();
  }, [handleStartGame]);

  const handleScoreUpdate = useCallback((newScore: number) => {
    setCurrentScore(newScore);
    const newLevel = Math.floor(newScore / SCORE_TO_LEVEL_UP) + 1;
    if (newLevel !== currentLevel && newLevel <= MAX_LEVELS) {
      setCurrentLevel(newLevel);
    }
  }, [currentLevel]);

  useKeyAction(FLAP_KEY, () => {
    if (gameStatus === GameStatus.GameOver) {
      handleRestart();
    } else if (gameStatus === GameStatus.StartScreen) {
      handleStartGame();
    }
    // Flap action during GameStatus.Playing is handled within GamePlay.tsx
  }, gameStatus === GameStatus.GameOver || gameStatus === GameStatus.StartScreen);


  const handleNameChange = (name: string) => {
    setPlayerName(name);
  };

  const scale = Math.min(windowSize.width / GAME_WIDTH, windowSize.height / GAME_HEIGHT, 1); // Cap scale at 1 to prevent upsizing beyond native

  const gameAreaStyle: CSSProperties = {
    width: `${GAME_WIDTH}px`,
    height: `${GAME_HEIGHT}px`,
    transform: `scale(${scale})`,
    transformOrigin: 'center center',
    position: 'relative', // For absolute positioning of children like StartScreen, GameOverScreen
    overflow: 'hidden', // Crucial to clip content outside GAME_WIDTH/GAME_HEIGHT
    // Drop shadow for the game area
    boxShadow: '0 10px 25px rgba(0,0,0,0.3), 0 5px 10px rgba(0,0,0,0.2)',
    borderRadius: '0.5rem', // Match GamePlay's border radius if any visible part
  };
  
  // Prevent default touch behavior on space press for mobile, if FLAP_KEY is space
  useEffect(() => {
    const preventSpaceScroll = (event: TouchEvent) => {
      if (FLAP_KEY === ' ' && gameStatus !== GameStatus.Playing) { // Only prevent if space is flap key and not in active gameplay where GamePlay handles it
         // This is tricky, as GamePlay has its own key handler.
         // This effect is more for Start/Game Over screens if space is used there.
      }
    };
    // This is better handled directly in useKeyAction or Start/Game Over screen buttons.
    // For now, primary input is keyboard, mobile touch on buttons.
  }, [gameStatus]);


  return (
    // Main container for the entire application, centers the game area
    <div className="w-full h-full flex items-center justify-center bg-gray-800 select-none antialiased game-area" role="application">
      <ProfileBadge highScore={highScore} onNameChange={handleNameChange} initialName={playerName}/>
      
      <div style={gameAreaStyle}>
        {/* All game content now lives inside the scaled container */}
        {gameStatus === GameStatus.StartScreen && <StartScreen onStart={handleStartGame} />}
        
        {gameStatus === GameStatus.Playing && (
          <GamePlay 
            onGameOver={handleGameOver} 
            currentLevel={currentLevel}
            levelConfig={levelConfig}
            onScoreUpdate={handleScoreUpdate}
          />
        )}
        
        {gameStatus === GameStatus.GameOver && (
          <GameOverScreen 
            score={finalScore} 
            highScore={highScore} 
            level={finalLevel}
            onRestart={handleRestart} 
          />
        )}
      </div>
      
      <footer className="absolute bottom-2 text-center w-full pointer-events-none">
        <p className="text-xs text-gray-400 font-fredoka opacity-75">
          Flappy Fun Adventure
        </p>
      </footer>
    </div>
  );
};

export default App;
