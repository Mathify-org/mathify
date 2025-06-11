
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, XCircle, Star, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Shape {
  id: string;
  name: string;
  sides: number;
  color: string;
  svg: string;
}

const shapes: Shape[] = [
  {
    id: "triangle",
    name: "Triangle",
    sides: 3,
    color: "fill-red-400",
    svg: "M50 10 L90 80 L10 80 Z"
  },
  {
    id: "square",
    name: "Square", 
    sides: 4,
    color: "fill-blue-400",
    svg: "M20 20 L80 20 L80 80 L20 80 Z"
  },
  {
    id: "pentagon",
    name: "Pentagon",
    sides: 5,
    color: "fill-green-400",
    svg: "M50 10 L80 30 L70 70 L30 70 L20 30 Z"
  },
  {
    id: "hexagon",
    name: "Hexagon",
    sides: 6,
    color: "fill-purple-400",
    svg: "M50 10 L80 25 L80 55 L50 70 L20 55 L20 25 Z"
  },
  {
    id: "circle",
    name: "Circle",
    sides: 0,
    color: "fill-yellow-400",
    svg: "M50 50 m-30 0 a30 30 0 1 0 60 0 a30 30 0 1 0 -60 0"
  }
];

const ShapeMatch = () => {
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);
  const [options, setOptions] = useState<Shape[]>([]);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [gameMode, setGameMode] = useState<"name" | "sides">("name");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);

  const generateQuestion = () => {
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    setCurrentShape(randomShape);

    // Create 4 options including the correct one
    const correctAnswer = randomShape;
    const wrongAnswers = shapes.filter(s => s.id !== randomShape.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const allOptions = [correctAnswer, ...wrongAnswers]
      .sort(() => Math.random() - 0.5);
    
    setOptions(allOptions);
    setIsCorrect(null);
    setShowResult(false);
  };

  const handleAnswer = (selectedShape: Shape) => {
    const correct = selectedShape.id === currentShape?.id;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(prev => prev + 1);
      toast.success("Correct!");
    } else {
      toast.error(`Incorrect! That was a ${currentShape?.name}`);
    }
    
    setQuestionsAnswered(prev => prev + 1);
  };

  const nextQuestion = () => {
    generateQuestion();
  };

  const resetGame = () => {
    setScore(0);
    setQuestionsAnswered(0);
    generateQuestion();
  };

  const toggleGameMode = () => {
    setGameMode(prev => prev === "name" ? "sides" : "name");
    generateQuestion();
  };

  useEffect(() => {
    generateQuestion();
  }, [gameMode]);

  const getQuestionText = () => {
    if (!currentShape) return "";
    
    if (gameMode === "name") {
      return `What is this shape called?`;
    } else {
      return `How many sides does this shape have?`;
    }
  };

  const getOptionText = (shape: Shape) => {
    if (gameMode === "name") {
      return shape.name;
    } else {
      return shape.sides === 0 ? "0 sides (curved)" : `${shape.sides} sides`;
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
          
          <Button
            onClick={toggleGameMode}
            variant="outline"
            className="mx-2"
          >
            Mode: {gameMode === "name" ? "Name Shapes" : "Count Sides"}
          </Button>
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
              {currentShape && (
                <>
                  <div className="text-center mb-6">
                    <p className="text-xl font-semibold mb-6">
                      {getQuestionText()}
                    </p>
                    
                    {/* Shape Display */}
                    <div className="flex justify-center mb-6">
                      <div className="w-32 h-32 bg-white rounded-lg shadow-md flex items-center justify-center">
                        <svg width="100" height="100" viewBox="0 0 100 100">
                          <path d={currentShape.svg} className={currentShape.color} stroke="#374151" strokeWidth="2" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {!showResult ? (
                    <div className="grid grid-cols-2 gap-4">
                      {options.map((shape, index) => (
                        <Button
                          key={shape.id}
                          onClick={() => handleAnswer(shape)}
                          variant="outline"
                          className="p-4 h-auto text-center hover:bg-blue-50 transition-colors"
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <svg width="40" height="40" viewBox="0 0 100 100">
                              <path d={shape.svg} className={shape.color} stroke="#374151" strokeWidth="2" />
                            </svg>
                            <span className="font-medium">{getOptionText(shape)}</span>
                          </div>
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
                          {isCorrect ? "Correct!" : `Wrong! That was a ${currentShape.name}`}
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
