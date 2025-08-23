import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowLeft, Grid3X3, Palette, RotateCw, Sparkles, Trophy, Target } from "lucide-react";
import { toast } from "sonner";

type PatternShape = "circle" | "square" | "triangle" | "diamond" | "star" | "heart";
type PatternColor = "red" | "blue" | "green" | "yellow" | "purple" | "orange";

interface PatternElement {
  shape: PatternShape;
  color: PatternColor;
  id: string;
}

interface Pattern {
  id: number;
  sequence: PatternElement[];
  name: string;
  difficulty: "easy" | "medium" | "hard";
  points: number;
  description: string;
}

interface GameStats {
  score: number;
  patternsCompleted: number;
  streak: number;
  bestStreak: number;
  accuracy: number;
  totalAttempts: number;
  correctAttempts: number;
}

const shapes: Record<PatternShape, string> = {
  circle: "⭕",
  square: "🟦",
  triangle: "🔺", 
  diamond: "🔷",
  star: "⭐",
  heart: "💖"
};

const colors: Record<PatternColor, string> = {
  red: "#ef4444",
  blue: "#3b82f6", 
  green: "#10b981",
  yellow: "#f59e0b",
  purple: "#8b5cf6",
  orange: "#f97316"
};

const patterns: Pattern[] = [
  {
    id: 1,
    sequence: [
      { shape: "circle", color: "red", id: "1" },
      { shape: "square", color: "blue", id: "2" },
      { shape: "circle", color: "red", id: "3" },
      { shape: "square", color: "blue", id: "4" }
    ],
    name: "Alternating Shapes",
    difficulty: "easy",
    points: 100,
    description: "Red circles and blue squares alternate"
  },
  {
    id: 2,
    sequence: [
      { shape: "triangle", color: "green", id: "1" },
      { shape: "triangle", color: "yellow", id: "2" },
      { shape: "triangle", color: "green", id: "3" },
      { shape: "triangle", color: "yellow", id: "4" }
    ],
    name: "Color Pattern",
    difficulty: "easy",
    points: 120,
    description: "Same shape, alternating colors"
  },
  {
    id: 3,
    sequence: [
      { shape: "circle", color: "red", id: "1" },
      { shape: "square", color: "blue", id: "2" },
      { shape: "triangle", color: "green", id: "3" },
      { shape: "circle", color: "red", id: "4" },
      { shape: "square", color: "blue", id: "5" },
      { shape: "triangle", color: "green", id: "6" }
    ],
    name: "Triple Sequence",
    difficulty: "medium", 
    points: 180,
    description: "Three shapes and colors repeating"
  },
  {
    id: 4,
    sequence: [
      { shape: "star", color: "yellow", id: "1" },
      { shape: "heart", color: "red", id: "2" },
      { shape: "diamond", color: "blue", id: "3" },
      { shape: "star", color: "purple", id: "4" },
      { shape: "heart", color: "orange", id: "5" },
      { shape: "diamond", color: "green", id: "6" }
    ],
    name: "Complex Pattern",
    difficulty: "hard",
    points: 250,
    description: "Shapes repeat, colors change in sequence"
  }
];

export default function PatternBuilder() {
  const [gameState, setGameState] = useState<"menu" | "playing" | "completed">("menu");
  const [currentPattern, setCurrentPattern] = useState(0);
  const [playerSequence, setPlayerSequence] = useState<PatternElement[]>([]);
  const [showingPattern, setShowingPattern] = useState(true);
  const [availableElements, setAvailableElements] = useState<PatternElement[]>([]);
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    patternsCompleted: 0,
    streak: 0,
    bestStreak: 0,
    accuracy: 100,
    totalAttempts: 0,
    correctAttempts: 0
  });

  useEffect(() => {
    generateAvailableElements();
  }, [currentPattern]);

  const generateAvailableElements = () => {
    const pattern = patterns[currentPattern];
    const uniqueElements = new Set<string>();
    
    pattern.sequence.forEach(element => {
      uniqueElements.add(`${element.shape}-${element.color}`);
    });
    
    // Add some extra elements to make it challenging
    const allShapes: PatternShape[] = ["circle", "square", "triangle", "diamond", "star", "heart"];
    const allColors: PatternColor[] = ["red", "blue", "green", "yellow", "purple", "orange"];
    
    const elements: PatternElement[] = [];
    
    // Add the pattern elements
    Array.from(uniqueElements).forEach((elementKey, index) => {
      const [shape, color] = elementKey.split('-') as [PatternShape, PatternColor];
      elements.push({ shape, color, id: `available-${index}` });
    });
    
    // Add some random distractors
    for (let i = 0; i < 4; i++) {
      const randomShape = allShapes[Math.floor(Math.random() * allShapes.length)];
      const randomColor = allColors[Math.floor(Math.random() * allColors.length)];
      const key = `${randomShape}-${randomColor}`;
      
      if (!uniqueElements.has(key)) {
        elements.push({ shape: randomShape, color: randomColor, id: `distractor-${i}` });
      }
    }
    
    // Shuffle the elements
    setAvailableElements(elements.sort(() => Math.random() - 0.5));
  };

  const startGame = () => {
    setGameState("playing");
    setCurrentPattern(0);
    setPlayerSequence([]);
    setShowingPattern(true);
    setStats({
      score: 0,
      patternsCompleted: 0,
      streak: 0,
      bestStreak: 0,
      accuracy: 100,
      totalAttempts: 0,
      correctAttempts: 0
    });
    
    // Show pattern for 3 seconds then hide
    setTimeout(() => {
      setShowingPattern(false);
    }, 3000);
  };

  const addToSequence = (element: PatternElement) => {
    if (showingPattern) return;
    
    const newElement = { ...element, id: `player-${playerSequence.length}` };
    setPlayerSequence(prev => [...prev, newElement]);
  };

  const removeFromSequence = (index: number) => {
    setPlayerSequence(prev => prev.filter((_, i) => i !== index));
  };

  const checkPattern = () => {
    const pattern = patterns[currentPattern];
    const isCorrect = playerSequence.length === pattern.sequence.length &&
      playerSequence.every((element, index) => 
        element.shape === pattern.sequence[index].shape &&
        element.color === pattern.sequence[index].color
      );
    
    const newTotalAttempts = stats.totalAttempts + 1;
    const newCorrectAttempts = isCorrect ? stats.correctAttempts + 1 : stats.correctAttempts;
    const newAccuracy = (newCorrectAttempts / newTotalAttempts) * 100;
    
    if (isCorrect) {
      const newScore = stats.score + pattern.points;
      const newStreak = stats.streak + 1;
      
      setStats(prev => ({
        ...prev,
        score: newScore,
        patternsCompleted: prev.patternsCompleted + 1,
        streak: newStreak,
        bestStreak: Math.max(prev.bestStreak, newStreak),
        totalAttempts: newTotalAttempts,
        correctAttempts: newCorrectAttempts,
        accuracy: newAccuracy
      }));
      
      toast.success(`Perfect! +${pattern.points} points! 🎉`);
      
      setTimeout(() => {
        if (currentPattern < patterns.length - 1) {
          setCurrentPattern(prev => prev + 1);
          setPlayerSequence([]);
          setShowingPattern(true);
          setTimeout(() => setShowingPattern(false), 3000);
        } else {
          setGameState("completed");
        }
      }, 2000);
    } else {
      setStats(prev => ({
        ...prev,
        streak: 0,
        totalAttempts: newTotalAttempts,
        correctAttempts: newCorrectAttempts,
        accuracy: newAccuracy
      }));
      
      toast.error("Not quite right! Try again! 🤔");
      setPlayerSequence([]);
    }
  };

  const renderElement = (element: PatternElement, size: "sm" | "md" | "lg" = "md") => {
    const sizeClasses = {
      sm: "w-8 h-8 text-lg",
      md: "w-12 h-12 text-2xl", 
      lg: "w-16 h-16 text-3xl"
    };
    
    return (
      <div 
        className={`${sizeClasses[size]} rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer`}
        style={{ backgroundColor: colors[element.color] }}
      >
        <span className="text-white filter drop-shadow-sm">
          {shapes[element.shape]}
        </span>
      </div>
    );
  };

  if (gameState === "menu") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-8">
          <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6">
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Grid3X3 className="h-12 w-12 text-indigo-600" />
              <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-400 bg-clip-text text-transparent">
                Pattern Builder
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Master the art of patterns! Observe, remember, and recreate beautiful geometric sequences.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {patterns.map((pattern, index) => (
              <motion.div
                key={pattern.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge 
                        variant="secondary" 
                        className={`${
                          pattern.difficulty === "easy" ? "bg-green-100 text-green-700" :
                          pattern.difficulty === "medium" ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        }`}
                      >
                        {pattern.difficulty}
                      </Badge>
                      <span className="text-lg font-bold text-indigo-600">{pattern.points} pts</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{pattern.name}</h3>
                    <p className="text-gray-600 mb-4">{pattern.description}</p>
                    
                    <div className="flex gap-2 justify-center">
                      {pattern.sequence.slice(0, 4).map((element, idx) => (
                        <div key={idx}>
                          {renderElement(element, "sm")}
                        </div>
                      ))}
                      {pattern.sequence.length > 4 && (
                        <div className="w-8 h-8 flex items-center justify-center text-gray-400">
                          ...
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
                <Palette className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to Build Patterns?</h2>
                <p className="text-gray-600 mb-6">Watch carefully, then recreate the patterns from memory!</p>
                <Button onClick={startGame} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-full text-lg">
                  Start Building!
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === "playing") {
    const pattern = patterns[currentPattern];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700">
              <ArrowLeft className="h-5 w-5" />
              Back to Home
            </Link>
            
            <div className="flex gap-4">
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                Score: {stats.score}
              </Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                Streak: {stats.streak}
              </Badge>
              <Badge variant="secondary" className="bg-pink-100 text-pink-700">
                {currentPattern + 1}/{patterns.length}
              </Badge>
            </div>
          </div>

          <motion.div
            key={currentPattern}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="p-8 bg-white/90 backdrop-blur-sm shadow-xl mb-8">
              <CardContent className="p-0">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{pattern.name}</h2>
                  <p className="text-gray-600">{pattern.description}</p>
                  <Badge 
                    variant="secondary" 
                    className={`mt-2 ${
                      pattern.difficulty === "easy" ? "bg-green-100 text-green-700" :
                      pattern.difficulty === "medium" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}
                  >
                    {pattern.difficulty} - {pattern.points} points
                  </Badge>
                </div>

                {showingPattern ? (
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Study this pattern:</h3>
                    <div className="flex gap-3 justify-center mb-4">
                      {pattern.sequence.map((element, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.2 }}
                        >
                          {renderElement(element)}
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex items-center justify-center gap-2 text-indigo-600">
                      <RotateCw className="h-5 w-5 animate-spin" />
                      <span>Memorize the pattern...</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Now recreate the pattern:</h3>
                    
                    {/* Player's sequence */}
                    <div className="mb-6">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[80px] flex items-center justify-center">
                        {playerSequence.length === 0 ? (
                          <span className="text-gray-400">Click shapes below to build the pattern</span>
                        ) : (
                          <div className="flex gap-2">
                            {playerSequence.map((element, index) => (
                              <motion.div
                                key={element.id}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                onClick={() => removeFromSequence(index)}
                                className="cursor-pointer hover:scale-110 transition-transform"
                              >
                                {renderElement(element)}
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Available elements */}
                    <div className="mb-6">
                      <h4 className="text-md font-semibold text-gray-600 mb-3 text-center">Available shapes:</h4>
                      <div className="grid grid-cols-4 md:grid-cols-6 gap-3 justify-items-center">
                        {availableElements.map((element) => (
                          <motion.div
                            key={element.id}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => addToSequence(element)}
                          >
                            {renderElement(element)}
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4 justify-center">
                      <Button
                        onClick={checkPattern}
                        disabled={playerSequence.length === 0}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8"
                      >
                        <Target className="h-4 w-4 mr-2" />
                        Check Pattern
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => setPlayerSequence([])}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  if (gameState === "completed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-8">
          <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6">
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
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    Pattern Master!
                  </h1>
                  <p className="text-lg text-gray-600">
                    Outstanding work! You've mastered the art of pattern recognition!
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="text-center p-4 bg-indigo-50 rounded-lg">
                    <div className="text-3xl font-bold text-indigo-600">{stats.score}</div>
                    <div className="text-sm text-indigo-500">Total Score</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">{stats.bestStreak}</div>
                    <div className="text-sm text-purple-500">Best Streak</div>
                  </div>
                  <div className="text-center p-4 bg-pink-50 rounded-lg">
                    <div className="text-3xl font-bold text-pink-600">{stats.patternsCompleted}</div>
                    <div className="text-sm text-pink-500">Patterns Completed</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">{Math.round(stats.accuracy)}%</div>
                    <div className="text-sm text-green-500">Accuracy</div>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button onClick={startGame} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
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