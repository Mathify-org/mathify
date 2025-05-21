
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Star, Shield, Zap } from 'lucide-react';
import { PowerupType } from '@/types/additionHero';

interface PowerupNotificationProps {
  type: PowerupType;
}

const PowerupNotification: React.FC<PowerupNotificationProps> = ({ type }) => {
  const getPowerupData = () => {
    switch (type) {
      case 'slowMotion':
        return {
          title: 'Slow Motion',
          description: 'Equations fall slower for 15 seconds!',
          icon: <Clock className="h-6 w-6 text-blue-300" />,
          color: 'from-blue-600 to-cyan-500'
        };
      case 'doublePoints':
        return {
          title: 'Double Points',
          description: 'Score twice as many points for 20 seconds!',
          icon: <Star className="h-6 w-6 text-yellow-300" />,
          color: 'from-amber-500 to-yellow-400'
        };
      case 'shield':
        return {
          title: 'Shield Boost',
          description: 'Shield health restored by 30%!',
          icon: <Shield className="h-6 w-6 text-green-300" />,
          color: 'from-green-600 to-emerald-500'
        };
      case 'multiZap':
        return {
          title: 'Multi-Zap',
          description: 'Instantly zap all visible equations!',
          icon: <Zap className="h-6 w-6 text-purple-300" />,
          color: 'from-purple-600 to-violet-500'
        };
    }
  };
  
  const powerup = getPowerupData();

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      className="absolute top-32 left-1/2 transform -translate-x-1/2 z-30"
    >
      <div className={`bg-gradient-to-r ${powerup.color} px-4 py-3 rounded-lg shadow-lg flex items-center gap-3`}>
        <div className="p-2 bg-white/20 rounded-full">
          {powerup.icon}
        </div>
        <div>
          <h3 className="font-bold text-lg">{powerup.title}</h3>
          <p className="text-sm text-white/90">{powerup.description}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default PowerupNotification;
