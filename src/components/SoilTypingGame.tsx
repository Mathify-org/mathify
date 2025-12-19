
import { useState, useEffect, useRef } from "react";
import { Timer, Check, RefreshCw, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import GameCompletionHandler from "@/components/GameCompletionHandler";

interface Sentence {
  text: string;
  hint: string;
}

const SENTENCES: Sentence[] = [
  {
    text: "Trees help protect our soil from washing away.",
    hint: "What plants with trunks do for soil"
  },
  {
    text: "Water can cause soil erosion if it rains too much.",
    hint: "What happens when there's too much precipitation"
  },
  {
    text: "Planting grass helps keep soil in place with roots.",
    hint: "How plants with their underground parts prevent erosion"
  },
  {
    text: "Wind can blow away soil if there are no plants.",
    hint: "What moving air does to unprotected ground"
  },
  {
    text: "Soil is home to many tiny living things.",
    hint: "What earth contains that helps plants grow"
  },
  {
    text: "Mulch on top of soil helps stop erosion.",
    hint: "What we put on garden beds to protect them"
  },
  {
    text: "Cutting down forests can make soil wash away.",
    hint: "What happens when we remove trees"
  },
  {
    text: "Building terraces on hills helps save soil.",
    hint: "How stepped farming prevents erosion"
  },
  {
    text: "Cover crops protect soil when fields are not used.",
    hint: "What farmers plant between growing seasons"
  },
  {
    text: "Conservation means taking care of our natural resources.",
    hint: "What we call protecting nature for the future"
  }
];

const SoilTypingGame = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>("");
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [isGameComplete, setIsGameComplete] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [mistakeCount, setMistakeCount] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [results, setResults] = useState<{
    accuracy: number;
    speed: number;
    totalTime: number;
    score: number;
  } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);
  
  // Calculate correct characters as user types
  const calculateCorrect = (): number => {
    const targetSentence = SENTENCES[currentIndex].text;
    let correct = 0;
    
    for (let i = 0; i < userInput.length; i++) {
      if (i < targetSentence.length && userInput[i] === targetSentence[i]) {
        correct++;
      }
    }
    
    return correct;
  };
  
  const correctChars = calculateCorrect();
  const targetSentence = SENTENCES[currentIndex].text;
  const progress = Math.floor((currentIndex / SENTENCES.length) * 100);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);
  
  const startGame = () => {
    setIsGameStarted(true);
    setTimeElapsed(0);
    setCurrentIndex(0);
    setUserInput("");
    setMistakeCount(0);
    setResults(null);
    setIsGameComplete(false);
    setShowCompletion(false);
    
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
    
    timerRef.current = window.setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  const checkInput = (value: string) => {
    setUserInput(value);
    const target = SENTENCES[currentIndex].text;
    
    // Check for mistakes
    if (value.length > 0 && value.length <= target.length) {
      const lastChar = value[value.length - 1];
      const targetChar = target[value.length - 1];
      
      if (lastChar !== targetChar) {
        setMistakeCount(prev => prev + 1);
      }
    }
    
    // Check if sentence is completed correctly
    if (value === target) {
      // Move to next sentence
      if (currentIndex < SENTENCES.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setUserInput("");
        setShowHint(false);
        toast.success("Great job! Next sentence.");
      } else {
        // Game completed
        completeGame();
      }
    }
  };
  
  const completeGame = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    const totalChars = SENTENCES.reduce((acc, sentence) => acc + sentence.text.length, 0);
    const accuracy = Math.max(0, Math.min(100, ((totalChars - mistakeCount) / totalChars) * 100));
    const speed = totalChars / (timeElapsed / 60); // Characters per minute
    
    const score = Math.round((accuracy * 0.6) + (Math.min(speed, 300) / 3));
    
    setResults({
      accuracy: Math.round(accuracy),
      speed: Math.round(speed),
      totalTime: timeElapsed,
      score: Math.min(100, score)
    });
    
    setIsGameComplete(true);
    setShowCompletion(true);
    
    // Launch confetti if score is good
    if (score > 70) {
      launchConfetti();
    }
  };
  
  const launchConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handlePlayAgain = () => {
    setShowCompletion(false);
    startGame();
  };

  const handleExitGame = () => {
    setShowCompletion(false);
    setIsGameStarted(false);
    setIsGameComplete(false);
  };

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  
  return (
    <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2 text-green-800 relative inline-block">
          Soil Words Speed Typing
          <div className="absolute -bottom-1 left-0 right-0 h-1 bg-green-400 rounded-full"></div>
        </h2>
        <p className="text-gray-600">
          Type each sentence correctly to learn about soil conservation!
        </p>
      </div>

      {!isGameStarted && !isGameComplete && (
        <div className="text-center py-10">
          <div className="mb-8 animate-bounce">
            <Timer className="h-16 w-16 text-green-600 mx-auto" />
          </div>
          <h3 className="text-xl font-bold mb-4">Ready to Test Your Typing Skills?</h3>
          <p className="mb-6 text-gray-600">
            Complete 10 sentences about soil erosion and conservation as quickly and accurately as possible!
          </p>
          <Button 
            onClick={startGame}
            size="lg"
            className="bg-green-600 hover:bg-green-700"
          >
            Start Typing Challenge!
          </Button>
        </div>
      )}

      {isGameStarted && !isGameComplete && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Timer className="mr-2 h-5 w-5 text-amber-600" />
              <span className="font-mono font-bold">{formatTime(timeElapsed)}</span>
            </div>
            <div className="px-3 py-1 bg-blue-100 rounded-full text-blue-800 font-semibold">
              Sentence {currentIndex + 1} of {SENTENCES.length}
            </div>
            <div className="flex items-center">
              <span className="font-mono font-bold text-red-600 mr-2">{mistakeCount}</span>
              <span className="text-gray-600">mistakes</span>
            </div>
          </div>
          
          <div className="mb-4">
            <Progress value={progress} className="h-2 bg-gray-100" />
          </div>
          
          <div className="p-6 rounded-lg bg-white shadow-md border-2 border-green-100">
            <div className="mb-6">
              <p className="text-lg font-medium text-center">
                {targetSentence.split('').map((char, index) => {
                  let className = "text-gray-400"; // Default
                  
                  if (index < userInput.length) {
                    className = userInput[index] === char ? "text-green-600 font-bold" : "text-red-500 font-bold";
                  }
                  
                  return (
                    <span key={index} className={className}>
                      {char}
                    </span>
                  );
                })}
              </p>
            </div>
            
            <div className="mb-4">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => checkInput(e.target.value)}
                className="w-full p-3 border-2 border-green-200 rounded-md focus:ring-2 focus:ring-green-300 focus:border-green-300 focus:outline-none transition-all font-mono"
                placeholder="Type the sentence here..."
                autoFocus
              />
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setShowHint(!showHint)}
              >
                {showHint ? "Hide Hint" : "Show Hint"}
              </Button>
              
              <div className="text-right">
                <span className="text-sm text-gray-500">
                  Correct characters: {correctChars} / {targetSentence.length}
                </span>
              </div>
            </div>
            
            {showHint && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
                <p className="text-sm">Hint: {SENTENCES[currentIndex].hint}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {isGameComplete && results && !showCompletion && (
        <div className="text-center py-8 space-y-6">
          <div className="mb-4 animate-bounce">
            <Trophy className="h-20 w-20 text-amber-500 mx-auto" />
          </div>
          
          <h3 className="text-2xl font-bold text-green-800">
            Challenge Complete!
          </h3>
          
          <div className="grid grid-cols-3 gap-4 mt-6 mb-8">
            <div className="p-4 bg-white rounded-lg shadow-md">
              <p className="text-gray-600 mb-1">Accuracy</p>
              <p className="text-3xl font-bold text-green-600">{results.accuracy}%</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-md">
              <p className="text-gray-600 mb-1">Speed</p>
              <p className="text-3xl font-bold text-blue-600">{results.speed} CPM</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-md">
              <p className="text-gray-600 mb-1">Time</p>
              <p className="text-3xl font-bold text-amber-600">{formatTime(results.totalTime)}</p>
            </div>
          </div>
          
          <div className="p-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl shadow-md inline-block">
            <h4 className="text-lg font-semibold mb-2">Your Final Score</h4>
            <p className="text-4xl font-bold text-green-700">{results.score}</p>
          </div>
          
          <div className="mt-6">
            <Button 
              onClick={startGame}
              size="lg"
              className="bg-green-600 hover:bg-green-700"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Play Again
            </Button>
          </div>
        </div>
      )}

      {/* Game Completion Handler */}
      {showCompletion && results && (
        <GameCompletionHandler
          gameId="soil-typing-game"
          gameName="Soil Typing Challenge"
          score={results.score}
          correctAnswers={SENTENCES.length}
          totalQuestions={SENTENCES.length}
          difficulty="medium"
          timeSpentSeconds={results.totalTime}
          onPlayAgain={handlePlayAgain}
          onClose={handleExitGame}
        />
      )}
    </Card>
  );
};

export default SoilTypingGame;
