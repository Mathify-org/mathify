
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Rocket, Zap, Star } from 'lucide-react';

interface GameMenuProps {
  onStartGame: () => void;
}

const GameMenu: React.FC<GameMenuProps> = ({ onStartGame }) => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 animate-float">
            🚀 Math Warp
          </h1>
          <p className="text-xl md:text-2xl text-blue-200">
            Navigate through space by solving multiplication & division!
          </p>
        </div>

        {/* Game Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-black/30 border-blue-400/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-300">
                <Rocket className="text-blue-400" />
                How to Play
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <Badge className="bg-blue-500 text-white">1</Badge>
                <p className="text-white">Look at the equation signal in the portal</p>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="bg-blue-500 text-white">2</Badge>
                <p className="text-white">Tap the correct number to open the portal</p>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="bg-blue-500 text-white">3</Badge>
                <p className="text-white">Your spaceship warps through to the next challenge!</p>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="bg-yellow-500 text-white">⚡</Badge>
                <p className="text-white">Build streaks for WARP SPEED bonuses!</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/30 border-purple-400/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-300">
                <Zap className="text-purple-400" />
                Game Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-left">
              <div className="flex items-center gap-2">
                <Star className="text-yellow-400 fill-yellow-400" size={16} />
                <span className="text-white">60 seconds of fast-paced math</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="text-yellow-400 fill-yellow-400" size={16} />
                <span className="text-white">Multiplication & division practice</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="text-yellow-400 fill-yellow-400" size={16} />
                <span className="text-white">Progressive difficulty levels</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="text-yellow-400 fill-yellow-400" size={16} />
                <span className="text-white">Streak bonuses & warp effects</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="text-yellow-400 fill-yellow-400" size={16} />
                <span className="text-white">Ages 9-14 perfect difficulty</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Start Button */}
        <Button
          onClick={onStartGame}
          size="lg"
          className="text-2xl py-6 px-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold shadow-lg transform hover:scale-105 transition-all duration-200 animate-pulse"
        >
          🚀 LAUNCH INTO SPACE
        </Button>
      </div>
    </div>
  );
};

export default GameMenu;
