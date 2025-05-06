
import React, { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { NumberType, OperationType, FeedbackType, GameState, GameStatusType, Guess } from "@/types/puzzleTypes";
import { 
  generateDailyPuzzle, 
  checkGuess, 
  evaluateEquation,
  getTimeToNextPuzzle,
  generateShareText
} from "@/utils/numberPuzzleUtils";
import DraggableNumber from "@/components/puzzle/DraggableNumber";
import EquationSlot from "@/components/puzzle/EquationSlot";
import CountdownTimer from "@/components/puzzle/CountdownTimer";
import ShareResults from "@/components/puzzle/ShareResults";
import HintButton from "@/components/puzzle/HintButton";
import { Button } from "@/components/ui/button";
import { RefreshCw, X, CheckCircle2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const MAX_GUESSES = 5;
const MAX_HINTS = 2;
const MAX_EQUATION_LENGTH = 9; // Increased to allow for more alternating numbers/operations
const STORAGE_KEY = "mathify_daily_puzzle";

const DailyMathPuzzle: React.FC = () => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>({
    guesses: [],
    currentGuess: {
      values: Array(MAX_EQUATION_LENGTH).fill(null),
      operations: Array(MAX_EQUATION_LENGTH - 1).fill(null)
    },
    dailyPuzzle: {
      availableNumbers: [],
      availableOperations: [],
      solution: {
        values: [],
        operations: []
      },
      target: 0,
    },
    maxGuesses: MAX_GUESSES,
    gameStatus: "playing" as GameStatusType,
    streak: 0,
    hintsUsed: 0,
    maxHints: MAX_HINTS,
    lastPlayedDate: null,
  });

  const [showRules, setShowRules] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [revealedHint, setRevealedHint] = useState<NumberType | OperationType | null>(null);
  const [revealedHintIsOp, setRevealedHintIsOp] = useState(false);

  // Load game state from localStorage and initialize
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    try {
      // Get today's date as a string
      const today = new Date().toDateString();
      
      // Try to load saved game state
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState) as GameState;
        
        // Check if this is from today
        if (parsedState.lastPlayedDate === today) {
          setGameState(parsedState);
          return;
        }
      }
      
      // If no valid saved state, create a new puzzle
      const newPuzzle = generateDailyPuzzle();
      const streakValue = savedState ? JSON.parse(savedState).streak : 0;
      
      setGameState({
        guesses: [],
        currentGuess: {
          values: Array(MAX_EQUATION_LENGTH).fill(null),
          operations: Array(MAX_EQUATION_LENGTH - 1).fill(null)
        },
        dailyPuzzle: newPuzzle,
        maxGuesses: MAX_GUESSES,
        gameStatus: "playing" as GameStatusType,
        streak: streakValue,
        hintsUsed: 0,
        maxHints: MAX_HINTS,
        lastPlayedDate: today,
      });
      
      // Show rules for first-time users
      if (!localStorage.getItem("mathify_puzzle_rules_seen")) {
        setShowRules(true);
        localStorage.setItem("mathify_puzzle_rules_seen", "true");
      }
    } catch (error) {
      console.error("Error initializing game:", error);
      toast({
        title: "Error loading puzzle",
        description: "There was an error loading today's puzzle. Please try refreshing the page.",
        variant: "destructive",
      });
    }
  };

  // Save game state to localStorage when it changes
  useEffect(() => {
    if (gameState.dailyPuzzle.availableNumbers.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    }
  }, [gameState]);

  const handleDrop = useCallback((id: string, droppedId: string) => {
    if (gameState.gameStatus !== "playing") return;
    
    const slotIndex = parseInt(id.replace("slot-", ""), 10);
    const isEvenIndex = slotIndex % 2 === 0; // Even indices for numbers, odd for operations
    
    let slotType: "value" | "operation" = isEvenIndex ? "value" : "operation";
    
    if (droppedId.startsWith("number-")) {
      const numberValue = parseInt(droppedId.replace("number-", ""), 10) as NumberType;
      
      if (slotType !== "value") return; // Numbers can only go in value slots
      
      setGameState(prev => {
        const newValues = [...prev.currentGuess.values];
        newValues[slotIndex / 2] = numberValue;
        
        return {
          ...prev,
          currentGuess: {
            ...prev.currentGuess,
            values: newValues
          }
        };
      });
    } 
    else if (droppedId.startsWith("op-")) {
      const opValue = droppedId.replace("op-", "") as OperationType;
      
      if (slotType !== "operation") return; // Operations can only go in operation slots
      
      setGameState(prev => {
        const newOps = [...prev.currentGuess.operations];
        newOps[(slotIndex - 1) / 2] = opValue;
        
        return {
          ...prev,
          currentGuess: {
            ...prev.currentGuess,
            operations: newOps
          }
        };
      });
    }
  }, [gameState.gameStatus]);

  const clearValueSlot = (index: number) => {
    if (gameState.gameStatus !== "playing") return;
    
    setGameState(prev => {
      const newValues = [...prev.currentGuess.values];
      newValues[index] = null;
      
      return {
        ...prev,
        currentGuess: {
          ...prev.currentGuess,
          values: newValues
        }
      };
    });
  };

  const clearOpSlot = (index: number) => {
    if (gameState.gameStatus !== "playing") return;
    
    setGameState(prev => {
      const newOps = [...prev.currentGuess.operations];
      newOps[index] = null;
      
      return {
        ...prev,
        currentGuess: {
          ...prev.currentGuess,
          operations: newOps
        }
      };
    });
  };

  const resetCurrentGuess = () => {
    setGameState(prev => ({
      ...prev,
      currentGuess: {
        values: Array(MAX_EQUATION_LENGTH).fill(null),
        operations: Array(MAX_EQUATION_LENGTH - 1).fill(null)
      }
    }));
  };

  const submitGuess = () => {
    if (gameState.gameStatus !== "playing") return;

    // Extract non-null values and operations
    const values = gameState.currentGuess.values.filter(val => val !== null) as NumberType[];
    const operations = gameState.currentGuess.operations.filter((op, index) => 
      op !== null && index < values.length - 1
    ) as OperationType[];
    
    if (values.length < 2) {
      toast({
        title: "Too short",
        description: "Your equation needs at least 2 numbers",
      });
      return;
    }

    if (operations.length < values.length - 1) {
      toast({
        title: "Incomplete equation",
        description: "Make sure you have operations between all numbers",
      });
      return;
    }

    // Calculate the result of the current guess
    const guessValue = evaluateEquation(values, operations);

    // Fill in operations array to match expected length
    const paddedOps = [...operations];
    while (paddedOps.length < values.length - 1) {
      paddedOps.push(null);
    }

    // Check the guess against the solution
    const feedback = checkGuess(
      values,
      paddedOps,
      gameState.dailyPuzzle.solution.values,
      gameState.dailyPuzzle.solution.operations
    );
    
    const newGuess: Guess = {
      values,
      operations: paddedOps,
      feedback,
      result: guessValue
    };

    const updatedGuesses = [...gameState.guesses, newGuess];
    
    // Check if the player won
    const isCorrect = guessValue === gameState.dailyPuzzle.target;
    const isLastGuess = updatedGuesses.length >= MAX_GUESSES;
    
    let newGameStatus: GameStatusType = gameState.gameStatus;
    let newStreak = gameState.streak;
    
    if (isCorrect) {
      newGameStatus = "won";
      newStreak += 1;
      toast({
        title: "Correct!",
        description: `You solved today's puzzle in ${updatedGuesses.length} tries!`,
      });
    } else if (isLastGuess) {
      newGameStatus = "lost";
      newStreak = 0;
      toast({
        title: "Game Over",
        description: "You've used all your attempts. Better luck tomorrow!",
        variant: "destructive",
      });
    } else {
      // Give feedback on how close they are
      const diff = Math.abs(guessValue - gameState.dailyPuzzle.target);
      let message = "";
      
      if (diff > 20) {
        message = "Not even close!";
      } else if (diff > 10) {
        message = "Getting warmer...";
      } else if (diff > 5) {
        message = "You're getting close!";
      } else if (diff > 0) {
        message = "So close! Just a bit off.";
      }
      
      if (message) {
        toast({
          title: `Your result: ${guessValue}`,
          description: message,
        });
      }
    }
    
    setGameState(prev => ({
      ...prev,
      guesses: updatedGuesses,
      currentGuess: {
        values: Array(MAX_EQUATION_LENGTH).fill(null),
        operations: Array(MAX_EQUATION_LENGTH - 1).fill(null)
      },
      gameStatus: newGameStatus,
      streak: newStreak,
    }));
  };

  const useHint = () => {
    if (gameState.hintsUsed >= MAX_HINTS || gameState.gameStatus !== "playing") return;
    
    // Decide whether to reveal a number or an operation
    const revealOperation = Math.random() > 0.5 && gameState.dailyPuzzle.solution.operations.some(op => op !== null);
    
    if (revealOperation) {
      // Choose a random operation from the solution
      const availableOps = gameState.dailyPuzzle.solution.operations.filter(op => op !== null) as OperationType[];
      
      if (availableOps.length > 0) {
        const randomOp = availableOps[Math.floor(Math.random() * availableOps.length)];
        
        setRevealedHint(randomOp);
        setRevealedHintIsOp(true);
        setShowHint(true);
      }
    } else {
      // Choose a random number from the solution
      const availableNums = gameState.dailyPuzzle.solution.values;
      
      if (availableNums.length > 0) {
        const randomNum = availableNums[Math.floor(Math.random() * availableNums.length)];
        
        setRevealedHint(randomNum);
        setRevealedHintIsOp(false);
        setShowHint(true);
      }
    }
    
    setGameState(prev => ({
      ...prev,
      hintsUsed: prev.hintsUsed + 1
    }));
  };

  const getEquationSlots = () => {
    // Create alternating slots for numbers and operations
    const slots = [];
    let numOfValues = 0;
    
    for (let i = 0; i < MAX_EQUATION_LENGTH; i++) {
      const isOperationSlot = i % 2 === 1;
      
      if (isOperationSlot) {
        // This is an operation slot
        const opIndex = (i - 1) / 2;
        const currentOp = gameState.currentGuess.operations[opIndex];
        
        if (numOfValues < 2) {
          continue; // Skip operation slots until we have at least 2 values
        }
        
        slots.push(
          <div key={`slot-${i}`} className="relative">
            <EquationSlot 
              id={`slot-${i}`} 
              value={currentOp}
              isOperator={true}
            />
            {currentOp && (
              <button 
                onClick={() => clearOpSlot(opIndex)}
                className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 shadow-sm"
              >
                <X size={12} />
              </button>
            )}
          </div>
        );
      } else {
        // This is a value slot
        const valueIndex = i / 2;
        const currentValue = gameState.currentGuess.values[valueIndex];
        
        slots.push(
          <div key={`slot-${i}`} className="relative">
            <EquationSlot 
              id={`slot-${i}`} 
              value={currentValue}
              isOperator={false}
            />
            {currentValue && (
              <button 
                onClick={() => clearValueSlot(valueIndex)}
                className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 shadow-sm"
              >
                <X size={12} />
              </button>
            )}
          </div>
        );
        
        numOfValues++;
      }
    }
    return slots;
  };

  const getAvailableNumbers = () => {
    return gameState.dailyPuzzle.availableNumbers.map((num) => {
      // Count how many times this number has been used in the current guess
      const usedCount = gameState.currentGuess.values.filter(v => v === num).length;
      
      // Disable if we've already used this number too many times (e.g., 2 times)
      const isDisabled = usedCount >= 2;
      
      return (
        <DraggableNumber 
          key={`number-${num}`}
          id={`number-${num}`}
          value={num}
          isOperator={false}
          disabled={isDisabled}
        />
      );
    });
  };

  const getAvailableOperations = () => {
    return gameState.dailyPuzzle.availableOperations.map((op) => {
      return (
        <DraggableNumber 
          key={`op-${op}`}
          id={`op-${op}`}
          value={op}
          isOperator={true}
        />
      );
    });
  };

  const getPreviousGuesses = () => {
    return gameState.guesses.map((guess, index) => {
      // Create an array with alternating values and operations
      const elements = [];
      
      for (let i = 0; i < guess.values.length; i++) {
        elements.push(
          <DraggableNumber 
            key={`guess-${index}-value-${i}`}
            id={`guess-${index}-value-${i}`}
            value={guess.values[i]}
            feedback={guess.feedback[2*i]} // Adjust feedback index
            isOperator={false}
            disabled={true}
          />
        );
        
        if (i < guess.values.length - 1) {
          elements.push(
            <DraggableNumber 
              key={`guess-${index}-op-${i}`}
              id={`guess-${index}-op-${i}`}
              value={guess.operations[i] as OperationType}
              feedback={guess.feedback[2*i+1]} // Adjust feedback index
              isOperator={true}
              disabled={true}
            />
          );
        }
      }
      
      return (
        <div key={index} className="flex flex-col items-center gap-2 mb-4">
          <div className="flex items-center gap-2">
            {elements}
            <span className="ml-2 text-lg">=</span>
            <span className="ml-2 text-lg font-semibold">{guess.result}</span>
          </div>
        </div>
      );
    });
  };

  // Display a loading state while the game initializes
  if (gameState.dailyPuzzle.availableNumbers.length === 0) {
    return (
      <div className="container max-w-md mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-center mb-6">Daily Math Puzzle</h1>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-lg bg-gray-200 h-4 w-32 mb-4"></div>
            <div className="rounded-lg bg-gray-200 h-12 w-40"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto py-6 md:py-8 px-4">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-4">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">
          Daily Math Puzzle
        </span>
      </h1>

      {/* Game status section */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <div>
            <p className="font-medium">Target:</p>
            <p className="text-2xl font-bold text-purple-700">{gameState.dailyPuzzle.target}</p>
          </div>
          <div>
            <p className="font-medium">Streak:</p>
            <p className="text-2xl font-bold text-amber-600">{gameState.streak}</p>
          </div>
          <div>
            <p className="font-medium">Attempts:</p>
            <p className="text-2xl font-bold">{gameState.guesses.length}/{MAX_GUESSES}</p>
          </div>
        </div>
      </div>

      {/* Previous guesses */}
      {gameState.guesses.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-lg font-medium mb-3">Previous Attempts</h2>
          <div className="space-y-4">
            {getPreviousGuesses()}
          </div>
        </div>
      )}

      {/* Game over section */}
      {gameState.gameStatus !== "playing" && (
        <div className={`bg-white rounded-lg shadow-md p-4 mb-6 border-l-4 ${
          gameState.gameStatus === "won" ? "border-green-500" : "border-red-500"
        }`}>
          <h2 className="text-lg font-bold mb-2">
            {gameState.gameStatus === "won" ? "Congratulations!" : "Game Over"}
          </h2>
          <p>
            {gameState.gameStatus === "won" 
              ? `You solved today's puzzle in ${gameState.guesses.length} ${gameState.guesses.length === 1 ? 'try' : 'tries'}!` 
              : "Better luck next time!"}
          </p>
          
          {gameState.gameStatus === "lost" && (
            <p className="mt-2">
              The correct answer was: <span className="font-medium">
                {gameState.dailyPuzzle.target}
              </span>
            </p>
          )}
          
          <CountdownTimer />
          <ShareResults 
            guesses={gameState.guesses.length}
            maxGuesses={MAX_GUESSES}
            won={gameState.gameStatus === "won"}
            streak={gameState.streak}
          />
        </div>
      )}

      {/* Current equation builder */}
      {gameState.gameStatus === "playing" && (
        <>
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-lg font-medium mb-3">Build Your Equation</h2>
            <p className="text-sm text-gray-600 mb-4">
              Create an equation using the numbers and operations below that equals {gameState.dailyPuzzle.target}
            </p>
            
            <div className="flex justify-center items-center gap-1 mb-6 flex-wrap">
              {getEquationSlots()}
              <span className="text-lg font-semibold ml-2">=</span>
              <span className="text-lg font-semibold ml-2">{gameState.dailyPuzzle.target}</span>
            </div>
            
            <div className="flex justify-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={resetCurrentGuess}
                className="flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Reset
              </Button>
              <Button
                size="sm"
                onClick={submitGuess}
                className="flex items-center gap-2"
              >
                <CheckCircle2 size={16} />
                Submit
              </Button>
              <HintButton 
                hintsUsed={gameState.hintsUsed}
                maxHints={gameState.maxHints}
                onUseHint={useHint}
              />
            </div>
          </div>
          
          {/* Available numbers and operations */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-lg font-medium mb-3">Available Numbers</h2>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2 justify-items-center mb-4">
              {getAvailableNumbers()}
            </div>
            
            <h2 className="text-lg font-medium my-3">Available Operations</h2>
            <div className="grid grid-cols-4 gap-2 justify-items-center">
              {getAvailableOperations()}
            </div>
            
            <p className="text-sm text-gray-500 mt-3 text-center">
              Drag numbers and operations to the slots above to build your equation
            </p>
          </div>
        </>
      )}
      
      {/* Rules dialog */}
      <AlertDialog open={showRules} onOpenChange={setShowRules}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>How to Play</AlertDialogTitle>
            <AlertDialogDescription>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Create an equation using numbers and operations to reach the target number.</li>
                <li>Drag numbers and operations to the slots to build your equation.</li>
                <li>You have {MAX_GUESSES} attempts to solve the puzzle.</li>
                <li>After each guess, you'll get feedback:
                  <ul className="pl-5 mt-1">
                    <li><span className="text-green-600 font-medium">Green</span>: Correct value in correct position</li>
                    <li><span className="text-yellow-600 font-medium">Yellow</span>: Correct value in wrong position</li>
                    <li><span className="text-gray-500 font-medium">Gray</span>: Value doesn't belong in the equation</li>
                  </ul>
                </li>
                <li>You can use {MAX_HINTS} hints per day if you get stuck.</li>
                <li>A new puzzle will be available every day!</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Start Playing</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Hint dialog */}
      <AlertDialog open={showHint} onOpenChange={setShowHint}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hint</AlertDialogTitle>
            <AlertDialogDescription>
              {revealedHint && (
                <div className="flex flex-col items-center gap-2 py-4">
                  <p>This {revealedHintIsOp ? "operation" : "number"} is part of the solution:</p>
                  <div className="p-2 bg-yellow-100 rounded-lg border border-yellow-300">
                    <DraggableNumber
                      id="hint-value"
                      value={revealedHint}
                      isOperator={revealedHintIsOp}
                      disabled={false}
                    />
                  </div>
                </div>
              )}
              <p className="mt-2 text-sm text-gray-500">
                You have used {gameState.hintsUsed} of {MAX_HINTS} hints for today's puzzle.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Got it</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Help button */}
      <div className="text-center mt-6">
        <Button 
          variant="ghost" 
          onClick={() => setShowRules(true)}
          className="text-sm text-gray-500 hover:text-gray-800"
        >
          How to Play
        </Button>
      </div>
    </div>
  );
};

export default DailyMathPuzzle;
