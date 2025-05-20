
export type FractionType = "half" | "third" | "quarter" | "fifth" | "sixth";

export interface FractionData {
  numerator: number;
  denominator: number;
  type: FractionType;
  id: string;
  value: number;
}

export type GameMode = "menu" | "frenzy" | "practice" | "survival";

export type Theme = "pizza" | "pie" | "chocolate" | "liquid" | "grid";

export type Difficulty = "halves" | "thirds" | "quarters" | "mixed";

export interface GameStats {
  bestFrenzyScore: number;
  totalCorrect: number;
  longestStreak: number;
  currentStreak: number;
  survivalModeUnlocked: boolean;
  selectedTheme: string; // Theme
}
