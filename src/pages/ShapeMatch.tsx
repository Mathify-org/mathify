
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, XCircle, Star, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import GameCompletionHandler from "@/components/GameCompletionHandler";

interface Shape {
  id: string;
  name: string;
  sides: number;
  color: string;
  svg: string;
  category: "basic" | "advanced";
}

const shapes: Shape[] = [
  {
    id: "triangle",
    name: "Triangle",
    sides: 3,
    color: "fill-red-400",
    svg: "M50 10 L90 80 L10 80 Z",
    category: "basic"
  },
  {
    id: "square",
    name: "Square", 
    sides: 4,
    color: "fill-blue-400",
    svg: "M20 20 L80 20 L80 80 L20 80 Z",
    category: "basic"
  },
  {
    id: "pentagon",
    name: "Pentagon",
    sides: 5,
    color: "fill-green-400",
    svg: "M50 10 L80 30 L70 70 L30 70 L20 30 Z",
    category: "basic"
  },
  {
    id: "hexagon",
    name: "Hexagon",
    sides: 6,
    color: "fill-purple-400",
    svg: "M50 10 L80 25 L80 55 L50 70 L20 55 L20 25 Z",
    category: "basic"
  },
  {
    id: "circle",
    name: "Circle",
    sides: 0,
    color: "fill-yellow-400",
    svg: "M50 50 m-30 0 a30 30 0 1 0 60 0 a30 30 0 1 0 -60 0",
    category: "basic"
  },
  {
    id: "octagon",
    name: "Octagon",
    sides: 8,
    color: "fill-orange-400",
    svg: "M50 10 L70 10 L85 25 L85 55 L70 70 L50 70 L30 70 L15 55 L15 25 L30 10 Z",
    category: "advanced"
  },
  {
    id: "heptagon",
    name: "Heptagon",
    sides: 7,
    color: "fill-pink-400",
    svg: "M50 5 L75 20 L85 45 L75 70 L50 80 L25 70 L15 45 L25 20 Z",
    category: "advanced"
  },
  {
    id: "diamond",
    name: "Diamond",
    sides: 4,
    color: "fill-cyan-400",
    svg: "M50 10 L80 50 L50 90 L20 50 Z",
    category: "advanced"
  }
];

type QuestionType = "name" | "sides" | "category" | "comparison";

interface Question {
  type: QuestionType;
  shape: Shape;
  question: string;
  options: string[];
  correctAnswer: string;
}

const ShapeMatch = () => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [usedQuestions, setUsedQuestions] = useState<Set<string>>(new Set());
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [showCompletionHandler, setShowCompletionHandler] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const gameStartTime = useRef<number>(Date.now());
  const totalQuestions = 10;

  const generateQuestion = (): Question => {
    const availableShapes = shapes.filter(shape => {
      if (difficulty === "easy") return shape.category === "basic";
      if (difficulty === "medium") return true;
      return shape.category === "advanced" || Math.random() > 0.3;
    });

    const questionTypes: QuestionType[] = difficulty === "easy" 
      ? ["name", "sides"] 
      : ["name", "sides", "category", "comparison"];

    let attempts = 0;
    let question: Question;
    let questionId: string;

    do {
      const shape = availableShapes[Math.floor(Math.random() * availableShapes.length)];
      const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      
      question = createQuestion(shape, questionType, availableShapes);
      questionId = `${shape.id}-${questionType}-${question.question}`;
      attempts++;
    } while (usedQuestions.has(questionId) && attempts < 50);

    setUsedQuestions(prev => new Set([...prev, questionId]));
    return question;
  };

  const createQuestion = (shape: Shape, type: QuestionType, availableShapes: Shape[]): Question => {
    switch (type) {
      case "name":
        return {
          type,
          shape,
          question: "What is this shape called?",
          options: generateNameOptions(shape, availableShapes),
          correctAnswer: shape.name
        };
      
      case "sides":
        return {
          type,
          shape,
          question: "How many sides does this shape have?",
          options: generateSideOptions(shape),
          correctAnswer: shape.sides === 0 ? "0 sides (curved)" : `${shape.sides} sides`
        };
      
      case "category":
        const isBasic = shape.category === "basic";
        return {
          type,
          shape,
          question: "Is this a basic or advanced shape?",
          options: ["Basic shape", "Advanced shape"],
          correctAnswer: isBasic ? "Basic shape" : "Advanced shape"
        };
      
      case "comparison":
        const otherShape = availableShapes.filter(s => s.id !== shape.id)[Math.floor(Math.random() * (availableShapes.length - 1))];
        const hasMoreSides = shape.sides > otherShape.sides;
        return {
          type,
          shape,
          question: `Does this shape have more or fewer sides than a ${otherShape.name.toLowerCase()}?`,
          options: ["More sides", "Fewer sides", "Same number of sides"],
          correctAnswer: hasMoreSides ? "More sides" : shape.sides < otherShape.sides ? "Fewer sides" : "Same number of sides"
        };
      
      default:
        return createQuestion(shape, "name", availableShapes);
    }
  };

  const generateNameOptions = (correctShape: Shape, availableShapes: Shape[]): string[] => {
    const options = [correctShape.name];
    const otherShapes = availableShapes.filter(s => s.id !== correctShape.id);
    
    while (options.length < 4 && otherShapes.length > 0) {
      const randomShape = otherShapes.splice(Math.floor(Math.random() * otherShapes.length), 1)[0];
      if (!options.includes(randomShape.name)) {
        options.push(randomShape.name);
      }
    }
    
    return options.sort(() => Math.random() - 0.5);
  };

  const generateSideOptions = (shape: Shape): string[] => {
    const correctAnswer = shape.sides === 0 ? "0 sides (curved)" : `${shape.sides} sides`;
    const options = [correctAnswer];
    
    // Generate different side counts
    const possibleSides = [0, 3, 4, 5, 6, 7, 8, 10, 12];
    const filteredSides = possibleSides.filter(s => s !== shape.sides);
    
    while (options.length < 4) {
      const randomSides = filteredSides[Math.floor(Math.random() * filteredSides.length)];
      const option = randomSides === 0 ? "0 sides (curved)" : `${randomSides} sides`;
      if (!options.includes(option)) {
        options.push(option);
      }
    }
    
    return options.sort(() => Math.random() - 0.5);
  };

  const handleAnswer = (selectedAnswer: string) => {
    if (!currentQuestion) return;
    
    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(prev => prev + 1);
      toast.success("Correct!");
    } else {
      toast.error(`Incorrect! The answer was: ${currentQuestion.correctAnswer}`);
    }
    
    setQuestionsAnswered(prev => prev + 1);
    
    // Increase difficulty every 5 questions
    if ((questionsAnswered + 1) % 5 === 0) {
      if (difficulty === "easy") setDifficulty("medium");
      else if (difficulty === "medium") setDifficulty("hard");
    }
  };

  const nextQuestion = () => {
    // Check if we've used most questions, reset if needed
    if (usedQuestions.size > shapes.length * 3) {
      setUsedQuestions(new Set());
    }
    
    const question = generateQuestion();
    setCurrentQuestion(question);
    setIsCorrect(null);
    setShowResult(false);
  };

  const resetGame = () => {
    setScore(0);
    setQuestionsAnswered(0);
    setUsedQuestions(new Set());
    setDifficulty("easy");
    nextQuestion();
  };

  useEffect(() => {
    nextQuestion();
  }, []);

  const getDifficultyColor = () => {
    switch (difficulty) {
      case "easy": return "bg-green-500";
      case "medium": return "bg-yellow-500";
      case "hard": return "bg-red-500";
      default: return "bg-green-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex items-center">
          <Link to="/">
            <Button variant="ghost" size="icon" className="text-white mr-4 hover:bg-white/10">
              <ArrowLeft />
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">Shape Match</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Score and Controls */}
        <div className="text-center mb-8 space-y-4">
          <div className="inline-flex items-center bg-white rounded-lg shadow-md px-6 py-3">
            <Star className="text-yellow-500 mr-2" />
            <span className="text-lg font-bold">Score: {score}/{questionsAnswered}</span>
          </div>
          
          <div className={`inline-flex items-center rounded-lg px-4 py-2 text-white font-medium ${getDifficultyColor()}`}>
            Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </div>
        </div>

        {/* Question Card */}
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-t-lg">
              <CardTitle className="text-center text-xl">
                Question {questionsAnswered + 1}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {currentQuestion && (
                <>
                  <div className="text-center mb-6">
                    <p className="text-xl font-semibold mb-6">
                      {currentQuestion.question}
                    </p>
                    
                    {/* Shape Display */}
                    <div className="flex justify-center mb-6">
                      <div className="w-32 h-32 bg-white rounded-lg shadow-md flex items-center justify-center">
                        <svg width="100" height="100" viewBox="0 0 100 100">
                          <path d={currentQuestion.shape.svg} className={currentQuestion.shape.color} stroke="#374151" strokeWidth="2" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {!showResult ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentQuestion.options.map((option, index) => (
                        <Button
                          key={index}
                          onClick={() => handleAnswer(option)}
                          variant="outline"
                          className="p-4 h-auto text-center hover:bg-blue-50 transition-colors"
                        >
                          <span className="font-medium">{option}</span>
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className={cn(
                        "flex items-center justify-center p-4 rounded-lg",
                        isCorrect ? "bg-green-100" : "bg-red-100"
                      )}>
                        {isCorrect ? (
                          <CheckCircle className="text-green-600 mr-2" />
                        ) : (
                          <XCircle className="text-red-600 mr-2" />
                        )}
                        <span className={cn(
                          "font-semibold",
                          isCorrect ? "text-green-800" : "text-red-800"
                        )}>
                          {isCorrect ? "Correct!" : `Wrong! The answer was: ${currentQuestion.correctAnswer}`}
                        </span>
                      </div>
                      <Button
                        onClick={nextQuestion}
                        className="w-full bg-gradient-to-r from-emerald-600 to-blue-600"
                      >
                        Next Question
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Reset Button */}
          <div className="text-center mt-6">
            <Button
              onClick={resetGame}
              variant="outline"
              className="border-emerald-300 text-emerald-600 hover:bg-emerald-50"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Game
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShapeMatch;
