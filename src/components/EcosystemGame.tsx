
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Bird, Bug, Cat, Fish, TreeDeciduous, Droplet, Sun } from "lucide-react";

// Ecosystem entities and their relationships
interface EcosystemEntity {
  id: string;
  name: string;
  type: "animal" | "insect" | "bird" | "plant";
  icon: React.ReactNode;
  color: string;
  initialPopulation: number;
  currentPopulation: number;
  resourceNeeds: {
    food: number;
    water: number;
    shelter: number;
  };
  predators: string[];
  prey: string[];
}

// Simplified 3D visualization using CSS 3D transforms
const Ecosystem3D: React.FC<{ entities: EcosystemEntity[] }> = ({ entities }) => {
  return (
    <div className="h-[500px] rounded-xl overflow-hidden shadow-xl bg-gradient-to-b from-blue-300 to-green-300 relative perspective-1000">
      {/* Sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-300 to-blue-100 h-1/3" />
      
      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-b from-green-600 to-amber-700">
        {/* Water */}
        <div className="absolute right-0 bottom-0 w-1/3 h-1/4 bg-blue-400 rounded-tl-xl opacity-80" />
        
        {/* Trees */}
        <div className="absolute left-[20%] bottom-0 flex items-end">
          <div className="flex flex-col items-center transform hover:scale-105 transition-transform">
            <div className="w-10 h-16 bg-green-800 rounded-full transform -translate-y-2" />
            <div className="w-2 h-8 bg-amber-800" />
          </div>
        </div>
        
        <div className="absolute left-[60%] bottom-0 flex items-end">
          <div className="flex flex-col items-center transform hover:scale-105 transition-transform">
            <div className="w-14 h-20 bg-green-700 rounded-full transform -translate-y-2" />
            <div className="w-3 h-10 bg-amber-900" />
          </div>
        </div>
        
        {/* Entities */}
        <div className="absolute inset-0 flex flex-wrap p-4">
          {entities.map((entity, index) => {
            const populationRatio = entity.currentPopulation / entity.initialPopulation;
            const entityCount = Math.max(1, Math.round(populationRatio * 3));
            
            return Array.from({ length: entityCount }).map((_, subIndex) => {
              const left = `${(index * 12 + subIndex * 5) % 80 + 10}%`;
              const bottom = `${(index * 7 + subIndex * 9) % 50 + 5}%`;
              
              if (entity.type === "animal") {
                return (
                  <motion.div
                    key={`${entity.id}-${subIndex}`}
                    className="absolute transform hover:scale-110 transition-all cursor-pointer"
                    style={{ left, bottom }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="p-2 rounded-full" style={{ backgroundColor: entity.color }}>
                      {entity.icon}
                    </div>
                  </motion.div>
                );
              } else if (entity.type === "bird") {
                return (
                  <motion.div
                    key={`${entity.id}-${subIndex}`}
                    className="absolute transform hover:scale-110 transition-all cursor-pointer"
                    style={{ left, bottom: `${parseInt(bottom) + 20}%` }}
                    animate={{
                      y: [0, -10, 0],
                      x: [0, 5, 0],
                    }}
                    transition={{ repeat: Infinity, duration: 3 + index }}
                  >
                    <div className="p-2 rounded-full" style={{ backgroundColor: entity.color }}>
                      {entity.icon}
                    </div>
                  </motion.div>
                );
              } else if (entity.type === "insect") {
                return (
                  <motion.div
                    key={`${entity.id}-${subIndex}`}
                    className="absolute transform hover:scale-110 transition-all cursor-pointer"
                    style={{ left, bottom }}
                    animate={{
                      x: [0, 5, 0, -5, 0],
                    }}
                    transition={{ repeat: Infinity, duration: 2 + index * 0.5 }}
                  >
                    <div className="p-1 rounded-full" style={{ backgroundColor: entity.color }}>
                      {entity.icon}
                    </div>
                  </motion.div>
                );
              }
              return null;
            });
          })}
        </div>
      </div>
      
      {/* Clouds */}
      <motion.div
        className="absolute top-[10%] left-[10%] bg-white opacity-80 rounded-full w-20 h-8"
        animate={{
          x: [0, 100, 0],
        }}
        transition={{ repeat: Infinity, duration: 20 }}
      />
      <motion.div
        className="absolute top-[15%] left-[30%] bg-white opacity-80 rounded-full w-24 h-10"
        animate={{
          x: [0, 80, 0],
        }}
        transition={{ repeat: Infinity, duration: 25, delay: 5 }}
      />
      
      {/* Sun */}
      <div className="absolute top-[10%] right-[10%] bg-yellow-300 rounded-full w-16 h-16 shadow-lg" />
    </div>
  );
};

// Main game component
const EcosystemGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [resources, setResources] = useState({
    food: 100,
    water: 100,
    shelter: 100
  });
  const [allocations, setAllocations] = useState<Record<string, { food: number; water: number; shelter: number }>>({});
  const [ecosystemEntities, setEcosystemEntities] = useState<EcosystemEntity[]>([
    {
      id: "wolf",
      name: "Wolf",
      type: "animal",
      icon: <Cat size={24} />,
      color: "#78716c",
      initialPopulation: 10,
      currentPopulation: 10,
      resourceNeeds: { food: 8, water: 5, shelter: 6 },
      predators: [],
      prey: ["rabbit", "deer"]
    },
    {
      id: "rabbit",
      name: "Rabbit",
      type: "animal",
      icon: <Cat size={20} />,
      color: "#a8a29e",
      initialPopulation: 30,
      currentPopulation: 30,
      resourceNeeds: { food: 3, water: 2, shelter: 4 },
      predators: ["wolf", "eagle"],
      prey: ["grass"]
    },
    {
      id: "deer",
      name: "Deer",
      type: "animal",
      icon: <Cat size={22} />,
      color: "#a87c5b",
      initialPopulation: 20,
      currentPopulation: 20,
      resourceNeeds: { food: 5, water: 6, shelter: 3 },
      predators: ["wolf"],
      prey: ["grass"]
    },
    {
      id: "eagle",
      name: "Eagle",
      type: "bird",
      icon: <Bird size={24} />,
      color: "#854d0e",
      initialPopulation: 8,
      currentPopulation: 8,
      resourceNeeds: { food: 6, water: 3, shelter: 7 },
      predators: [],
      prey: ["rabbit", "mouse", "butterfly"]
    },
    {
      id: "sparrow",
      name: "Sparrow",
      type: "bird",
      icon: <Bird size={18} />,
      color: "#7f6e56",
      initialPopulation: 25,
      currentPopulation: 25,
      resourceNeeds: { food: 2, water: 1, shelter: 3 },
      predators: ["eagle"],
      prey: ["ant", "butterfly"]
    },
    {
      id: "butterfly",
      name: "Butterfly",
      type: "insect",
      icon: <Bug size={18} />,
      color: "#c084fc",
      initialPopulation: 40,
      currentPopulation: 40,
      resourceNeeds: { food: 1, water: 1, shelter: 1 },
      predators: ["sparrow", "eagle"],
      prey: ["flower"]
    },
    {
      id: "ant",
      name: "Ant",
      type: "insect",
      icon: <Bug size={16} />,
      color: "#525252",
      initialPopulation: 50,
      currentPopulation: 50,
      resourceNeeds: { food: 1, water: 1, shelter: 1 },
      predators: ["sparrow"],
      prey: ["grass", "flower"]
    }
  ]);

  // Initialize allocations
  useEffect(() => {
    if (gameStarted && Object.keys(allocations).length === 0) {
      const initialAllocations: Record<string, { food: number; water: number; shelter: number }> = {};
      ecosystemEntities.forEach(entity => {
        initialAllocations[entity.id] = { food: 0, water: 0, shelter: 0 };
      });
      setAllocations(initialAllocations);
    }
  }, [gameStarted, ecosystemEntities, allocations]);

  // Update allocation for a specific entity and resource
  const updateAllocation = (entityId: string, resourceType: 'food' | 'water' | 'shelter', value: number) => {
    setAllocations(prev => {
      const entityAllocation = prev[entityId] || { food: 0, water: 0, shelter: 0 };
      return {
        ...prev,
        [entityId]: {
          ...entityAllocation,
          [resourceType]: value
        }
      };
    });
  };

  // Calculate remaining resources
  const calculateRemainingResources = () => {
    const used = {
      food: 0,
      water: 0,
      shelter: 0
    };

    Object.values(allocations).forEach(allocation => {
      used.food += allocation.food;
      used.water += allocation.water;
      used.shelter += allocation.shelter;
    });

    return {
      food: Math.max(0, resources.food - used.food),
      water: Math.max(0, resources.water - used.water),
      shelter: Math.max(0, resources.shelter - used.shelter)
    };
  };

  const remainingResources = calculateRemainingResources();

  // Run the simulation and calculate the score
  const runSimulation = () => {
    // Clone entities for simulation
    const simulatedEntities = [...ecosystemEntities];
    
    // Apply resource allocations and calculate survival
    simulatedEntities.forEach(entity => {
      const entityAllocation = allocations[entity.id] || { food: 0, water: 0, shelter: 0 };
      const needs = entity.resourceNeeds;
      
      // Calculate resource satisfaction percentages
      const foodSatisfaction = Math.min(100, (entityAllocation.food / needs.food) * 100);
      const waterSatisfaction = Math.min(100, (entityAllocation.water / needs.water) * 100);
      const shelterSatisfaction = Math.min(100, (entityAllocation.shelter / needs.shelter) * 100);
      
      // Calculate overall health (average of all needs)
      const overallHealth = (foodSatisfaction + waterSatisfaction + shelterSatisfaction) / 3;
      
      // Predator-prey dynamics
      let predatorPressure = 0;
      let preyAvailability = 100;
      
      // Calculate predator pressure on this entity
      entity.predators.forEach(predatorId => {
        const predator = simulatedEntities.find(e => e.id === predatorId);
        if (predator) {
          // Higher predator population = more pressure
          predatorPressure += (predator.currentPopulation / predator.initialPopulation) * 25;
        }
      });
      
      // If this is a predator, check prey availability
      if (entity.prey.length > 0) {
        preyAvailability = 0;
        entity.prey.forEach(preyId => {
          const prey = simulatedEntities.find(e => e.id === preyId);
          if (prey) {
            // More prey = better for predator
            preyAvailability += (prey.currentPopulation / prey.initialPopulation) * 100 / entity.prey.length;
          }
        });
      }
      
      // Calculate final survival factor (between 0 and 1)
      const survivalFactor = Math.max(0, Math.min(1, 
        (overallHealth / 100) * 0.6 + // Resources are 60% important
        (Math.max(0, 100 - predatorPressure) / 100) * 0.2 + // Predators are 20% important
        (preyAvailability / 100) * 0.2 // Prey availability is 20% important
      ));
      
      // Update population based on survival factor
      entity.currentPopulation = Math.round(entity.initialPopulation * survivalFactor);
    });
    
    // Calculate ecosystem balance score (0-100)
    const totalInitialPopulation = ecosystemEntities.reduce((sum, entity) => sum + entity.initialPopulation, 0);
    const totalRemainingPopulation = simulatedEntities.reduce((sum, entity) => sum + entity.currentPopulation, 0);
    const survivalRate = (totalRemainingPopulation / totalInitialPopulation) * 100;
    
    // Biodiversity factor - all species should survive
    const speciesSurvivalCount = simulatedEntities.filter(entity => entity.currentPopulation > 0).length;
    const biodiversityFactor = speciesSurvivalCount / simulatedEntities.length;
    
    // Calculate final score
    const finalScore = Math.round(survivalRate * 0.7 + biodiversityFactor * 100 * 0.3);
    
    // Update state
    setEcosystemEntities(simulatedEntities);
    setScore(finalScore);
    setGameFinished(true);
    
    // Show toast message based on score
    if (finalScore >= 90) {
      toast.success("Outstanding! Your ecosystem is thriving!");
    } else if (finalScore >= 70) {
      toast.success("Great job! Your ecosystem is healthy!");
    } else if (finalScore >= 50) {
      toast.info("Not bad. Your ecosystem is surviving, but some species are struggling.");
    } else {
      toast.error("Your ecosystem is in trouble! Many species didn't survive.");
    }
  };

  // Restart the game
  const restartGame = () => {
    const resetEntities = ecosystemEntities.map(entity => ({
      ...entity,
      currentPopulation: entity.initialPopulation
    }));
    
    setEcosystemEntities(resetEntities);
    setAllocations({});
    setScore(0);
    setGameFinished(false);
    setGameStarted(true);
    toast.info("Let's try again! Allocate your resources wisely.");
  };

  // Render game intro
  if (!gameStarted) {
    return (
      <motion.div 
        className="max-w-4xl mx-auto py-10 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 mb-6">Ecosystem Balance Challenge</h2>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl mb-8 text-left">
          <h3 className="text-2xl font-bold mb-4 text-purple-800">How to Play:</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <div className="mt-1 text-purple-600"><Sun size={18} /></div>
              <p>You are the guardian of an ecosystem with various animals, birds, and insects.</p>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1 text-blue-600"><Droplet size={18} /></div>
              <p>Allocate limited resources (food, water, shelter) among all creatures.</p>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1 text-green-600"><TreeDeciduous size={18} /></div>
              <p>Remember that some animals eat others! Balance the food chain carefully.</p>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1 text-amber-600"><Cat size={18} /></div>
              <p>After allocation, see how your ecosystem performs and get a score out of 100.</p>
            </li>
          </ul>
        </div>
        
        <Button
          onClick={() => setGameStarted(true)}
          className="text-lg px-8 py-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all"
        >
          Start Ecosystem Challenge
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {!gameFinished ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
              <h3 className="text-2xl font-bold mb-4 text-blue-800">Available Resources</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Food: {remainingResources.food}/{resources.food}</span>
                  </div>
                  <Progress value={(remainingResources.food / resources.food) * 100} className="h-2 bg-amber-100" indicatorClassName="bg-amber-500" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Water: {remainingResources.water}/{resources.water}</span>
                  </div>
                  <Progress value={(remainingResources.water / resources.water) * 100} className="h-2 bg-blue-100" indicatorClassName="bg-blue-500" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Shelter: {remainingResources.shelter}/{resources.shelter}</span>
                  </div>
                  <Progress value={(remainingResources.shelter / resources.shelter) * 100} className="h-2 bg-green-100" indicatorClassName="bg-green-500" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {ecosystemEntities.map(entity => (
                <Card key={entity.id} className="overflow-hidden border-l-4" style={{ borderLeftColor: entity.color }}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-full" style={{ backgroundColor: `${entity.color}30` }}>
                        {entity.icon}
                      </div>
                      <div>
                        <h4 className="font-bold">{entity.name}</h4>
                        <div className="text-xs text-gray-500 flex gap-2">
                          <span>Type: {entity.type}</span>
                          <span>Population: {entity.initialPopulation}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs">Food ({allocations[entity.id]?.food || 0}/{entity.resourceNeeds.food} needed)</span>
                        </div>
                        <Slider 
                          value={[allocations[entity.id]?.food || 0]}
                          min={0}
                          max={25}
                          step={1}
                          onValueChange={(value) => updateAllocation(entity.id, "food", value[0])}
                          className="py-1"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs">Water ({allocations[entity.id]?.water || 0}/{entity.resourceNeeds.water} needed)</span>
                        </div>
                        <Slider 
                          value={[allocations[entity.id]?.water || 0]}
                          min={0}
                          max={25}
                          step={1}
                          onValueChange={(value) => updateAllocation(entity.id, "water", value[0])}
                          className="py-1"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs">Shelter ({allocations[entity.id]?.shelter || 0}/{entity.resourceNeeds.shelter} needed)</span>
                        </div>
                        <Slider 
                          value={[allocations[entity.id]?.shelter || 0]}
                          min={0}
                          max={25}
                          step={1}
                          onValueChange={(value) => updateAllocation(entity.id, "shelter", value[0])}
                          className="py-1"
                        />
                      </div>
                    </div>
                    
                    {entity.predators.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs text-red-500">Predators: {entity.predators.join(", ")}</span>
                      </div>
                    )}
                    
                    {entity.prey.length > 0 && (
                      <div className="mt-1">
                        <span className="text-xs text-green-500">Eats: {entity.prey.join(", ")}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-6">
              <Button
                onClick={runSimulation}
                disabled={Object.keys(allocations).length === 0}
                className="w-full py-4 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Run Simulation
              </Button>
            </div>
          </div>
          
          <div className="sticky top-6">
            <Ecosystem3D entities={ecosystemEntities} />
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Ecosystem Preview</h3>
              <p className="text-sm text-gray-600">
                This visualization shows your ecosystem. Each creature is represented by its icon.
                The number of creatures shown represents their current population.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl mb-6"
              >
                <h2 className="text-3xl font-bold mb-6 text-blue-800">Simulation Results</h2>
                
                <div className="mb-6">
                  <div className="relative h-40 w-40 mx-auto mb-4">
                    <div 
                      className="absolute inset-0 rounded-full bg-blue-500 flex items-center justify-center text-4xl font-bold text-white shadow-lg"
                      style={{
                        background: `conic-gradient(${score >= 70 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444'} ${score}%, #f3f4f6 0%)`,
                      }}
                    ></div>
                    <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
                      <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                        {score}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">
                      {score >= 90 ? "Excellent!" : 
                       score >= 70 ? "Great job!" : 
                       score >= 50 ? "Not bad!" : 
                       "Needs improvement"}
                    </h3>
                    <p className="text-gray-600">
                      {score >= 90 ? "Your ecosystem is thriving with perfect balance!" : 
                       score >= 70 ? "Your ecosystem is healthy and sustainable." : 
                       score >= 50 ? "Your ecosystem is surviving, but some species are struggling." : 
                       "Many species didn't survive in your ecosystem."}
                    </p>
                  </div>
                </div>
                
                <Button
                  onClick={restartGame}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Try Again
                </Button>
              </motion.div>
              
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {ecosystemEntities.map(entity => (
                  <motion.div
                    key={entity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: ecosystemEntities.indexOf(entity) * 0.1 }}
                  >
                    <Card className={`overflow-hidden border-l-4 ${
                      entity.currentPopulation === 0 ? "bg-red-50" :
                      entity.currentPopulation < entity.initialPopulation / 2 ? "bg-amber-50" :
                      "bg-green-50"
                    }`} style={{ borderLeftColor: entity.color }}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full" style={{ backgroundColor: `${entity.color}30` }}>
                              {entity.icon}
                            </div>
                            <div>
                              <h4 className="font-bold">{entity.name}</h4>
                              <div className="text-xs text-gray-500">Type: {entity.type}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              Population: {entity.currentPopulation}/{entity.initialPopulation}
                            </div>
                            <div className={`text-xs ${
                              entity.currentPopulation === 0 ? "text-red-600" :
                              entity.currentPopulation < entity.initialPopulation / 2 ? "text-amber-600" :
                              "text-green-600"
                            }`}>
                              {entity.currentPopulation === 0 ? "Extinct" :
                               entity.currentPopulation < entity.initialPopulation / 2 ? "Struggling" :
                               "Thriving"}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <Progress 
                            value={(entity.currentPopulation / entity.initialPopulation) * 100} 
                            className="h-2 bg-gray-100" 
                            indicatorClassName={`${
                              entity.currentPopulation === 0 ? "bg-red-500" :
                              entity.currentPopulation < entity.initialPopulation / 2 ? "bg-amber-500" :
                              "bg-green-500"
                            }`} 
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="sticky top-6">
              <Ecosystem3D entities={ecosystemEntities} />
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Final Ecosystem State</h3>
                <p className="text-sm text-gray-600">
                  This visualization shows the final state of your ecosystem after the simulation.
                  Notice how the populations have changed based on your resource allocations.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EcosystemGame;
