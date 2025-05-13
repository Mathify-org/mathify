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
import { Trophy, Timer, Share2, Flag, List, Users, UserPlus, UserRound } from "lucide-react";
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
import { useParams, useNavigate } from "react-router-dom";
import { MathFactsMultiplayer } from "@/components/MathFactsMultiplayer";
import { MathFactsWaitingRoom } from "@/components/MathFactsWaitingRoom";

// Type for a math question
type MathQuestion = {
  text: string;
  answer: number;
};

// Type for game mode
type GameMode = "single" | "create" | "join" | "waiting" | "multiplayer";

// Type for a player
type Player = {
  id: string;
  username: string;
  progress: number;
  time: number | null;
  isComplete: boolean;
};

// Type for a multiplayer game
type MultiplayerGame = {
  gameId: string;
  hostId: string;
  players: Player[];
  maxPlayers: number;
  questions: MathQuestion[];
  isStarted: boolean;
  startTime: number | null;
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

// Generate a random ID for multiplayer games
const generateGameId = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Generate a unique player ID
const generatePlayerId = (): string => {
  return Math.random().toString(36).substring(2, 10);
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
  const [gameMode, setGameMode] = useState<GameMode>("single");
  const [username, setUsername] = useState<string>("");
  const [maxPlayers, setMaxPlayers] = useState<number>(4);
  const [multiplayerGame, setMultiplayerGame] = useState<MultiplayerGame | null>(null);
  const [playerId, setPlayerId] = useState<string>("");
  const [countdownTime, setCountdownTime] = useState<number>(5);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);
  const countdownRef = useRef<number | null>(null);
  const isMobile = useIsMobile();
  const { gameId } = useParams();
  const navigate = useNavigate();

  // Initialize single player game
  useEffect(() => {
    // If gameId is present in URL, switch to join mode
    if (gameId) {
      setGameMode("join");
      return;
    }
    
    // Otherwise proceed with single player initialization
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
    if (inputRef.current && gameMode === "single") {
      inputRef.current.focus();
    }
    
    // Generate a player ID for this session
    const id = localStorage.getItem("mathFactsPlayerId") || generatePlayerId();
    localStorage.setItem("mathFactsPlayerId", id);
    setPlayerId(id);
  }, [gameId]);

  // Start timer if game has started but timer hasn't
  useEffect(() => {
    if (isGameStarted && !timerRef.current) {
      const currentTime = Date.now();
      setStartTime(currentTime);
      
      timerRef.current = window.setInterval(() => {
        setElapsedTime(Date.now() - currentTime);
        
        // Update player progress in multiplayer mode
        if (gameMode === "multiplayer" && multiplayerGame) {
          const updatedPlayers = multiplayerGame.players.map(p => {
            if (p.id === playerId) {
              return {
                ...p,
                progress: currentQuestionIndex,
                time: Date.now() - (multiplayerGame.startTime || 0)
              };
            }
            return p;
          });
          
          setMultiplayerGame({
            ...multiplayerGame,
            players: updatedPlayers
          });
          
          // Simulate other players progress
          if (multiplayerGame.players.some(p => p.id !== playerId)) {
            const simulateOthers = setInterval(() => {
              setMultiplayerGame(prev => {
                if (!prev) return null;
                
                return {
                  ...prev,
                  players: prev.players.map(p => {
                    if (p.id !== playerId && !p.isComplete && Math.random() > 0.7) {
                      const newProgress = Math.min(p.progress + 1, questions.length);
                      const newTime = Date.now() - (prev.startTime || 0);
                      const newIsComplete = newProgress === questions.length;
                      
                      if (newIsComplete && !p.isComplete) {
                        toast.info(`${p.username} has finished!`);
                      }
                      
                      return {
                        ...p,
                        progress: newProgress,
                        time: newTime,
                        isComplete: newIsComplete
                      };
                    }
                    return p;
                  })
                };
              });
            }, 2000); // Simulate progress every 2 seconds
            
            return () => clearInterval(simulateOthers);
          }
        }
      }, 100);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isGameStarted, currentQuestionIndex, gameMode, multiplayerGame, playerId, questions.length]);

  // Handle user input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserAnswer(value);
    
    // Start the game on first input
    if (!isGameStarted && value) {
      setIsGameStarted(true);
    }
    
    // Check if the answer is correct
    if (parseInt(value) === questions[currentQuestionIndex]?.answer) {
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
    
    if (gameMode === "single") {
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
    } else if (gameMode === "multiplayer" && multiplayerGame) {
      // Update player status in multiplayer game
      const updatedPlayers = multiplayerGame.players.map(p => {
        if (p.id === playerId) {
          return {
            ...p,
            progress: questions.length,
            time: totalTime,
            isComplete: true
          };
        }
        return p;
      });
      
      setMultiplayerGame({
        ...multiplayerGame,
        players: updatedPlayers
      });
      
      setFeedback("Waiting for others to finish...");
      
      // Check if all players have finished
      const allFinished = updatedPlayers.every(p => p.isComplete);
      if (allFinished) {
        // Sort players by completion time
        const sortedPlayers = [...updatedPlayers].sort((a, b) => {
          if (a.time === null) return 1;
          if (b.time === null) return -1;
          return a.time - b.time;
        });
        
        const currentPlayerRank = sortedPlayers.findIndex(p => p.id === playerId) + 1;
        
        if (currentPlayerRank === 1) {
          setFeedback("You won! 🏆");
        } else {
          setFeedback(`You finished ${currentPlayerRank}${
            currentPlayerRank === 1 ? "st" :
            currentPlayerRank === 2 ? "nd" :
            currentPlayerRank === 3 ? "rd" : "th"
          } place!`);
        }
      }
    }
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
    setGameMode("single");
    setMultiplayerGame(null);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    
    // Focus the input
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  // Create a multiplayer game
  const createMultiplayerGame = () => {
    if (!username) {
      toast.error("Please enter a username");
      return;
    }
    
    const gameId = generateGameId();
    
    // Create new questions for multiplayer game
    const seed = Date.now();
    const multiplayerQuestions = generateDailyQuestions(seed);
    
    const newGame: MultiplayerGame = {
      gameId,
      hostId: playerId,
      players: [
        {
          id: playerId,
          username,
          progress: 0,
          time: null,
          isComplete: false
        }
      ],
      maxPlayers,
      questions: multiplayerQuestions,
      isStarted: false,
      startTime: null
    };
    
    setMultiplayerGame(newGame);
    setGameMode("waiting");
    setQuestions(multiplayerQuestions);
    setCountdownTime(5);
    
    // Generate shareable URL
    const shareableUrl = `${window.location.origin}/math-facts/${gameId}`;
    
    // Copy link to clipboard
    navigator.clipboard.writeText(shareableUrl).then(() => {
      toast.success("Game created! Share link copied to clipboard");
    }).catch(() => {
      toast.error("Could not copy game link automatically");
    });
  };

  // Join a multiplayer game
  const joinMultiplayerGame = () => {
    if (!username || !gameId) {
      toast.error("Please enter a username");
      return;
    }
    
    // In a real app, we would fetch the game data from a backend
    // For this demo, we'll simulate joining
    const simulatedGame: MultiplayerGame = {
      gameId: gameId,
      hostId: "simulated-host",
      players: [
        {
          id: "simulated-host",
          username: "Host",
          progress: 0,
          time: null,
          isComplete: false
        },
        {
          id: playerId,
          username,
          progress: 0,
          time: null,
          isComplete: false
        }
      ],
      maxPlayers: 4,
      questions: generateDailyQuestions(Date.now()),
      isStarted: false,
      startTime: null
    };
    
    // Add some simulated players
    const simulatedPlayerCount = Math.floor(Math.random() * 2) + 1; // 1-2 simulated players
    
    for (let i = 0; i < simulatedPlayerCount; i++) {
      const simId = `simulated-${i}`;
      const simNames = ["Alex", "Sam", "Jordan", "Taylor", "Riley", "Casey"];
      
      simulatedGame.players.push({
        id: simId,
        username: simNames[Math.floor(Math.random() * simNames.length)],
        progress: 0,
        time: null,
        isComplete: false
      });
    }
    
    setMultiplayerGame(simulatedGame);
    setGameMode("waiting");
    setQuestions(simulatedGame.questions);
    
    // Redirect to non-parameterized URL to avoid issues with refreshing
    navigate("/math-facts", { replace: true });
    
    // Simulate host starting the game after a short delay
    setTimeout(() => {
      startCountdown();
    }, 3000);
  };

  // Start the countdown for multiplayer game
  const startCountdown = () => {
    setCountdownTime(5);
    
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    
    countdownRef.current = window.setInterval(() => {
      setCountdownTime(prev => {
        if (prev <= 1) {
          // Start the game
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
          }
          
          if (multiplayerGame) {
            setMultiplayerGame({
              ...multiplayerGame,
              isStarted: true,
              startTime: Date.now()
            });
          }
          
          setGameMode("multiplayer");
          setIsGameStarted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
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

  // Game Mode Selection
  const renderModeSelection = () => (
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
            <CardTitle className="font-semibold text-lg">Choose Game Mode</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Button 
              onClick={() => setGameMode("single")}
              className="w-full h-20 text-xl bg-gradient-to-r from-blue-500 to-indigo-600"
            >
              <UserRound className="w-6 h-6 mr-2" />
              Play Single Player
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">or</span>
              </div>
            </div>
            
            <Button 
              onClick={() => setGameMode("create")}
              className="w-full h-16 text-lg bg-gradient-to-r from-indigo-500 to-violet-600"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Create Multiplayer Game
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Create Multiplayer Game Form
  const renderCreateGame = () => (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Create Multiplayer Game
          </h1>
        </header>
        
        <Card className="mb-6 shadow-lg border-0 bg-white/90 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="font-semibold text-lg">Game Setup</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Your Username
              </label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white"
                placeholder="Enter your name"
                maxLength={15}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="players" className="text-sm font-medium">
                Maximum Players
              </label>
              <div className="flex items-center space-x-2">
                {[2, 3, 4, 5, 6].map((num) => (
                  <Button
                    key={num}
                    variant={maxPlayers === num ? "default" : "outline"}
                    className={maxPlayers === num ? "bg-indigo-600" : ""}
                    onClick={() => setMaxPlayers(num)}
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline"
              onClick={() => setGameMode("single")}
            >
              Back
            </Button>
            
            <Button 
              onClick={createMultiplayerGame}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Users className="w-4 h-4 mr-2" />
              Create Game
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );

  // Join Multiplayer Game Form
  const renderJoinGame = () => (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Join Multiplayer Game
          </h1>
        </header>
        
        <Card className="mb-6 shadow-lg border-0 bg-white/90 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="font-semibold text-lg">Game {gameId}</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Your Username
              </label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white"
                placeholder="Enter your name"
                maxLength={15}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline"
              onClick={() => navigate("/math-facts")}
            >
              Back
            </Button>
            
            <Button 
              onClick={joinMultiplayerGame}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Users className="w-4 h-4 mr-2" />
              Join Game
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );

  // Render the main component based on gameMode
  if (gameMode === "create") {
    return renderCreateGame();
  }

  if (gameMode === "join") {
    return renderJoinGame();
  }

  if (gameMode === "waiting" && multiplayerGame) {
    return (
      <MathFactsWaitingRoom
        game={multiplayerGame}
        playerId={playerId}
        onStart={startCountdown}
        countdown={countdownTime}
        isCountingDown={countdownRef.current !== null}
      />
    );
  }

  if (gameMode === "multiplayer" && multiplayerGame) {
    return (
      <MathFactsMultiplayer
        game={multiplayerGame}
        playerId={playerId}
        questions={questions}
        currentQuestionIndex={currentQuestionIndex}
        userAnswer={userAnswer}
        handleInputChange={handleInputChange}
        isGameComplete={isGameComplete}
        feedback={feedback}
        elapsedTime={elapsedTime}
        startNewGame={startNewGame}
        shareResults={shareResults}
      />
    );
  }

  // Mode selection screen
  if (gameMode === "single" && !isGameStarted && !isGameComplete) {
    return renderModeSelection();
  }

  // Regular single player game
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
