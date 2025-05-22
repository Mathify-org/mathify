
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Lock, CheckCircle2, ArrowLeft } from 'lucide-react';
import { gameService } from '@/services/arithmeticHero/gameService';
import { useToast } from '@/hooks/use-toast';
import HeroAvatar from './HeroAvatar';

// Define customization options
const avatarOptions = {
  colors: [
    { id: 'blue', name: 'Blue', lockThreshold: 0 },
    { id: 'red', name: 'Red', lockThreshold: 200 },
    { id: 'green', name: 'Green', lockThreshold: 500 },
    { id: 'purple', name: 'Purple', lockThreshold: 1000 },
    { id: 'orange', name: 'Orange', lockThreshold: 1500 }
  ],
  masks: [
    { id: 'default', name: 'Default', lockThreshold: 0 },
    { id: 'square', name: 'Square', lockThreshold: 300 },
    { id: 'diamond', name: 'Diamond', lockThreshold: 800 },
    { id: 'star', name: 'Star', lockThreshold: 1200 }
  ],
  capes: [
    { id: 'default', name: 'Default', lockThreshold: 0 },
    { id: 'star', name: 'Star', lockThreshold: 400 },
    { id: 'wave', name: 'Wave', lockThreshold: 900 },
    { id: 'flames', name: 'Flames', lockThreshold: 1400 }
  ],
  emblems: [
    { id: 'lightning', name: 'Lightning', lockThreshold: 0 },
    { id: 'plus', name: 'Plus', lockThreshold: 250 },
    { id: 'star', name: 'Star', lockThreshold: 600 },
    { id: 'bolt', name: 'Bolt', lockThreshold: 1100 }
  ]
};

interface AvatarCustomizerProps {
  onClose: () => void;
}

const AvatarCustomizer: React.FC<AvatarCustomizerProps> = ({ onClose }) => {
  const { toast } = useToast();
  const playerProgress = gameService.getPlayerProgress();
  const unlockedItems = gameService.getUnlockedItems();
  const currentAvatar = gameService.getAvatar();
  
  const [selectedColor, setSelectedColor] = useState(currentAvatar.color);
  const [selectedMask, setSelectedMask] = useState(currentAvatar.mask);
  const [selectedCape, setSelectedCape] = useState(currentAvatar.cape);
  const [selectedEmblem, setSelectedEmblem] = useState(currentAvatar.emblem);
  
  const isUnlocked = (type: string, id: string) => {
    return unlockedItems.includes(`${id}-${type}`);
  };
  
  const unlockItem = (type: string, id: string, threshold: number) => {
    if (playerProgress.totalCorrectAnswers >= threshold) {
      gameService.unlockItem(`${id}-${type}`);
      
      toast({
        title: "Item Unlocked!",
        description: `You've unlocked the ${id} ${type}!`,
        duration: 3000,
      });
      
      return true;
    }
    return false;
  };
  
  const saveChanges = () => {
    gameService.updateAvatar({
      color: selectedColor,
      mask: selectedMask,
      cape: selectedCape,
      emblem: selectedEmblem
    });
    
    toast({
      title: "Hero Updated!",
      description: "Your hero's look has been saved.",
      duration: 3000,
    });
    
    onClose();
  };
  
  return (
    <div className="container max-w-3xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={onClose}>
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Button>
          
          <h2 className="text-2xl font-bold">Customize Your Hero</h2>
          
          <div className="w-20"></div> {/* Placeholder for alignment */}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Preview panel */}
          <Card className="bg-white/10 border-none shadow-xl backdrop-blur-sm md:col-span-1">
            <CardContent className="p-6 flex flex-col items-center">
              <h3 className="text-lg font-medium mb-4">Preview</h3>
              
              <div className="mb-4">
                <HeroAvatar size="large" />
              </div>
              
              <div className="text-center text-sm opacity-80 mb-6">
                <p>Achievements: {playerProgress.achievements.filter(a => a.isUnlocked).length}/{playerProgress.achievements.length}</p>
                <p>Total correct: {playerProgress.totalCorrectAnswers}</p>
              </div>
              
              <Button 
                onClick={saveChanges}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
          
          {/* Customization options */}
          <Card className="bg-white/10 border-none shadow-xl backdrop-blur-sm md:col-span-2">
            <CardContent className="p-6">
              <Tabs defaultValue="colors">
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="colors">Colors</TabsTrigger>
                  <TabsTrigger value="masks">Masks</TabsTrigger>
                  <TabsTrigger value="capes">Capes</TabsTrigger>
                  <TabsTrigger value="emblems">Emblems</TabsTrigger>
                </TabsList>
                
                <TabsContent value="colors">
                  <h3 className="font-medium mb-4">Select Hero Color</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {avatarOptions.colors.map(color => {
                      const isItemUnlocked = isUnlocked('color', color.id) || color.lockThreshold === 0;
                      const canUnlock = playerProgress.totalCorrectAnswers >= color.lockThreshold;
                      
                      return (
                        <Button
                          key={color.id}
                          variant={selectedColor === color.id ? "default" : "outline"}
                          className={`relative p-3 h-auto ${selectedColor === color.id ? "" : "bg-white/10"}`}
                          onClick={() => {
                            if (isItemUnlocked) {
                              setSelectedColor(color.id);
                            } else if (canUnlock) {
                              const unlocked = unlockItem('color', color.id, color.lockThreshold);
                              if (unlocked) {
                                setSelectedColor(color.id);
                              }
                            }
                          }}
                        >
                          <div className="flex flex-col items-center">
                            <div 
                              className={`w-8 h-8 rounded-full mb-2 border border-white/50 ${
                                color.id === 'red' ? 'bg-red-500' :
                                color.id === 'green' ? 'bg-green-500' :
                                color.id === 'purple' ? 'bg-purple-500' :
                                color.id === 'orange' ? 'bg-orange-500' :
                                'bg-blue-500'
                              }`}
                            ></div>
                            
                            <div>{color.name}</div>
                            
                            {!isItemUnlocked && (
                              <div className="absolute inset-0 bg-black/70 rounded-md flex items-center justify-center">
                                <div className="text-center">
                                  <Lock className="h-5 w-5 mx-auto mb-1" />
                                  <div className="text-xs">
                                    {canUnlock ? "Click to Unlock" : `Unlock at ${color.lockThreshold}`}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </TabsContent>
                
                <TabsContent value="masks">
                  <h3 className="font-medium mb-4">Select Hero Mask</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {avatarOptions.masks.map(mask => {
                      const isItemUnlocked = isUnlocked('mask', mask.id) || mask.lockThreshold === 0;
                      const canUnlock = playerProgress.totalCorrectAnswers >= mask.lockThreshold;
                      
                      return (
                        <Button
                          key={mask.id}
                          variant={selectedMask === mask.id ? "default" : "outline"}
                          className={`relative p-3 h-auto ${selectedMask === mask.id ? "" : "bg-white/10"}`}
                          onClick={() => {
                            if (isItemUnlocked) {
                              setSelectedMask(mask.id);
                            } else if (canUnlock) {
                              const unlocked = unlockItem('mask', mask.id, mask.lockThreshold);
                              if (unlocked) {
                                setSelectedMask(mask.id);
                              }
                            }
                          }}
                        >
                          <div className="flex flex-col items-center">
                            <div className="text-lg mb-2">
                              {mask.id === 'square' ? '◼' : 
                               mask.id === 'diamond' ? '◆' :
                               mask.id === 'star' ? '★' : '⬤'}
                            </div>
                            
                            <div>{mask.name}</div>
                            
                            {!isItemUnlocked && (
                              <div className="absolute inset-0 bg-black/70 rounded-md flex items-center justify-center">
                                <div className="text-center">
                                  <Lock className="h-5 w-5 mx-auto mb-1" />
                                  <div className="text-xs">
                                    {canUnlock ? "Click to Unlock" : `Unlock at ${mask.lockThreshold}`}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </TabsContent>
                
                <TabsContent value="capes">
                  <h3 className="font-medium mb-4">Select Hero Cape</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {avatarOptions.capes.map(cape => {
                      const isItemUnlocked = isUnlocked('cape', cape.id) || cape.lockThreshold === 0;
                      const canUnlock = playerProgress.totalCorrectAnswers >= cape.lockThreshold;
                      
                      return (
                        <Button
                          key={cape.id}
                          variant={selectedCape === cape.id ? "default" : "outline"}
                          className={`relative p-3 h-auto ${selectedCape === cape.id ? "" : "bg-white/10"}`}
                          onClick={() => {
                            if (isItemUnlocked) {
                              setSelectedCape(cape.id);
                            } else if (canUnlock) {
                              const unlocked = unlockItem('cape', cape.id, cape.lockThreshold);
                              if (unlocked) {
                                setSelectedCape(cape.id);
                              }
                            }
                          }}
                        >
                          <div className="flex flex-col items-center">
                            <div className="text-lg mb-2">
                              {cape.id === 'star' ? '★' : 
                               cape.id === 'wave' ? '〰️' :
                               cape.id === 'flames' ? '🔥' : '⬛'}
                            </div>
                            
                            <div>{cape.name}</div>
                            
                            {!isItemUnlocked && (
                              <div className="absolute inset-0 bg-black/70 rounded-md flex items-center justify-center">
                                <div className="text-center">
                                  <Lock className="h-5 w-5 mx-auto mb-1" />
                                  <div className="text-xs">
                                    {canUnlock ? "Click to Unlock" : `Unlock at ${cape.lockThreshold}`}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </TabsContent>
                
                <TabsContent value="emblems">
                  <h3 className="font-medium mb-4">Select Hero Emblem</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {avatarOptions.emblems.map(emblem => {
                      const isItemUnlocked = isUnlocked('emblem', emblem.id) || emblem.lockThreshold === 0;
                      const canUnlock = playerProgress.totalCorrectAnswers >= emblem.lockThreshold;
                      
                      return (
                        <Button
                          key={emblem.id}
                          variant={selectedEmblem === emblem.id ? "default" : "outline"}
                          className={`relative p-3 h-auto ${selectedEmblem === emblem.id ? "" : "bg-white/10"}`}
                          onClick={() => {
                            if (isItemUnlocked) {
                              setSelectedEmblem(emblem.id);
                            } else if (canUnlock) {
                              const unlocked = unlockItem('emblem', emblem.id, emblem.lockThreshold);
                              if (unlocked) {
                                setSelectedEmblem(emblem.id);
                              }
                            }
                          }}
                        >
                          <div className="flex flex-col items-center">
                            <div className="text-xl mb-2">
                              {emblem.id === 'plus' ? '+' : 
                               emblem.id === 'star' ? '★' :
                               emblem.id === 'bolt' ? '⚡' : '⚡'}
                            </div>
                            
                            <div>{emblem.name}</div>
                            
                            {!isItemUnlocked && (
                              <div className="absolute inset-0 bg-black/70 rounded-md flex items-center justify-center">
                                <div className="text-center">
                                  <Lock className="h-5 w-5 mx-auto mb-1" />
                                  <div className="text-xs">
                                    {canUnlock ? "Click to Unlock" : `Unlock at ${emblem.lockThreshold}`}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default AvatarCustomizer;
