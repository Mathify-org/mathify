import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, ArrowLeft, Plus, Minus, Divide, Timer } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";

// Types for our math problem
type Operation = "+" | "-" | "*" | "/";
type Problem = {
  num1: number;
  num2: number;
  operation: Operation;
  answer: number;
  options: number[];
};

// Encouraging messages that will be displayed when student gets the answer correct
const encouragingMessages = [
  { message: "Fantastic work! You're a math wizard! ✨", color: "from-emerald-500 to-sky-500" },
  { message: "Brilliant! Keep up the great work! 🌟", color: "from-purple-500 to-pink-500" },
  { message: "Amazing job! Your brain is on fire! 🔥", color: "from-yellow-500 to-orange-500" },
  { message: "Superb! You're unstoppable! 💪", color: "from-blue-500 to-indigo-500" },
  { message: "Impressive skills! You're crushing it! 🏆", color: "from-pink-500 to-purple-500" },
  { message: "Excellent! You're a math genius! 🧠", color: "from-green-500 to-teal-500" },
  { message: "Outstanding! You're making great progress! 🚀", color: "from-orange-500 to-red-500" },
  { message: "Phenomenal! Your mind is powerful! ⚡", color: "from-indigo-500 to-violet-500" },
  { message: "Spectacular! You're absolutely brilliant! 💫", color: "from-teal-500 to-cyan-500" },
  { message: "Incredible! Your skills are top-notch! 🌈", color: "from-red-500 to-pink-500" },
];

const MentalMathsGame = () => {
  const isMobile = useIsMobile();
  const [gameState, setGameState] = useState<"idle" | "playing" | "completed">("idle");
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [timeLeft, setTimeLeft] = useState(12);
  const [resultAnimation, setResultAnimation] = useState<"correct" | "incorrect" | null>(null);
  const [results, setResults] = useState<Array<{ correct: boolean; problem: Problem }>>([]);
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [encouragementMessage, setEncouragementMessage] = useState({ message: "", color: "" });
  const totalQuestions = 25;
  
  // Create random positions for the answer bubbles with better spacing and mobile optimization
  const generateRandomPositions = (count: number) => {
    // Define grid cells to ensure better distribution
    const gridSize = Math.ceil(Math.sqrt(count));
    const cellWidth = 100 / gridSize;
    const cellHeight = 100 / gridSize;
    
    const usedCells: {row: number, col: number}[] = [];
    const positions = [];
    
    for (let i = 0; i < count; i++) {
      let row, col, attempts = 0;
      let cellFound = false;
      
      // Try to find an unused cell
      while (!cellFound && attempts < 20) {
        row = Math.floor(Math.random() * gridSize);
        col = Math.floor(Math.random() * gridSize);
        
        const isCellUsed = usedCells.some(cell => cell.row === row && cell.col === col);
        if (!isCellUsed) {
          usedCells.push({ row, col });
          cellFound = true;
        }
        attempts++;
      }
      
      // If we couldn't find an unused cell, just pick a random one
      if (!cellFound) {
        row = Math.floor(Math.random() * gridSize);
        col = Math.floor(Math.random() * gridSize);
        usedCells.push({ row, col });
      }
      
      // Calculate position within the cell with some randomness
      // On mobile, ensure better vertical distribution to avoid overflow
      const baseTop = (row * cellHeight) + (isMobile ? 15 : 10) + (Math.random() * (cellHeight - (isMobile ? 30 : 20)));
      const baseLeft = (col * cellWidth) + 10 + (Math.random() * (cellWidth - 20));
      
      // Ensure position is within bounds
      const top = Math.min(Math.max(baseTop, 10), 85); // Prevent overflow at bottom
      const left = Math.min(Math.max(baseLeft, 10), 85); // Prevent overflow at sides
      
      positions.push({
        top: top + "%",
        left: left + "%",
        animationDelay: `${Math.random() * 2}s`,
        animationDuration: `${Math.random() * 2 + 2.5}s` // Faster animation (2.5-4.5s)
      });
    }
    return positions;
  };
  
  const [optionPositions, setOptionPositions] = useState<any[]>([]);
  
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
    
    // Generate 4 options including the correct answer
    const options = [answer];
    
    // Add incorrect options
    while (options.length < 4) {
      // Generate a random offset between -10 and +10 but not 0
      const offset = Math.floor(Math.random() * 20) - 10;
      const option = answer + (offset === 0 ? 1 : offset);
      
      // Make sure options are not negative and not duplicates
      if (option > 0 && !options.includes(option)) {
        options.push(option);
      }
    }
    
    // Shuffle options
    const shuffledOptions = options.sort(() => Math.random() - 0.5);
    
    return { num1, num2, operation, answer, options: shuffledOptions };
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
    setUserAnswer(null);
    setTimeLeft(12);
    setResultAnimation(null);
    setQuestionNumber((prev) => prev + 1);
    setOptionPositions(generateRandomPositions(problem.options.length));
    setShowEncouragement(false);
  };
  
  const checkAnswer = (selectedAnswer: number) => {
    if (!currentProblem) return;
    
    setUserAnswer(selectedAnswer);
    const isCorrect = selectedAnswer === currentProblem.answer;
    
    setResults((prev) => [...prev, { correct: isCorrect, problem: currentProblem }]);
    
    if (isCorrect) {
      setScore((prev) => prev + 1);
      setResultAnimation("correct");
      toast.success("Correct!");
      
      // Show encouraging message
      const randomMessage = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
      setEncouragementMessage(randomMessage);
      setShowEncouragement(true);
      
      // Auto-dismiss the encouragement message after 2 seconds
      setTimeout(() => {
        setShowEncouragement(false);
      }, 2000);
      
      // Small confetti burst for each correct answer
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7, x: 0.5 },
        colors: ['#9b87f5', '#7E69AB', '#6E59A5']
      });
    } else {
      setResultAnimation("incorrect");
      toast.error(`Incorrect! The answer was ${currentProblem.answer}`);
    }
    
    // Short delay before next question
    setTimeout(() => {
      nextQuestion();
    }, 1500); // Increased delay to show encouragement
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
  
  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gameState === "playing" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 0.1);
      }, 100);
    } else if (timeLeft <= 0 && gameState === "playing" && currentProblem) {
      // Auto-select wrong answer when time runs out
      checkAnswer(-1); // Invalid answer to mark as incorrect
    }
    
    return () => clearInterval(timer);
  }, [timeLeft, gameState]);
  
  // Display the appropriate operation icon
  const OperationIcon = () => {
    if (!currentProblem) return null;
    
    switch (currentProblem.operation) {
      case "+": return <Plus className={`h-${isMobile ? '6' : '8'} w-${isMobile ? '6' : '8'} text-emerald-500`} />;
      case "-": return <Minus className={`h-${isMobile ? '6' : '8'} w-${isMobile ? '6' : '8'} text-sky-500`} />;
      case "*": return <X className={`h-${isMobile ? '6' : '8'} w-${isMobile ? '6' : '8'} text-purple-500`} />;
      case "/": return <Divide className={`h-${isMobile ? '6' : '8'} w-${isMobile ? '6' : '8'} text-orange-500`} />;
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
    <div className="min-h-screen bg-gradient-to-br from-[#E5DEFF] to-[#FEF7CD] flex flex-col items-center justify-center p-3 md:p-4">
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-4 md:mb-8">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-1 md:gap-2 text-xs md:text-sm p-1 md:p-2">
            <ArrowLeft className="h-3 w-3 md:h-4 md:w-4" /> Back
          </Button>
        </Link>
        <h1 className="text-xl md:text-4xl font-bold bg-gradient-to-r from-[#9b87f5] to-[#8B5CF6] bg-clip-text text-transparent">
          Mental Maths
        </h1>
        <div className="w-12 md:w-24" /> {/* Spacer for balanced layout */}
      </div>
      
      {/* Main content */}
      <Card className="w-full max-w-2xl shadow-lg border-none glass-morphism bg-white/90">
        {gameState === "idle" && (
          <>
            <CardHeader className="text-center p-4 md:p-6">
              <CardTitle className="text-xl md:text-3xl font-bold">Speed Math Challenge</CardTitle>
              <CardDescription className="text-sm md:text-lg mt-1 md:mt-2">
                Test your mental math skills with {totalQuestions} quick-fire questions!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6 px-3 md:px-6">
              <div className="bg-[#E5DEFF] rounded-lg p-3 md:p-6 text-center">
                <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">How to Play</h3>
                <ul className="text-left space-y-2 md:space-y-3">
                  <li className="flex items-center gap-2">
                    <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-[#9b87f5] flex items-center justify-center text-white font-bold text-sm md:text-base">1</div>
                    <span className="text-sm md:text-base">You'll see a math problem</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-[#9b87f5] flex items-center justify-center text-white font-bold text-sm md:text-base">2</div>
                    <span className="text-sm md:text-base">You have only 12 seconds to select the correct answer</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-[#9b87f5] flex items-center justify-center text-white font-bold text-sm md:text-base">3</div>
                    <span className="text-sm md:text-base">Answer all {totalQuestions} questions to see your final score</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex flex-wrap gap-2 md:gap-4 justify-center">
                <div className="text-center p-2 md:p-4 rounded-lg bg-[#FEF7CD]">
                  <Plus className="h-5 w-5 md:h-8 md:w-8 mx-auto text-emerald-500 mb-1 md:mb-2" />
                  <p className="text-xs md:text-base">Addition</p>
                </div>
                <div className="text-center p-2 md:p-4 rounded-lg bg-[#FEF7CD]">
                  <Minus className="h-5 w-5 md:h-8 md:w-8 mx-auto text-sky-500 mb-1 md:mb-2" />
                  <p className="text-xs md:text-base">Subtraction</p>
                </div>
                <div className="text-center p-2 md:p-4 rounded-lg bg-[#FEF7CD]">
                  <X className="h-5 w-5 md:h-8 md:w-8 mx-auto text-purple-500 mb-1 md:mb-2" />
                  <p className="text-xs md:text-base">Multiplication</p>
                </div>
                <div className="text-center p-2 md:p-4 rounded-lg bg-[#FEF7CD]">
                  <Divide className="h-5 w-5 md:h-8 md:w-8 mx-auto text-orange-500 mb-1 md:mb-2" />
                  <p className="text-xs md:text-base">Division</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center px-4 pb-4 md:pb-6">
              <Button 
                size={isMobile ? "default" : "lg"}
                className="bg-gradient-to-r from-[#9b87f5] to-[#8B5CF6] hover:opacity-90 text-white px-6 py-2 md:px-8 md:py-6 text-base md:text-xl"
                onClick={handleStartGame}
              >
                Start Challenge!
              </Button>
            </CardFooter>
          </>
        )}
        
        {gameState === "playing" && currentProblem && (
          <>
            <CardHeader className="text-center p-3 md:p-6">
              <div className="flex justify-between items-center">
                <div className="text-left">
                  <span className="text-xs md:text-sm font-medium text-muted-foreground">Question</span>
                  <h3 className="text-base md:text-2xl font-bold">{questionNumber} of {totalQuestions}</h3>
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                  <Timer className="h-4 w-4 md:h-5 md:w-5 text-orange-500" />
                  <div className="w-16 md:w-24 h-1.5 md:h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 transition-all" 
                      style={{ width: `${(timeLeft / 12) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs md:text-sm font-medium text-muted-foreground">Score</span>
                  <h3 className="text-base md:text-2xl font-bold">{score}</h3>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-3 md:py-6 px-3 md:px-6">
              <div className="flex items-center justify-center gap-2 md:gap-4 mb-4 md:mb-8">
                <div className="text-3xl md:text-6xl font-bold">{currentProblem.num1}</div>
                <div className="flex items-center justify-center h-10 w-10 md:h-16 md:w-16 rounded-full bg-[#E5DEFF]">
                  <OperationIcon />
                </div>
                <div className="text-3xl md:text-6xl font-bold">{currentProblem.num2}</div>
                <div className="text-3xl md:text-6xl font-bold">=</div>
                <div 
                  className={`
                    h-12 w-20 md:h-20 md:w-32 flex items-center justify-center rounded-lg 
                    ${resultAnimation === "correct" ? "bg-green-100 border-2 border-green-500" : ""}
                    ${resultAnimation === "incorrect" ? "bg-red-100 border-2 border-red-500" : ""}
                    ${!resultAnimation ? "border-2 border-dashed border-gray-300" : ""}
                  `}
                >
                  {resultAnimation === "correct" && (
                    <Check className="h-6 w-6 md:h-10 md:w-10 text-green-500" />
                  )}
                  {resultAnimation === "incorrect" && (
                    <X className="h-6 w-6 md:h-10 md:w-10 text-red-500" />
                  )}
                  {!resultAnimation && userAnswer === null && (
                    <span className="text-2xl md:text-4xl font-bold text-gray-400">?</span>
                  )}
                  {!resultAnimation && userAnswer !== null && (
                    <span className="text-2xl md:text-4xl font-bold">{userAnswer}</span>
                  )}
                </div>
              </div>

              {/* Visual options bubbles - with better spacing for mobile */}
              <div className="w-full h-40 md:h-64 relative mt-2 md:mt-4 bg-gradient-to-br from-[#E5DEFF]/30 to-[#FEF7CD]/30 rounded-xl overflow-hidden">
                {currentProblem.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => checkAnswer(option)}
                    disabled={resultAnimation !== null || userAnswer !== null}
                    className={`
                      absolute transform -translate-x-1/2 -translate-y-1/2
                      h-12 w-12 md:h-16 md:w-16 rounded-full 
                      flex items-center justify-center
                      text-lg md:text-2xl font-bold
                      cursor-pointer
                      transition-all duration-200
                      bg-gradient-to-r from-[#9b87f5] to-[#8B5CF6]
                      text-white
                      shadow-lg hover:shadow-xl
                      glow hover:scale-110
                      focus:outline-none focus:ring-4 focus:ring-purple-500/50
                      animate-float
                    `}
                    style={{
                      top: optionPositions[index]?.top || "30%",
                      left: optionPositions[index]?.left || "50%",
                      animationDelay: optionPositions[index]?.animationDelay,
                      animationDuration: optionPositions[index]?.animationDuration
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <p className="text-xs md:text-sm text-muted-foreground animate-fade-in mt-3 md:mt-4">
                Select the correct answer
              </p>
            </CardContent>
          </>
        )}
        
        {gameState === "completed" && (
          <>
            <CardHeader className="text-center p-4 md:p-6">
              <CardTitle className="text-xl md:text-3xl font-bold">Challenge Complete!</CardTitle>
              <CardDescription className="text-sm md:text-lg mt-1 md:mt-2">
                You scored {score} out of {totalQuestions}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6 px-4">
              <div className="flex justify-center mb-2 md:mb-4">
                <div className="relative h-32 w-32 md:h-40 md:w-40">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-[#9b87f5] to-[#8B5CF6] bg-clip-text text-transparent">
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
              
              <div className="bg-white rounded-lg shadow p-3 md:p-4">
                <h3 className="text-base md:text-lg font-medium mb-2">Your Results</h3>
                <div className="space-y-2 max-h-32 md:max-h-48 overflow-y-auto pr-2">
                  {results.map((result, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center justify-between p-1.5 md:p-2 rounded-md text-xs md:text-sm ${result.correct ? "bg-green-50" : "bg-red-50"}`}
                    >
                      <div className="flex items-center gap-1 md:gap-2">
                        {result.correct ? 
                          <Check className="h-4 w-4 md:h-5 md:w-5 text-green-500" /> : 
                          <X className="h-4 w-4 md:h-5 md:w-5 text-red-500" />
                        }
                        <div>
                          {result.problem.num1} {result.problem.operation} {result.problem.num2} = {result.problem.answer}
                        </div>
                      </div>
                      <div className="text-xs md:text-sm text-muted-foreground">
                        {getOperationName(result.problem.operation)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center gap-2 md:gap-4 p-4">
              <Button
                variant="outline"
                onClick={handleStartGame}
                className="text-xs md:text-sm px-4 py-1 md:px-6"
                size={isMobile ? "sm" : "default"}
              >
                Try Again
              </Button>
              <Link to="/">
                <Button
                  variant="secondary"
                  className="text-xs md:text-sm px-4 py-1 md:px-6"
                  size={isMobile ? "sm" : "default"}
                >
                  Back to Home
                </Button>
              </Link>
            </CardFooter>
          </>
        )}
      </Card>
      
      {/* Encouragement dialog - optimized for mobile */}
      <Dialog open={showEncouragement} onOpenChange={setShowEncouragement}>
        <DialogContent className="p-0 border-0 overflow-hidden max-w-xs md:max-w-md mx-auto">
          <div className={`p-4 md:p-8 bg-gradient-to-r ${encouragementMessage.color} text-white text-center`}>
            <div className="animate-bounce mb-2 md:mb-4">
              <div className="text-4xl md:text-6xl">🎉</div>
            </div>
            <h2 className="text-xl md:text-3xl font-bold mb-2 md:mb-4">{encouragementMessage.message}</h2>
            <p className="text-base md:text-lg opacity-90">Keep up the great work!</p>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* CSS animations - enhanced for mobile */}
      <style>
        {`
          @keyframes float {
            0% {
              transform: translate(-50%, -50%) translateY(0) rotate(0deg);
            }
            33% {
              transform: translate(-50%, -50%) translateY(-6px) rotate(3deg);
            }
            66% {
              transform: translate(-50%, -50%) translateY(3px) rotate(-3deg);
            }
            100% {
              transform: translate(-50%, -50%) translateY(0) rotate(0deg);
            }
          }
          .animate-float {
            animation: float 5s ease-in-out infinite;
            animation-duration: var(--duration, 5s);
            animation-delay: var(--delay, 0s);
          }
        `}
      </style>
    </div>
  );
};

export default MentalMathsGame;
