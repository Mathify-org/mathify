import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Brain, Trophy, Zap, Eye, EyeOff } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

// First 50 digits of Golden Ratio (phi) for the game (including decimal point)
const PHI_DIGITS = "1.6180339887498948482045868343656381177203091798057";

const MemorizingPhi = () => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<"menu" | "memorize" | "input" | "correct" | "gameover">("menu");
  const [currentLevel, setCurrentLevel] = useState(3);
  const [userInput, setUserInput] = useState("");
  const [showDigits, setShowDigits] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [flashTime, setFlashTime] = useState(3000);
  const [highScore, setHighScore] = useState(3);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("phiMemoryHighScore");
    if (saved) setHighScore(parseInt(saved));
    else setHighScore(3);
  }, []);

  useEffect(() => {
    if (gameState === "memorize" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === "memorize" && countdown === 0) {
      setShowDigits(true);
      const timer = setTimeout(() => {
        setShowDigits(false);
        setGameState("input");
      }, flashTime);
      return () => clearTimeout(timer);
    }
  }, [gameState, countdown, flashTime]);

  const startGame = () => {
    setCurrentLevel(3);
    setStreak(0);
    setGameState("memorize");
    setCountdown(3);
    setUserInput("");
  };

  const getCurrentDigits = () => {
    return PHI_DIGITS.substring(0, currentLevel);
  };

  const checkAnswer = () => {
    const correctAnswer = getCurrentDigits();
    
    if (userInput === correctAnswer) {
      setStreak(streak + 1);
      setGameState("correct");
      
      if (currentLevel >= 10) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      
      toast({
        title: "Perfect! 🎉",
        description: `You remembered ${currentLevel} characters correctly!`,
      });
      
      if (currentLevel > highScore) {
        setHighScore(currentLevel);
        localStorage.setItem("phiMemoryHighScore", currentLevel.toString());
        toast({
          title: "New High Score! 🏆",
          description: `You've set a new record: ${currentLevel} characters!`,
          variant: "default",
        });
      }
      
      setTimeout(() => {
        setCurrentLevel(currentLevel + 1);
        setUserInput("");
        setGameState("memorize");
        setCountdown(3);
        setFlashTime(Math.max(1500, flashTime - 100));
      }, 2000);
    } else {
      setGameState("gameover");
      toast({
        title: "Game Over!",
        description: `You reached ${currentLevel - 1} characters with a streak of ${streak}!`,
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && userInput.length === currentLevel) {
      checkAnswer();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl mb-4 shadow-lg">
            <Brain className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 pb-1 bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Golden Ratio (φ) Challenge
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Test your memory by memorizing digits of φ (phi)! Start with "1.6" and progress as far as you can.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 border-0 shadow-lg">
            <CardContent className="p-4 text-center text-white">
              <Trophy className="h-6 w-6 mx-auto mb-1" />
              <div className="text-2xl font-bold">{highScore}</div>
              <div className="text-xs opacity-90">High Score</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-500 to-orange-500 border-0 shadow-lg">
            <CardContent className="p-4 text-center text-white">
              <Brain className="h-6 w-6 mx-auto mb-1" />
              <div className="text-2xl font-bold">{currentLevel}</div>
              <div className="text-xs opacity-90">Current Level</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 border-0 shadow-lg">
            <CardContent className="p-4 text-center text-white">
              <Zap className="h-6 w-6 mx-auto mb-1" />
              <div className="text-2xl font-bold">{streak}</div>
              <div className="text-xs opacity-90">Streak</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Game Area */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">
              {gameState === "menu" && "Ready to Challenge Your Memory?"}
              {gameState === "memorize" && countdown > 0 && `Get Ready... ${countdown}`}
              {gameState === "memorize" && countdown === 0 && "Memorize These Digits!"}
              {gameState === "input" && "What Were the Digits?"}
              {gameState === "correct" && "Correct! Moving to Next Level..."}
              {gameState === "gameover" && "Game Over!"}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 md:p-8">
            {/* Menu State */}
            {gameState === "menu" && (
              <div className="text-center space-y-6">
                <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-8">
                  <h3 className="text-xl font-bold mb-4 text-slate-800">How to Play</h3>
                  <div className="space-y-3 text-left max-w-md mx-auto text-slate-700">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">1</div>
                      <p>You'll see digits of φ (Golden Ratio) flash on screen</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">2</div>
                      <p>Memorize them quickly before they disappear</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">3</div>
                      <p>Type the digits in the correct order (include the decimal!)</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">4</div>
                      <p>Progress to longer sequences as you succeed!</p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={startGame}
                  size="lg"
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-12 py-6 text-xl rounded-xl shadow-lg"
                >
                  Start Challenge
                </Button>
              </div>
            )}

            {/* Memorize State */}
            {gameState === "memorize" && (
              <div className="text-center space-y-6">
                {countdown > 0 ? (
                  <div className="py-12">
                    <div className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 animate-pulse">
                      {countdown}
                    </div>
                    <p className="text-slate-600 mt-4">Get ready to memorize {currentLevel} characters...</p>
                  </div>
                ) : showDigits ? (
                  <div className="py-12 space-y-4">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Eye className="h-6 w-6 text-amber-600 animate-pulse" />
                      <p className="text-lg font-semibold text-amber-600">Memorize Now!</p>
                    </div>
                    <div className="text-6xl md:text-8xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 animate-pulse">
                      {getCurrentDigits()}
                    </div>
                    <Progress 
                      value={(flashTime - (Date.now() % flashTime)) / flashTime * 100} 
                      className="h-2"
                      indicatorClassName="bg-gradient-to-r from-amber-600 to-orange-600"
                    />
                  </div>
                ) : null}
              </div>
            )}

            {/* Input State */}
            {gameState === "input" && (
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <EyeOff className="h-6 w-6 text-slate-600" />
                  <p className="text-lg font-semibold text-slate-700">Enter {currentLevel} characters of φ</p>
                </div>
                
                <div className="max-w-md mx-auto">
                  <Input
                    type="text"
                    value={userInput}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d.]/g, "");
                      const decimalCount = (value.match(/\./g) || []).length;
                      if (value.length <= currentLevel && decimalCount <= 1) {
                        setUserInput(value);
                      }
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="Type the digits (include decimal)..."
                    className="text-4xl md:text-5xl text-center font-bold tracking-wider h-20 border-4 border-amber-200 focus:border-amber-500"
                    maxLength={currentLevel}
                    autoFocus
                  />
                  
                  <div className="mt-4">
                    <Progress 
                      value={(userInput.length / currentLevel) * 100} 
                      className="h-3"
                      indicatorClassName="bg-gradient-to-r from-amber-500 to-orange-500"
                    />
                    <p className="text-sm text-slate-600 mt-2">
                      {userInput.length} / {currentLevel} characters
                    </p>
                  </div>
                </div>

                <Button
                  onClick={checkAnswer}
                  disabled={userInput.length !== currentLevel}
                  size="lg"
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-12 py-6 text-xl rounded-xl shadow-lg disabled:opacity-50"
                >
                  Check Answer
                </Button>
              </div>
            )}

            {/* Correct State */}
            {gameState === "correct" && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-3xl font-bold text-green-600 mb-4">Perfect!</h3>
                <p className="text-xl text-slate-700">
                  You remembered <span className="font-bold text-amber-600">{currentLevel}</span> characters correctly!
                </p>
                <p className="text-slate-600 mt-2">Preparing level {currentLevel + 1}...</p>
              </div>
            )}

            {/* Game Over State */}
            {gameState === "gameover" && (
              <div className="text-center space-y-6">
                <div className="text-6xl mb-4">🧠</div>
                <h3 className="text-3xl font-bold text-slate-800 mb-4">Final Score</h3>
                
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
                  <div className="bg-amber-100 rounded-xl p-4">
                    <div className="text-3xl font-bold text-amber-600">{currentLevel - 1}</div>
                    <div className="text-sm text-slate-600">Characters Memorized</div>
                  </div>
                  <div className="bg-orange-100 rounded-xl p-4">
                    <div className="text-3xl font-bold text-orange-600">{streak}</div>
                    <div className="text-sm text-slate-600">Perfect Streak</div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-6 max-w-md mx-auto">
                  <p className="text-slate-700 mb-2">The correct answer was:</p>
                  <div className="text-3xl font-bold text-amber-600 tracking-wider">
                    {getCurrentDigits()}
                  </div>
                </div>

                {currentLevel - 1 === highScore && (
                  <div className="bg-yellow-100 border-2 border-yellow-400 rounded-xl p-4 max-w-md mx-auto">
                    <Trophy className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <p className="font-bold text-yellow-800">New High Score!</p>
                  </div>
                )}

                <Button
                  onClick={startGame}
                  size="lg"
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-12 py-6 text-xl rounded-xl shadow-lg"
                >
                  Try Again
                </Button>

                <Button
                  onClick={() => setGameState("menu")}
                  variant="outline"
                  size="lg"
                  className="ml-4"
                >
                  Back to Menu
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Golden Ratio Facts */}
        <div className="mt-8 text-center">
          <Card className="bg-gradient-to-r from-amber-100 to-orange-100 border-0">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-2 text-slate-800">Did You Know?</h3>
              <p className="text-slate-700">
                φ (phi), the Golden Ratio, is approximately 1.618. It appears in nature, art, and architecture! 
                From the spiral of a nautilus shell to the proportions of the Parthenon, this special number is everywhere!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MemorizingPhi;
