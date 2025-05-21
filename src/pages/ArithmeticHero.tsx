
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import MainMenu from '@/components/ArithmeticHero/MainMenu';
import GameArea from '@/components/ArithmeticHero/GameArea';
import GameOver from '@/components/ArithmeticHero/GameOver';
import PracticeMode from '@/components/ArithmeticHero/PracticeMode';
import HeroChallenge from '@/components/ArithmeticHero/HeroChallenge';
import AvatarCustomizer from '@/components/ArithmeticHero/AvatarCustomizer';
import RewardsGallery from '@/components/ArithmeticHero/RewardsGallery';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { gameService } from '@/services/arithmeticHero/gameService';
import { GameState, GameMode } from '@/types/arithmeticHero';

const ArithmeticHero = () => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>("menu");
  const [gameMode, setGameMode] = useState<GameMode>("arcade");
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [showRewards, setShowRewards] = useState(false);

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
    
    // Show toast when game starts
    toast({
      title: `${mode.charAt(0).toUpperCase() + mode.slice(1)} Mode`,
      description: `Level ${level} - Let's go!`,
      duration: 2000,
    });
  };

  const handleGameOver = () => {
    setGameState("gameover");
  };

  const handleReturnToMenu = () => {
    setGameState("menu");
    setShowCustomizer(false);
    setShowRewards(false);
  };

  const handleOpenCustomizer = () => {
    setShowCustomizer(true);
    setGameState("other");
  };

  const handleOpenRewards = () => {
    setShowRewards(true);
    setGameState("other");
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
        
        {gameState === "gameover" && (
          <GameOver 
            gameMode={gameMode}
            level={selectedLevel}
            onRetry={() => handleStartGame(gameMode, selectedLevel)}
            onReturnToMenu={handleReturnToMenu}
          />
        )}
        
        {showCustomizer && (
          <AvatarCustomizer onClose={handleReturnToMenu} />
        )}
        
        {showRewards && (
          <RewardsGallery onClose={handleReturnToMenu} />
        )}
        
        {gameState !== "menu" && gameState !== "gameover" && (
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
    </div>
  );
};

export default ArithmeticHero;
