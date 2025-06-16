
import React from "react";
import { X, GraduationCap, BookOpen, School, Globe } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface SecondaryMathsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const SecondaryMathsPopup: React.FC<SecondaryMathsPopupProps> = ({ isOpen, onClose }) => {
  const examBoards = [
    {
      title: "A-Levels",
      description: "Advanced Level Mathematics",
      icon: <GraduationCap className="h-8 w-8" />,
      path: "/video-hub/alevels",
      gradient: "from-blue-600 to-indigo-700",
      flag: "🇬🇧"
    },
    {
      title: "IB",
      description: "International Baccalaureate",
      icon: <Globe className="h-8 w-8" />,
      path: "/video-hub/ib",
      gradient: "from-purple-600 to-violet-700",
      flag: "🌍"
    },
    {
      title: "GCSE",
      description: "General Certificate Education",
      icon: <School className="h-8 w-8" />,
      path: "/video-hub/gcse",
      gradient: "from-green-600 to-emerald-700",
      flag: "🇬🇧"
    },
    {
      title: "US Curriculum",
      description: "American High School Math",
      icon: <BookOpen className="h-8 w-8" />,
      path: "/video-hub/us",
      gradient: "from-red-600 to-rose-700",
      flag: "🇺🇸"
    },
    {
      title: "Australian",
      description: "Australian Curriculum",
      icon: <School className="h-8 w-8" />,
      path: "/video-hub/australian",
      gradient: "from-orange-600 to-amber-700",
      flag: "🇦🇺"
    },
    {
      title: "Canadian",
      description: "Canadian Curriculum",
      icon: <BookOpen className="h-8 w-8" />,
      path: "/video-hub/canadian",
      gradient: "from-red-500 to-red-600",
      flag: "🇨🇦"
    },
    {
      title: "CBSE",
      description: "Central Board of Secondary",
      icon: <GraduationCap className="h-8 w-8" />,
      path: "/video-hub/cbse",
      gradient: "from-teal-600 to-cyan-700",
      flag: "🇮🇳"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-[95vw] mx-auto p-0 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 border-0 rounded-3xl overflow-hidden">
        <div className="relative">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]"></div>
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/20 rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
            <div className="flex items-center justify-center gap-3 mb-2">
              <GraduationCap className="h-8 w-8 text-white" />
              <h2 className="text-2xl font-bold text-white">Secondary Maths</h2>
            </div>
            <p className="text-indigo-100">Select your exam board</p>
          </div>

          {/* Exam Boards Grid */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-3">
              {examBoards.map((board, index) => (
                <Link
                  key={board.path}
                  to={board.path}
                  onClick={onClose}
                  className="block group"
                >
                  <Card className="p-3 h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group-hover:bg-white/90">
                    <div className={`w-10 h-10 bg-gradient-to-r ${board.gradient} rounded-lg flex items-center justify-center text-white mb-2 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                      {board.icon}
                    </div>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <span className="text-lg">{board.flag}</span>
                      <h3 className="font-bold text-xs text-center text-slate-800">
                        {board.title}
                      </h3>
                    </div>
                    <p className="text-[10px] text-slate-600 text-center leading-tight">
                      {board.description}
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

export default SecondaryMathsPopup;
