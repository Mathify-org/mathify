import React, { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { ShapeType, GameState, Guess, FeedbackType, GameStatusType } from "@/types/puzzleTypes";
import { 
  generateDailyPuzzle, 
  checkGuess, 
  evaluateEquation 
} from "@/utils/dailyPuzzleUtils";
import DraggableShape from "@/components/puzzle/DraggableShape";
import EquationSlot from "@/components/puzzle/EquationSlot";
import CountdownTimer from "@/components/puzzle/CountdownTimer";
import ShareResults from "@/components/puzzle/ShareResults";
import HintButton from "@/components/puzzle/HintButton";
import { Button } from "@/components/ui/button";
import { RefreshCw, X, CheckCircle2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const MAX_GUESSES = 5;
const MAX_HINTS = 2;
const MAX_EQUATION_LENGTH = 5;
const STORAGE_KEY = "mathify_daily_puzzle";

const DailyMathPuzzle: React.FC = () => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>({
    guesses: [],
    currentGuess: [],
    dailyPuzzle: {
      shapes: [],
      solution: [],
      target: 0,
      shapeValues: {} as Record<ShapeType, number>,
      operations: {} as Record<ShapeType, string>,
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
  const [revealedHint, setRevealedHint] = useState<ShapeType | null>(null);

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
        currentGuess: [],
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
    if (gameState.dailyPuzzle.shapes.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    }
  }, [gameState]);

  const handleDrop = useCallback((id: string, droppedId: string) => {
    if (gameState.gameStatus !== "playing") return;
    
    const slotIndex = parseInt(id.replace("slot-", ""), 10);
    const shapeType = droppedId.replace("shape-", "") as ShapeType;
    
    setGameState(prev => {
      // Create a new currentGuess array
      const newGuess = [...prev.currentGuess];
      // Set the shape at the dropped position
      newGuess[slotIndex] = shapeType;
      
      return {
        ...prev,
        currentGuess: newGuess,
      };
    });
  }, [gameState.gameStatus]);

  const clearSlot = (index: number) => {
    if (gameState.gameStatus !== "playing") return;
    
    setGameState(prev => {
      const newGuess = [...prev.currentGuess];
      newGuess[index] = undefined as unknown as ShapeType;
      
      return {
        ...prev,
        currentGuess: newGuess
      };
    });
  };

  const resetCurrentGuess = () => {
    setGameState(prev => ({
      ...prev,
      currentGuess: []
    }));
  };

  const submitGuess = () => {
    if (gameState.gameStatus !== "playing") return;

    // Filter out empty slots
    const filledGuess = gameState.currentGuess.filter(shape => shape !== undefined);
    
    if (filledGuess.length < 2) {
      toast({
        title: "Too short",
        description: "Your equation needs at least 2 symbols",
      });
      return;
    }

    // Calculate the result of the current guess
    const guessValue = evaluateEquation(
      filledGuess, 
      gameState.dailyPuzzle.shapeValues, 
      gameState.dailyPuzzle.operations
    );

    // Check the guess against the solution
    const feedback = checkGuess(filledGuess, gameState.dailyPuzzle.solution);
    
    const newGuess: Guess = {
      shapes: filledGuess,
      feedback,
      value: guessValue
    };

    const updatedGuesses = [...gameState.guesses, newGuess];
    
    // Check if the player won
    const isCorrect = guessValue === gameState.dailyPuzzle.target;
    const isLastGuess = updatedGuesses.length >= MAX_GUESSES;
    
    let newGameStatus = gameState.gameStatus;
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
      currentGuess: [],
      gameStatus: newGameStatus,
      streak: newStreak,
    }));
  };

  const useHint = () => {
    if (gameState.hintsUsed >= MAX_HINTS || gameState.gameStatus !== "playing") return;
    
    // Choose a random shape from the solution that hasn't been revealed yet
    const availableShapes = gameState.dailyPuzzle.solution.filter(
      shape => shape !== revealedHint
    );
    
    if (availableShapes.length > 0) {
      const randomShape = availableShapes[Math.floor(Math.random() * availableShapes.length)];
      
      setRevealedHint(randomShape);
      setShowHint(true);
      
      setGameState(prev => ({
        ...prev,
        hintsUsed: prev.hintsUsed + 1
      }));
    }
  };

  const getEquationSlots = () => {
    // Create slots for the equation
    const slots = [];
    for (let i = 0; i < MAX_EQUATION_LENGTH; i++) {
      const currentShape = gameState.currentGuess[i];
      
      // Check if this shape is an operator in the puzzle
      const isOperator = currentShape && gameState.dailyPuzzle.operations[currentShape] !== "";
      const operatorValue = isOperator ? gameState.dailyPuzzle.operations[currentShape] : "";
      
      slots.push(
        <div key={`slot-${i}`} className="relative">
          <EquationSlot 
            id={`slot-${i}`} 
            shape={currentShape || null}
            isOperator={isOperator}
            operatorValue={operatorValue} 
          />
          {currentShape && (
            <button 
              onClick={() => clearSlot(i)}
              className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 shadow-sm"
            >
              <X size={12} />
            </button>
          )}
        </div>
      );
    }
    return slots;
  };

  const getAvailableShapes = () => {
    // Show all shapes available for the puzzle
    return gameState.dailyPuzzle.shapes.map((shape) => {
      // Check if this shape is an operator
      const isOperator = gameState.dailyPuzzle.operations[shape] !== "";
      const operatorValue = isOperator ? gameState.dailyPuzzle.operations[shape] : "";
      
      // Count how many times this shape has been used in the current guess
      const usedCount = gameState.currentGuess.filter(s => s === shape).length;
      
      // The shape is disabled if it's been used the maximum allowed times (e.g. once for operators)
      const isDisabled = isOperator && usedCount > 0;
      
      return (
        <DraggableShape 
          key={`shape-${shape}`}
          id={`shape-${shape}`}
          type={shape}
          isOperator={isOperator}
          operatorValue={operatorValue}
          disabled={isDisabled}
        />
      );
    });
  };

  const getPreviousGuesses = () => {
    return gameState.guesses.map((guess, index) => {
      return (
        <div key={index} className="flex flex-col items-center gap-2 mb-4">
          <div className="flex items-center gap-2">
            {guess.shapes.map((shape, shapeIndex) => {
              // Check if this shape is an operator
              const isOperator = gameState.dailyPuzzle.operations[shape] !== "";
              const operatorValue = isOperator ? gameState.dailyPuzzle.operations[shape] : "";
              
              return (
                <DraggableShape 
                  key={`guess-${index}-${shapeIndex}`}
                  id={`guess-${index}-${shapeIndex}`}
                  type={shape}
                  feedback={guess.feedback[shapeIndex]}
                  isOperator={isOperator}
                  operatorValue={operatorValue}
                  disabled={true}
                />
              );
            })}
            <span className="ml-2 text-lg">=</span>
            <span className="ml-2 text-lg font-semibold">{guess.value}</span>
          </div>
        </div>
      );
    });
  };

  // Display a loading state while the game initializes
  if (gameState.dailyPuzzle.shapes.length === 0) {
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
              Create an equation using the shapes below that equals {gameState.dailyPuzzle.target}
            </p>
            
            <div className="flex justify-center items-center gap-3 mb-6">
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
                disabled={gameState.currentGuess.filter(Boolean).length < 2}
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
          
          {/* Available shapes */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-lg font-medium mb-3">Available Shapes</h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 justify-items-center">
              {getAvailableShapes()}
            </div>
            <p className="text-sm text-gray-500 mt-3 text-center">
              Drag shapes to the slots above to build your equation
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
                <li>Create an equation using the shapes to reach the target number.</li>
                <li>Each shape represents a number or an operation.</li>
                <li>You have {MAX_GUESSES} attempts to solve the puzzle.</li>
                <li>After each guess, you'll get feedback:
                  <ul className="pl-5 mt-1">
                    <li><span className="text-green-600 font-medium">Green</span>: Correct shape in correct position</li>
                    <li><span className="text-yellow-600 font-medium">Yellow</span>: Correct shape in wrong position</li>
                    <li><span className="text-gray-500 font-medium">Gray</span>: Shape doesn't belong in the equation</li>
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
                  <p>This shape is part of the solution:</p>
                  <div className="p-2 bg-yellow-100 rounded-lg border border-yellow-300">
                    <DraggableShape
                      id="hint-shape"
                      type={revealedHint}
                      isOperator={!!gameState.dailyPuzzle.operations[revealedHint]}
                      operatorValue={gameState.dailyPuzzle.operations[revealedHint]}
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
