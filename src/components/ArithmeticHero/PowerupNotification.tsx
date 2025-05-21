
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, Star, Zap } from 'lucide-react';
import { PowerupType } from '@/types/arithmeticHero';

interface PowerupNotificationProps {
  type: PowerupType;
}

const PowerupNotification: React.FC<PowerupNotificationProps> = ({ type }) => {
  const getIcon = () => {
    switch (type) {
      case "slowMotion":
        return <Clock className="h-8 w-8 text-blue-300" />;
      case "doublePoints":
        return <Star className="h-8 w-8 text-yellow-300" />;
      case "shield":
        return <Shield className="h-8 w-8 text-green-300" />;
      case "multiZap":
        return <Zap className="h-8 w-8 text-purple-300" />;
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (type) {
      case "slowMotion":
        return "Slow Motion";
      case "doublePoints":
        return "Double Points";
      case "shield":
        return "Shield Boost";
      case "multiZap":
        return "Multi-Zap";
      default:
        return "Power-up";
    }
  };

  const getDescription = () => {
    switch (type) {
      case "slowMotion":
        return "Equations fall 50% slower for 15 seconds!";
      case "doublePoints":
        return "All points are doubled for 20 seconds!";
      case "shield":
        return "Shield health increased by 30%!";
      case "multiZap":
        return "All equations on screen are instantly solved!";
      default:
        return "";
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "slowMotion":
        return "bg-gradient-to-r from-cyan-500/80 to-blue-600/80";
      case "doublePoints":
        return "bg-gradient-to-r from-amber-400/80 to-orange-500/80";
      case "shield":
        return "bg-gradient-to-r from-emerald-500/80 to-green-600/80";
      case "multiZap":
        return "bg-gradient-to-r from-violet-500/80 to-purple-600/80";
      default:
        return "bg-gradient-to-r from-blue-500/80 to-indigo-600/80";
    }
  };

  return (
    <motion.div
      className="absolute top-1/4 left-0 right-0 flex justify-center z-30 pointer-events-none"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`rounded-lg ${getBgColor()} backdrop-blur-sm p-4 shadow-lg border border-white/20 max-w-xs text-center`}>
        <div className="flex items-center justify-center mb-2">
          {getIcon()}
          <h3 className="text-xl font-bold text-white ml-2">{getTitle()}</h3>
        </div>
        <p className="text-white text-sm">{getDescription()}</p>
      </div>
    </motion.div>
  );
};

export default PowerupNotification;
