import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Trophy, Gauge, Zap, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

type QuestionType = "speed-calc" | "distance" | "time" | "compare" | "concept";

interface Question {
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  unit?: string;
}

const questions: Question[] = [
  {
    type: "concept",
    question: "What is motion?",
    options: [
      "When an object changes position",
      "When an object is heavy",
      "When an object is colorful",
      "When an object is round"
    ],
    correctAnswer: 0,
    explanation: "Motion is when an object changes its position over time relative to a reference point!"
  },
  {
    type: "speed-calc",
    question: "A car travels 100 km in 2 hours. What is its average speed?",
    options: ["25 km/h", "50 km/h", "100 km/h", "200 km/h"],
    correctAnswer: 1,
    explanation: "Speed = Distance ÷ Time = 100 km ÷ 2 hours = 50 km/h",
    unit: "km/h"
  },
  {
    type: "compare",
    question: "Which is faster: a cheetah running at 100 km/h or a car at 60 km/h?",
    options: ["Cheetah", "Car", "Same speed"],
    correctAnswer: 0,
    explanation: "The cheetah at 100 km/h is faster than the car at 60 km/h!"
  },
  {
    type: "distance",
    question: "If you walk at 5 km/h for 3 hours, how far do you travel?",
    options: ["8 km", "15 km", "2 km", "20 km"],
    correctAnswer: 1,
    explanation: "Distance = Speed × Time = 5 km/h × 3 hours = 15 km",
    unit: "km"
  },
  {
    type: "concept",
    question: "An object at rest has what speed?",
    options: ["0 km/h", "1 km/h", "10 km/h", "It depends"],
    correctAnswer: 0,
    explanation: "An object at rest (not moving) has a speed of 0!"
  },
  {
    type: "time",
    question: "How long does it take to travel 120 km at 60 km/h?",
    options: ["1 hour", "2 hours", "3 hours", "4 hours"],
    correctAnswer: 1,
    explanation: "Time = Distance ÷ Speed = 120 km ÷ 60 km/h = 2 hours",
    unit: "hours"
  },
  {
    type: "concept",
    question: "What does acceleration mean?",
    options: [
      "Change in speed over time",
      "Total distance traveled",
      "Standing still",
      "Moving backward"
    ],
    correctAnswer: 0,
    explanation: "Acceleration is the rate at which an object changes its speed!"
  },
  {
    type: "compare",
    question: "A bike travels 30 km in 1 hour. A walker travels 5 km in 1 hour. Who is faster?",
    options: ["Bike", "Walker", "Same speed"],
    correctAnswer: 0,
    explanation: "The bike at 30 km/h is much faster than the walker at 5 km/h!"
  },
  {
    type: "speed-calc",
    question: "A train travels 300 km in 3 hours. What's its speed?",
    options: ["50 km/h", "75 km/h", "100 km/h", "150 km/h"],
    correctAnswer: 2,
    explanation: "Speed = 300 km ÷ 3 hours = 100 km/h",
    unit: "km/h"
  },
  {
    type: "concept",
    question: "Which direction matters when describing motion?",
    options: [
      "Yes, direction is part of velocity",
      "No, only speed matters",
      "Only for cars",
      "Only when going uphill"
    ],
    correctAnswer: 0,
    explanation: "Velocity includes both speed AND direction! Going 50 km/h north is different from 50 km/h south."
  },
  {
    type: "distance",
    question: "A plane flies at 800 km/h for 2 hours. How far does it travel?",
    options: ["400 km", "1600 km", "800 km", "2400 km"],
    correctAnswer: 1,
    explanation: "Distance = 800 km/h × 2 hours = 1600 km",
    unit: "km"
  },
  {
    type: "compare",
    question: "If two cars travel the same distance, which one is faster?",
    options: [
      "The one that takes less time",
      "The one that takes more time",
      "They're equally fast",
      "The heavier one"
    ],
    correctAnswer: 0,
    explanation: "Less time for the same distance means higher speed!"
  }
];

const MotionMastery = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleStartGame = () => {
    setGameStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const handleAnswer = (answerIndex: number) => {
    if (showExplanation) return;
    
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    const isCorrect = answerIndex === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore(score + 10);
      toast.success("Excellent! 🚀");
    } else {
      toast.error("Not quite! Learn from the explanation.");
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 p-8">
        <div className="max-w-4xl mx-auto">
          <Link to="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <Card className="overflow-hidden border-none shadow-2xl">
            <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 p-8 text-white">
              <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
                <Gauge className="h-10 w-10" />
                Motion Mastery
              </h1>
              <p className="text-lg opacity-90">Master speed, distance, and time calculations!</p>
            </div>

            <CardContent className="p-8 space-y-6">
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-xl border-2 border-cyan-200">
                <h3 className="font-bold text-xl mb-4 text-cyan-900">The Motion Formula Triangle</h3>
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="w-48 h-48 bg-gradient-to-br from-cyan-500 to-blue-600 clip-triangle flex items-center justify-center" style={{clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)"}}>
                      <div className="text-white text-center">
                        <p className="text-3xl font-bold mb-8">D</p>
                        <div className="flex justify-between px-8">
                          <p className="text-2xl font-bold">S</p>
                          <p className="text-2xl font-bold">T</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-white rounded-lg shadow">
                    <p className="font-bold text-cyan-700">Speed</p>
                    <p className="text-sm text-muted-foreground">Distance ÷ Time</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg shadow">
                    <p className="font-bold text-blue-700">Distance</p>
                    <p className="text-sm text-muted-foreground">Speed × Time</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg shadow">
                    <p className="font-bold text-indigo-700">Time</p>
                    <p className="text-sm text-muted-foreground">Distance ÷ Speed</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-gradient-to-br from-cyan-100 to-cyan-50">
                  <CardContent className="p-6">
                    <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                      <Gauge className="h-5 w-5 text-cyan-600" />
                      What is Speed?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Speed tells us how fast something is moving. It's measured in units like km/h (kilometers per hour) or m/s (meters per second).
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-100 to-blue-50">
                  <CardContent className="p-6">
                    <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                      <Play className="h-5 w-5 text-blue-600" />
                      Motion Basics
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Motion happens when an object changes position. We measure it using distance (how far), speed (how fast), and time (how long).
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-indigo-50 p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-indigo-600" />
                  Game Features
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Calculate speed, distance, and time</li>
                  <li>• Compare speeds of different objects</li>
                  <li>• Understand motion concepts clearly</li>
                  <li>• Practice real-world motion problems</li>
                  <li>• Master the motion formula triangle!</li>
                </ul>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-cyan-50 rounded-lg">
                  <p className="text-3xl font-bold text-cyan-600">{questions.length}</p>
                  <p className="text-sm text-muted-foreground">Questions</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">10</p>
                  <p className="text-sm text-muted-foreground">Points Each</p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <p className="text-3xl font-bold text-indigo-600">{questions.length * 10}</p>
                  <p className="text-sm text-muted-foreground">Max Score</p>
                </div>
              </div>

              <Button 
                onClick={handleStartGame}
                className="w-full bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 text-white py-6 text-lg font-bold"
              >
                Start Motion Challenge
                <Gauge className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestion === questions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Trophy className="h-6 w-6 text-yellow-600" />
            <span className="text-2xl font-bold text-indigo-900">{score}</span>
          </div>
          <div className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-bold">
            {currentQuestion + 1} / {questions.length}
          </div>
        </div>

        <div className="mb-6">
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="shadow-xl border-none">
          <CardContent className="p-8">
            <div className="flex items-start gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
                <Gauge className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 flex-1">{question.question}</h2>
            </div>

            <div className="space-y-3">
              {question.options?.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === question.correctAnswer;
                const showResult = showExplanation;

                let buttonClass = "w-full p-5 text-left border-2 rounded-xl transition-all hover:shadow-lg font-medium text-lg ";
                
                if (showResult) {
                  if (isCorrect) {
                    buttonClass += "border-green-500 bg-green-50 text-green-900 shadow-green-200";
                  } else if (isSelected && !isCorrect) {
                    buttonClass += "border-red-500 bg-red-50 text-red-900 shadow-red-200";
                  } else {
                    buttonClass += "border-gray-200 bg-gray-50 opacity-60";
                  }
                } else {
                  buttonClass += isSelected 
                    ? "border-cyan-500 bg-cyan-50 shadow-cyan-200" 
                    : "border-gray-200 hover:border-cyan-300 hover:bg-cyan-50";
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={showExplanation}
                    className={buttonClass}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
                        showResult && isCorrect ? 'bg-green-500 text-white' :
                        showResult && isSelected && !isCorrect ? 'bg-red-500 text-white' :
                        isSelected ? 'bg-cyan-500 text-white' : 'bg-gray-200'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span>{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {showExplanation && (
              <div className="mt-6 p-6 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border-l-4 border-cyan-500">
                <h3 className="font-bold text-lg mb-2 text-cyan-900 flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Explanation
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">{question.explanation}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {showExplanation && (
          <div className="mt-6 flex justify-center">
            {isLastQuestion ? (
              <Button 
                onClick={() => {
                  setGameStarted(false);
                  toast.success(`Amazing work! Final Score: ${score}/${questions.length * 10}`);
                }}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-6 text-lg"
              >
                View Results
                <Trophy className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              <Button 
                onClick={handleNext}
                className="bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 text-white px-8 py-6 text-lg"
              >
                Next Question →
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MotionMastery;
