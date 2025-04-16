
import { useState } from "react";
import { Cloud, Sun, Trees, Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";

const SoilLandscape = () => {
  const [weather, setWeather] = useState<"sunny" | "rainy">("sunny");
  const [plants, setPlants] = useState<number>(0);
  const [erosion, setErosion] = useState<number>(0);

  const addPlant = () => {
    setPlants((prev) => Math.min(prev + 1, 5));
    setErosion((prev) => Math.max(prev - 10, 0));
  };

  const toggleWeather = () => {
    setWeather((prev) => (prev === "sunny" ? "rainy" : "sunny"));
    if (weather === "sunny") {
      setErosion((prev) => Math.min(prev + (plants < 3 ? 20 : 5), 100));
    }
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
          ) : (
            <Cloud className="h-8 w-8 text-gray-500">
              <Droplet className="h-4 w-4 text-water animate-bounce" />
            </Cloud>
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
      </div>

      <div className="absolute bottom-4 left-4">
        <Button
          variant="secondary"
          onClick={addPlant}
          disabled={plants >= 5}
          className="bg-plant text-white hover:bg-plant/80"
        >
          Plant a Tree
        </Button>
      </div>

      <div className="absolute top-4 left-4 bg-white/80 rounded p-2">
        Erosion Level: {erosion}%
      </div>
    </div>
  );
};

export default SoilLandscape;
