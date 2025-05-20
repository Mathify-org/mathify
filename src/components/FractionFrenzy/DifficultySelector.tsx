
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Difficulty } from "@/types/fractionFrenzy";

type DifficultySelectorProps = {
  difficulty: Difficulty;
  onChange: (difficulty: Difficulty) => void;
};

const DifficultySelector = ({ difficulty, onChange }: DifficultySelectorProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Difficulty Level</h3>
      <p className="text-sm text-slate-600">Choose which fractions to practice with:</p>
      
      <RadioGroup 
        value={difficulty} 
        onValueChange={(value) => onChange(value as Difficulty)}
        className="grid gap-3"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="halves" id="halves" />
          <Label htmlFor="halves" className="cursor-pointer">Halves (1/2)</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="thirds" id="thirds" />
          <Label htmlFor="thirds" className="cursor-pointer">Thirds (1/3, 2/3)</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="quarters" id="quarters" />
          <Label htmlFor="quarters" className="cursor-pointer">Quarters (1/4, 2/4, 3/4)</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="mixed" id="mixed" />
          <Label htmlFor="mixed" className="cursor-pointer">Mixed (All fractions)</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default DifficultySelector;
