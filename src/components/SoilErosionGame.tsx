
import { useState, useEffect } from "react";
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { Trees, Droplet, Wind, Sun, Tractor, Factory, House, Trash, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import Draggable from "@/components/Draggable";
import DroppableZone from "@/components/DroppableZone";
import { Progress } from "@/components/ui/progress";

type ConservationItem = {
  id: string;
  type: "tree" | "mulch" | "grass" | "rocks" | "terrace" | "cover-crop";
  icon: JSX.Element;
  effect: number;
  label: string;
};

type HumanActivity = {
  id: string;
  type: "farming" | "construction" | "deforestation" | "pollution" | "burning";
  icon: JSX.Element;
  effect: number;
  label: string;
};

type Weather = "sunny" | "rainy" | "windy";

const SoilErosionGame = () => {
  const [weather, setWeather] = useState<Weather>("sunny");
  const [erosion, setErosion] = useState<number>(80);
  const [placedItems, setPlacedItems] = useState<(ConservationItem | HumanActivity)[]>([]);
  const [activeTab, setActiveTab] = useState<"conservation" | "human">("conservation");
  const [goal] = useState<number>(20);
  const [gameWon, setGameWon] = useState<boolean>(false);
  
  const conservationItems: ConservationItem[] = [
    { 
      id: "tree", 
      type: "tree", 
      icon: <Trees className="h-10 w-10 text-green-700" />, 
      effect: -10,
      label: "Tree" 
    },
    { 
      id: "mulch", 
      type: "mulch", 
      icon: <div className="h-8 w-14 rounded bg-amber-800" />, 
      effect: -7,
      label: "Mulch" 
    },
    { 
      id: "grass", 
      type: "grass", 
      icon: <div className="h-10 w-10 bg-green-400 rounded-t-full" />, 
      effect: -5,
      label: "Grass" 
    },
    { 
      id: "rocks", 
      type: "rocks", 
      icon: <div className="flex gap-1">
        <div className="h-6 w-6 bg-gray-400 rounded-full" />
        <div className="h-5 w-5 bg-gray-500 rounded-full" />
        <div className="h-7 w-7 bg-gray-600 rounded-full" />
      </div>, 
      effect: -8,
      label: "Rocks" 
    },
    { 
      id: "terrace", 
      type: "terrace", 
      icon: <div className="flex flex-col items-center">
        <div className="h-2 w-12 bg-brown-500 mb-1" />
        <div className="h-2 w-12 bg-brown-500 mb-1" />
        <div className="h-2 w-12 bg-brown-500" />
      </div>, 
      effect: -12,
      label: "Terraces" 
    },
    { 
      id: "cover-crop", 
      type: "cover-crop", 
      icon: <div className="grid grid-cols-3 gap-0.5">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="h-2 w-2 bg-green-300 rounded-full" />
        ))}
      </div>, 
      effect: -6,
      label: "Cover Crops" 
    }
  ];

  const humanActivities: HumanActivity[] = [
    { 
      id: "farming", 
      type: "farming", 
      icon: <Tractor className="h-10 w-10 text-yellow-600" />, 
      effect: 8,
      label: "Farming" 
    },
    { 
      id: "construction", 
      type: "construction", 
      icon: <House className="h-10 w-10 text-gray-700" />, 
      effect: 10,
      label: "Construction" 
    },
    { 
      id: "deforestation", 
      type: "deforestation", 
      icon: <div className="relative">
        <Trees className="h-10 w-10 text-green-700 opacity-50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-0.5 w-8 bg-red-600 rotate-45" />
          <div className="h-0.5 w-8 bg-red-600 -rotate-45" />
        </div>
      </div>, 
      effect: 15,
      label: "Deforestation" 
    },
    { 
      id: "pollution", 
      type: "pollution", 
      icon: <Trash className="h-10 w-10 text-gray-600" />, 
      effect: 7,
      label: "Pollution" 
    },
    { 
      id: "burning", 
      type: "burning", 
      icon: <Flame className="h-10 w-10 text-orange-600" />, 
      effect: 12,
      label: "Burning" 
    }
  ];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const toggleWeather = () => {
    setWeather((prev) => {
      if (prev === "sunny") return "rainy";
      if (prev === "rainy") return "windy";
      return "sunny";
    });
  };

  useEffect(() => {
    calculateErosion();
  }, [weather, placedItems]);

  const calculateErosion = () => {
    // Base erosion starts at 80%
    let newErosion = 80;
    
    // Apply the effects of all placed items
    placedItems.forEach(item => {
      newErosion += item.effect;
    });
    
    // Weather effects can increase erosion
    if (weather === "rainy") {
      // Rain increases erosion, but less so if you have trees and other protection
      const protectionItems = placedItems.filter(item => 
        'type' in item && 
        (item.type === "tree" || item.type === "grass" || item.type === "cover-crop")
      );
      const protection = protectionItems.length * 2;
      newErosion += Math.max(0, 15 - protection);
    }
    if (weather === "windy") {
      // Wind increases erosion, but less so if you have rocks, trees and terraces
      const windProtectionItems = placedItems.filter(item => 
        'type' in item && 
        (item.type === "tree" || item.type === "rocks" || item.type === "terrace")
      );
      const windProtection = windProtectionItems.length * 3;
      newErosion += Math.max(0, 10 - windProtection);
    }
    
    // Synergistic effects - certain combinations work better
    const hasTree = placedItems.some(item => 'type' in item && item.type === "tree");
    const hasGrass = placedItems.some(item => 'type' in item && item.type === "grass");
    const hasMulch = placedItems.some(item => 'type' in item && item.type === "mulch");
    
    if (hasTree && hasGrass && hasMulch) {
      newErosion -= 5; // Additional bonus for a good combination
    }
    
    // Ensure erosion stays within 0-100 range
    const finalErosion = Math.max(0, Math.min(100, newErosion));
    setErosion(finalErosion);
    
    // Check win condition
    if (finalErosion <= goal && !gameWon) {
      setGameWon(true);
      toast.success("Great job! You've protected the soil from erosion!");
    } else if (finalErosion > goal) {
      setGameWon(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && over.id === "soil-zone") {
      const itemType = active.id as string;
      const conservationItem = conservationItems.find(item => item.id === itemType);
      const humanActivityItem = humanActivities.find(item => item.id === itemType);
      const itemToAdd = conservationItem || humanActivityItem;
      
      if (itemToAdd) {
        const newItem = { 
          ...itemToAdd, 
          id: `${itemToAdd.id}-${Date.now()}` // Make a unique ID for this instance
        };
        setPlacedItems(prev => [...prev, newItem]);
        
        if ('type' in itemToAdd && ['tree', 'grass', 'mulch', 'rocks', 'terrace', 'cover-crop'].includes(itemToAdd.type as string)) {
          toast.info(`Added ${itemToAdd.label} to protect the soil!`);
        } else {
          toast.warning(`Added ${itemToAdd.label} which increases erosion!`);
        }
      }
    }
  };

  const resetGame = () => {
    setPlacedItems([]);
    setErosion(80);
    setWeather("sunny");
    setGameWon(false);
  };

  const getStatusMessage = () => {
    if (gameWon) {
      return "Great job! You've achieved sustainable soil conservation!";
    }
    if (erosion > 60) {
      return "Your soil is heavily eroding! Try adding more conservation methods.";
    }
    if (erosion > 40) {
      return "You're making progress, but the soil still needs more protection!";
    }
    return "Keep working to reduce erosion! You're getting closer to your goal.";
  };

  // Calculate which color to use based on erosion level
  const getErosionColor = () => {
    if (erosion > 60) return "bg-red-600";
    if (erosion > 40) return "bg-orange-500";
    if (erosion > 20) return "bg-yellow-500";
    return "bg-green-500";
  }
  
  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <Card className="p-6 relative bg-gradient-to-b from-blue-100 to-amber-200">
        <div className="absolute top-4 right-4 space-x-2 flex">
          <Button
            variant="ghost"
            size="icon"
            className="bg-sun hover:bg-sun/80"
            onClick={toggleWeather}
            title="Change weather"
          >
            {weather === "sunny" ? (
              <Sun className="h-8 w-8 text-orange-500" />
            ) : weather === "rainy" ? (
              <Droplet className="h-8 w-8 text-blue-500" />
            ) : (
              <Wind className="h-8 w-8 text-gray-500" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetGame}
            className="bg-red-100 hover:bg-red-200"
          >
            Reset
          </Button>
        </div>

        <div className="flex flex-col space-y-6">
          {/* Status and controls */}
          <div className="flex items-center justify-between">
            <div className="space-y-2 w-full">
              <div className="flex items-center justify-between">
                <div className="text-lg font-medium">Erosion Level: {erosion}%</div>
                <div className="text-sm">Goal: Reduce erosion to {goal}% or lower</div>
              </div>
              <Progress value={100 - erosion} className="h-3">
                <div 
                  className={`${getErosionColor()} h-full rounded-full transition-all duration-500`} 
                  style={{ width: `${100 - erosion}%` }}
                ></div>
              </Progress>
            </div>
          </div>
          
          {/* Message */}
          <div className={`bg-white/80 p-3 rounded-lg text-center transition-colors ${gameWon ? 'bg-green-100' : ''}`}>
            {getStatusMessage()}
          </div>
          
          {/* Main gameplay area */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Left side: items to drag */}
            <div className="bg-white/40 p-4 rounded-lg">
              <div className="flex space-x-2 mb-4">
                <Button 
                  variant={activeTab === "conservation" ? "default" : "outline"}
                  onClick={() => setActiveTab("conservation")}
                  className="flex-1"
                >
                  Conservation
                </Button>
                <Button 
                  variant={activeTab === "human" ? "default" : "outline"}
                  onClick={() => setActiveTab("human")}
                  className="flex-1"
                >
                  Human Activities
                </Button>
              </div>
              
              {activeTab === "conservation" ? (
                <div>
                  <h3 className="font-bold mb-3">Conservation Tools:</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {conservationItems.map((item) => (
                      <Draggable key={item.id} id={item.id}>
                        <div className="bg-white p-4 rounded-lg shadow cursor-grab flex flex-col items-center justify-center h-24">
                          {item.icon}
                          <span className="mt-2 text-sm font-medium">{item.label}</span>
                          <span className="text-xs text-green-600">{item.effect}% erosion</span>
                        </div>
                      </Draggable>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="font-bold mb-3">Human Activities:</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {humanActivities.map((item) => (
                      <Draggable key={item.id} id={item.id}>
                        <div className="bg-white p-4 rounded-lg shadow cursor-grab flex flex-col items-center justify-center h-24">
                          {item.icon}
                          <span className="mt-2 text-sm font-medium">{item.label}</span>
                          <span className="text-xs text-red-600">+{item.effect}% erosion</span>
                        </div>
                      </Draggable>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Right side: soil zone */}
            <div className="col-span-1 md:col-span-2">
              <DroppableZone id="soil-zone">
                <div className="relative bg-amber-700 h-64 rounded-lg overflow-hidden">
                  {/* Sky/Weather visualization */}
                  <div 
                    className={`absolute top-0 left-0 right-0 h-1/3 ${
                      weather === "sunny" ? "bg-blue-300" : 
                      weather === "rainy" ? "bg-gray-400" : "bg-gray-300"
                    } transition-colors duration-500`}
                  >
                    {weather === "rainy" && (
                      <div className="absolute inset-0 flex justify-around">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <div 
                            key={i}
                            className="animate-rainfall h-8 w-0.5 bg-blue-500 opacity-70"
                            style={{ 
                              animationDelay: `${i * 0.2}s`,
                              left: `${i * 12}%` 
                            }}
                          ></div>
                        ))}
                      </div>
                    )}
                    {weather === "windy" && (
                      <div className="absolute inset-0 flex flex-col justify-around">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div 
                            key={i}
                            className="animate-wind h-1 bg-gray-400"
                            style={{ animationDelay: `${i * 0.3}s` }}
                          ></div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Soil visualization */}
                  <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-amber-800">
                    {/* Placed items */}
                    <div className="absolute inset-0 flex flex-wrap content-end p-2">
                      {placedItems.map((item, index) => (
                        <div key={item.id} className="p-1 transform transition-transform hover:scale-110">
                          {item.icon}
                        </div>
                      ))}
                    </div>
                    
                    {/* Erosion visualization */}
                    {erosion > 40 && (
                      <div className="absolute bottom-0 left-0 right-0">
                        <div className="flex justify-around">
                          {Array.from({ length: Math.ceil(erosion / 10) }).map((_, i) => (
                            <div 
                              key={i}
                              className="w-4 h-4 bg-amber-900 rounded-full opacity-70 animate-fall"
                              style={{ animationDelay: `${i * 0.5}s` }}
                            ></div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Drop here prompt */}
                  {placedItems.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-white bg-black/50 p-2 rounded">
                        Drag and drop items here to protect or change the soil
                      </p>
                    </div>
                  )}
                </div>
              </DroppableZone>
              
              {/* Tips section */}
              <div className="mt-4 bg-white/60 p-3 rounded-lg text-sm">
                <h4 className="font-bold">Tips:</h4>
                <ul className="list-disc ml-5">
                  <li>Different conservation methods work better against different weather conditions</li>
                  <li>Combining multiple conservation methods provides better protection</li>
                  <li>Human activities increase erosion - balance is key!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </DndContext>
  );
};

export default SoilErosionGame;
