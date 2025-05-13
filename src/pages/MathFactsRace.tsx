
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Timer, Share2, Flag, List } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

// Type for a math question
type MathQuestion = {
  text: string;
  answer: number;
};

// Generate a random integer between min and max (inclusive)
const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate a math question based on the operation
const generateQuestion = (operation: string): MathQuestion => {
  let num1: number, num2: number, answer: number, text: string;
  
  switch (operation) {
    case "add":
      num1 = getRandomInt(1, 50);
      num2 = getRandomInt(1, 50);
      answer = num1 + num2;
      text = `${num1} + ${num2} = ?`;
      break;
    case "subtract":
      num1 = getRandomInt(10, 99);
      num2 = getRandomInt(1, num1);
      answer = num1 - num2;
      text = `${num1} - ${num2} = ?`;
      break;
    case "multiply":
      num1 = getRandomInt(2, 12);
      num2 = getRandomInt(2, 12);
      answer = num1 * num2;
      text = `${num1} × ${num2} = ?`;
      break;
    case "divide":
      num2 = getRandomInt(2, 12);
      answer = getRandomInt(1, 10);
      num1 = num2 * answer;
      text = `${num1} ÷ ${num2} = ?`;
      break;
    default:
      num1 = getRandomInt(1, 20);
      num2 = getRandomInt(1, 20);
      answer = num1 + num2;
      text = `${num1} + ${num2} = ?`;
  }
  
  return { text, answer };
};

// Generate a set of questions for the day based on a seed
const generateDailyQuestions = (seed: number): MathQuestion[] => {
  // Use the seed to create a deterministic pseudo-random number generator
  const seededRandom = () => {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  const operations = ["add", "subtract", "multiply", "divide"];
  const questions: MathQuestion[] = [];
  
  // Generate 10 questions with a balanced mix of operations
  for (let i = 0; i < 10; i++) {
    const operationIndex = Math.floor(seededRandom() * operations.length);
    const operation = operations[operationIndex];
    
    // Set the seed based on the operation and question number for consistent daily questions
    const questionSeed = seed + i + operationIndex * 100;
    const seededRandomForQuestion = () => {
      let x = Math.sin(questionSeed) * 10000;
      return x - Math.floor(x);
    };
    
    let question: MathQuestion;
    
    switch (operation) {
      case "add": {
        const num1 = Math.floor(seededRandomForQuestion() * 50) + 1;
        const num2 = Math.floor(seededRandomForQuestion() * 50) + 1;
        question = {
          text: `${num1} + ${num2} = ?`,
          answer: num1 + num2
        };
        break;
      }
      case "subtract": {
        const num1 = Math.floor(seededRandomForQuestion() * 90) + 10;
        const num2 = Math.floor(seededRandomForQuestion() * num1) + 1;
        question = {
          text: `${num1} - ${num2} = ?`,
          answer: num1 - num2
        };
        break;
      }
      case "multiply": {
        const num1 = Math.floor(seededRandomForQuestion() * 11) + 2;
        const num2 = Math.floor(seededRandomForQuestion() * 11) + 2;
        question = {
          text: `${num1} × ${num2} = ?`,
          answer: num1 * num2
        };
        break;
      }
      case "divide": {
        const divisor = Math.floor(seededRandomForQuestion() * 11) + 2;
        const quotient = Math.floor(seededRandomForQuestion() * 10) + 1;
        const dividend = divisor * quotient;
        question = {
          text: `${dividend} ÷ ${divisor} = ?`,
          answer: quotient
        };
        break;
      }
      default:
        question = generateQuestion("add");
    }
    
    questions.push(question);
  }
  
  return questions;
};

// Format time in MM:SS format
const formatTime = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

// Get today's date as YYYY-MM-DD string
const getTodayString = (): string => {
  const today = new Date();
  return `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
};

// Generate a seed from the date string
const generateSeedFromDate = (dateString: string): number => {
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash = ((hash << 5) - hash) + dateString.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

const MathFactsRace = () => {
  const [questions, setQuestions] = useState<MathQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [isGameComplete, setIsGameComplete] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [personalBest, setPersonalBest] = useState<number | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [totalRaces, setTotalRaces] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);
  const isMobile = useIsMobile();

  // Initialize game
  useEffect(() => {
    const today = getTodayString();
    const seed = generateSeedFromDate(today);
    const dailyQuestions = generateDailyQuestions(seed);
    setQuestions(dailyQuestions);
    
    // Load user stats from localStorage
    const storedStats = localStorage.getItem("mathFactsStats");
    if (storedStats) {
      const stats = JSON.parse(storedStats);
      setPersonalBest(stats.personalBest || null);
      setStreak(stats.streak || 0);
      setTotalRaces(stats.totalRaces || 0);
      
      // Check if we need to update streak
      const lastPlayedDate = stats.lastPlayedDate;
      if (lastPlayedDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = `${yesterday.getFullYear()}-${(yesterday.getMonth() + 1).toString().padStart(2, "0")}-${yesterday.getDate().toString().padStart(2, "0")}`;
        
        // If last played was not yesterday, reset streak
        if (lastPlayedDate !== yesterdayString && lastPlayedDate !== today) {
          setStreak(0);
        }
      }
    }
    
    // Focus the input when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Start timer if game has started but timer hasn't
  useEffect(() => {
    if (isGameStarted && !timerRef.current) {
      const currentTime = Date.now();
      setStartTime(currentTime);
      
      timerRef.current = window.setInterval(() => {
        setElapsedTime(Date.now() - currentTime);
      }, 100);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isGameStarted]);

  // Handle user input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserAnswer(value);
    
    // Start the game on first input
    if (!isGameStarted && value) {
      setIsGameStarted(true);
    }
    
    // Check if the answer is correct
    if (parseInt(value) === questions[currentQuestionIndex].answer) {
      // Move to next question or finish game
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setUserAnswer("");
      } else {
        // Game complete
        finishGame();
      }
    }
  };

  // Finish the game and update stats
  const finishGame = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    const finalTime = Date.now();
    setEndTime(finalTime);
    const totalTime = finalTime - (startTime || 0);
    
    setIsGameComplete(true);
    
    // Update personal best if achieved
    let isNewRecord = false;
    if (!personalBest || totalTime < personalBest) {
      setPersonalBest(totalTime);
      isNewRecord = true;
      setFeedback("New Record! 🎉");
    } else if (totalTime < personalBest * 1.2) {
      setFeedback("Speedy Solver! ⚡");
    } else {
      setFeedback("Well done! 👍");
    }
    
    // Update streak and total races
    const newStreak = streak + 1;
    const newTotalRaces = totalRaces + 1;
    setStreak(newStreak);
    setTotalRaces(newTotalRaces);
    
    // Save stats to localStorage
    const today = getTodayString();
    const stats = {
      personalBest: isNewRecord ? totalTime : personalBest,
      streak: newStreak,
      totalRaces: newTotalRaces,
      lastPlayedDate: today
    };
    localStorage.setItem("mathFactsStats", JSON.stringify(stats));
  };

  // Start a new game
  const startNewGame = () => {
    // Generate new questions
    const today = getTodayString();
    const seed = generateSeedFromDate(today);
    const dailyQuestions = generateDailyQuestions(seed);
    
    setQuestions(dailyQuestions);
    setCurrentQuestionIndex(0);
    setUserAnswer("");
    setIsGameStarted(false);
    setIsGameComplete(false);
    setStartTime(null);
    setEndTime(null);
    setElapsedTime(0);
    setFeedback("");
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Focus the input
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  // Share results
  const shareResults = () => {
    const timeString = formatTime(endTime! - startTime!);
    const shareText = `I finished today's Math Facts Race in ${timeString} ⚡ Try it at https://mathify.org/math-facts`;
    
    if (navigator.share) {
      navigator.share({
        text: shareText,
      }).catch((error) => console.log("Error sharing:", error));
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        toast.success("Results copied to clipboard!");
      }).catch((err) => {
        toast.error("Could not copy results.");
        console.error("Could not copy text: ", err);
      });
    }
  };

  // Instructions component
  const Instructions = () => (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="text-2xl mb-2">How to Play Math Facts Race</DialogTitle>
        <DialogDescription className="text-base space-y-4">
          <div>
            <p className="mb-2">Race against the clock to solve 10 arithmetic problems as quickly as possible!</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>The timer starts when you begin typing your first answer</li>
              <li>Each correct answer immediately advances to the next question</li>
              <li>Complete all 10 questions to finish the race</li>
              <li>Try to beat your personal best time</li>
            </ol>
          </div>
          <div>
            <p className="font-semibold mt-2">Example:</p>
            <div className="bg-muted p-3 rounded-md text-center">
              <p className="text-xl font-bold">7 × 8 = ?</p>
              <p>Type: 56</p>
              <p>Next question appears automatically!</p>
            </div>
          </div>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Math Facts Race
          </h1>
          
          <div className="flex justify-center items-center gap-2 mt-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs md:text-sm">
                  How to Play
                </Button>
              </DialogTrigger>
              <Instructions />
            </Dialog>
          </div>
        </header>
        
        <Card className="mb-6 shadow-lg border-0 bg-white/90 backdrop-blur">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="font-semibold text-lg">
                  {!isGameComplete ? "Today's Challenge" : "Challenge Complete!"}
                </CardTitle>
              </div>
              <div className="text-right">
                <span className="font-mono text-xl bg-indigo-100 px-3 py-1 rounded-md">
                  {isGameStarted && !isGameComplete ? formatTime(elapsedTime) : "00:00"}
                </span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {!isGameComplete ? (
              <>
                <div className="mb-6 relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <List className="w-4 h-4 mr-2 text-indigo-600" />
                      <span className="text-sm font-medium">
                        Question {currentQuestionIndex + 1} of {questions.length}
                      </span>
                    </div>
                    <span className="text-xs font-medium">
                      {Math.floor((currentQuestionIndex / questions.length) * 100)}%
                    </span>
                  </div>
                  
                  <Progress
                    value={(currentQuestionIndex / questions.length) * 100}
                    className="h-2"
                    indicatorClassName="bg-gradient-to-r from-indigo-500 to-violet-500"
                  />
                </div>
                
                <div className="bg-indigo-50 p-5 rounded-xl text-center mb-6">
                  <p className="text-3xl font-bold mb-1">
                    {questions[currentQuestionIndex]?.text || "Loading..."}
                  </p>
                  <p className="text-sm text-slate-600">Type your answer below</p>
                </div>
                
                <Input
                  ref={inputRef}
                  type="number"
                  placeholder="Enter your answer..."
                  value={userAnswer}
                  onChange={handleInputChange}
                  className="text-center text-xl font-bold py-6"
                  inputMode="numeric"
                  autoFocus
                />
              </>
            ) : (
              <div className="text-center py-4">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center bg-indigo-100 rounded-full w-20 h-20 mb-4">
                    <Trophy className="w-10 h-10 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feedback}</h3>
                  <p className="text-3xl font-bold text-indigo-700 mb-1">
                    {formatTime(endTime! - startTime!)}
                  </p>
                  <p className="text-slate-600 text-sm">
                    You completed all 10 questions
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-indigo-50 rounded-lg p-3">
                    <div className="text-xl font-bold">{streak}</div>
                    <div className="text-xs text-slate-600">Day Streak</div>
                  </div>
                  <div className="bg-indigo-50 rounded-lg p-3">
                    <div className="text-xl font-bold">
                      {personalBest ? formatTime(personalBest) : "--:--"}
                    </div>
                    <div className="text-xs text-slate-600">Best Time</div>
                  </div>
                  <div className="bg-indigo-50 rounded-lg p-3">
                    <div className="text-xl font-bold">{totalRaces}</div>
                    <div className="text-xs text-slate-600">Total Races</div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button 
                    onClick={startNewGame} 
                    className="flex-1"
                    variant="outline"
                  >
                    New Race
                  </Button>
                  <Button 
                    onClick={shareResults}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Share2 className="w-4 h-4 mr-2" /> Share
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className={`${isGameComplete ? "hidden" : "block"} pt-0`}>
            {isGameStarted ? (
              <div className="w-full text-center">
                <p className="text-sm text-slate-600 mt-2">
                  Type the answer and press Enter to continue
                </p>
              </div>
            ) : (
              <div className="w-full text-center">
                <p className="text-sm text-slate-600 mt-2">
                  Start typing to begin the race!
                </p>
              </div>
            )}
          </CardFooter>
        </Card>
        
        <div className="bg-white/80 backdrop-blur rounded-lg p-4 shadow">
          <h2 className="text-lg font-bold mb-3">Your Stats</h2>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-blue-50 p-3 rounded-md text-center">
              <div className="text-sm font-medium text-slate-600">Streak</div>
              <div className="text-2xl font-bold text-blue-700">{streak}</div>
            </div>
            <div className="bg-violet-50 p-3 rounded-md text-center">
              <div className="text-sm font-medium text-slate-600">Best Time</div>
              <div className="text-xl font-bold text-violet-700">
                {personalBest ? formatTime(personalBest) : "--:--"}
              </div>
            </div>
            <div className="bg-indigo-50 p-3 rounded-md text-center">
              <div className="text-sm font-medium text-slate-600">Total</div>
              <div className="text-2xl font-bold text-indigo-700">{totalRaces}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MathFactsRace;
