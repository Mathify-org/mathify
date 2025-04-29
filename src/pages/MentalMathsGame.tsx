import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, X, ArrowLeft, Plus, Minus, Divide, Timer } from "lucide-react";

// Types for our math problem
type Operation = "+" | "-" | "*" | "/";
type Problem = {
  num1: number;
  num2: number;
  operation: Operation;
  answer: number;
};

const MentalMathsGame = () => {
  const [gameState, setGameState] = useState<"idle" | "playing" | "completed">("idle");
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [timeLeft, setTimeLeft] = useState(6);
  const [resultAnimation, setResultAnimation] = useState<"correct" | "incorrect" | null>(null);
  const [results, setResults] = useState<Array<{ correct: boolean; problem: Problem }>>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const totalQuestions = 25;
  
  const generateProblem = (): Problem => {
    const operations: Operation[] = ["+", "-", "*", "/"];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let num1, num2, answer;
    
    switch (operation) {
      case "+":
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        answer = num1 + num2;
        break;
      case "-":
        num1 = Math.floor(Math.random() * 50) + 20; // Ensure positive result
        num2 = Math.floor(Math.random() * num1);
        answer = num1 - num2;
        break;
      case "*":
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        answer = num1 * num2;
        break;
      case "/":
        num2 = Math.floor(Math.random() * 11) + 2; // Divisor between 2 and 12
        answer = Math.floor(Math.random() * 12) + 1; // Answer between 1 and 12
        num1 = num2 * answer; // Ensure clean division
        break;
      default:
        num1 = 1;
        num2 = 1;
        answer = 2;
    }
    
    return { num1, num2, operation, answer };
  };
  
  const handleStartGame = () => {
    setGameState("playing");
    setQuestionNumber(0);
    setScore(0);
    setResults([]);
    nextQuestion();
  };
  
  const nextQuestion = () => {
    if (questionNumber >= totalQuestions) {
      endGame();
      return;
    }
    
    const problem = generateProblem();
    setCurrentProblem(problem);
    setUserAnswer("");
    setTimeLeft(6);
    setResultAnimation(null);
    setQuestionNumber((prev) => prev + 1);
    
    // Focus the input
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };
  
  const checkAnswer = () => {
    if (!currentProblem) return;
    
    const userAnswerNum = parseInt(userAnswer);
    const isCorrect = userAnswerNum === currentProblem.answer;
    
    setResults((prev) => [...prev, { correct: isCorrect, problem: currentProblem }]);
    
    if (isCorrect) {
      setScore((prev) => prev + 1);
      setResultAnimation("correct");
      toast.success("Correct!");
    } else {
      setResultAnimation("incorrect");
      toast.error(`Incorrect! The answer was ${currentProblem.answer}`);
    }
    
    // Short delay before next question
    setTimeout(() => {
      nextQuestion();
    }, 500);
  };
  
  const endGame = () => {
    setGameState("completed");
    
    // Launch confetti if score is good
    if (score >= totalQuestions * 0.7) {
      launchConfetti();
    }
  };
  
  const launchConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#9b87f5', '#7E69AB', '#6E59A5']
    });
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      checkAnswer();
    }
  };
  
  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gameState === "playing" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 0.1);
      }, 100);
    } else if (timeLeft <= 0 && gameState === "playing") {
      checkAnswer();
    }
    
    return () => clearInterval(timer);
  }, [timeLeft, gameState]);
  
  // Display the appropriate operation icon
  const OperationIcon = () => {
    if (!currentProblem) return null;
    
    switch (currentProblem.operation) {
      case "+": return <Plus className="h-8 w-8 text-emerald-500" />;
      case "-": return <Minus className="h-8 w-8 text-sky-500" />;
      case "*": return <X className="h-8 w-8 text-purple-500" />;
      case "/": return <Divide className="h-8 w-8 text-orange-500" />;
      default: return null;
    }
  };
  
  // Get human-readable operation name
  const getOperationName = (op: Operation): string => {
    switch (op) {
      case "+": return "Addition";
      case "-": return "Subtraction";
      case "*": return "Multiplication";
      case "/": return "Division";
      default: return "";
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E5DEFF] to-[#FEF7CD] flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Button>
        </Link>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#9b87f5] to-[#8B5CF6] bg-clip-text text-transparent">
          Mental Maths Challenge
        </h1>
        <div className="w-24" /> {/* Spacer for balanced layout */}
      </div>
      
      {/* Main content */}
      <Card className="w-full max-w-2xl shadow-lg border-none glass-morphism bg-white/90">
        {gameState === "idle" && (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">Speed Math Challenge</CardTitle>
              <CardDescription className="text-lg mt-2">
                Test your mental math skills with {totalQuestions} quick-fire questions!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-[#E5DEFF] rounded-lg p-6 text-center">
                <h3 className="text-xl font-bold mb-4">How to Play</h3>
                <ul className="text-left space-y-3">
                  <li className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-[#9b87f5] flex items-center justify-center text-white font-bold">1</div>
                    <span>You'll see a math problem</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-[#9b87f5] flex items-center justify-center text-white font-bold">2</div>
                    <span>You have only 6 seconds to answer</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-[#9b87f5] flex items-center justify-center text-white font-bold">3</div>
                    <span>Answer all {totalQuestions} questions to see your final score</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex gap-4 justify-center">
                <div className="text-center p-4 rounded-lg bg-[#FEF7CD]">
                  <Plus className="h-8 w-8 mx-auto text-emerald-500 mb-2" />
                  <p>Addition</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-[#FEF7CD]">
                  <Minus className="h-8 w-8 mx-auto text-sky-500 mb-2" />
                  <p>Subtraction</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-[#FEF7CD]">
                  <X className="h-8 w-8 mx-auto text-purple-500 mb-2" />
                  <p>Multiplication</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-[#FEF7CD]">
                  <Divide className="h-8 w-8 mx-auto text-orange-500 mb-2" />
                  <p>Division</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-[#9b87f5] to-[#8B5CF6] hover:opacity-90 text-white px-8 py-6 text-xl"
                onClick={handleStartGame}
              >
                Start Challenge!
              </Button>
            </CardFooter>
          </>
        )}
        
        {gameState === "playing" && currentProblem && (
          <>
            <CardHeader className="text-center">
              <div className="flex justify-between items-center">
                <div className="text-left">
                  <span className="text-sm font-medium text-muted-foreground">Question</span>
                  <h3 className="text-2xl font-bold">{questionNumber} of {totalQuestions}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Timer className="h-5 w-5 text-orange-500" />
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 transition-all" 
                      style={{ width: `${(timeLeft / 6) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-muted-foreground">Score</span>
                  <h3 className="text-2xl font-bold">{score}</h3>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="text-6xl font-bold">{currentProblem.num1}</div>
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#E5DEFF]">
                  <OperationIcon />
                </div>
                <div className="text-6xl font-bold">{currentProblem.num2}</div>
                <div className="text-6xl font-bold">=</div>
                <div 
                  className={`
                    h-20 w-32 flex items-center justify-center rounded-lg 
                    ${resultAnimation === "correct" ? "bg-green-100 border-2 border-green-500" : ""}
                    ${resultAnimation === "incorrect" ? "bg-red-100 border-2 border-red-500" : ""}
                    ${!resultAnimation ? "border-2 border-dashed border-gray-300" : ""}
                  `}
                >
                  {resultAnimation === "correct" && (
                    <Check className="h-10 w-10 text-green-500" />
                  )}
                  {resultAnimation === "incorrect" && (
                    <X className="h-10 w-10 text-red-500" />
                  )}
                  {!resultAnimation && (
                    <Input
                      ref={inputRef}
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="text-4xl font-bold text-center h-16 w-full"
                      autoFocus
                    />
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground animate-fade-in">
                Type your answer and press Enter
              </p>
            </CardContent>
          </>
        )}
        
        {gameState === "completed" && (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">Challenge Complete!</CardTitle>
              <CardDescription className="text-lg mt-2">
                You scored {score} out of {totalQuestions}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center mb-4">
                <div className="relative h-40 w-40">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-5xl font-bold bg-gradient-to-r from-[#9b87f5] to-[#8B5CF6] bg-clip-text text-transparent">
                      {Math.round((score / totalQuestions) * 100)}%
                    </div>
                  </div>
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle 
                      className="text-gray-200" 
                      strokeWidth="10" 
                      stroke="currentColor" 
                      fill="transparent" 
                      r="40" 
                      cx="50" 
                      cy="50" 
                    />
                    <circle 
                      className="text-[#9b87f5]" 
                      strokeWidth="10" 
                      strokeDasharray={`${(score / totalQuestions) * 251.2} 251.2`}
                      strokeLinecap="round" 
                      stroke="currentColor" 
                      fill="transparent" 
                      r="40" 
                      cx="50" 
                      cy="50" 
                    />
                  </svg>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-medium mb-2">Your Results</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {results.map((result, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center justify-between p-2 rounded-md ${result.correct ? "bg-green-50" : "bg-red-50"}`}
                    >
                      <div className="flex items-center gap-2">
                        {result.correct ? 
                          <Check className="h-5 w-5 text-green-500" /> : 
                          <X className="h-5 w-5 text-red-500" />
                        }
                        <div>
                          {result.problem.num1} {result.problem.operation} {result.problem.num2} = {result.problem.answer}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {getOperationName(result.problem.operation)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={handleStartGame}
                className="px-6"
              >
                Try Again
              </Button>
              <Link to="/">
                <Button
                  variant="secondary"
                  className="px-6"
                >
                  Back to Home
                </Button>
              </Link>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
};

export default MentalMathsGame;
