
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { gameService } from '@/services/additionHero/gameService';
import HeroAvatar from './HeroAvatar';

interface AvatarCustomizerProps {
  onClose: () => void;
}

interface CustomizationOption {
  id: string;
  name: string;
  value: string;
  itemId: string;
  unlockRequirement?: number;
}

const AvatarCustomizer: React.FC<AvatarCustomizerProps> = ({ onClose }) => {
  const [avatar, setAvatar] = useState(gameService.getAvatar());
  const [unlockedItems, setUnlockedItems] = useState<string[]>(gameService.getUnlockedItems());
  const [playerProgress, setPlayerProgress] = useState(gameService.getPlayerProgress());
  
  // Available avatar options
  const capeOptions: CustomizationOption[] = [
    { id: 'cape-1', name: 'Classic Cape', value: 'default', itemId: 'default-cape' },
    { id: 'cape-2', name: 'Flame Cape', value: 'flame', itemId: 'flame-cape', unlockRequirement: 300 },
    { id: 'cape-3', name: 'Star Cape', value: 'star', itemId: 'star-cape', unlockRequirement: 700 }
  ];
  
  const maskOptions: CustomizationOption[] = [
    { id: 'mask-1', name: 'Classic Mask', value: 'default', itemId: 'default-mask' },
    { id: 'mask-2', name: 'Star Mask', value: 'star', itemId: 'star-mask', unlockRequirement: 400 },
    { id: 'mask-3', name: 'Goggles', value: 'goggles', itemId: 'goggles-mask', unlockRequirement: 600 }
  ];
  
  const colorOptions: CustomizationOption[] = [
    { id: 'color-1', name: 'Blue', value: 'blue', itemId: 'blue-color' },
    { id: 'color-2', name: 'Red', value: 'red', itemId: 'red-color', unlockRequirement: 200 },
    { id: 'color-3', name: 'Green', value: 'green', itemId: 'green-color', unlockRequirement: 350 },
    { id: 'color-4', name: 'Purple', value: 'purple', itemId: 'purple-color', unlockRequirement: 500 },
    { id: 'color-5', name: 'Orange', value: 'orange', itemId: 'orange-color', unlockRequirement: 800 }
  ];
  
  const emblemOptions: CustomizationOption[] = [
    { id: 'emblem-1', name: 'Lightning', value: 'lightning', itemId: 'lightning-emblem' },
    { id: 'emblem-2', name: 'Star', value: 'star', itemId: 'star-emblem', unlockRequirement: 450 },
    { id: 'emblem-3', name: 'None', value: 'none', itemId: 'none-emblem' }
  ];
  
  // State for current selection indices
  const [selectedIndices, setSelectedIndices] = useState({
    cape: capeOptions.findIndex(c => c.value === avatar.cape),
    mask: maskOptions.findIndex(m => m.value === avatar.mask),
    color: colorOptions.findIndex(c => c.value === avatar.color),
    emblem: emblemOptions.findIndex(e => e.value === avatar.emblem)
  });
  
  // Handle option change
  const handleChangeOption = (
    category: 'cape' | 'mask' | 'color' | 'emblem',
    direction: 'next' | 'prev'
  ) => {
    const options = 
      category === 'cape' ? capeOptions :
      category === 'mask' ? maskOptions :
      category === 'color' ? colorOptions :
      emblemOptions;
    
    let newIndex = selectedIndices[category];
    
    // Find the next/previous unlocked option
    let found = false;
    let attempts = 0;
    
    while (!found && attempts < options.length) {
      // Update index based on direction
      if (direction === 'next') {
        newIndex = (newIndex + 1) % options.length;
      } else {
        newIndex = (newIndex - 1 + options.length) % options.length;
      }
      
      // Check if this option is unlocked
      const option = options[newIndex];
      const isUnlocked = unlockedItems.includes(option.itemId);
      
      if (isUnlocked) {
        found = true;
      }
      
      attempts++;
    }
    
    if (found) {
      // Update selected index
      setSelectedIndices(prev => ({
        ...prev,
        [category]: newIndex
      }));
      
      // Update avatar
      const newValue = options[newIndex].value;
      setAvatar(prev => ({
        ...prev,
        [category]: newValue
      }));
    }
  };
  
  // Save avatar changes
  const handleSaveChanges = () => {
    gameService.updateAvatar(avatar);
    onClose();
  };
  
  // Check if an item is unlocked
  const isItemUnlocked = (itemId: string): boolean => {
    return unlockedItems.includes(itemId);
  };
  
  // Get option based on current index
  const getCurrentOption = (
    category: 'cape' | 'mask' | 'color' | 'emblem'
  ) => {
    const options = 
      category === 'cape' ? capeOptions :
      category === 'mask' ? maskOptions :
      category === 'color' ? colorOptions :
      emblemOptions;
    
    const index = selectedIndices[category];
    return options[index];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto bg-indigo-900/90 backdrop-blur-md rounded-lg p-6 shadow-xl"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Customize Your Hero</h2>
        <p className="text-blue-200">Unlock new items by earning points in games</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="mb-4">
            <HeroAvatar size="large" />
          </div>
          
          <div className="text-center bg-indigo-800/50 rounded-lg p-3 w-full">
            <div className="text-sm opacity-70">Total Score</div>
            <div className="text-2xl font-bold">{playerProgress.totalCorrectAnswers * 10}</div>
          </div>
        </div>
        
        <div className="flex-1 space-y-6">
          {/* Cape Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Cape Style</h3>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleChangeOption('cape', 'prev')}
                className="bg-white/10"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex-1 bg-indigo-800/50 rounded-lg p-3 text-center relative">
                {getCurrentOption('cape').name}
                
                {isItemUnlocked(getCurrentOption('cape').itemId) ? (
                  <div className="absolute top-1 right-1">
                    <Check className="h-4 w-4 text-green-400" />
                  </div>
                ) : null}
              </div>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleChangeOption('cape', 'next')}
                className="bg-white/10"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Show unlock requirements for locked items */}
            {capeOptions.some(item => !isItemUnlocked(item.itemId)) && (
              <div className="mt-2 grid gap-2">
                {capeOptions
                  .filter(item => !isItemUnlocked(item.itemId))
                  .map(item => (
                    <div key={item.id} className="text-xs flex gap-1 items-center opacity-70">
                      <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                      <span>Unlock {item.name}: Score {item.unlockRequirement} points</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
          
          {/* Mask Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Mask Style</h3>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleChangeOption('mask', 'prev')}
                className="bg-white/10"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex-1 bg-indigo-800/50 rounded-lg p-3 text-center relative">
                {getCurrentOption('mask').name}
                
                {isItemUnlocked(getCurrentOption('mask').itemId) ? (
                  <div className="absolute top-1 right-1">
                    <Check className="h-4 w-4 text-green-400" />
                  </div>
                ) : null}
              </div>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleChangeOption('mask', 'next')}
                className="bg-white/10"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Show unlock requirements */}
            {maskOptions.some(item => !isItemUnlocked(item.itemId)) && (
              <div className="mt-2 grid gap-2">
                {maskOptions
                  .filter(item => !isItemUnlocked(item.itemId))
                  .map(item => (
                    <div key={item.id} className="text-xs flex gap-1 items-center opacity-70">
                      <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                      <span>Unlock {item.name}: Score {item.unlockRequirement} points</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
          
          {/* Color Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Hero Color</h3>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleChangeOption('color', 'prev')}
                className="bg-white/10"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex-1 bg-indigo-800/50 rounded-lg p-3 text-center relative">
                {getCurrentOption('color').name}
                
                {isItemUnlocked(getCurrentOption('color').itemId) ? (
                  <div className="absolute top-1 right-1">
                    <Check className="h-4 w-4 text-green-400" />
                  </div>
                ) : null}
              </div>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleChangeOption('color', 'next')}
                className="bg-white/10"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Show unlock requirements */}
            {colorOptions.some(item => !isItemUnlocked(item.itemId)) && (
              <div className="mt-2 grid gap-2">
                {colorOptions
                  .filter(item => !isItemUnlocked(item.itemId))
                  .map(item => (
                    <div key={item.id} className="text-xs flex gap-1 items-center opacity-70">
                      <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                      <span>Unlock {item.name}: Score {item.unlockRequirement} points</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
          
          {/* Emblem Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Chest Emblem</h3>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleChangeOption('emblem', 'prev')}
                className="bg-white/10"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex-1 bg-indigo-800/50 rounded-lg p-3 text-center relative">
                {getCurrentOption('emblem').name}
                
                {isItemUnlocked(getCurrentOption('emblem').itemId) ? (
                  <div className="absolute top-1 right-1">
                    <Check className="h-4 w-4 text-green-400" />
                  </div>
                ) : null}
              </div>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleChangeOption('emblem', 'next')}
                className="bg-white/10"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Show unlock requirements */}
            {emblemOptions.some(item => !isItemUnlocked(item.itemId)) && (
              <div className="mt-2 grid gap-2">
                {emblemOptions
                  .filter(item => !isItemUnlocked(item.itemId))
                  .map(item => (
                    <div key={item.id} className="text-xs flex gap-1 items-center opacity-70">
                      <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                      <span>Unlock {item.name}: Score {item.unlockRequirement} points</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end gap-3">
        <Button 
          variant="outline" 
          onClick={onClose}
          className="bg-white/10"
        >
          Cancel
        </Button>
        
        <Button 
          onClick={handleSaveChanges}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <User className="mr-2 h-4 w-4" />
          Save Avatar
        </Button>
      </div>
    </motion.div>
  );
};

export default AvatarCustomizer;
