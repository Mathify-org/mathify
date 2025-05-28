
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GameMode } from '@/pages/TargetTakedown';

interface ModeSelectorProps {
  selectedMode: GameMode;
  onModeSelect: (mode: GameMode) => void;
}

const ModeSelector = ({ selectedMode, onModeSelect }: ModeSelectorProps) => {
  const modes = [
    {
      id: 'classic' as GameMode,
      name: '⚡ Classic',
      description: '60 seconds, infinite targets',
      color: 'from-blue-500 to-purple-500'
    },
    {
      id: 'survival' as GameMode,
      name: '💀 Survival',
      description: '3 lives, no mistakes allowed',
      color: 'from-red-500 to-orange-500'
    },
    {
      id: 'chill' as GameMode,
      name: '🌸 Chill',
      description: 'No timer, no pressure',
      color: 'from-green-500 to-teal-500'
    }
  ];

  return (
    <div className="space-y-3">
      {modes.map((mode) => (
        <Button
          key={mode.id}
          onClick={() => onModeSelect(mode.id)}
          variant={selectedMode === mode.id ? "default" : "outline"}
          className={`w-full p-4 h-auto text-left transition-all duration-200 ${
            selectedMode === mode.id
              ? `bg-gradient-to-r ${mode.color} text-white shadow-lg scale-105`
              : 'hover:scale-102'
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg">{mode.name}</span>
              {selectedMode === mode.id && (
                <Badge className="bg-white/20 text-white">Selected</Badge>
              )}
            </div>
            <p className="text-sm opacity-90">{mode.description}</p>
          </div>
        </Button>
      ))}
    </div>
  );
};

export default ModeSelector;
