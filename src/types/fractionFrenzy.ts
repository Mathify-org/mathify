
export type FractionType = "half" | "third" | "quarter" | "fifth" | "sixth";

export interface FractionData {
  numerator: number;
  denominator: number;
  type: FractionType;
  id: string;
  value: number;
}

export type GameMode = "visual-match" | "equivalent" | "arithmetic" | "word-problems";

export type Theme = "pizza" | "pie" | "chocolate" | "liquid" | "grid";

export type Difficulty = "easy" | "medium" | "hard" | "halves" | "thirds" | "quarters" | "mixed";

export type GameState = "menu" | "playing" | "gameOver";

export interface FractionQuestion {
  id: string;
  type: GameMode;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  fractionData?: {
    numerator: number;
    denominator: number;
    value: number;
  };
}

export interface GameStats {
  bestFrenzyScore: number;
  totalCorrect: number;
  longestStreak: number;
  currentStreak: number;
  survivalModeUnlocked: boolean;
  selectedTheme: string;
  // Game session stats
  score: number;
  questionsAnswered: number;
  correctAnswers: number;
  streak: number;
  timeRemaining: number;
  totalTime: number;
}
