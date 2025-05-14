
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SortingChallengeProps {
  challengeId: string;
  onSuccess: () => void;
}

interface Shape {
  id: string;
  shape: string;
  color: string;
  sortKey: string;
}

interface Category {
  id: string;
  name: string;
  key: string;
  color: string;
}

const SortingChallenge: React.FC<SortingChallengeProps> = ({ challengeId, onSuccess }) => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sortedShapes, setSortedShapes] = useState<Record<string, string[]>>({});
  const [draggingShape, setDraggingShape] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState(0);
  
  useEffect(() => {
    // Load challenge data based on challengeId
    const data = getChallenge(challengeId);
    setShapes(data.shapes);
    setCategories(data.categories);
    
    // Initialize sorted shapes object
    const initialSorted: Record<string, string[]> = {};
    data.categories.forEach(cat => {
      initialSorted[cat.id] = [];
    });
    setSortedShapes(initialSorted);
  }, [challengeId]);
  
  const handleDragStart = (shapeId: string) => {
    setDraggingShape(shapeId);
  };
  
  const handleDrop = (categoryId: string) => {
    if (draggingShape) {
      // Add shape to category
      setSortedShapes(prev => {
        // Remove from any previous category
        const newSorted = { ...prev };
        Object.keys(newSorted).forEach(catId => {
          newSorted[catId] = newSorted[catId].filter(id => id !== draggingShape);
        });
        
        // Add to new category
        newSorted[categoryId] = [...newSorted[categoryId], draggingShape];
        return newSorted;
      });
      
      setDraggingShape(null);
    }
  };
  
  const handleCheck = () => {
    setAttempts(prev => prev + 1);
    
    const allShapesSorted = shapes.every(shape => {
      return Object.values(sortedShapes).flat().includes(shape.id);
    });
    
    if (!allShapesSorted) {
      toast.error("Please sort all shapes before checking");
      return;
    }
    
    // Check if shapes are sorted correctly
    let correct = true;
    
    Object.entries(sortedShapes).forEach(([categoryId, shapeIds]) => {
      const category = categories.find(c => c.id === categoryId);
      if (!category) return;
      
      shapeIds.forEach(shapeId => {
        const shape = shapes.find(s => s.id === shapeId);
        if (!shape) return;
        
        if (shape.sortKey !== category.key) {
          correct = false;
        }
      });
    });
    
    setIsCorrect(correct);
    
    if (correct) {
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }
  };
  
  const handleReset = () => {
    // Reset sorted shapes
    const resetSorted: Record<string, string[]> = {};
    categories.forEach(cat => {
      resetSorted[cat.id] = [];
    });
    setSortedShapes(resetSorted);
    setIsCorrect(null);
  };
  
  const getUnsortedShapes = () => {
    const sortedIds = Object.values(sortedShapes).flat();
    return shapes.filter(shape => !sortedIds.includes(shape.id));
  };
  
  const renderShape = (shape: Shape, isDraggable: boolean = true) => {
    let content;
    
    switch(shape.shape) {
      case "square":
        content = <div className={`w-12 h-12 ${shape.color}`}></div>;
        break;
      case "circle":
        content = <div className={`w-12 h-12 rounded-full ${shape.color}`}></div>;
        break;
      case "triangle":
        content = (
          <div className={`w-0 h-0 border-l-[24px] border-r-[24px] border-b-[42px] 
            border-l-transparent border-r-transparent ${shape.color.replace('bg-', 'border-b-')}`}>
          </div>
        );
        break;
      case "rectangle":
        content = <div className={`w-16 h-10 ${shape.color}`}></div>;
        break;
      case "hexagon":
        content = (
          <div className={`w-12 h-10 ${shape.color} relative`} 
               style={{ clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)" }}>
          </div>
        );
        break;
      default:
        content = <div className={`w-12 h-12 ${shape.color}`}></div>;
    }
    
    return (
      <div
        key={shape.id}
        draggable={isDraggable}
        onDragStart={() => isDraggable && handleDragStart(shape.id)}
        className={cn(
          "flex items-center justify-center p-2 m-2 bg-white rounded-lg shadow-md cursor-grab",
          isDraggable ? "hover:shadow-lg" : "opacity-70"
        )}
      >
        {content}
      </div>
    );
  };
  
  return (
    <div className="p-4">
      <div className="mb-8 text-center">
        <h3 className="text-lg font-bold mb-2">{getChallengeTitle(challengeId)}</h3>
        <p className="text-slate-600">{getChallengeInstructions(challengeId)}</p>
      </div>
      
      {/* Unsorted shapes section */}
      <div 
        className={cn(
          "p-4 mb-6 bg-slate-50 rounded-xl flex flex-wrap justify-center items-center min-h-[100px]",
          isCorrect !== null && (isCorrect ? "bg-green-50" : "bg-red-50"),
          draggingShape ? "border-2 border-dashed border-blue-300" : ""
        )}
      >
        {getUnsortedShapes().map(shape => renderShape(shape))}
        
        {getUnsortedShapes().length === 0 && (
          <p className="text-slate-500 italic">All shapes sorted!</p>
        )}
      </div>
      
      {/* Categories section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {categories.map(category => (
          <div 
            key={category.id}
            className={cn(
              "p-4 rounded-xl min-h-[120px]",
              category.color.replace('bg-', 'bg-').replace('500', '100'),
              draggingShape ? "border-2 border-dashed border-blue-300" : ""
            )}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(category.id)}
          >
            <h4 className="font-bold mb-2 text-center">{category.name}</h4>
            <div className="flex flex-wrap justify-center">
              {sortedShapes[category.id]?.map(shapeId => {
                const shape = shapes.find(s => s.id === shapeId);
                return shape ? renderShape(shape, false) : null;
              })}
              
              {sortedShapes[category.id]?.length === 0 && (
                <p className="text-slate-500 italic text-center w-full">Drag shapes here</p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Feedback area */}
      {isCorrect !== null && (
        <div className={cn(
          "p-3 rounded-lg mb-4 flex items-center",
          isCorrect ? "bg-green-100" : "bg-red-100"
        )}>
          {isCorrect ? (
            <CheckCircle2 className="text-green-600 mr-2" size={20} />
          ) : (
            <AlertCircle className="text-red-600 mr-2" size={20} />
          )}
          <p className={isCorrect ? "text-green-800" : "text-red-800"}>
            {isCorrect 
              ? "Great job! Your sorting is correct." 
              : "Not quite right. Try again!"}
          </p>
        </div>
      )}
      
      {/* Actions */}
      <div className="flex justify-center gap-3">
        <Button 
          variant="outline"
          onClick={handleReset}
          className="border-slate-300"
        >
          Reset
        </Button>
        <Button 
          onClick={handleCheck}
          disabled={isCorrect === true}
          className={cn(
            "text-white",
            isCorrect === true
              ? "bg-green-500 hover:bg-green-600"
              : "bg-purple-600 hover:bg-purple-700"
          )}
        >
          {isCorrect === true ? "Correct!" : "Check Answer"}
        </Button>
      </div>
    </div>
  );
};

// Challenge data and helper functions
const getChallengeTitle = (challengeId: string): string => {
  const titles: Record<string, string> = {
    "poly-1": "Polygon Sorting",
    "poly-3": "Quadrilateral Types",
    "poly-4": "Regular vs Irregular Shapes",
  };
  return titles[challengeId] || "Sort the Shapes";
};

const getChallengeInstructions = (challengeId: string): string => {
  const instructions: Record<string, string> = {
    "poly-1": "Drag each shape to the correct category: polygon or not a polygon.",
    "poly-3": "Sort the shapes into squares or other quadrilaterals.",
    "poly-4": "Determine which shapes are regular (all sides and angles equal) and which are irregular.",
  };
  return instructions[challengeId] || "Drag shapes into their correct categories.";
};

// Get challenge data based on ID
const getChallenge = (challengeId: string) => {
  // Default challenge
  let shapes: Shape[] = [];
  let categories: Category[] = [];
  
  switch(challengeId) {
    case "poly-1":
      shapes = [
        { id: "s1", shape: "square", color: "bg-blue-500", sortKey: "polygon" },
        { id: "s2", shape: "circle", color: "bg-red-500", sortKey: "not-polygon" },
        { id: "s3", shape: "triangle", color: "bg-green-500", sortKey: "polygon" },
        { id: "s4", shape: "hexagon", color: "bg-purple-500", sortKey: "polygon" },
        { id: "s5", shape: "circle", color: "bg-yellow-500", sortKey: "not-polygon" },
        { id: "s6", shape: "rectangle", color: "bg-pink-500", sortKey: "polygon" },
      ];
      categories = [
        { id: "c1", name: "Polygons", key: "polygon", color: "bg-blue-500" },
        { id: "c2", name: "Not Polygons", key: "not-polygon", color: "bg-red-500" },
      ];
      break;
      
    case "poly-3":
      shapes = [
        { id: "q1", shape: "square", color: "bg-blue-500", sortKey: "square" },
        { id: "q2", shape: "rectangle", color: "bg-green-500", sortKey: "other-quad" },
        { id: "q3", shape: "square", color: "bg-purple-500", sortKey: "square" },
        { id: "q4", shape: "rectangle", color: "bg-pink-500", sortKey: "other-quad" },
        { id: "q5", shape: "square", color: "bg-yellow-500", sortKey: "square" },
      ];
      categories = [
        { id: "c1", name: "Squares", key: "square", color: "bg-blue-500" },
        { id: "c2", name: "Other Quadrilaterals", key: "other-quad", color: "bg-green-500" },
      ];
      break;
      
    case "poly-4":
      shapes = [
        { id: "r1", shape: "square", color: "bg-blue-500", sortKey: "regular" },
        { id: "r2", shape: "rectangle", color: "bg-green-500", sortKey: "irregular" },
        { id: "r3", shape: "hexagon", color: "bg-purple-500", sortKey: "regular" },
        { id: "r4", shape: "triangle", color: "bg-yellow-500", sortKey: "regular" },
        { id: "r5", shape: "rectangle", color: "bg-pink-500", sortKey: "irregular" },
      ];
      categories = [
        { id: "c1", name: "Regular Shapes", key: "regular", color: "bg-purple-500" },
        { id: "c2", name: "Irregular Shapes", key: "irregular", color: "bg-orange-500" },
      ];
      break;
      
    default:
      // Default sorting challenge
      shapes = [
        { id: "d1", shape: "square", color: "bg-blue-500", sortKey: "polygon" },
        { id: "d2", shape: "circle", color: "bg-red-500", sortKey: "not-polygon" },
        { id: "d3", shape: "triangle", color: "bg-green-500", sortKey: "polygon" },
      ];
      categories = [
        { id: "c1", name: "Category 1", key: "polygon", color: "bg-blue-500" },
        { id: "c2", name: "Category 2", key: "not-polygon", color: "bg-red-500" },
      ];
  }
  
  return { shapes, categories };
};

export default SortingChallenge;
