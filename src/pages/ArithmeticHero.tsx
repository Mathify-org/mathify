import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import MainMenu from '@/components/ArithmeticHero/MainMenu';
import GameArea from '@/components/ArithmeticHero/GameArea';
import PracticeMode from '@/components/ArithmeticHero/PracticeMode';
import HeroChallenge from '@/components/ArithmeticHero/HeroChallenge';
import AvatarCustomizer from '@/components/ArithmeticHero/AvatarCustomizer';
import RewardsGallery from '@/components/ArithmeticHero/RewardsGallery';
import GameCompletionHandler from '@/components/GameCompletionHandler';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { gameService } from '@/services/arithmeticHero/gameService';
import { GameState, GameMode } from '@/types/arithmeticHero';

interface GameStats {
  score: number;
  correctAnswers: number;
  incorrectAnswers: number;
  longestStreak: number;
}

const ArithmeticHero = () => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>("menu");
  const [gameMode, setGameMode] = useState<GameMode>("arcade");
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  const [showCompletionHandler, setShowCompletionHandler] = useState(false);
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    longestStreak: 0
  });
  const gameStartTime = useRef<number>(Date.now());

  // Initialize game data from localStorage on first load
  useEffect(() => {
    gameService.initializeGameData();
    
    // Check for any achievements earned last session but not shown
    const pendingAchievements = gameService.getPendingAchievements();
    if (pendingAchievements.length > 0) {
      pendingAchievements.forEach(achievement => {
        toast({
          title: "🏆 Achievement Unlocked!",
          description: achievement.name,
          duration: 5000,
        });
      });
      gameService.clearPendingAchievements();
    }
  }, [toast]);

  const handleStartGame = (mode: GameMode, level: number) => {
    setGameMode(mode);
    setSelectedLevel(level);
    setGameState("playing");
    setShowCompletionHandler(false);
    gameStartTime.current = Date.now();
    
    // Show toast when game starts
    toast({
      title: `${mode.charAt(0).toUpperCase() + mode.slice(1)} Mode`,
      description: `Level ${level} - Let's go!`,
      duration: 2000,
    });
  };

  const handleGameOver = (stats?: GameStats) => {
    if (stats) {
      setGameStats(stats);
    }
    setGameState("gameover");
    setShowCompletionHandler(true);
  };

  const handleReturnToMenu = () => {
    setGameState("menu");
    setShowCustomizer(false);
    setShowRewards(false);
    setShowCompletionHandler(false);
  };

  const handleOpenCustomizer = () => {
    setShowCustomizer(true);
    setGameState("other");
  };

  const handleOpenRewards = () => {
    setShowRewards(true);
    setGameState("other");
  };

  const handlePlayAgain = () => {
    setShowCompletionHandler(false);
    handleStartGame(gameMode, selectedLevel);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white">
      <Helmet>
        <title>Arithmetic Hero - Math Game</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        {gameState === "menu" && (
          <MainMenu 
            onStartGame={handleStartGame} 
            onOpenCustomizer={handleOpenCustomizer}
            onOpenRewards={handleOpenRewards}
          />
        )}
        
        {gameState === "playing" && gameMode === "arcade" && (
          <GameArea 
            level={selectedLevel}
            onGameOver={handleGameOver}
          />
        )}
        
        {gameState === "playing" && gameMode === "practice" && (
          <PracticeMode 
            level={selectedLevel}
            onExit={handleReturnToMenu}
          />
        )}
        
        {gameState === "playing" && gameMode === "challenge" && (
          <HeroChallenge
            onGameOver={handleGameOver}
          />
        )}
        
        {showCustomizer && (
          <AvatarCustomizer onClose={handleReturnToMenu} />
        )}
        
        {showRewards && (
          <RewardsGallery onClose={handleReturnToMenu} />
        )}
        
        {gameState !== "menu" && gameState !== "gameover" && !showCompletionHandler && (
          <div className="mt-4">
            <Button 
              variant="outline" 
              onClick={handleReturnToMenu}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm"
            >
              Back to Menu
            </Button>
          </div>
        )}
      </div>
      
      {/* Global Progress Tracking Modal */}
      {showCompletionHandler && (
        <GameCompletionHandler
          gameId="arithmetic-hero"
          gameName="Arithmetic Hero"
          score={gameStats.score}
          correctAnswers={gameStats.correctAnswers}
          totalQuestions={gameStats.correctAnswers + gameStats.incorrectAnswers}
          timeSpentSeconds={Math.round((Date.now() - gameStartTime.current) / 1000)}
          difficulty={gameMode === "challenge" ? "challenge" : `level-${selectedLevel}`}
          onClose={handleReturnToMenu}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
};

export default ArithmeticHero;
