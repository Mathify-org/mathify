import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { RotateCw, Star, HelpCircle, ArrowLeft } from "lucide-react";
import ExplorerMap from "@/components/ShapeExplorer/ExplorerMap";
import ShapeChallenge from "@/components/ShapeExplorer/ShapeChallenge";
import HelpModal from "@/components/ShapeExplorer/HelpModal";

// Define island types and challenge data (removed 3D shapes island)
const islands = [
  {
    id: "polygons",
    name: "Polygons Point",
    description: "Explore the wonderful world of polygons and their properties",
    color: "bg-gradient-to-r from-blue-500 to-cyan-400",
    position: { x: 20, y: 30 },
    unlocked: true,
    completed: false,
    stars: 0,
    icon: "hexagon",
    challenges: [
      {
        id: "poly-1",
        name: "Polygon Basics",
        type: "sort",
        description: "Sort shapes based on their properties",
        completed: false,
        stars: 0
      },
      {
        id: "poly-2",
        name: "Polygon Corners",
        type: "match",
        description: "Match shapes with their number of vertices",
        completed: false,
        stars: 0
      },
      {
        id: "poly-3",
        name: "Quadrilateral Quest",
        type: "sort",
        description: "Identify and classify different quadrilaterals",
        completed: false,
        stars: 0
      },
      {
        id: "poly-4",
        name: "Regular vs Irregular",
        type: "sort",
        description: "Distinguish between regular and irregular polygons",
        completed: false,
        stars: 0
      }
    ]
  },
  {
    id: "circles",
    name: "Circle Cove",
    description: "Dive into the perfect world of circles and their parts",
    color: "bg-gradient-to-r from-green-400 to-teal-500",
    position: { x: 75, y: 60 },
    unlocked: true,
    completed: false,
    stars: 0,
    icon: "circle",
    challenges: [
      {
        id: "circ-1",
        name: "Parts of a Circle",
        type: "label",
        description: "Learn about radius, diameter, and circumference",
        completed: false,
        stars: 0
      },
      {
        id: "circ-2",
        name: "Circle Calculations",
        type: "calculate",
        description: "Practice calculations with circular shapes",
        completed: false,
        stars: 0
      }
    ]
  },
  {
    id: "symmetry",
    name: "Symmetry Safari",
    description: "Explore the beauty and balance of symmetrical shapes",
    color: "bg-gradient-to-r from-pink-500 to-rose-500",
    position: { x: 50, y: 40 },
    unlocked: true,
    completed: false,
    stars: 0,
    icon: "square-dashed",
    challenges: [
      {
        id: "sym-1",
        name: "Line Symmetry",
        type: "identify",
        description: "Find lines of symmetry in different shapes",
        completed: false,
        stars: 0
      },
      {
        id: "sym-2",
        name: "Rotational Symmetry",
        type: "rotate",
        description: "Discover shapes with rotational symmetry",
        completed: false,
        stars: 0
      }
    ]
  }
];

// Progress manager to handle localStorage
const useProgressManager = () => {
  const [gameData, setGameData] = useState(islands);
  
  useEffect(() => {
    const savedData = localStorage.getItem('shapeExplorerProgress');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setGameData(parsedData);
      } catch (err) {
        console.error('Failed to load saved progress', err);
      }
    }
  }, []);

  const updateProgress = (islandId: string, challengeId: string, stars: number) => {
    setGameData(prevData => {
      const newData = [...prevData];
      const islandIndex = newData.findIndex(island => island.id === islandId);
      
      if (islandIndex === -1) return prevData;
      
      const challengeIndex = newData[islandIndex].challenges.findIndex(
        challenge => challenge.id === challengeId
      );
      
      if (challengeIndex === -1) return prevData;
      
      // Update challenge stars and completion
      newData[islandIndex].challenges[challengeIndex].stars = stars;
      newData[islandIndex].challenges[challengeIndex].completed = true;
      
      // Update island stats
      const totalStars = newData[islandIndex].challenges.reduce(
        (sum, challenge) => sum + challenge.stars, 0
      );
      newData[islandIndex].stars = totalStars;
      
      const islandCompleted = newData[islandIndex].challenges.every(
        challenge => challenge.completed
      );
      newData[islandIndex].completed = islandCompleted;
      
      // Show toast notification for island completion
      if (islandCompleted) {
        toast.success(`Congratulations! You've completed ${newData[islandIndex].name}!`, {
          description: "Great job exploring geometry!",
          duration: 4000,
        });
      }
      
      // Save to localStorage
      localStorage.setItem('shapeExplorerProgress', JSON.stringify(newData));
      return newData;
    });
  };

  const resetProgress = () => {
    localStorage.removeItem('shapeExplorerProgress');
    setGameData(islands);
    toast.success("Progress reset successfully!", {
      description: "All islands have been reset to their initial state.",
      duration: 3000,
    });
  };

  return { gameData, updateProgress, resetProgress };
};

const ShapeExplorer = () => {
  const [activeView, setActiveView] = useState<'map' | 'challenge'>('map');
  const [activeIsland, setActiveIsland] = useState<string | null>(null);
  const [activeChallenge, setActiveChallenge] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const { gameData, updateProgress, resetProgress } = useProgressManager();
  
  const handleIslandSelect = (islandId: string) => {
    setActiveIsland(islandId);
  };
  
  const handleChallengeSelect = (challengeId: string) => {
    setActiveChallenge(challengeId);
    setActiveView('challenge');
  };
  
  const handleBackToMap = () => {
    setActiveView('map');
    setActiveChallenge(null);
  };
  
  const handleChallengeComplete = (stars: number) => {
    if (activeIsland && activeChallenge) {
      updateProgress(activeIsland, activeChallenge, stars);
    }
  };
  
  const selectedIsland = activeIsland 
    ? gameData.find(island => island.id === activeIsland)
    : null;
  
  const selectedChallenge = selectedIsland && activeChallenge
    ? selectedIsland.challenges.find(challenge => challenge.id === activeChallenge)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white mr-2 hover:bg-white/10"
              >
                <ArrowLeft />
              </Button>
            </Link>
            <h1 className="text-xl md:text-3xl font-bold">
              {activeView === 'map' 
                ? 'Shape Explorer' 
                : selectedChallenge 
                  ? selectedChallenge.name
                  : 'Shape Explorer'}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowHelp(true)}
              className="text-white hover:bg-white/10"
            >
              <HelpCircle />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={resetProgress}
              className="text-white hover:bg-white/10"
              title="Reset Progress"
            >
              <RotateCw />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {activeView === 'map' && (
          <div className="space-y-6">
            {/* Map View */}
            <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 mb-8">
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-purple-700">Geometry World Map</h2>
              <p className="text-slate-600 mb-4">
                Explore the islands of Geometry World and complete challenges to restore knowledge to the realm!
              </p>
              
              <ExplorerMap 
                islands={gameData} 
                onIslandSelect={handleIslandSelect} 
              />
            </div>
            
            {/* Selected Island Details */}
            {selectedIsland && (
              <div className={cn("rounded-2xl shadow-lg p-4 md:p-6", selectedIsland.color)}>
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 md:p-6">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">{selectedIsland.name}</h3>
                  <p className="text-slate-700 mb-4">{selectedIsland.description}</p>
                  
                  {/* Island Progress */}
                  <div className="flex items-center mb-6">
                    <div className="flex items-center">
                      <Star className="text-yellow-500 fill-yellow-500 mr-1" size={18} />
                      <span className="font-bold">{selectedIsland.stars}/{selectedIsland.challenges.length * 3}</span>
                    </div>
                    <span className="mx-2">•</span>
                    <span className={cn(
                      "px-2 py-1 text-xs font-medium rounded-full",
                      selectedIsland.completed ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                    )}>
                      {selectedIsland.completed ? "Completed" : "In Progress"}
                    </span>
                  </div>
                  
                  {/* Challenge List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedIsland.challenges.map((challenge) => (
                      <Card 
                        key={challenge.id} 
                        className={cn(
                          "hover:shadow-md transition-all transform hover:-translate-y-1 cursor-pointer",
                          challenge.completed ? "border-green-200" : ""
                        )}
                        onClick={() => handleChallengeSelect(challenge.id)}
                      >
                        <CardContent className="p-4">
                          <h4 className="font-bold mb-1">{challenge.name}</h4>
                          <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                          <div className="flex justify-between items-center">
                            <span className={cn(
                              "px-2 py-1 text-xs font-medium rounded-full",
                              challenge.type === "sort" ? "bg-blue-100 text-blue-800" : 
                              challenge.type === "match" ? "bg-purple-100 text-purple-800" :
                              challenge.type === "measure" ? "bg-green-100 text-green-800" :
                              challenge.type === "build" ? "bg-orange-100 text-orange-800" :
                              "bg-gray-100 text-gray-800"
                            )}>
                              {challenge.type}
                            </span>
                            <div className="flex">
                              {[1, 2, 3].map((star) => (
                                <Star 
                                  key={star}
                                  size={16}
                                  className={cn(
                                    star <= challenge.stars
                                      ? "text-yellow-500 fill-yellow-500"
                                      : "text-gray-300"
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeView === 'challenge' && selectedChallenge && (
          <ShapeChallenge 
            challenge={selectedChallenge}
            onComplete={handleChallengeComplete}
            onBack={handleBackToMap}
          />
        )}
      </div>
      
      {/* Help Modal */}
      <HelpModal open={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
};

export default ShapeExplorer;
