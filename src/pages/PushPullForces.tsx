import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Trophy, Hand, Zap, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import GameCompletionHandler from "@/components/GameCompletionHandler";

type QuestionType = "identify" | "compare" | "scenario" | "drag-demo";

interface Question {
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  visual?: {
    push?: boolean;
    pull?: boolean;
    both?: boolean;
  };
}

const questions: Question[] = [
  {
    type: "identify",
    question: "Opening a door - is this a push or a pull?",
    options: ["Push", "Pull", "Both"],
    correctAnswer: 2,
    explanation: "You can both PUSH a door open (from inside) or PULL it open (from outside)!",
    visual: { both: true }
  },
  {
    type: "identify",
    question: "Kicking a soccer ball - push or pull?",
    options: ["Push", "Pull", "Neither"],
    correctAnswer: 0,
    explanation: "Kicking is a PUSH force - your foot pushes the ball forward!",
    visual: { push: true }
  },
  {
    type: "scenario",
    question: "You're in a tug-of-war. What force are you using?",
    options: ["Push", "Pull", "Twist"],
    correctAnswer: 1,
    explanation: "Tug-of-war uses PULL force - you're pulling the rope toward you!",
    visual: { pull: true }
  },
  {
    type: "identify",
    question: "Using a vacuum cleaner - push or pull?",
    options: ["Push", "Pull", "Both"],
    correctAnswer: 2,
    explanation: "You PUSH the vacuum around, but it PULLS dirt in with suction!",
    visual: { both: true }
  },
  {
    type: "compare",
    question: "Which uses more force: pushing a heavy box or a light box?",
    options: ["Heavy box", "Light box", "Same force"],
    correctAnswer: 0,
    explanation: "Heavier objects need MORE force to move them (remember F=ma!).",
    visual: { push: true }
  },
  {
    type: "scenario",
    question: "A magnet attracts a paperclip. What force is this?",
    options: ["Push", "Pull", "Both"],
    correctAnswer: 1,
    explanation: "Magnetic attraction is a PULL force - it pulls the paperclip closer!",
    visual: { pull: true }
  },
  {
    type: "identify",
    question: "Closing a drawer - push or pull?",
    options: ["Push", "Pull", "Both"],
    correctAnswer: 0,
    explanation: "Closing a drawer requires a PUSH force to move it inward.",
    visual: { push: true }
  },
  {
    type: "scenario",
    question: "A compressed spring releases. What force does it apply?",
    options: ["Push", "Pull", "Twist"],
    correctAnswer: 0,
    explanation: "Springs PUSH back when released, exerting a push force!",
    visual: { push: true }
  },
  {
    type: "identify",
    question: "Zipping up your jacket - push or pull?",
    options: ["Push", "Pull", "Both"],
    correctAnswer: 1,
    explanation: "Zipping up requires PULL force - you pull the zipper upward!",
    visual: { pull: true }
  },
  {
    type: "compare",
    question: "On ice vs. rough ground, which needs less force to push an object?",
    options: ["Ice", "Rough ground", "Same"],
    correctAnswer: 0,
    explanation: "Ice has less friction, so less force is needed to push objects!",
    visual: { push: true }
  }
];

const PushPullForces = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);

  const handleStartGame = () => {
    setGameStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCorrectAnswers(0);
    setGameStartTime(Date.now());
  };

  const handleAnswer = (answerIndex: number) => {
    if (showExplanation) return;
    
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    const isCorrect = answerIndex === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore(score + 10);
      setCorrectAnswers(prev => prev + 1);
      toast.success("Great job! 🎉");
    } else {
      toast.error("Try again next time!");
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleGameComplete = () => {
    setShowCompletion(true);
  };

  const handlePlayAgain = () => {
    setShowCompletion(false);
    handleStartGame();
  };

  const handleExitGame = () => {
    setShowCompletion(false);
    setGameStarted(false);
  };

  const getTimeSpent = () => {
    if (!gameStartTime) return 0;
    return Math.round((Date.now() - gameStartTime) / 1000);
  };

  const renderVisual = (visual?: { push?: boolean; pull?: boolean; both?: boolean }) => {
    if (!visual) return null;

    return (
      <div className="flex justify-center gap-6 my-6">
        {(visual.push || visual.both) && (
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mb-2 shadow-lg animate-pulse">
              <ChevronRight className="h-12 w-12 text-white" />
            </div>
            <p className="font-bold text-orange-600">PUSH</p>
          </div>
        )}
        {(visual.pull || visual.both) && (
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mb-2 shadow-lg animate-pulse">
              <Hand className="h-12 w-12 text-white" />
            </div>
            <p className="font-bold text-blue-600">PULL</p>
          </div>
        )}
      </div>
    );
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 p-8">
        <div className="max-w-4xl mx-auto">
          <Link to="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <Card className="overflow-hidden border-none shadow-2xl">
            <div className="bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 p-8 text-white">
              <h1 className="text-4xl font-bold mb-4">Push & Pull Forces</h1>
              <p className="text-lg opacity-90">Explore the fundamental forces that move our world!</p>
            </div>

            <CardContent className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="overflow-hidden border-2 border-orange-200">
                  <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold">Push Forces</h3>
                      <ChevronRight className="h-10 w-10" />
                    </div>
                    <p className="text-sm opacity-90">Move objects away from you</p>
                  </div>
                  <CardContent className="p-4 space-y-2">
                    <p className="text-sm font-medium">Examples:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Pushing a shopping cart</li>
                      <li>• Kicking a ball</li>
                      <li>• Pressing a button</li>
                      <li>• Closing a door</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-2 border-blue-200">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold">Pull Forces</h3>
                      <Hand className="h-10 w-10" />
                    </div>
                    <p className="text-sm opacity-90">Move objects toward you</p>
                  </div>
                  <CardContent className="p-4 space-y-2">
                    <p className="text-sm font-medium">Examples:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Opening a drawer</li>
                      <li>• Tug-of-war rope</li>
                      <li>• Magnetic attraction</li>
                      <li>• Pulling a wagon</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-purple-50 p-6 rounded-lg border-2 border-orange-200">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-orange-600" />
                  What You'll Learn
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Identify push and pull forces in everyday actions</li>
                  <li>• Understand how forces cause objects to move</li>
                  <li>• Compare different types of forces and their effects</li>
                  <li>• See real-world examples with visual demonstrations</li>
                  <li>• Master the basics of force and motion!</li>
                </ul>
              </div>

              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">10</p>
                  <p className="text-sm text-muted-foreground">Questions</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-3xl font-bold text-purple-600">10</p>
                  <p className="text-sm text-muted-foreground">Points Each</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-3xl font-bold text-orange-600">100</p>
                  <p className="text-sm text-muted-foreground">Max Score</p>
                </div>
              </div>

              <Button 
                onClick={handleStartGame}
                className="w-full bg-gradient-to-r from-orange-600 to-purple-600 hover:from-orange-700 hover:to-purple-700 text-white py-6 text-lg font-bold"
              >
                Start Exploring Forces
                <Zap className="ml-2 h-5 w-5" />
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Trophy className="h-6 w-6 text-yellow-600" />
            <span className="text-2xl font-bold text-purple-900">{score}</span>
          </div>
          <div className="px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-purple-500 text-white font-bold">
            Question {currentQuestion + 1}/{questions.length}
          </div>
        </div>

        <div className="mb-6">
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="shadow-xl border-none">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">{question.question}</h2>

            {renderVisual(question.visual)}

            <div className="space-y-3">
              {question.options?.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === question.correctAnswer;
                const showResult = showExplanation;

                let buttonClass = "w-full p-5 text-left border-2 rounded-lg transition-all hover:shadow-lg font-medium text-lg ";
                
                if (showResult) {
                  if (isCorrect) {
                    buttonClass += "border-green-500 bg-green-50 text-green-900";
                  } else if (isSelected && !isCorrect) {
                    buttonClass += "border-red-500 bg-red-50 text-red-900";
                  } else {
                    buttonClass += "border-gray-200 bg-gray-50";
                  }
                } else {
                  buttonClass += isSelected 
                    ? "border-orange-500 bg-orange-50" 
                    : "border-gray-200 hover:border-orange-300";
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={showExplanation}
                    className={buttonClass}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                        showResult && isCorrect ? 'bg-green-500 text-white' :
                        showResult && isSelected && !isCorrect ? 'bg-red-500 text-white' :
                        isSelected ? 'bg-orange-500 text-white' : 'bg-gray-200'
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
              <div className="mt-6 p-6 bg-gradient-to-r from-orange-50 to-purple-50 rounded-lg border-l-4 border-orange-500">
                <h3 className="font-bold text-lg mb-2 text-orange-900 flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Explanation
                </h3>
                <p className="text-gray-700 text-lg">{question.explanation}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {showExplanation && (
          <div className="mt-6 flex justify-center">
            {isLastQuestion ? (
              <Button 
                onClick={handleGameComplete}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-6 text-lg"
              >
                View Results
                <Trophy className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              <Button 
                onClick={handleNext}
                className="bg-gradient-to-r from-orange-600 to-purple-600 hover:from-orange-700 hover:to-purple-700 text-white px-8 py-6 text-lg"
              >
                Next Question →
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Game Completion Handler */}
      {showCompletion && (
        <GameCompletionHandler
          gameId="push-pull-forces"
          gameName="Push & Pull Forces"
          score={score}
          correctAnswers={correctAnswers}
          totalQuestions={questions.length}
          difficulty="easy"
          timeSpentSeconds={getTimeSpent()}
          onPlayAgain={handlePlayAgain}
          onClose={handleExitGame}
        />
      )}
    </div>
  );
};

export default PushPullForces;
