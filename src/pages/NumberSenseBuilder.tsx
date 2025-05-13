
import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger
} from "@/components/ui/dialog";
import { Trophy, Share2, Lightbulb, Move } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

// Types
type NumberTile = {
  id: string;
  value: number;
};

type PuzzleLevel = {
  target: number;
  difficulty: "easy" | "medium" | "hard";
  solved: boolean;
  moves: NumberTile[];
  startTime?: number;
  endTime?: number;
};

type UserStats = {
  streak: number;
  bestMoves: number | null;
  bestTime: number | null;
  totalSolved: number;
  lastPlayedDate: string | null;
};

// Math quotes to show after completion
const mathQuotes = [
  "Mathematics is not about numbers, equations, computations, or algorithms: it is about understanding. – William Paul Thurston",
  "Pure mathematics is, in its way, the poetry of logical ideas. – Albert Einstein",
  "Mathematics is the most beautiful and most powerful creation of the human spirit. – Stefan Banach",
  "Mathematics is the music of reason. – James Joseph Sylvester",
  "Without mathematics, there's nothing you can do. Everything around you is mathematics. – Shakuntala Devi",
  "Mathematics is the language in which God has written the universe. – Galileo Galilei",
  "The essence of mathematics is not to make simple things complicated, but to make complicated things simple. – S. Gudder",
  "Mathematics may not teach us how to add love or subtract hate, but it gives us hope that every problem has a solution. – Anonymous"
];

// Format time in MM:SS format
const formatTime = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

// Get today's date as YYYY-MM-DD string
const getTodayString = (): string => {
  const today = new Date();
  return `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
};

// Generate a seed from the date string
const generateSeedFromDate = (dateString: string): number => {
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash = ((hash << 5) - hash) + dateString.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

// Generate daily puzzles based on the seed
const generateDailyPuzzles = (seed: number): PuzzleLevel[] => {
  const seededRandom = (min: number, max: number, offset: number = 0) => {
    const x = Math.sin(seed + offset) * 10000;
    const rand = x - Math.floor(x);
    return Math.floor(rand * (max - min + 1)) + min;
  };

  // Generate three puzzles of increasing difficulty
  return [
    {
      target: seededRandom(15, 50, 1),
      difficulty: "easy",
      solved: false,
      moves: []
    },
    {
      target: seededRandom(51, 120, 2),
      difficulty: "medium",
      solved: false,
      moves: []
    },
    {
      target: seededRandom(121, 250, 3),
      difficulty: "hard",
      solved: false,
      moves: []
    }
  ] as PuzzleLevel[];
};

// Get available number tiles based on difficulty
const getNumberTiles = (difficulty: "easy" | "medium" | "hard"): NumberTile[] => {
  const baseNumbers = [1, 5, 10, 25];
  let tiles: NumberTile[] = [];
  
  switch (difficulty) {
    case "easy":
      // 1 of each base number (total: 4 tiles)
      baseNumbers.forEach((num, idx) => {
        tiles.push({ id: `tile-${idx}`, value: num });
      });
      break;
    case "medium":
      // 2 of each base number (total: 8 tiles)
      baseNumbers.forEach((num, idx) => {
        tiles.push({ id: `tile-${idx}-a`, value: num });
        tiles.push({ id: `tile-${idx}-b`, value: num });
      });
      break;
    case "hard":
      // 2 of each base number plus some other useful numbers (total: 10 tiles)
      baseNumbers.forEach((num, idx) => {
        tiles.push({ id: `tile-${idx}-a`, value: num });
        tiles.push({ id: `tile-${idx}-b`, value: num });
      });
      // Add two additional tiles for hard mode
      tiles.push({ id: "tile-extra-1", value: 3 });
      tiles.push({ id: "tile-extra-2", value: 20 });
      break;
  }
  
  return tiles;
};

// Get a random math quote
const getRandomMathQuote = (): string => {
  const randomIndex = Math.floor(Math.random() * mathQuotes.length);
  return mathQuotes[randomIndex];
};

const NumberSenseBuilder = () => {
  const [puzzles, setPuzzles] = useState<PuzzleLevel[]>([]);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState<number>(0);
  const [availableTiles, setAvailableTiles] = useState<NumberTile[]>([]);
  const [selectedTiles, setSelectedTiles] = useState<NumberTile[]>([]);
  const [operation, setOperation] = useState<"add" | "subtract">("add");
  const [currentTotal, setCurrentTotal] = useState<number>(0);
  const [isGameComplete, setIsGameComplete] = useState<boolean>(false);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [currentQuote, setCurrentQuote] = useState<string>("");
  const [userStats, setUserStats] = useState<UserStats>({
    streak: 0,
    bestMoves: null,
    bestTime: null,
    totalSolved: 0,
    lastPlayedDate: null
  });
  const [feedback, setFeedback] = useState<string>("");
  const isMobile = useIsMobile();

  // Initialize game
  useEffect(() => {
    const today = getTodayString();
    const seed = generateSeedFromDate(today);
    const dailyPuzzles = generateDailyPuzzles(seed);
    setPuzzles(dailyPuzzles);
    
    // Initialize first puzzle
    const initialTiles = getNumberTiles(dailyPuzzles[0].difficulty);
    setAvailableTiles(initialTiles);
    
    // Load user stats from localStorage
    const storedStats = localStorage.getItem("numberSenseStats");
    if (storedStats) {
      const stats: UserStats = JSON.parse(storedStats);
      
      // Check if we need to update streak
      const lastPlayedDate = stats.lastPlayedDate;
      if (lastPlayedDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = `${yesterday.getFullYear()}-${(yesterday.getMonth() + 1).toString().padStart(2, "0")}-${yesterday.getDate().toString().padStart(2, "0")}`;
        
        // If last played was not yesterday, reset streak
        if (lastPlayedDate !== yesterdayString && lastPlayedDate !== today) {
          stats.streak = 0;
        }
      }
      
      setUserStats(stats);
    }
    
    // Choose a random math quote
    setCurrentQuote(getRandomMathQuote());
  }, []);

  // Calculate progress through the puzzles
  const progress = useMemo(() => {
    if (puzzles.length === 0) return 0;
    const solvedCount = puzzles.filter(p => p.solved).length;
    return (solvedCount / puzzles.length) * 100;
  }, [puzzles]);

  // Handle tile selection
  const handleTileClick = (tile: NumberTile) => {
    // Don't allow more than 5 moves
    if (selectedTiles.length >= 5) {
      toast.error("Maximum 5 moves allowed!");
      return;
    }
    
    // Start the timer for the first move of a puzzle
    if (selectedTiles.length === 0) {
      const updatedPuzzles = [...puzzles];
      updatedPuzzles[currentPuzzleIndex].startTime = Date.now();
      setPuzzles(updatedPuzzles);
    }
    
    // Add tile to selected tiles
    setSelectedTiles([...selectedTiles, tile]);
    
    // Remove from available tiles
    setAvailableTiles(availableTiles.filter(t => t.id !== tile.id));
    
    // Update current total
    updateCurrentTotal([...selectedTiles, tile], operation);
  };

  // Handle operation change
  const handleOperationChange = (newOperation: "add" | "subtract") => {
    setOperation(newOperation);
    updateCurrentTotal(selectedTiles, newOperation);
  };

  // Update the current total
  const updateCurrentTotal = (tiles: NumberTile[], op: "add" | "subtract") => {
    if (tiles.length === 0) {
      setCurrentTotal(0);
      return;
    }
    
    // Calculate the total
    let total = tiles[0].value;
    for (let i = 1; i < tiles.length; i++) {
      if (op === "add") {
        total += tiles[i].value;
      } else {
        total -= tiles[i].value;
      }
    }
    
    setCurrentTotal(total);
    
    // Check if the target is reached
    const currentPuzzle = puzzles[currentPuzzleIndex];
    if (total === currentPuzzle.target && !currentPuzzle.solved) {
      solvePuzzle(tiles);
    }
  };

  // Handle tile removal
  const handleRemoveTile = (index: number) => {
    const tileToRemove = selectedTiles[index];
    
    // Add back to available tiles
    setAvailableTiles([...availableTiles, tileToRemove]);
    
    // Remove from selected tiles
    const newSelectedTiles = [...selectedTiles];
    newSelectedTiles.splice(index, 1);
    setSelectedTiles(newSelectedTiles);
    
    // Update current total
    updateCurrentTotal(newSelectedTiles, operation);
  };

  // Reset current puzzle
  const resetPuzzle = () => {
    const currentPuzzle = puzzles[currentPuzzleIndex];
    setAvailableTiles(getNumberTiles(currentPuzzle.difficulty));
    setSelectedTiles([]);
    setCurrentTotal(0);
    setOperation("add");
  };

  // Mark current puzzle as solved
  const solvePuzzle = (finalMoves: NumberTile[]) => {
    const currentTime = Date.now();
    const updatedPuzzles = [...puzzles];
    const currentPuzzle = updatedPuzzles[currentPuzzleIndex];
    
    // Update puzzle data
    currentPuzzle.solved = true;
    currentPuzzle.moves = finalMoves;
    currentPuzzle.endTime = currentTime;
    setPuzzles(updatedPuzzles);
    
    // Calculate time taken
    const timeTaken = currentTime - (currentPuzzle.startTime || currentTime);
    
    // Show success message
    toast.success("Target number reached! Puzzle solved!");
    
    // Check if this was efficient
    if (finalMoves.length <= 3) {
      setFeedback("Elegant Solution! 👏");
    } else {
      setFeedback("Puzzle Solved! 🎉");
    }
    
    // Check if all puzzles are solved
    const allSolved = updatedPuzzles.every(p => p.solved);
    if (allSolved) {
      completeGame();
    } else {
      // Short delay before moving to next puzzle
      setTimeout(() => {
        moveToNextPuzzle();
      }, 1500);
    }
  };

  // Move to the next puzzle
  const moveToNextPuzzle = () => {
    if (currentPuzzleIndex < puzzles.length - 1) {
      const nextIndex = currentPuzzleIndex + 1;
      setCurrentPuzzleIndex(nextIndex);
      
      // Reset for next puzzle
      setAvailableTiles(getNumberTiles(puzzles[nextIndex].difficulty));
      setSelectedTiles([]);
      setCurrentTotal(0);
      setOperation("add");
      setFeedback("");
    }
  };

  // Complete the game
  const completeGame = () => {
    // Calculate total time
    let totalTimeMs = 0;
    puzzles.forEach(puzzle => {
      if (puzzle.startTime && puzzle.endTime) {
        totalTimeMs += (puzzle.endTime - puzzle.startTime);
      }
    });
    setTotalTime(totalTimeMs);
    
    // Calculate total moves
    const totalMoves = puzzles.reduce((sum, puzzle) => sum + puzzle.moves.length, 0);
    
    // Update stats
    const today = getTodayString();
    const newStreak = userStats.streak + 1;
    const newTotalSolved = userStats.totalSolved + 1;
    let newBestMoves = userStats.bestMoves;
    let newBestTime = userStats.bestTime;
    
    // Check for records
    if (!newBestMoves || totalMoves < newBestMoves) {
      newBestMoves = totalMoves;
    }
    
    if (!newBestTime || totalTimeMs < newBestTime) {
      newBestTime = totalTimeMs;
    }
    
    const updatedStats = {
      streak: newStreak,
      bestMoves: newBestMoves,
      bestTime: newBestTime,
      totalSolved: newTotalSolved,
      lastPlayedDate: today
    };
    
    // Save stats to localStorage
    localStorage.setItem("numberSenseStats", JSON.stringify(updatedStats));
    setUserStats(updatedStats);
    
    // Show game completion screen
    setIsGameComplete(true);
  };

  // Start a new game
  const startNewGame = () => {
    const today = getTodayString();
    const seed = generateSeedFromDate(today);
    const dailyPuzzles = generateDailyPuzzles(seed);
    
    setPuzzles(dailyPuzzles);
    setCurrentPuzzleIndex(0);
    setAvailableTiles(getNumberTiles(dailyPuzzles[0].difficulty));
    setSelectedTiles([]);
    setCurrentTotal(0);
    setOperation("add");
    setIsGameComplete(false);
    setFeedback("");
    
    // Choose a new random math quote
    setCurrentQuote(getRandomMathQuote());
  };

  // Share results
  const shareResults = () => {
    const timeString = formatTime(totalTime);
    
    // Count total moves
    const totalMoves = puzzles.reduce((sum, puzzle) => sum + puzzle.moves.length, 0);
    
    const shareText = `I solved today's Number Sense Builder in ${timeString} using ${totalMoves} moves! 🧮 Try it at https://mathify.org/number-sense`;
    
    if (navigator.share) {
      navigator.share({
        text: shareText,
      }).catch((error) => console.log("Error sharing:", error));
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        toast.success("Results copied to clipboard!");
      }).catch((err) => {
        toast.error("Could not copy results.");
        console.error("Could not copy text: ", err);
      });
    }
  };

  // Instructions component
  const Instructions = () => (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle className="text-2xl mb-2">How to Play Number Sense Builder</DialogTitle>
        <DialogDescription className="text-base space-y-4">
          <div>
            <p className="mb-2">Build your way to the target number using basic number tiles!</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>You'll be given a target number to reach (e.g., 47)</li>
              <li>Use the available number tiles to build up to that target</li>
              <li>Click on tiles to add them to your solution</li>
              <li>Choose "+" or "-" to add or subtract the tiles</li>
              <li>You can use a maximum of 5 moves per puzzle</li>
              <li>Try to solve all three puzzles with the fewest moves</li>
            </ol>
          </div>
          
          <div>
            <p className="font-semibold mt-2">Example:</p>
            <div className="bg-muted p-3 rounded-md text-center">
              <p className="font-bold">Target: 42</p>
              <p className="mt-2">Available tiles: 25, 10, 5, 1, 1</p>
              <p className="mt-2">Solution: 25 + 10 + 5 + 1 + 1 = 42</p>
              <p className="mt-2">Or: 25 + 25 - 5 - 3 = 42</p>
            </div>
          </div>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );

  const currentPuzzle = puzzles[currentPuzzleIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-100 py-8 px-4">
      <div className="max-w-lg mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
            Number Sense Builder
          </h1>
          
          <div className="flex justify-center items-center gap-2 mt-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs md:text-sm">
                  How to Play
                </Button>
              </DialogTrigger>
              <Instructions />
            </Dialog>
          </div>
        </header>
        
        {!isGameComplete ? (
          <Card className="mb-6 shadow-lg border-0 bg-white/90 backdrop-blur">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="font-semibold text-lg">
                  Puzzle {currentPuzzleIndex + 1}: {currentPuzzle?.difficulty}
                </CardTitle>
                <Badge variant="outline" className="bg-teal-100">
                  {currentPuzzle?.solved ? (
                    <span className="flex items-center">
                      <Trophy className="w-3 h-3 mr-1" /> Solved
                    </span>
                  ) : (
                    `${selectedTiles.length}/5 Moves`
                  )}
                </Badge>
              </div>
              
              <CardDescription>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center">
                    <Lightbulb className="w-4 h-4 mr-2 text-teal-600" />
                    <span className="text-sm font-medium">
                      Progress: {Math.floor(progress)}%
                    </span>
                  </div>
                  <span className="text-xs font-medium">
                    {puzzles.filter(p => p.solved).length} of {puzzles.length}
                  </span>
                </div>
                <Progress
                  value={progress}
                  className="h-2 mt-2"
                  indicatorClassName="bg-gradient-to-r from-emerald-500 to-teal-500"
                />
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {/* Target Display */}
              <div className="bg-gradient-to-r from-emerald-100 to-teal-100 p-6 rounded-xl text-center mb-6">
                <p className="text-sm text-teal-700 mb-1">TARGET</p>
                <p className="text-4xl font-bold text-teal-800">
                  {currentPuzzle?.target || "..."}
                </p>
                
                {feedback && (
                  <p className="mt-2 text-teal-700 font-semibold">{feedback}</p>
                )}
              </div>
              
              {/* Current Build */}
              <div className="mb-6">
                <p className="text-sm font-medium text-slate-600 mb-2">Current Build:</p>
                <div className="flex items-center justify-center flex-wrap bg-slate-100 p-3 rounded-lg min-h-16">
                  {selectedTiles.length === 0 ? (
                    <p className="text-slate-400 text-sm">Select tiles to build your number</p>
                  ) : (
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {selectedTiles.map((tile, index) => (
                        <React.Fragment key={tile.id}>
                          {index > 0 && (
                            <div className="text-lg font-bold">{operation === "add" ? "+" : "−"}</div>
                          )}
                          <div 
                            className="bg-teal-600 text-white font-bold px-3 py-2 rounded-md flex items-center shadow-sm cursor-pointer"
                            onClick={() => handleRemoveTile(index)}
                          >
                            {tile.value}
                          </div>
                        </React.Fragment>
                      ))}
                      <div className="text-lg font-bold mx-2">=</div>
                      <div className={`text-lg font-bold px-3 py-1 rounded-md ${
                        currentTotal === currentPuzzle?.target 
                          ? "bg-green-100 text-green-700" 
                          : "bg-slate-100 text-slate-700"
                      }`}>
                        {currentTotal}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Operation Toggle */}
              <div className="flex justify-center mb-6">
                <div className="flex rounded-md overflow-hidden">
                  <button 
                    className={`px-6 py-2 font-medium ${
                      operation === "add" 
                        ? "bg-teal-600 text-white" 
                        : "bg-slate-200 text-slate-700"
                    }`}
                    onClick={() => handleOperationChange("add")}
                  >
                    Addition
                  </button>
                  <button 
                    className={`px-6 py-2 font-medium ${
                      operation === "subtract" 
                        ? "bg-teal-600 text-white" 
                        : "bg-slate-200 text-slate-700"
                    }`}
                    onClick={() => handleOperationChange("subtract")}
                  >
                    Subtraction
                  </button>
                </div>
              </div>
              
              {/* Available Tiles */}
              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">Available Tiles:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {availableTiles.map((tile) => (
                    <button
                      key={tile.id}
                      className="bg-white border-2 border-teal-500 text-teal-700 font-bold text-xl px-4 py-3 rounded-lg shadow hover:bg-teal-50 transition-colors"
                      onClick={() => handleTileClick(tile)}
                      disabled={selectedTiles.length >= 5 || currentPuzzle?.solved}
                    >
                      {tile.value}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={resetPuzzle}
                disabled={selectedTiles.length === 0 || currentPuzzle?.solved}
              >
                Reset
              </Button>
              {currentPuzzle?.solved && currentPuzzleIndex < puzzles.length - 1 && (
                <Button 
                  onClick={moveToNextPuzzle}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  Next Puzzle
                </Button>
              )}
            </CardFooter>
          </Card>
        ) : (
          <Card className="mb-6 shadow-lg border-0 bg-white/90 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                All Puzzles Solved!
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="text-center py-4">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center bg-teal-100 rounded-full w-20 h-20 mb-4">
                    <Trophy className="w-10 h-10 text-teal-600" />
                  </div>
                  <p className="text-3xl font-bold text-teal-700 mb-1">
                    {formatTime(totalTime)}
                  </p>
                  <p className="text-slate-600">
                    Total time for all puzzles
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-teal-50 rounded-lg p-3">
                    <div className="text-xl font-bold">{userStats.streak}</div>
                    <div className="text-xs text-slate-600">Day Streak</div>
                  </div>
                  <div className="bg-teal-50 rounded-lg p-3">
                    <div className="text-xl font-bold">
                      {userStats.bestMoves ?? "--"}
                    </div>
                    <div className="text-xs text-slate-600">Best Moves</div>
                  </div>
                  <div className="bg-teal-50 rounded-lg p-3">
                    <div className="text-xl font-bold">{userStats.totalSolved}</div>
                    <div className="text-xs text-slate-600">Total Solved</div>
                  </div>
                </div>
                
                <div className="mb-6 bg-emerald-50 rounded-lg p-4 text-sm text-slate-700 italic">
                  "{currentQuote}"
                </div>
                
                <div className="flex space-x-3">
                  <Button 
                    onClick={startNewGame} 
                    className="flex-1"
                    variant="outline"
                  >
                    New Game
                  </Button>
                  <Button 
                    onClick={shareResults}
                    className="flex-1 bg-teal-600 hover:bg-teal-700"
                  >
                    <Share2 className="w-4 h-4 mr-2" /> Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Stats Card */}
        <div className="bg-white/80 backdrop-blur rounded-lg p-4 shadow">
          <h2 className="text-lg font-bold mb-3">Your Stats</h2>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-emerald-50 p-3 rounded-md text-center">
              <div className="text-sm font-medium text-slate-600">Streak</div>
              <div className="text-2xl font-bold text-emerald-700">{userStats.streak}</div>
            </div>
            <div className="bg-teal-50 p-3 rounded-md text-center">
              <div className="text-sm font-medium text-slate-600">Best Time</div>
              <div className="text-xl font-bold text-teal-700">
                {userStats.bestTime ? formatTime(userStats.bestTime) : "--:--"}
              </div>
            </div>
            <div className="bg-cyan-50 p-3 rounded-md text-center">
              <div className="text-sm font-medium text-slate-600">Solved</div>
              <div className="text-2xl font-bold text-cyan-700">{userStats.totalSolved}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NumberSenseBuilder;
