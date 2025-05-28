
import React from 'react';
import { Button } from '@/components/ui/button';

interface NumberTileProps {
  value: number;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const NumberTile = ({ value, selected, onClick, disabled }: NumberTileProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={`
        aspect-square text-2xl font-bold transition-all duration-200 transform
        ${selected 
          ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white scale-110 shadow-lg rotate-3' 
          : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:scale-105 hover:shadow-lg'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}
        rounded-xl border-2 border-white/30 hover:border-white/50
      `}
    >
      {value}
    </Button>
  );
};

export default NumberTile;
