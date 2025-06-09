
export interface BirdState {
  y: number;
  velocity: number;
  rotation: number;
}

export interface Pipe {
  id: string;
  x: number;
  topHeight: number; // Height of the top pipe piece
  passed: boolean;
}

export interface Cloud {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  style: number; // To vary cloud appearance
}

export enum GameStatus {
  StartScreen,
  Playing,
  GameOver,
}

export interface LevelConfig {
  pipeSpeed: number;
  pipeGap: number;
  pipeSpawnInterval: number;
}
