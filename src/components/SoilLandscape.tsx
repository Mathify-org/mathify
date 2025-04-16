
import { useState } from "react";
import { Cloud, Sun, Trees, Droplet, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";

const SoilLandscape = () => {
  const [weather, setWeather] = useState<"sunny" | "rainy" | "windy">("sunny");
  const [plants, setPlants] = useState<number>(0);
  const [erosion, setErosion] = useState<number>(50);
  const [mulch, setMulch] = useState<boolean>(false);
  const [goal] = useState<number>(25); // Target erosion level

  const addPlant = () => {
    setPlants((prev) => Math.min(prev + 1, 5));
    updateErosion();
  };

  const toggleWeather = () => {
    setWeather((prev) => {
      if (prev === "sunny") return "rainy";
      if (prev === "rainy") return "windy";
      return "sunny";
    });
    updateErosion();
  };

  const toggleMulch = () => {
    setMulch(prev => !prev);
    updateErosion();
  };

  const updateErosion = () => {
    let baseErosion = erosion;
    
    // Weather effects
    if (weather === "rainy") {
      baseErosion += (plants < 3 ? 20 : 5);
    }
    if (weather === "windy") {
      baseErosion += (plants < 2 ? 15 : 3);
    }
    
    // Conservation effects
    if (plants > 0) {
      baseErosion -= plants * 5;
    }
    if (mulch) {
      baseErosion -= 15;
    }
    
    setErosion(Math.max(0, Math.min(100, baseErosion)));
  };

  const getStatusMessage = () => {
    if (erosion <= goal) {
      return "Great job! You've achieved sustainable soil conservation!";
    }
    return "Keep working to reduce erosion! Try different combinations of trees and mulch.";
  };

  return (
    <div className="relative h-96 bg-gradient-to-b from-water to-soil rounded-lg overflow-hidden p-4">
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="icon"
          className="bg-sun hover:bg-sun/80"
          onClick={toggleWeather}
        >
          {weather === "sunny" ? (
            <Sun className="h-8 w-8 text-orange-500 animate-spin-slow" />
          ) : weather === "rainy" ? (
            <Cloud className="h-8 w-8 text-gray-500">
              <Droplet className="h-4 w-4 text-water animate-bounce" />
            </Cloud>
          ) : (
            <Wind className="h-8 w-8 text-gray-500 animate-pulse" />
          )}
        </Button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1/2 flex items-end justify-around">
        {Array.from({ length: plants }).map((_, i) => (
          <Trees
            key={i}
            className="h-16 w-16 text-plant transform transition-transform hover:scale-110"
          />
        ))}
        {mulch && (
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-brown-300/50" />
        )}
      </div>

      <div className="absolute bottom-4 left-4 space-y-2">
        <Button
          variant="secondary"
          onClick={addPlant}
          disabled={plants >= 5}
          className="bg-plant text-white hover:bg-plant/80"
        >
          Plant a Tree
        </Button>
        <Button
          variant="secondary"
          onClick={toggleMulch}
          className={`${mulch ? 'bg-brown-500' : 'bg-brown-300'} text-white hover:bg-brown-400`}
        >
          {mulch ? 'Remove Mulch' : 'Add Mulch'}
        </Button>
      </div>

      <div className="absolute top-4 left-4 space-y-2">
        <div className="bg-white/80 rounded p-2">
          <div>Erosion Level: {erosion}%</div>
          <div>Goal: {goal}%</div>
        </div>
        <div className="bg-white/80 rounded p-2">
          {getStatusMessage()}
        </div>
      </div>
    </div>
  );
};

export default SoilLandscape;
