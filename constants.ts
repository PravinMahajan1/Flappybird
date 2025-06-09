
export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

export const BIRD_SIZE = 40;
export const BIRD_FLAP_STRENGTH = -9; // Adjusted for better feel
export const BIRD_GRAVITY = 0.5;
export const BIRD_MAX_ROTATION = 45; // degrees
export const BIRD_MIN_ROTATION = -30; // degrees
export const BIRD_ROTATION_SPEED_FACTOR = 5; // Multiplier for velocity to rotation

export const BIRD_INITIAL_X = GAME_WIDTH / 4;
export const BIRD_INITIAL_Y = GAME_HEIGHT / 2 - BIRD_SIZE / 2;

export const PIPE_WIDTH = 80;
export const PIPE_COLOR = "bg-green-500";
export const PIPE_BORDER_COLOR = "border-green-700";
export const MIN_PIPE_HEIGHT = 50; // Minimum height for a section of pipe (top or bottom)

// Base values for level 1
export const PIPE_GAP_BASE = 200; // Initial gap size
export const PIPE_SPEED_BASE = 3; // Initial speed (px per update)
export const PIPE_SPAWN_INTERVAL_BASE = 1800; // ms

// Difficulty scaling per level
export const PIPE_GAP_REDUCTION_PER_LEVEL = 2; // How much gap reduces
export const PIPE_SPEED_INCREMENT_PER_LEVEL = 0.075;
export const PIPE_SPAWN_INTERVAL_REDUCTION_PER_LEVEL = 25; // ms

// Min/max limits for parameters
export const PIPE_GAP_MIN_POSSIBLE = 120; // Smallest allowed gap
export const PIPE_SPEED_MAX = 7;
export const PIPE_SPAWN_INTERVAL_MIN = 900; // Fastest spawn rate

export const MAX_LEVELS = 50;
export const SCORE_TO_LEVEL_UP = 5; // Score needed to advance one level

export const CLOUD_COUNT = 5;
export const CLOUD_MIN_SPEED = 0.5;
export const CLOUD_MAX_SPEED = 1.5;
export const CLOUD_MIN_Y = 20;
export const CLOUD_MAX_Y = GAME_HEIGHT / 3;

export const GROUND_HEIGHT = 20; // Visual ground, not a collision object for game over (top/bottom screen bounds are)

export const FLAP_KEY = " "; // Using " " (Space) for flap
