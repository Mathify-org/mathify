
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Difficulty } from "@/types/fractionFrenzy";

type DifficultySelectorProps = {
  selectedDifficulty: Difficulty;
  onDifficultySelect: (difficulty: Difficulty) => void;
};

const DifficultySelector = ({ selectedDifficulty, onDifficultySelect }: DifficultySelectorProps) => {
  return (
    <Card className="glass-morphism border-white/20">
      <CardHeader>
        <CardTitle className="text-xl">Difficulty Level</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-600">Choose which fractions to practice with:</p>
        
        <RadioGroup 
          value={selectedDifficulty} 
          onValueChange={(value) => onDifficultySelect(value as Difficulty)}
          className="grid gap-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="easy" id="easy" />
            <Label htmlFor="easy" className="cursor-pointer">Easy (Simple problems)</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium" id="medium" />
            <Label htmlFor="medium" className="cursor-pointer">Medium (Moderate challenge)</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="hard" id="hard" />
            <Label htmlFor="hard" className="cursor-pointer">Hard (Advanced problems)</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mixed" id="mixed" />
            <Label htmlFor="mixed" className="cursor-pointer">Mixed (All difficulties)</Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default DifficultySelector;
