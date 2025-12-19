
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Info, Sun, Moon, X, Timer } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import GameCompletionHandler from "@/components/GameCompletionHandler";

// Define types for grid and game state
type GridSize = 3 | 4;
type CellStatus = "default" | "correct" | "incorrect" | "hint-high" | "hint-low";
type GameState = "idle" | "playing" | "completed";

interface GridCell {
  value: number;
  status: CellStatus;
}

interface GridData {
  cells: GridCell[][];
  rowFactors: number[];
  colFactors: number[];
  size: GridSize;
}

interface UserGuess {
  rowFactors: (number | null)[];
  colFactors: (number | null)[];
}

interface GameStats {
  streak: number;
  bestTime: number | null;
  gamesCompleted: number;
  lastCompleted: string | null;
}

// Generate a random seed for the puzzle
const generateRandomSeed = (): number => {
  return Math.floor(Math.random() * 1000000);
};

// Seeded random number generator
const seededRandom = (seed: number, max: number, min = 1): number => {
  const x = Math.sin(seed++) * 10000;
  const result = (x - Math.floor(x));
  return Math.floor(result * (max - min + 1)) + min;
};

const TimesTablesMaster = () => {
  const isMobile = useIsMobile();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [gridSize, setGridSize] = useState<GridSize>(3);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [grid, setGrid] = useState<GridData | null>(null);
  const [userGuess, setUserGuess] = useState<UserGuess>({
    rowFactors: [],
    colFactors: []
  });
  const [timer, setTimer] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [gameStats, setGameStats] = useState<GameStats>({
    streak: 0,
    bestTime: null,
    gamesCompleted: 0,
    lastCompleted: null,
  });
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [currentSeed, setCurrentSeed] = useState<number>(generateRandomSeed());
  const [showCompletionHandler, setShowCompletionHandler] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate grid with row and column factors
  const generateGrid = (size: GridSize): GridData => {
    const minFactor = 1;
    const maxFactor = 9;
    const rowFactors: number[] = [];
    const colFactors: number[] = [];
    
    // Generate row factors using the random seed
    for (let i = 0; i < size; i++) {
      rowFactors.push(seededRandom(currentSeed + i, maxFactor, minFactor));
    }
    
    // Generate column factors using the random seed
    for (let i = 0; i < size; i++) {
      colFactors.push(seededRandom(currentSeed + size + i, maxFactor, minFactor));
    }
    
    // Create grid cells with multiplication results
    const cells: GridCell[][] = [];
    for (let row = 0; row < size; row++) {
      const rowCells: GridCell[] = [];
      for (let col = 0; col < size; col++) {
        rowCells.push({
          value: rowFactors[row] * colFactors[col],
          status: "default"
        });
      }
      cells.push(rowCells);
    }
    
    return { cells, rowFactors, colFactors, size };
  };
  
  // Handle user input for row and column guesses
  const handleGuessChange = (type: 'row' | 'col', index: number, value: string) => {
    if (!timerActive && gameState === "playing") {
      setTimerActive(true);
    }
    
    const numberValue = value === "" ? null : Number(value);
    
    if (numberValue !== null && (isNaN(numberValue) || numberValue < 1 || numberValue > 99)) {
      return; // Invalid input
    }
    
    setUserGuess(prev => {
      const newGuess = { ...prev };
      if (type === 'row') {
        newGuess.rowFactors = [...prev.rowFactors];
        newGuess.rowFactors[index] = numberValue;
      } else {
        newGuess.colFactors = [...prev.colFactors];
        newGuess.colFactors[index] = numberValue;
      }
      return newGuess;
    });
  };
  
  // Check user guesses against actual factors
  const checkAnswers = () => {
    if (!grid) return;
    
    let allCorrect = true;
    const newGrid = { ...grid, cells: [...grid.cells.map(row => [...row])] };
    
    // Check each cell based on row/col guesses and update status
    for (let row = 0; row < grid.size; row++) {
      for (let col = 0; col < grid.size; col++) {
        const rowGuess = userGuess.rowFactors[row] ?? 0;
        const colGuess = userGuess.colFactors[col] ?? 0;
        
        if (rowGuess === 0 || colGuess === 0) {
          newGrid.cells[row][col].status = "default";
          allCorrect = false;
          continue;
        }
        
        const expectedValue = grid.rowFactors[row] * grid.colFactors[col];
        const guessedValue = rowGuess * colGuess;
        
        if (guessedValue === expectedValue) {
          newGrid.cells[row][col].status = "correct";
        } else {
          newGrid.cells[row][col].status = guessedValue > expectedValue ? "hint-high" : "hint-low";
          allCorrect = false;
        }
      }
    }
    
    setGrid(newGrid);
    
    if (allCorrect) {
      completePuzzle();
    } else {
      toast.info("Keep trying! Check the colored cells for hints.");
    }
  };
  
  // Complete the puzzle and update stats
  const completePuzzle = () => {
    setGameState("completed");
    setTimerActive(false);
    setShowCompletionHandler(true);
    
    // Launch celebration confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#9b87f5', '#7E69AB', '#6E59A5']
    });
    
    // Update game stats
    const today = new Date().toISOString().split('T')[0];
    const newStats = { ...gameStats };
    
    // Always update stats when completing a puzzle
    newStats.streak += 1;
    newStats.gamesCompleted += 1;
    newStats.lastCompleted = today;
    
    if (newStats.bestTime === null || timer < newStats.bestTime) {
      newStats.bestTime = timer;
    }
    
    setGameStats(newStats);
    saveGameStats(newStats);
    
    toast.success("Congratulations! You've solved the puzzle! 🎉");
  };
  
  // Format timer to MM:SS
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Share results
  const shareResults = () => {
    const timeText = formatTime(timer);
    const shareText = `🧮 Times Tables Master\n🔢 Puzzle solved in ${timeText}\n🔥 Streak: ${gameStats.streak}\n\nhttps://mathify.org/times-tables`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Times Tables Master Results',
        text: shareText
      }).catch(() => {
        copyToClipboard(shareText);
      });
    } else {
      copyToClipboard(shareText);
    }
  };
  
  // Copy to clipboard helper
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Results copied to clipboard!");
      setShowShareModal(false);
    }).catch(() => {
      toast.error("Failed to copy results");
    });
  };
  
  // Load game data from localStorage
  const loadGameData = () => {
    try {
      // Load game stats
      const savedStats = localStorage.getItem('timesTablesMasterStats');
      if (savedStats) {
        setGameStats(JSON.parse(savedStats));
      }
      
      // Load dark mode preference
      const darkMode = localStorage.getItem('timesTablesDarkMode');
      if (darkMode) {
        const isDark = darkMode === 'true';
        setIsDarkMode(isDark);
        if (isDark) {
          document.documentElement.classList.add('dark');
        }
      }
    } catch (error) {
      console.error("Error loading game data:", error);
    }
  };
  
  // Save game stats to localStorage
  const saveGameStats = (stats: GameStats) => {
    try {
      localStorage.setItem('timesTablesMasterStats', JSON.stringify(stats));
    } catch (error) {
      console.error("Error saving game stats:", error);
    }
  };
  
  // Start a new game
  const startGame = () => {
    // Generate new random seed for this game
    const newSeed = generateRandomSeed();
    setCurrentSeed(newSeed);
    
    // Start fresh game
    const newGrid = generateGrid(gridSize);
    setGrid(newGrid);
    setUserGuess({
      rowFactors: Array(newGrid.size).fill(null),
      colFactors: Array(newGrid.size).fill(null),
    });
    setGameState("playing");
    setTimer(0);
    setTimerActive(false);
    setShowCompletionHandler(false);
  };
  
  // Start a new game after completing one
  const startNewGame = () => {
    setShowShareModal(false);
    startGame();
  };
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('timesTablesDarkMode', String(newMode));
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  // Timer effect
  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerActive]);
  
  // Initial load
  useEffect(() => {
    loadGameData();
  }, []);
  
  // Get cell background color based on status
  const getCellBackground = (status: CellStatus) => {
    switch (status) {
      case "correct":
        return isDarkMode ? "bg-green-800" : "bg-green-100";
      case "incorrect":
        return isDarkMode ? "bg-red-900" : "bg-red-100";
      case "hint-high":
        return isDarkMode ? "bg-orange-800" : "bg-orange-100";
      case "hint-low":
        return isDarkMode ? "bg-blue-800" : "bg-blue-100";
      default:
        return isDarkMode ? "bg-gray-800" : "bg-white";
    }
  };
  
  // Get cell text color based on status
  const getCellTextColor = (status: CellStatus) => {
    switch (status) {
      case "correct":
        return isDarkMode ? "text-green-100" : "text-green-800";
      case "incorrect":
        return isDarkMode ? "text-red-100" : "text-red-800";
      case "hint-high":
        return isDarkMode ? "text-orange-100" : "text-orange-800";
      case "hint-low":
        return isDarkMode ? "text-blue-100" : "text-blue-800";
      default:
        return isDarkMode ? "text-white" : "text-gray-800";
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-[#E5DEFF] to-[#FEF7CD]'} flex flex-col items-center justify-center p-2 md:p-4 overflow-hidden transition-colors duration-300`}>
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-3 md:mb-8 px-1">
        <Link to="/">
          <Button variant="ghost" size="sm" className={`gap-1 md:gap-2 text-xs md:text-sm p-1 md:p-2 ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : ''}`}>
            <ArrowLeft className="h-3 w-3 md:h-4 md:w-4" /> Back
          </Button>
        </Link>
        <h1 className={`text-lg md:text-4xl font-bold ${isDarkMode ? 'text-purple-300' : 'bg-gradient-to-r from-[#9b87f5] to-[#8B5CF6] bg-clip-text text-transparent'}`}>
          Times Tables Master
        </h1>
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleDarkMode} 
            className={`p-1 md:p-2 ${isDarkMode ? 'text-yellow-300 hover:text-yellow-100 hover:bg-gray-800' : 'text-gray-600 hover:text-gray-800'}`}
          >
            {isDarkMode ? <Sun className="h-4 w-4 md:h-5 md:w-5" /> : <Moon className="h-4 w-4 md:h-5 md:w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Main Game Card */}
      <Card className={`w-full max-w-2xl shadow-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white/90 border-none glass-morphism'} overflow-hidden`}>
        {/* Game Statistics Header */}
        <CardHeader className={`text-center p-2 md:p-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
          <div className="flex justify-between items-center">
            <div className="text-xs md:text-sm">
              <span className={`font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Streak:</span> 
              <span className={`ml-1 font-bold ${isDarkMode ? 'text-orange-300' : 'text-orange-500'}`}>{gameStats.streak}</span>
            </div>
            <div className="text-center">
              <CardTitle className={`text-base md:text-2xl font-bold ${isDarkMode ? 'text-white' : ''}`}>
                Times Tables Puzzle
              </CardTitle>
              <CardDescription className={`text-xs md:text-sm ${isDarkMode ? 'text-gray-400' : ''}`}>
                Unlimited Puzzles!
              </CardDescription>
            </div>
            <div className="text-xs md:text-sm text-right">
              <span className={`font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Best:</span> 
              <span className={`ml-1 font-bold ${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>
                {gameStats.bestTime ? formatTime(gameStats.bestTime) : "--:--"}
              </span>
            </div>
          </div>
        </CardHeader>
        
        {/* Game Content */}
        <CardContent className={`p-3 md:p-6 ${isDarkMode ? 'text-white' : ''}`}>
          {gameState === "idle" && (
            <div className="text-center space-y-4 md:space-y-8">
              <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'} p-4 rounded-lg`}>
                <h3 className="text-lg md:text-xl font-bold mb-3">Welcome to Times Tables Master!</h3>
                <p className="text-sm md:text-base mb-4">
                  Solve multiplication puzzles by figuring out the row and column factors.
                </p>
                <div className="flex justify-center">
                  <Dialog open={showHowToPlay} onOpenChange={setShowHowToPlay}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className={`flex items-center gap-2 ${isDarkMode ? 'border-gray-600 hover:bg-gray-700' : ''}`}
                      >
                        <Info className="h-4 w-4" /> How to Play
                      </Button>
                    </DialogTrigger>
                    <DialogContent className={`max-w-xl max-h-[80vh] overflow-y-auto ${isDarkMode ? 'bg-gray-800 text-white' : ''}`}>
                      <DialogHeader>
                        <DialogTitle className="text-xl md:text-2xl">How to Play Times Tables Master</DialogTitle>
                        <DialogDescription className="text-sm md:text-base mt-2">
                          A multiplication puzzle that tests your deductive reasoning
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-3 text-sm md:text-base">
                        <div>
                          <h4 className="font-bold mb-1">The Goal</h4>
                          <p>Figure out what numbers should go in each row and column to create the multiplication grid.</p>
                        </div>
                        
                        <div className="border rounded-lg p-3">
                          <h4 className="font-bold mb-1">Example:</h4>
                          <div className="overflow-x-auto">
                            <Table className="w-auto mx-auto">
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="bg-gray-100 dark:bg-gray-700">#</TableHead>
                                  <TableHead className="text-center bg-purple-100 dark:bg-purple-900">A = ?</TableHead>
                                  <TableHead className="text-center bg-purple-100 dark:bg-purple-900">B = ?</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="bg-purple-100 dark:bg-purple-900">1 = ?</TableCell>
                                  <TableCell className="text-center">6</TableCell>
                                  <TableCell className="text-center">8</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="bg-purple-100 dark:bg-purple-900">2 = ?</TableCell>
                                  <TableCell className="text-center">9</TableCell>
                                  <TableCell className="text-center">12</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                          <p className="mt-2">In this example, if you figure out that row 1 = 2, row 2 = 3, column A = 3, and column B = 4, then all cells will match:</p>
                          <ul className="list-disc ml-6 mt-1 space-y-1">
                            <li>2 × 3 = 6</li>
                            <li>2 × 4 = 8</li>
                            <li>3 × 3 = 9</li>
                            <li>3 × 4 = 12</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-bold mb-1">How to Play</h4>
                          <ol className="list-decimal ml-6 space-y-2">
                            <li>Enter your guesses for row and column values</li>
                            <li>Click <strong>Check</strong> to see if your guesses are correct</li>
                            <li>Cell colors provide hints:
                              <ul className="list-disc ml-6 mt-1">
                                <li><span className={`${isDarkMode ? "text-green-300" : "text-green-600"} font-bold`}>Green</span>: Correct product</li>
                                <li><span className={`${isDarkMode ? "text-orange-300" : "text-orange-600"} font-bold`}>Orange</span>: Your product is too high</li>
                                <li><span className={`${isDarkMode ? "text-blue-300" : "text-blue-600"} font-bold`}>Blue</span>: Your product is too low</li>
                              </ul>
                            </li>
                            <li>Use logic to adjust your guesses until all cells are correct</li>
                            <li>Solve as quickly as you can to improve your best time</li>
                          </ol>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              <div>
                <div className={`text-sm md:text-base mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Choose grid size:
                </div>
                <div className="flex justify-center space-x-2 md:space-x-4">
                  <Button 
                    variant={gridSize === 3 ? "default" : "outline"}
                    onClick={() => setGridSize(3)}
                    className={isDarkMode && gridSize !== 3 ? "border-gray-600" : ""}
                  >
                    3×3 Grid
                  </Button>
                  <Button 
                    variant={gridSize === 4 ? "default" : "outline"}
                    onClick={() => setGridSize(4)}
                    className={isDarkMode && gridSize !== 4 ? "border-gray-600" : ""}
                  >
                    4×4 Grid
                  </Button>
                </div>
              </div>
              
              <Button 
                onClick={startGame} 
                className={`w-full md:w-auto px-6 py-2 md:px-8 md:py-3 ${isDarkMode 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'bg-gradient-to-r from-[#9b87f5] to-[#8B5CF6] hover:opacity-90 text-white'
                }`}
                size={isMobile ? "default" : "lg"}
              >
                Start New Puzzle
              </Button>
            </div>
          )}
          
          {(gameState === "playing" || gameState === "completed") && grid && (
            <div>
              {/* Timer */}
              {gameState !== "completed" && (
                <div className="text-center mb-3 md:mb-4">
                  <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'}`}>
                    <Timer className="h-3 w-3 md:h-4 md:w-4 text-indigo-500" />
                    <span className="font-mono text-sm md:text-base font-bold">{formatTime(timer)}</span>
                  </div>
                </div>
              )}
              
              {/* Grid */}
              <div className="overflow-x-auto pb-3">
                <div className="w-full overflow-x-auto pr-3 md:pr-0">
                  <Table className={`w-full ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <TableHeader>
                      <TableRow>
                        <TableCell className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} text-center font-bold p-1 md:p-3`}>×</TableCell>
                        {Array.from({ length: grid.size }).map((_, colIndex) => (
                          <TableCell key={`col-${colIndex}`} className="p-1 md:p-3 text-center">
                            <Input
                              type="number"
                              min="1"
                              max="99"
                              value={userGuess.colFactors[colIndex] || ''}
                              onChange={(e) => handleGuessChange('col', colIndex, e.target.value)}
                              className={`w-8 md:w-12 text-center p-1 md:p-2 text-sm md:text-base font-bold ${
                                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'
                              }`}
                              disabled={gameState === "completed"}
                              placeholder={`${String.fromCharCode(65 + colIndex)}`}
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {grid.cells.map((row, rowIndex) => (
                        <TableRow key={`row-${rowIndex}`}>
                          <TableCell className="p-1 md:p-3 text-center">
                            <Input
                              type="number"
                              min="1"
                              max="99"
                              value={userGuess.rowFactors[rowIndex] || ''}
                              onChange={(e) => handleGuessChange('row', rowIndex, e.target.value)}
                              className={`w-8 md:w-12 text-center p-1 md:p-2 text-sm md:text-base font-bold ${
                                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'
                              }`}
                              disabled={gameState === "completed"}
                              placeholder={`${rowIndex + 1}`}
                            />
                          </TableCell>
                          {row.map((cell, colIndex) => (
                            <TableCell 
                              key={`cell-${rowIndex}-${colIndex}`}
                              className={`p-1 md:p-3 text-center transition-colors ${
                                getCellBackground(cell.status)
                              } ${
                                getCellTextColor(cell.status)
                              } text-sm md:text-lg font-bold`}
                            >
                              {cell.value}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              {/* Hint text */}
              {gameState === "playing" && (
                <div className="text-center my-3 text-xs md:text-sm">
                  <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                    Fill in the row and column numbers to make the products match
                  </p>
                </div>
              )}
              
              {/* Legend for colors */}
              {gameState === "playing" && (
                <div className="flex flex-wrap justify-center gap-2 md:gap-4 my-3 md:my-4 text-xs md:text-sm">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 md:w-4 md:h-4 mr-1 ${isDarkMode ? 'bg-green-800' : 'bg-green-100'} rounded`}></div>
                    <span>Correct</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 md:w-4 md:h-4 mr-1 ${isDarkMode ? 'bg-orange-800' : 'bg-orange-100'} rounded`}></div>
                    <span>Too High</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 md:w-4 md:h-4 mr-1 ${isDarkMode ? 'bg-blue-800' : 'bg-blue-100'} rounded`}></div>
                    <span>Too Low</span>
                  </div>
                </div>
              )}
              
              {/* Completed message */}
              {gameState === "completed" && (
                <div className={`my-4 p-3 md:p-4 rounded-lg text-center ${
                  isDarkMode ? 'bg-purple-900/50' : 'bg-purple-100'
                }`}>
                  <h3 className="text-lg md:text-xl font-bold mb-1">
                    Puzzle Solved! 🎉
                  </h3>
                  <p className="text-sm md:text-base">
                    You solved it in {formatTime(timer)}
                  </p>
                  <div className="flex justify-center gap-2 mt-3">
                    <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
                      <DialogTrigger asChild>
                        <Button className={isDarkMode ? 'bg-indigo-600 hover:bg-indigo-700' : ''}>
                          Share Results
                        </Button>
                      </DialogTrigger>
                      <DialogContent className={`max-w-md ${isDarkMode ? 'bg-gray-800 text-white' : ''}`}>
                        <DialogHeader>
                          <DialogTitle>Share your results</DialogTitle>
                          <DialogDescription>
                            Let your friends know about your Times Tables Master success!
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-3">
                          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            <p className="font-mono whitespace-pre-line">
                              🧮 Times Tables Master<br/>
                              🔢 Puzzle solved in {formatTime(timer)}<br/>
                              🔥 Streak: {gameStats.streak}
                            </p>
                          </div>
                          <Button onClick={shareResults} className="w-full">Copy & Share</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button 
                      variant={isDarkMode ? "outline" : "secondary"} 
                      className={isDarkMode ? 'border-gray-600' : ''}
                      onClick={startNewGame}
                    >
                      New Puzzle
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
        
        {/* Footer with check button */}
        {gameState === "playing" && (
          <CardFooter className={`p-3 md:p-4 flex justify-center ${isDarkMode ? 'border-t border-gray-700' : 'border-t'}`}>
            <Button 
              onClick={checkAnswers}
              className={`px-6 py-2 ${isDarkMode 
                ? 'bg-indigo-600 hover:bg-indigo-700' 
                : 'bg-indigo-500 hover:bg-indigo-600'
              } text-white`}
              size={isMobile ? "default" : "lg"}
            >
              Check Answers
            </Button>
          </CardFooter>
        )}
      </Card>
      
      {/* Dark mode styles */}
      <style>
        {`
          .dark {
            --background: 222.2 84% 4.9%;
            --foreground: 210 40% 98%;
            --card: 222.2 84% 4.9%;
            --card-foreground: 210 40% 98%;
            --popover: 222.2 84% 4.9%;
            --popover-foreground: 210 40% 98%;
            --primary: 252.1 95% 85%;
            --primary-foreground: 222.2 47.4% 11.2%;
            --secondary: 217.2 32.6% 17.5%;
            --secondary-foreground: 210 40% 98%;
            --muted: 217.2 32.6% 17.5%;
            --muted-foreground: 215 20.2% 65.1%;
            --accent: 217.2 32.6% 17.5%;
            --accent-foreground: 210 40% 98%;
            --destructive: 0 62.8% 30.6%;
            --destructive-foreground: 210 40% 98%;
            --border: 217.2 32.6% 17.5%;
            --input: 217.2 32.6% 17.5%;
            --ring: 224.3 76.3% 48%;
          }
          
          input[type="number"]::-webkit-inner-spin-button,
          input[type="number"]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }

          input[type="number"] {
            -moz-appearance: textfield;
            appearance: textfield;
          }
          
          .glass-morphism {
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
          }
        `}
      </style>
      
      {/* Progress Tracking Modal */}
      {showCompletionHandler && (
        <GameCompletionHandler
          gameId="times-tables-master"
          gameName="Times Tables Master"
          score={Math.max(0, 100 - timer)}
          correctAnswers={1}
          totalQuestions={1}
          timeSpentSeconds={timer}
          onClose={() => setShowCompletionHandler(false)}
          onPlayAgain={startGame}
        />
      )}
    </div>
  );
};

export default TimesTablesMaster;
