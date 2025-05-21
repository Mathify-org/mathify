
import React from 'react';
import { gameService } from '@/services/additionHero/gameService';

interface HeroAvatarProps {
  size?: 'small' | 'medium' | 'large';
}

const HeroAvatar: React.FC<HeroAvatarProps> = ({ size = 'medium' }) => {
  const avatarItems = gameService.getAvatar();
  
  // Size classes
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-24 h-24',
    large: 'w-32 h-32'
  };
  
  // Color styles
  const colorStyles: Record<string, { main: string, secondary: string }> = {
    blue: { main: '#3b82f6', secondary: '#1d4ed8' },
    red: { main: '#ef4444', secondary: '#b91c1c' },
    green: { main: '#22c55e', secondary: '#15803d' },
    purple: { main: '#a855f7', secondary: '#7e22ce' },
    orange: { main: '#f97316', secondary: '#c2410c' },
  };
  
  const selectedColor = colorStyles[avatarItems.color] || colorStyles.blue;
  
  // Cape styles
  const renderCape = () => {
    switch (avatarItems.cape) {
      case 'flame':
        return (
          <div className="absolute -bottom-1 w-full flex justify-center z-0">
            <div className="w-3/4 h-full bg-gradient-to-t from-orange-500 via-yellow-500 to-transparent rounded-b-full blur-sm" />
          </div>
        );
      case 'star':
        return (
          <div className="absolute -bottom-2 w-full flex justify-center z-0">
            <div className="relative w-3/4 h-2/3 bg-yellow-400 rotate-45 transform -translate-y-1/3">
              <div className="absolute top-0 left-0 w-full h-full bg-yellow-300 opacity-50 animate-pulse" />
            </div>
          </div>
        );
      case 'default':
      default:
        return (
          <div className="absolute -bottom-1 w-full flex justify-center z-0">
            <div className="w-3/4 h-full bg-gradient-to-t from-blue-500 to-transparent rounded-b-full" />
          </div>
        );
    }
  };
  
  // Mask styles
  const renderMask = () => {
    switch (avatarItems.mask) {
      case 'star':
        return (
          <div className="absolute top-1/3 left-1/4 right-1/4 h-1/4 bg-white flex items-center justify-center">
            <div className="absolute w-full h-full overflow-hidden">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-full bg-black" />
              <div className="absolute top-0 left-1/3 w-1/3 h-full bg-black rotate-45" />
              <div className="absolute top-0 right-1/3 w-1/3 h-full bg-black -rotate-45" />
            </div>
          </div>
        );
      case 'goggles':
        return (
          <div className="absolute top-1/3 left-0 right-0 h-1/6 bg-white flex items-center justify-center">
            <div className="absolute w-5/6 h-full flex justify-between">
              <div className="w-2/5 h-full rounded-full bg-black" />
              <div className="w-2/5 h-full rounded-full bg-black" />
            </div>
          </div>
        );
      case 'default':
      default:
        return (
          <div className="absolute top-1/3 left-1/4 right-1/4 h-1/6 bg-black" />
        );
    }
  };
  
  // Emblem styles
  const renderEmblem = () => {
    switch (avatarItems.emblem) {
      case 'star':
        return (
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/4">
            <div className="w-1/3 h-1/3 bg-yellow-400 rotate-45 transform" />
          </div>
        );
      case 'lightning':
        return (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-1/4 h-1/2 bg-yellow-400 rotate-45 transform" />
            <div className="w-1/4 h-1/2 bg-yellow-400 -rotate-45 transform" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`relative ${sizeClasses[size]} rounded-full overflow-visible`}>
      {/* Cape */}
      {renderCape()}
      
      {/* Hero body */}
      <div 
        className="relative z-10 w-full h-full rounded-full shadow-lg overflow-hidden"
        style={{ backgroundColor: selectedColor.main }}
      >
        {/* Mask */}
        {renderMask()}
        
        {/* Emblem on chest */}
        {renderEmblem()}
      </div>
    </div>
  );
};

export default HeroAvatar;
