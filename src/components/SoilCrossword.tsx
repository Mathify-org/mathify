import React, { useState, useEffect, useRef } from "react";
import { Timer, Check, RefreshCw, Trophy, HelpCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface CrosswordWord {
  word: string;
  clue: string;
  direction: "across" | "down";
  startRow: number;
  startCol: number;
}

const CROSSWORD_WORDS: CrosswordWord[] = [
  { 
    word: "EROSION", 
    clue: "The process of soil being worn away by water, wind or ice",
    direction: "across", 
    startRow: 0, 
    startCol: 0 
  },
  { 
    word: "ROOTS", 
    clue: "Plant parts that help hold soil in place",
    direction: "down", 
    startRow: 0, 
    startCol: 4 
  },
  { 
    word: "MULCH", 
    clue: "Material placed on soil surface to protect it",
    direction: "across", 
    startRow: 2, 
    startCol: 2 
  },
  { 
    word: "TERRACE", 
    clue: "Steps built on hills for farming that prevent soil loss",
    direction: "down", 
    startRow: 1, 
    startCol: 2 
  },
  { 
    word: "SOIL", 
    clue: "The top layer of earth where plants grow",
    direction: "across", 
    startRow: 4, 
    startCol: 1 
  },
  { 
    word: "WATER", 
    clue: "It can wash soil away during heavy rain",
    direction: "across", 
    startRow: 6, 
    startCol: 0 
  },
  { 
    word: "WIND", 
    clue: "Moving air that can blow away dry soil",
    direction: "down", 
    startRow: 3, 
    startCol: 6 
  },
  { 
    word: "PLANTS", 
    clue: "Living things that help protect soil with their roots",
    direction: "down", 
    startRow: 0, 
    startCol: 0 
  }
];

const GRID_SIZE = 10;

const SoilCrossword = () => {
  const [grid, setGrid] = useState<string[][]>(
    Array(GRID_SIZE).fill('').map(() => Array(GRID_SIZE).fill(''))
  );
  const [userGrid, setUserGrid] = useState<string[][]>(
    Array(GRID_SIZE).fill('').map(() => Array(GRID_SIZE).fill(''))
  );
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [isGameComplete, setIsGameComplete] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [currentClue, setCurrentClue] = useState<CrosswordWord | null>(null);
  const [correctWords, setCorrectWords] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  
  const timerRef = useRef<number | null>(null);
  const gridRefs = useRef<(HTMLInputElement | null)[][]>(
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null))
  );
  
  useEffect(() => {
    const newGrid = Array(GRID_SIZE).fill('').map(() => Array(GRID_SIZE).fill(''));
    
    CROSSWORD_WORDS.forEach(({ word, direction, startRow, startCol }) => {
      const letters = word.split('');
      
      letters.forEach((letter, index) => {
        if (direction === "across") {
          if (startCol + index < GRID_SIZE) {
            newGrid[startRow][startCol + index] = letter;
          }
        } else {
          if (startRow + index < GRID_SIZE) {
            newGrid[startRow + index][startCol] = letter;
          }
        }
      });
    });
    
    setGrid(newGrid);
  }, []);
  
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);
  
  const isCellActive = (row: number, col: number): boolean => {
    return grid[row][col] !== '';
  };

  const getCellNumber = (row: number, col: number): number | null => {
    for (let i = 0; i < CROSSWORD_WORDS.length; i++) {
      const { startRow, startCol } = CROSSWORD_WORDS[i];
      if (startRow === row && startCol === col) {
        return i + 1;
      }
    }
    return null;
  };
  
  const startGame = () => {
    setIsGameStarted(true);
    setTimeElapsed(0);
    setCorrectWords([]);
    setScore(0);
    setIsGameComplete(false);
    
    setUserGrid(Array(GRID_SIZE).fill('').map(() => Array(GRID_SIZE).fill('')));
    
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
    
    timerRef.current = window.setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
  };
  
  const handleCellInput = (row: number, col: number, value: string) => {
    value = value.slice(-1).toUpperCase();
    
    const newUserGrid = [...userGrid];
    newUserGrid[row][col] = value;
    setUserGrid(newUserGrid);
    
    checkCompletedWords(newUserGrid);
    
    if (value && currentClue) {
      moveToNextCell(row, col);
    }
  };
  
  const moveToNextCell = (row: number, col: number) => {
    if (!currentClue) return;
    
    let nextRow = row;
    let nextCol = col;
    
    if (currentClue.direction === "across") {
      nextCol++;
    } else {
      nextRow++;
    }
    
    if (
      nextRow < GRID_SIZE && 
      nextCol < GRID_SIZE && 
      isCellActive(nextRow, nextCol)
    ) {
      const nextInput = gridRefs.current[nextRow][nextCol];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };
  
  const checkCompletedWords = (currentUserGrid: string[][]) => {
    const newCorrectWords: string[] = [];
    
    CROSSWORD_WORDS.forEach(({ word, direction, startRow, startCol }) => {
      let isWordComplete = true;
      
      for (let i = 0; i < word.length; i++) {
        const row = direction === "across" ? startRow : startRow + i;
        const col = direction === "across" ? startCol + i : startCol;
        
        if (row >= GRID_SIZE || col >= GRID_SIZE) {
          isWordComplete = false;
          break;
        }
        
        if (currentUserGrid[row][col] !== word[i]) {
          isWordComplete = false;
          break;
        }
      }
      
      if (isWordComplete) {
        newCorrectWords.push(word);
      }
    });
    
    newCorrectWords.forEach(word => {
      if (!correctWords.includes(word)) {
        toast.success(`You found "${word}"!`);
      }
    });
    
    setCorrectWords(newCorrectWords);
    
    if (newCorrectWords.length === CROSSWORD_WORDS.length) {
      completeGame();
    }
  };
  
  const completeGame = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    const baseScore = 100;
    const timeDeduction = Math.min(50, Math.floor(timeElapsed / 10));
    const finalScore = baseScore - timeDeduction;
    
    setScore(finalScore);
    setIsGameComplete(true);
    
    launchConfetti();
  };
  
  const launchConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  
  const selectClue = (clue: CrosswordWord) => {
    setCurrentClue(clue);
    
    const { startRow, startCol } = clue;
    const firstCell = gridRefs.current[startRow][startCol];
    if (firstCell) {
      firstCell.focus();
    }
  };
  
  return (
    <Card className="p-6 bg-gradient-to-r from-amber-50 to-blue-50">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2 text-amber-800 relative inline-block">
          Soil Conservation Crossword
          <div className="absolute -bottom-1 left-0 right-0 h-1 bg-amber-400 rounded-full"></div>
        </h2>
        <p className="text-gray-600">
          Solve the puzzle to test your knowledge about soil erosion and conservation!
        </p>
      </div>

      {!isGameStarted && !isGameComplete && (
        <div className="text-center py-10">
          <div className="mb-8 animate-bounce">
            <HelpCircle className="h-16 w-16 text-amber-600 mx-auto" />
          </div>
          <h3 className="text-xl font-bold mb-4">Ready to Solve the Crossword Puzzle?</h3>
          <p className="mb-6 text-gray-600">
            Find words related to soil erosion and conservation. Complete the puzzle as quickly as you can!
          </p>
          <Button 
            onClick={startGame}
            size="lg"
            className="bg-amber-600 hover:bg-amber-700"
          >
            Start Crossword Challenge!
          </Button>
        </div>
      )}

      {isGameStarted && !isGameComplete && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Timer className="mr-2 h-5 w-5 text-amber-600" />
                <span className="font-mono font-bold">{formatTime(timeElapsed)}</span>
              </div>
              <div className="px-3 py-1 bg-green-100 rounded-full text-green-800 font-semibold">
                {correctWords.length} / {CROSSWORD_WORDS.length} words
              </div>
            </div>
            
            <div className="bg-white p-1 rounded-lg shadow-md">
              <div className="relative">
                <div className="grid grid-cols-10 gap-0.5">
                  {Array(GRID_SIZE).fill(null).map((_, rowIndex) => (
                    <React.Fragment key={`row-${rowIndex}`}>
                      {Array(GRID_SIZE).fill(null).map((_, colIndex) => {
                        const isActive = isCellActive(rowIndex, colIndex);
                        const cellNumber = getCellNumber(rowIndex, colIndex);
                        const isCurrentFocus = currentClue && 
                          ((currentClue.direction === "across" && 
                            rowIndex === currentClue.startRow && 
                            colIndex >= currentClue.startCol && 
                            colIndex < currentClue.startCol + currentClue.word.length) ||
                           (currentClue.direction === "down" && 
                            colIndex === currentClue.startCol && 
                            rowIndex >= currentClue.startRow && 
                            rowIndex < currentClue.startRow + currentClue.word.length));
                        
                        return (
                          <div 
                            key={`cell-${rowIndex}-${colIndex}`} 
                            className={`relative ${
                              isActive 
                                ? isCurrentFocus 
                                  ? "bg-blue-100 border-2 border-blue-300" 
                                  : "bg-white border border-gray-300" 
                                : "bg-gray-200"
                            } w-9 h-9 flex items-center justify-center`}
                          >
                            {isActive && (
                              <>
                                {cellNumber !== null && (
                                  <span className="absolute text-[8px] top-0 left-0.5 text-gray-500 font-bold">
                                    {cellNumber}
                                  </span>
                                )}
                                <Input
                                  type="text"
                                  value={userGrid[rowIndex][colIndex]}
                                  onChange={(e) => handleCellInput(rowIndex, colIndex, e.target.value)}
                                  className="w-full h-full text-center p-0 border-none focus:ring-0 uppercase font-bold text-lg"
                                  maxLength={1}
                                  ref={(el) => {
                                    gridRefs.current[rowIndex][colIndex] = el;
                                  }}
                                />
                              </>
                            )}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Clues</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentClue(null)}
              >
                Clear Selection
              </Button>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4 h-[350px] overflow-y-auto">
              {CROSSWORD_WORDS.map((word, index) => {
                const isComplete = correctWords.includes(word.word);
                const isSelected = currentClue === word;
                
                return (
                  <div 
                    key={`clue-${index}`} 
                    className={`p-2 mb-2 rounded cursor-pointer transition-all ${
                      isComplete 
                        ? "bg-green-100 text-green-800" 
                        : isSelected 
                          ? "bg-blue-100 border border-blue-300" 
                          : "hover:bg-gray-100"
                    }`}
                    onClick={() => !isComplete && selectClue(word)}
                  >
                    <div className="flex items-center">
                      <span className="mr-2 font-bold">{index + 1}.</span>
                      <span className="mr-2 text-sm text-gray-600">
                        {word.direction === "across" ? "Across" : "Down"}
                      </span>
                      {isComplete && (
                        <Check className="h-4 w-4 text-green-600 ml-auto" />
                      )}
                    </div>
                    <div className={`${isComplete ? "line-through" : ""} pl-6`}>
                      {word.clue}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {isGameComplete && (
        <div className="text-center py-8 space-y-6">
          <div className="mb-4 animate-bounce">
            <Trophy className="h-20 w-20 text-amber-500 mx-auto" />
          </div>
          
          <h3 className="text-2xl font-bold text-amber-800">
            Crossword Complete!
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mt-6 mb-8 max-w-xs mx-auto">
            <div className="p-4 bg-white rounded-lg shadow-md">
              <p className="text-gray-600 mb-1">Time</p>
              <p className="text-3xl font-bold text-amber-600">{formatTime(timeElapsed)}</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-md">
              <p className="text-gray-600 mb-1">Words</p>
              <p className="text-3xl font-bold text-green-600">{CROSSWORD_WORDS.length}/{CROSSWORD_WORDS.length}</p>
            </div>
          </div>
          
          <div className="p-6 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl shadow-md inline-block">
            <h4 className="text-lg font-semibold mb-2">Your Final Score</h4>
            <p className="text-4xl font-bold text-amber-700">{score}</p>
          </div>
          
          <div className="mt-6">
            <Button 
              onClick={startGame}
              size="lg"
              className="bg-amber-600 hover:bg-amber-700"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Play Again
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default SoilCrossword;
