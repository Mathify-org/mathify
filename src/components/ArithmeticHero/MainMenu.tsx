
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Zap, Shield, Award, Medal, User, Plus, Minus, Divide, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { gameService, levels } from '@/services/arithmeticHero/gameService';
import { GameMode, OperationType } from '@/types/arithmeticHero';
import HeroAvatar from './HeroAvatar';

interface MainMenuProps {
  onStartGame: (mode: GameMode, level: number) => void;
  onOpenCustomizer: () => void;
  onOpenRewards: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStartGame, onOpenCustomizer, onOpenRewards }) => {
  const [selectedMode, setSelectedMode] = useState<GameMode>("arcade");
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [playerProgress, setPlayerProgress] = useState(gameService.getPlayerProgress());
  
  useEffect(() => {
    // Update progress data when component mounts
    setPlayerProgress(gameService.getPlayerProgress());
  }, []);

  const handleModeSelect = (mode: GameMode) => {
    setSelectedMode(mode);
    // Reset level selection when changing modes (except for challenge which doesn't use levels)
    if (mode !== "challenge") {
      setSelectedLevel(1);
    }
  };

  const handleLevelSelect = (level: number) => {
    setSelectedLevel(level);
  };

  const handleStartGame = () => {
    onStartGame(selectedMode, selectedLevel);
  };

  // Get operation icons for level display
  const getOperationIcons = (operations: OperationType[]) => {
    return (
      <div className="flex space-x-1 mt-1">
        {operations.map((op, i) => {
          let icon;
          switch (op) {
            case "+": return <Plus key={i} className="h-3 w-3 text-blue-300" />;
            case "-": return <Minus key={i} className="h-3 w-3 text-green-300" />;
            case "×": return <span key={i} className="text-purple-300 font-bold">×</span>;
            case "÷": return <Divide key={i} className="h-3 w-3 text-orange-300" />;
            default: return null;
          }
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold mb-2 tracking-tight text-shadow-glow">
          <span className="text-yellow-300">Arithmetic</span> Hero
        </h1>
        <p className="text-lg md:text-xl text-blue-100">Become a math superhero and save the city!</p>
        
        <div className="mt-6">
          <HeroAvatar size="large" />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Zap className="mr-2 h-5 w-5 text-yellow-300" /> 
            Game Modes
          </h2>
          
          <div className="flex flex-col space-y-3">
            <Button 
              variant={selectedMode === "arcade" ? "default" : "outline"} 
              onClick={() => handleModeSelect("arcade")}
              className={`justify-start text-left p-4 h-auto ${selectedMode === "arcade" ? "bg-gradient-to-r from-blue-600 to-purple-600" : "bg-white/20"}`}
            >
              <div>
                <div className="font-bold">Arcade Mode</div>
                <div className="text-sm opacity-90">Waves of falling equations get faster with each level</div>
              </div>
            </Button>
            
            <Button 
              variant={selectedMode === "practice" ? "default" : "outline"}
              onClick={() => handleModeSelect("practice")}
              className={`justify-start text-left p-4 h-auto ${selectedMode === "practice" ? "bg-gradient-to-r from-green-600 to-emerald-600" : "bg-white/20"}`}
            >
              <div>
                <div className="font-bold">Practice Mode</div>
                <div className="text-sm opacity-90">No time limit, focus on mastering operations</div>
              </div>
            </Button>
            
            <Button 
              variant={selectedMode === "challenge" ? "default" : "outline"}
              onClick={() => handleModeSelect("challenge")}
              className={`justify-start text-left p-4 h-auto ${selectedMode === "challenge" ? "bg-gradient-to-r from-amber-600 to-orange-600" : "bg-white/20"}`}
            >
              <div>
                <div className="font-bold">Hero Challenge</div>
                <div className="text-sm opacity-90">Score as many points as possible in 90 seconds</div>
              </div>
            </Button>
          </div>
          
          {selectedMode !== "challenge" && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Star className="mr-2 h-5 w-5 text-yellow-300" />
                Select Level
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {levels.map((level) => (
                  <Button
                    key={level.id}
                    disabled={level.id > playerProgress.unlockedLevels}
                    variant={selectedLevel === level.id ? "default" : "outline"}
                    onClick={() => handleLevelSelect(level.id)}
                    className={`
                      p-3 h-auto
                      ${selectedLevel === level.id ? "bg-blue-600" : "bg-white/20"}
                      ${level.id > playerProgress.unlockedLevels ? "opacity-50" : ""}
                    `}
                  >
                    <div className="text-center">
                      <div className="font-bold">Level {level.id}</div>
                      {getOperationIcons(level.operations)}
                      {level.id > playerProgress.unlockedLevels && (
                        <div className="text-xs mt-1">🔒 Locked</div>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Medal className="mr-2 h-5 w-5 text-yellow-300" /> 
            Your Stats
          </h2>
          
          <Card className="bg-white/10 border-0 backdrop-blur-sm shadow-xl mb-4">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-white/10">
                  <div className="text-sm opacity-80">Best Score</div>
                  <div className="text-xl font-bold">
                    {selectedMode === "challenge" 
                      ? playerProgress.highScores.challenge 
                      : playerProgress.highScores.arcade[selectedLevel - 1] || 0}
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-white/10">
                  <div className="text-sm opacity-80">Longest Streak</div>
                  <div className="text-xl font-bold">{playerProgress.longestStreak}</div>
                </div>
                
                <div className="p-3 rounded-lg bg-white/10">
                  <div className="text-sm opacity-80">Total Correct</div>
                  <div className="text-xl font-bold">{playerProgress.totalCorrectAnswers}</div>
                </div>
                
                <div className="p-3 rounded-lg bg-white/10">
                  <div className="text-sm opacity-80">Levels Unlocked</div>
                  <div className="text-xl font-bold">{playerProgress.unlockedLevels} / {levels.length}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex flex-col space-y-3">
            <Button 
              className="bg-gradient-to-r from-violet-600 to-indigo-600 h-auto py-3" 
              onClick={handleStartGame}
            >
              <Zap className="mr-2 h-5 w-5" />
              Start Game
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={onOpenCustomizer} className="bg-white/20">
                <User className="mr-2 h-5 w-5" />
                Customize Hero
              </Button>
              
              <Button variant="outline" onClick={onOpenRewards} className="bg-white/20">
                <Award className="mr-2 h-5 w-5" />
                View Rewards
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-10 bg-white/10 rounded-lg p-4 max-w-4xl w-full backdrop-blur-sm">
        <h3 className="font-bold mb-2 flex items-center">
          <Shield className="mr-2 h-5 w-5 text-yellow-300" /> 
          How to Play
        </h3>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>Equations with different operations will fall from the sky - solve them before they hit the ground!</li>
          <li>Type the answer or select from multiple choice options</li>
          <li>Each correct answer earns points and increases your streak multiplier</li>
          <li>Wrong answers reduce your shield health</li>
          <li>Unlock new levels with more operations by reaching score thresholds</li>
          <li>Earn achievements and customize your hero avatar</li>
        </ul>
      </div>
    </div>
  );
};

export default MainMenu;
