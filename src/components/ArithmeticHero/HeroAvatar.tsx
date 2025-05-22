
import React from 'react';
import { Shield } from 'lucide-react';
import { gameService } from '@/services/arithmeticHero/gameService';

interface HeroAvatarProps {
  size?: 'small' | 'medium' | 'large';
  animate?: boolean;
}

const HeroAvatar: React.FC<HeroAvatarProps> = ({ 
  size = 'medium', 
  animate = false 
}) => {
  const avatar = gameService.getAvatar();
  
  const getSize = () => {
    switch (size) {
      case 'small': return 'w-12 h-12';
      case 'large': return 'w-32 h-32';
      case 'medium':
      default: return 'w-20 h-20';
    }
  };
  
  const getColor = () => {
    switch (avatar.color) {
      case 'red': return 'bg-gradient-to-b from-red-400 to-red-600';
      case 'green': return 'bg-gradient-to-b from-green-400 to-green-600';
      case 'purple': return 'bg-gradient-to-b from-purple-400 to-purple-600';
      case 'orange': return 'bg-gradient-to-b from-amber-400 to-orange-600';
      case 'blue':
      default: return 'bg-gradient-to-b from-blue-400 to-blue-600';
    }
  };

  const getCape = () => {
    switch (avatar.cape) {
      case 'star': return 'after:bg-yellow-500 after:clip-path-star';
      case 'wave': return 'after:bg-cyan-500 after:clip-path-wave';
      case 'flames': return 'after:bg-orange-500 after:clip-path-flames';
      case 'default':
      default: return 'after:bg-red-500 after:clip-path-cape';
    }
  };

  const getMask = () => {
    switch (avatar.mask) {
      case 'square': return 'rounded-lg';
      case 'diamond': return 'rotate-45';
      case 'star': return 'mask-star';
      case 'default':
      default: return 'rounded-full';
    }
  };

  const getEmblem = () => {
    switch (avatar.emblem) {
      case 'star': return '★';
      case 'plus': return '+';
      case 'bolt': return '⚡';
      case 'lightning':
      default: return (
        <Shield className="w-1/2 h-1/2 text-white drop-shadow-md" />
      );
    }
  };

  return (
    <div className={`relative ${getSize()}`}>
      {/* Hero body */}
      <div 
        className={`
          ${getSize()} 
          ${getColor()} 
          ${getMask()} 
          ${getCape()} 
          flex items-center justify-center
          relative z-10
          border-2 border-white/50
          shadow-lg
          after:absolute 
          after:h-full 
          after:w-full 
          after:-z-10 
          after:top-1/4 
          after:left-0
          overflow-visible
        `}
      >
        {/* Emblem */}
        <div className="text-white font-bold text-2xl">
          {getEmblem()}
        </div>
      </div>
      
      {/* Animation effect */}
      {animate && (
        <div className="absolute inset-0 rounded-full bg-white/30 animate-ping"></div>
      )}
    </div>
  );
};

export default HeroAvatar;
