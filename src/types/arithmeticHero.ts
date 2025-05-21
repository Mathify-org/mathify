
// Game state types
export type GameState = "menu" | "playing" | "gameover" | "other";
export type GameMode = "arcade" | "practice" | "challenge";
export type AnswerMethod = "type" | "multichoice";
export type OperationType = "+" | "-" | "×" | "÷";

// Level definitions
export interface LevelConfig {
  id: number;
  name: string;
  description: string;
  minDigits: [number, number]; // [first number min digits, second number min digits]
  maxDigits: [number, number]; // [first number max digits, second number max digits]
  allowNegative: boolean;
  speed: number; // Base falling speed in ms
  speedIncrease: number; // How much to increase speed per wave
  numEquationsPerWave: number;
  unlockThreshold: number; // Score needed to unlock next level
  operations: OperationType[]; // Available operations for this level
}

// Problem definition
export interface MathProblem {
  id: string;
  firstNumber: number;
  secondNumber: number;
  operation: OperationType;
  correctAnswer: number;
  options?: number[]; // For multiple choice
  position: {
    x: number; // Horizontal position (%)
    y: number; // Vertical position (%)
  };
  speed: number; // Individual fall speed
  isSolved: boolean;
  isPowerup?: boolean;
  powerupType?: PowerupType;
}

// Game metrics
export interface GameStats {
  score: number;
  streak: number;
  longestStreak: number;
  shieldHealth: number;
  correctAnswers: number;
  incorrectAnswers: number;
}

// Player progress data
export interface PlayerProgress {
  highScores: {
    arcade: number[];
    challenge: number;
  };
  unlockedLevels: number;
  totalCorrectAnswers: number;
  longestStreak: number;
  achievements: Achievement[];
  pendingAchievements: Achievement[];
  avatarItems: AvatarItems;
  unlockedItems: string[];
}

// Achievements
export interface Achievement {
  id: string;
  name: string;
  description: string;
  isUnlocked: boolean;
  icon: string; // Icon name from Lucide icons
}

// Avatar customization
export interface AvatarItems {
  cape: string;
  mask: string;
  color: string;
  emblem: string;
}

// Power-ups
export type PowerupType = "slowMotion" | "doublePoints" | "shield" | "multiZap";

// Animation types
export type AnimationType = "zap" | "crash" | "powerup" | "levelUp";
