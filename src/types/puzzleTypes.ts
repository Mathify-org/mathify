
// Available value types (replacing shapes with numbers)
export type NumberType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

// Available operation types
export type OperationType = "+" | "-" | "*" | "/";

// Feedback types (Wordle-like)
export type FeedbackType = "correct" | "wrong-position" | "incorrect";

// Represents a guess in the game
export interface Guess {
  values: NumberType[];
  operations: (OperationType | null)[];
  feedback: FeedbackType[];
  result: number;
}

// Game status type
export type GameStatusType = "playing" | "won" | "lost";

// Game state interface
export interface GameState {
  guesses: Guess[];
  currentGuess: {
    values: (NumberType | null)[];
    operations: (OperationType | null)[];
  };
  dailyPuzzle: {
    availableNumbers: NumberType[];
    availableOperations: OperationType[];
    solution: {
      values: NumberType[];
      operations: (OperationType | null)[];
    };
    target: number;
  };
  maxGuesses: number;
  gameStatus: GameStatusType;
  streak: number;
  hintsUsed: number;
  maxHints: number;
  lastPlayedDate: string | null;
}
