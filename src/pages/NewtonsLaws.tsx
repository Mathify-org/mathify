import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Trophy, Zap, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

type QuestionType = "identify-law" | "scenario" | "formula" | "application";

interface Question {
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | number;
  law: 1 | 2 | 3;
  explanation: string;
}

const questions: Question[] = [
  {
    type: "identify-law",
    question: "A book sits on a table without moving. Which law explains this?",
    options: ["First Law (Inertia)", "Second Law (F=ma)", "Third Law (Action-Reaction)"],
    correctAnswer: 0,
    law: 1,
    explanation: "Newton's First Law states an object at rest stays at rest unless acted upon by an external force."
  },
  {
    type: "scenario",
    question: "When you push a shopping cart, the harder you push, the faster it accelerates. Which law?",
    options: ["First Law", "Second Law", "Third Law"],
    correctAnswer: 1,
    law: 2,
    explanation: "Newton's Second Law (F=ma) shows force is proportional to acceleration."
  },
  {
    type: "application",
    question: "When a rocket launches, hot gases push down and the rocket goes up. Which law?",
    options: ["First Law", "Second Law", "Third Law"],
    correctAnswer: 2,
    law: 3,
    explanation: "Newton's Third Law: for every action, there's an equal and opposite reaction."
  },
  {
    type: "identify-law",
    question: "A ball rolling on grass eventually stops. Why?",
    options: ["Friction acts on it", "It loses energy naturally", "Gravity pulls it down"],
    correctAnswer: 0,
    law: 1,
    explanation: "The First Law tells us objects in motion stay in motion unless friction acts as an external force."
  },
  {
    type: "formula",
    question: "If a 10kg object accelerates at 5 m/s², what force is applied?",
    options: ["2 N", "15 N", "50 N", "500 N"],
    correctAnswer: 2,
    law: 2,
    explanation: "F = ma = 10kg × 5m/s² = 50 Newtons"
  },
  {
    type: "scenario",
    question: "You're in a car that suddenly brakes. You lurch forward. Which law?",
    options: ["First Law", "Second Law", "Third Law"],
    correctAnswer: 0,
    law: 1,
    explanation: "Your body wants to continue moving forward (inertia) even though the car stops."
  },
  {
    type: "application",
    question: "When swimming, you push water backward to move forward. Which law?",
    options: ["First Law", "Second Law", "Third Law"],
    correctAnswer: 2,
    law: 3,
    explanation: "You push water back (action), water pushes you forward (reaction)."
  },
  {
    type: "formula",
    question: "A 2kg ball is kicked with 20N of force. What's its acceleration?",
    options: ["5 m/s²", "10 m/s²", "20 m/s²", "40 m/s²"],
    correctAnswer: 1,
    law: 2,
    explanation: "a = F/m = 20N / 2kg = 10 m/s²"
  },
  {
    type: "scenario",
    question: "A astronaut floats in space because there's no gravity. True or false?",
    options: ["True", "False"],
    correctAnswer: 1,
    law: 1,
    explanation: "False! Gravity exists but there's no force to change their motion (First Law)."
  },
  {
    type: "application",
    question: "When you walk, your foot pushes Earth backward. What happens to Earth?",
    options: ["Nothing - it's too big", "It moves backward slightly", "It vibrates"],
    correctAnswer: 1,
    law: 3,
    explanation: "Third Law: Earth does move backward, but its huge mass makes it imperceptible!"
  }
];

const NewtonsLaws = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(new Array(questions.length).fill(false));

  const handleStartGame = () => {
    setGameStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setAnsweredQuestions(new Array(questions.length).fill(false));
  };

  const handleAnswer = (answerIndex: number) => {
    if (showExplanation) return;
    
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    const isCorrect = answerIndex === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore(score + 10);
      toast.success("Correct! 🎉");
    } else {
      toast.error("Not quite right. Read the explanation!");
    }
    
    const newAnswered = [...answeredQuestions];
    newAnswered[currentQuestion] = true;
    setAnsweredQuestions(newAnswered);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const getLawColor = (law: 1 | 2 | 3) => {
    const colors = {
      1: "from-blue-500 to-cyan-500",
      2: "from-purple-500 to-pink-500",
      3: "from-orange-500 to-red-500"
    };
    return colors[law];
  };

  const getLawIcon = (law: 1 | 2 | 3) => {
    const icons = {
      1: "🛑",
      2: "⚡",
      3: "🚀"
    };
    return icons[law];
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
        <div className="max-w-4xl mx-auto">
          <Link to="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <Card className="overflow-hidden border-none shadow-2xl">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-white">
              <h1 className="text-4xl font-bold mb-4">Newton's Three Laws</h1>
              <p className="text-lg opacity-90">Master the fundamental principles of motion and force!</p>
            </div>

            <CardContent className="p-8 space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="overflow-hidden">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-4 text-white text-center">
                    <div className="text-4xl mb-2">🛑</div>
                    <h3 className="font-bold text-lg">First Law</h3>
                    <p className="text-sm opacity-90">Law of Inertia</p>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">
                      An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force.
                    </p>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 text-white text-center">
                    <div className="text-4xl mb-2">⚡</div>
                    <h3 className="font-bold text-lg">Second Law</h3>
                    <p className="text-sm opacity-90">F = ma</p>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">
                      Force equals mass times acceleration. The greater the force or smaller the mass, the greater the acceleration.
                    </p>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden">
                  <div className="bg-gradient-to-br from-orange-500 to-red-500 p-4 text-white text-center">
                    <div className="text-4xl mb-2">🚀</div>
                    <h3 className="font-bold text-lg">Third Law</h3>
                    <p className="text-sm opacity-90">Action-Reaction</p>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">
                      For every action, there is an equal and opposite reaction. Forces always come in pairs!
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  How to Play
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Answer questions about Newton's three laws of motion</li>
                  <li>• Identify which law applies to different scenarios</li>
                  <li>• Solve force and acceleration problems</li>
                  <li>• Learn from detailed explanations after each answer</li>
                  <li>• Score 10 points for each correct answer!</li>
                </ul>
              </div>

              <Button 
                onClick={handleStartGame}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg font-bold"
              >
                Start Learning
                <Star className="ml-2 h-5 w-5" />
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Trophy className="h-6 w-6 text-yellow-600" />
            <span className="text-2xl font-bold text-purple-900">{score}</span>
          </div>
          <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${getLawColor(question.law)} text-white font-bold flex items-center gap-2`}>
            <span>{getLawIcon(question.law)}</span>
            <span>Law {question.law}</span>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="shadow-xl border-none">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">{question.question}</h2>

            <div className="space-y-3">
              {question.options?.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === question.correctAnswer;
                const showResult = showExplanation;

                let buttonClass = "w-full p-4 text-left border-2 rounded-lg transition-all hover:shadow-md ";
                
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
                    ? "border-purple-500 bg-purple-50" 
                    : "border-gray-200 hover:border-purple-300";
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={showExplanation}
                    className={buttonClass}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        showResult && isCorrect ? 'bg-green-500 text-white' :
                        showResult && isSelected && !isCorrect ? 'bg-red-500 text-white' :
                        isSelected ? 'bg-purple-500 text-white' : 'bg-gray-200'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="font-medium">{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {showExplanation && (
              <div className="mt-6 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <h3 className="font-bold text-lg mb-2 text-blue-900">Explanation</h3>
                <p className="text-gray-700">{question.explanation}</p>
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
                  toast.success(`Game Complete! Final Score: ${score}/${questions.length * 10}`);
                }}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-6 text-lg"
              >
                View Results
                <Trophy className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              <Button 
                onClick={handleNext}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg"
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

export default NewtonsLaws;
