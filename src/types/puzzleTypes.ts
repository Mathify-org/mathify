
// Available shape types
export type ShapeType = "circle" | "square" | "triangle" | "hexagon" | "star" | "clock";

// Feedback types (Wordle-like)
export type FeedbackType = "correct" | "wrong-position" | "incorrect";

// Represents a guess in the game
export interface Guess {
  shapes: ShapeType[];
  feedback: FeedbackType[];
  value: number;
}

// Game status type
export type GameStatusType = "playing" | "won" | "lost";

// Game state interface
export interface GameState {
  guesses: Guess[];
  currentGuess: ShapeType[];
  dailyPuzzle: {
    shapes: ShapeType[];
    solution: ShapeType[];
    target: number;
    shapeValues: Record<ShapeType, number>;
    operations: Record<ShapeType, string>;
  };
  maxGuesses: number;
  gameStatus: GameStatusType;
  streak: number;
  hintsUsed: number;
  maxHints: number;
  lastPlayedDate: string | null;
}
