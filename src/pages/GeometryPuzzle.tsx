import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowLeft, Puzzle, Move, RotateCw, Trophy, Lightbulb, Timer, Target } from "lucide-react";
import { toast } from "sonner";

type PuzzlePiece = {
  id: string;
  shape: "triangle" | "square" | "rectangle" | "pentagon" | "hexagon" | "parallelogram";
  color: string;
  rotation: number;
  position: { x: number; y: number };
  size: "small" | "medium" | "large";
  isPlaced: boolean;
};

type PuzzleLevel = {
  id: number;
  name: string;
  targetShape: string;
  difficulty: "easy" | "medium" | "hard";
  pieces: PuzzlePiece[];
  timeLimit: number;
  points: number;
  hint: string;
};

interface GameStats {
  score: number;
  puzzlesSolved: number;
  averageTime: number;
  perfectSolves: number;
  streak: number;
  bestStreak: number;
}

const puzzleLevels: PuzzleLevel[] = [
  {
    id: 1,
    name: "House Builder",
    targetShape: "house",
    difficulty: "easy",
    timeLimit: 120,
    points: 100,
    hint: "Use the triangle for the roof and square for the house base!",
    pieces: [
      { id: "p1", shape: "triangle", color: "#ef4444", rotation: 0, position: { x: 0, y: 0 }, size: "medium", isPlaced: false },
      { id: "p2", shape: "square", color: "#3b82f6", rotation: 0, position: { x: 0, y: 0 }, size: "medium", isPlaced: false },
      { id: "p3", shape: "rectangle", color: "#eab308", rotation: 0, position: { x: 0, y: 0 }, size: "small", isPlaced: false }
    ]
  },
  {
    id: 2,
    name: "Rocket Ship",
    targetShape: "rocket",
    difficulty: "medium",
    timeLimit: 180,
    points: 200,
    hint: "Stack triangles and rectangles to create a rocket pointing upward!",
    pieces: [
      { id: "p1", shape: "triangle", color: "#ef4444", rotation: 0, position: { x: 0, y: 0 }, size: "small", isPlaced: false },
      { id: "p2", shape: "rectangle", color: "#3b82f6", rotation: 0, position: { x: 0, y: 0 }, size: "large", isPlaced: false },
      { id: "p3", shape: "triangle", color: "#10b981", rotation: 0, position: { x: 0, y: 0 }, size: "small", isPlaced: false },
      { id: "p4", shape: "triangle", color: "#10b981", rotation: 0, position: { x: 0, y: 0 }, size: "small", isPlaced: false }
    ]
  },
  {
    id: 3,
    name: "Flower Garden",
    targetShape: "flower",
    difficulty: "medium",
    timeLimit: 200,
    points: 250,
    hint: "Use the hexagon as the center and arrange other pieces as petals!",
    pieces: [
      { id: "p1", shape: "hexagon", color: "#eab308", rotation: 0, position: { x: 0, y: 0 }, size: "medium", isPlaced: false },
      { id: "p2", shape: "pentagon", color: "#ec4899", rotation: 0, position: { x: 0, y: 0 }, size: "small", isPlaced: false },
      { id: "p3", shape: "pentagon", color: "#ec4899", rotation: 0, position: { x: 0, y: 0 }, size: "small", isPlaced: false },
      { id: "p4", shape: "pentagon", color: "#ec4899", rotation: 0, position: { x: 0, y: 0 }, size: "small", isPlaced: false },
      { id: "p5", shape: "rectangle", color: "#10b981", rotation: 90, position: { x: 0, y: 0 }, size: "small", isPlaced: false }
    ]
  },
  {
    id: 4,
    name: "Abstract Art",
    targetShape: "abstract",
    difficulty: "hard",
    timeLimit: 300,
    points: 400,
    hint: "Create a balanced composition using all the geometric pieces!",
    pieces: [
      { id: "p1", shape: "hexagon", color: "#8b5cf6", rotation: 0, position: { x: 0, y: 0 }, size: "large", isPlaced: false },
      { id: "p2", shape: "triangle", color: "#ef4444", rotation: 0, position: { x: 0, y: 0 }, size: "medium", isPlaced: false },
      { id: "p3", shape: "square", color: "#3b82f6", rotation: 45, position: { x: 0, y: 0 }, size: "small", isPlaced: false },
      { id: "p4", shape: "parallelogram", color: "#10b981", rotation: 0, position: { x: 0, y: 0 }, size: "medium", isPlaced: false },
      { id: "p5", shape: "pentagon", color: "#f97316", rotation: 0, position: { x: 0, y: 0 }, size: "small", isPlaced: false },
      { id: "p6", shape: "rectangle", color: "#ec4899", rotation: 0, position: { x: 0, y: 0 }, size: "small", isPlaced: false }
    ]
  }
];

export default function GeometryPuzzle() {
  const [gameState, setGameState] = useState<"menu" | "playing" | "completed" | "paused">("menu");
  const [currentLevel, setCurrentLevel] = useState(0);
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    puzzlesSolved: 0,
    averageTime: 0,
    perfectSolves: 0,
    streak: 0,
    bestStreak: 0
  });
  const [startTime, setStartTime] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === "playing" && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (gameState === "playing" && timeRemaining === 0) {
      // Time's up!
      toast.error("Time's up! Try again! ⏰");
      setGameState("menu");
    }
    return () => clearTimeout(timer);
  }, [gameState, timeRemaining]);

  const startGame = () => {
    setGameState("playing");
    setCurrentLevel(0);
    setPieces([...puzzleLevels[0].pieces]);
    setTimeRemaining(puzzleLevels[0].timeLimit);
    setSelectedPiece(null);
    setShowHint(false);
    setStartTime(Date.now());
    setStats({
      score: 0,
      puzzlesSolved: 0,
      averageTime: 0,
      perfectSolves: 0,
      streak: 0,
      bestStreak: 0
    });
  };

  const startLevel = (levelIndex: number) => {
    setCurrentLevel(levelIndex);
    setPieces([...puzzleLevels[levelIndex].pieces]);
    setTimeRemaining(puzzleLevels[levelIndex].timeLimit);
    setSelectedPiece(null);
    setShowHint(false);
    setStartTime(Date.now());
  };

  const rotatePiece = (pieceId: string) => {
    setPieces(prev => prev.map(piece => 
      piece.id === pieceId 
        ? { ...piece, rotation: (piece.rotation + 90) % 360 }
        : piece
    ));
  };

  const checkCompletion = () => {
    // Simple completion check - all pieces placed
    const allPlaced = pieces.every(piece => piece.isPlaced);
    
    if (allPlaced) {
      const timeUsed = puzzleLevels[currentLevel].timeLimit - timeRemaining;
      const level = puzzleLevels[currentLevel];
      const isPerfect = timeUsed < level.timeLimit * 0.5; // Solved in less than half the time
      
      const newScore = stats.score + level.points + (isPerfect ? level.points * 0.5 : 0);
      const newStreak = stats.streak + 1;
      
      setStats(prev => ({
        ...prev,
        score: newScore,
        puzzlesSolved: prev.puzzlesSolved + 1,
        perfectSolves: isPerfect ? prev.perfectSolves + 1 : prev.perfectSolves,
        streak: newStreak,
        bestStreak: Math.max(prev.bestStreak, newStreak),
        averageTime: prev.puzzlesSolved === 0 ? timeUsed : (prev.averageTime * prev.puzzlesSolved + timeUsed) / (prev.puzzlesSolved + 1)
      }));
      
      toast.success(`Puzzle completed! ${isPerfect ? "Perfect solve! " : ""}+${level.points} points! 🎉`);
      
      setTimeout(() => {
        if (currentLevel < puzzleLevels.length - 1) {
          startLevel(currentLevel + 1);
        } else {
          setGameState("completed");
        }
      }, 2000);
    }
  };

  const togglePiecePlacement = (pieceId: string) => {
    setPieces(prev => prev.map(piece => 
      piece.id === pieceId 
        ? { ...piece, isPlaced: !piece.isPlaced }
        : piece
    ));
    
    // Check completion after a short delay to allow state update
    setTimeout(checkCompletion, 100);
  };

  const renderPiece = (piece: PuzzlePiece) => {
    const sizeClasses = {
      small: "w-12 h-12",
      medium: "w-16 h-16", 
      large: "w-20 h-20"
    };
    
    const shapeStyles = {
      triangle: "clip-path: polygon(50% 0%, 0% 100%, 100% 100%)",
      square: "",
      rectangle: "",
      pentagon: "clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
      hexagon: "clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
      parallelogram: "clip-path: polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)"
    };
    
    return (
      <motion.div
        key={piece.id}
        className={`${sizeClasses[piece.size]} cursor-pointer transition-all duration-300 ${
          piece.isPlaced ? "opacity-50 scale-75" : "hover:scale-110"
        } ${selectedPiece === piece.id ? "ring-4 ring-yellow-400" : ""}`}
        style={{
          backgroundColor: piece.color,
          transform: `rotate(${piece.rotation}deg)`,
          ...(piece.shape !== "square" && piece.shape !== "rectangle" ? { clipPath: shapeStyles[piece.shape] } : {})
        }}
        onClick={() => {
          if (selectedPiece === piece.id) {
            togglePiecePlacement(piece.id);
          } else {
            setSelectedPiece(piece.id);
          }
        }}
        whileHover={{ scale: piece.isPlaced ? 0.75 : 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {piece.shape === "rectangle" && (
          <div className="w-full h-full bg-current rounded-sm"></div>
        )}
      </motion.div>
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (gameState === "menu") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <Link to="/" className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 mb-6">
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Puzzle className="h-12 w-12 text-cyan-600" />
              <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-600 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
                Geometry Puzzle
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Use geometric shapes to build amazing creations! Drag, rotate, and place pieces to solve challenging puzzles.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {puzzleLevels.map((level, index) => (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge 
                        variant="secondary" 
                        className={`${
                          level.difficulty === "easy" ? "bg-green-100 text-green-700" :
                          level.difficulty === "medium" ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        }`}
                      >
                        {level.difficulty}
                      </Badge>
                      <span className="text-lg font-bold text-cyan-600">{level.points} pts</span>
                      <Timer className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">{formatTime(level.timeLimit)}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{level.name}</h3>
                    <p className="text-gray-600 mb-4">Build: {level.targetShape}</p>
                    
                    <div className="flex gap-2 justify-center mb-4">
                      {level.pieces.slice(0, 3).map((piece, idx) => (
                        <div key={idx} className="w-8 h-8" style={{ backgroundColor: piece.color }}>
                          {/* Mini shape preview */}
                        </div>
                      ))}
                      {level.pieces.length > 3 && (
                        <div className="w-8 h-8 flex items-center justify-center text-gray-400 text-xs">
                          +{level.pieces.length - 3}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Card className="inline-block p-8 bg-white/80 backdrop-blur-sm shadow-xl">
              <CardContent className="p-0">
                <Move className="h-16 w-16 text-cyan-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to Puzzle?</h2>
                <p className="text-gray-600 mb-6">Click and drag pieces, rotate them, and create amazing shapes!</p>
                <Button onClick={startGame} className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-8 py-3 rounded-full text-lg">
                  Start Puzzling!
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === "playing") {
    const level = puzzleLevels[currentLevel];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700">
              <ArrowLeft className="h-5 w-5" />
              Back to Home
            </Link>
            
            <div className="flex gap-4">
              <Badge variant="secondary" className="bg-cyan-100 text-cyan-700">
                Score: {stats.score}
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                Level: {currentLevel + 1}/{puzzleLevels.length}
              </Badge>
              <Badge variant="secondary" className={`${timeRemaining < 30 ? "bg-red-100 text-red-700" : "bg-indigo-100 text-indigo-700"}`}>
                <Timer className="h-4 w-4 mr-1" />
                {formatTime(timeRemaining)}
              </Badge>
            </div>
          </div>

          <motion.div
            key={currentLevel}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="p-8 bg-white/90 backdrop-blur-sm shadow-xl mb-8">
              <CardContent className="p-0">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{level.name}</h2>
                  <p className="text-gray-600">Create: {level.targetShape}</p>
                  <Badge 
                    variant="secondary" 
                    className={`mt-2 ${
                      level.difficulty === "easy" ? "bg-green-100 text-green-700" :
                      level.difficulty === "medium" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}
                  >
                    {level.difficulty} - {level.points} points
                  </Badge>
                </div>

                {/* Workspace */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Workspace</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg min-h-[300px] bg-gray-50/50 flex items-center justify-center">
                    <div className="flex flex-wrap gap-4 justify-center">
                      {pieces.filter(piece => piece.isPlaced).map((piece) => (
                        <div key={`placed-${piece.id}`}>
                          {renderPiece(piece)}
                        </div>
                      ))}
                      {pieces.filter(piece => piece.isPlaced).length === 0 && (
                        <span className="text-gray-400">Click pieces below to place them here</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Available pieces */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Available Pieces</h3>
                  <div className="flex flex-wrap gap-4 justify-center p-4 bg-gray-50 rounded-lg">
                    {pieces.filter(piece => !piece.isPlaced).map((piece) => (
                      <div key={`available-${piece.id}`} className="text-center">
                        {renderPiece(piece)}
                        {selectedPiece === piece.id && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => rotatePiece(piece.id)}
                            className="mt-2 h-8 px-2"
                          >
                            <RotateCw className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setShowHint(!showHint)}
                    className="border-yellow-300 text-yellow-600 hover:bg-yellow-50"
                  >
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Hint
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setGameState("menu")}
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    Exit
                  </Button>
                </div>

                <AnimatePresence>
                  {showHint && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200"
                    >
                      <p className="text-yellow-700 text-center">💡 {level.hint}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  if (gameState === "completed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <Link to="/" className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 mb-6">
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-2xl mx-auto"
          >
            <Card className="p-8 bg-white/90 backdrop-blur-sm shadow-xl">
              <CardContent className="p-0">
                <div className="mb-6">
                  <Trophy className="h-20 w-20 text-yellow-500 mx-auto mb-4" />
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-4">
                    Puzzle Master!
                  </h1>
                  <p className="text-lg text-gray-600">
                    Incredible work! You've solved all the geometry puzzles!
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="text-center p-4 bg-cyan-50 rounded-lg">
                    <div className="text-3xl font-bold text-cyan-600">{stats.score}</div>
                    <div className="text-sm text-cyan-500">Total Score</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">{stats.puzzlesSolved}</div>
                    <div className="text-sm text-blue-500">Puzzles Solved</div>
                  </div>
                  <div className="text-center p-4 bg-indigo-50 rounded-lg">
                    <div className="text-3xl font-bold text-indigo-600">{stats.perfectSolves}</div>
                    <div className="text-sm text-indigo-500">Perfect Solves</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">{Math.round(stats.averageTime)}s</div>
                    <div className="text-sm text-green-500">Avg. Time</div>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button onClick={startGame} className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white">
                    Play Again
                  </Button>
                  <Link to="/">
                    <Button variant="outline" className="border-gray-300">
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return null;
}