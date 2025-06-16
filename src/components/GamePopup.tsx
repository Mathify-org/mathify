import React from "react";
import { X, Gamepad2, Calculator, Target, Zap, Shapes, Divide } from "lucide-react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface GamePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const GamePopup: React.FC<GamePopupProps> = ({ isOpen, onClose }) => {
  const games = [
    {
      title: "Mental Maths",
      description: "Quick calculations",
      icon: <Calculator className="h-8 w-8" />,
      path: "/mental-maths",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      title: "Times Tables",
      description: "Master multiplication",
      icon: <Zap className="h-8 w-8" />,
      path: "/times-tables",
      gradient: "from-green-500 to-teal-600"
    },
    {
      title: "Math Facts Race",
      description: "Speed challenge",
      icon: <Target className="h-8 w-8" />,
      path: "/math-facts",
      gradient: "from-red-500 to-pink-600"
    },
    {
      title: "Shape Match",
      description: "Geometry fun",
      icon: <Shapes className="h-8 w-8" />,
      path: "/shape-match",
      gradient: "from-yellow-500 to-orange-600"
    },
    {
      title: "Fraction Basics",
      description: "Learn fractions",
      icon: <Divide className="h-8 w-8" />,
      path: "/fraction-basics",
      gradient: "from-indigo-500 to-purple-600"
    },
    {
      title: "Arithmetic Hero",
      description: "Adventure learning",
      icon: <Gamepad2 className="h-8 w-8" />,
      path: "/arithmetic-hero",
      gradient: "from-cyan-500 to-blue-600"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-[95vw] mx-auto p-0 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 border-0 rounded-3xl overflow-hidden">
        <div className="relative">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]"></div>
            <DialogClose className="absolute top-4 right-4 p-2 bg-white/20 rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors">
              <X className="h-5 w-5 text-white" />
            </DialogClose>
            <div className="flex items-center justify-center gap-3 mb-2">
              <Gamepad2 className="h-8 w-8 text-white" />
              <h2 className="text-2xl font-bold text-white">Primary Games</h2>
            </div>
            <p className="text-purple-100">Choose your math adventure!</p>
          </div>

          {/* Games Grid */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              {games.map((game, index) => (
                <Link
                  key={game.path}
                  to={game.path}
                  onClick={onClose}
                  className="block group"
                >
                  <Card className="p-4 h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group-hover:bg-white/90">
                    <div className={`w-12 h-12 bg-gradient-to-r ${game.gradient} rounded-xl flex items-center justify-center text-white mb-3 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                      {game.icon}
                    </div>
                    <h3 className="font-bold text-sm text-center text-slate-800 mb-1">
                      {game.title}
                    </h3>
                    <p className="text-xs text-slate-600 text-center">
                      {game.description}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GamePopup;
