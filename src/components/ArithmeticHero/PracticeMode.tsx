
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight, Settings, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { gameService, levels } from '@/services/arithmeticHero/gameService';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { OperationType } from '@/types/arithmeticHero';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface PracticeModeProps {
  level: number;
  onExit: () => void;
}

const PracticeMode: React.FC<PracticeModeProps> = ({ level, onExit }) => {
  const [firstNumber, setFirstNumber] = useState(0);
  const [secondNumber, setSecondNumber] = useState(0);
  const [operation, setOperation] = useState<OperationType>("+");
  const [userAnswer, setUserAnswer] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedTab, setSelectedTab] = useState("practice");
  const [useMultipleChoice, setUseMultipleChoice] = useState(false);
  const [options, setOptions] = useState<number[]>([]);
  
  const levelConfig = levels.find(l => l.id === level) || levels[0];
  const availableOperations = levelConfig.operations;
  
  // Generate a new problem
  const generateProblem = () => {
    let first = gameService.generateNumberWithDigits(
      levelConfig.minDigits[0],
      levelConfig.maxDigits[0]
    );
    
    let second = gameService.generateNumberWithDigits(
      levelConfig.minDigits[1], 
      levelConfig.maxDigits[1]
    );
    
    // Pick a random operation from available ones for this level
    const newOperation = availableOperations[
      Math.floor(Math.random() * availableOperations.length)
    ];
    
    // Handle special cases for different operations
    if (newOperation === "-" && !levelConfig.allowNegative) {
      // Ensure first number is >= second number to avoid negative results
      if (first < second) {
        [first, second] = [second, first];
      }
    } else if (newOperation === "÷") {
      // Make sure division results in a whole number
      second = Math.max(2, second % 12 || 2); // Ensure non-zero divisor
      first = second * Math.floor(Math.random() * 10 + 1); // Make multiple of divisor
    }
    
    setFirstNumber(first);
    setSecondNumber(second);
    setOperation(newOperation);
    
    // Calculate the correct answer
    const answer = gameService.calculateResult(first, second, newOperation);
    setCorrectAnswer(answer);
    
    // Generate multiple choice options if needed
    if (useMultipleChoice) {
      setOptions(gameService.generateOptions(answer));
    }
    
    // Reset the user's answer and feedback
    setUserAnswer("");
    setFeedback(null);
  };
  
  // Check the user's answer
  const checkAnswer = () => {
    const userNumAnswer = parseInt(userAnswer);
    
    if (userNumAnswer === correctAnswer) {
      setFeedback("correct");
      setCorrectCount(prev => prev + 1);
      setStreak(prev => prev + 1);
      
      // Update player stats
      gameService.updateTotalCorrectAnswers(1);
      gameService.updateLongestStreak(streak + 1);
      
      // Generate a new problem after a short delay
      setTimeout(generateProblem, 1000);
    } else {
      setFeedback("incorrect");
      setIncorrectCount(prev => prev + 1);
      setStreak(0);
    }
  };
  
  // Handle multiple choice selection
  const handleOptionSelect = (option: number) => {
    setUserAnswer(option.toString());
    
    if (option === correctAnswer) {
      setFeedback("correct");
      setCorrectCount(prev => prev + 1);
      setStreak(prev => prev + 1);
      
      // Update player stats
      gameService.updateTotalCorrectAnswers(1);
      gameService.updateLongestStreak(streak + 1);
      
      // Generate a new problem after a short delay
      setTimeout(generateProblem, 1000);
    } else {
      setFeedback("incorrect");
      setIncorrectCount(prev => prev + 1);
      setStreak(0);
    }
  };
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    
    // Reset stats when switching to practice tab
    if (value === "practice") {
      setCorrectCount(0);
      setIncorrectCount(0);
      setStreak(0);
      generateProblem();
    }
  };
  
  // Get operation symbol for display
  const getOperationSymbol = (op: OperationType) => {
    return op;
  };
  
  // Initialize on component mount
  useEffect(() => {
    generateProblem();
  }, [level, useMultipleChoice]);
  
  return (
    <div className="container max-w-2xl mx-auto p-4">
      <Tabs value={selectedTab} onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="practice">Practice Mode</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="practice" className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-sm border-none shadow-xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <Badge variant="outline" className="bg-white/20 text-white">
                  Level {level} Practice
                </Badge>
                
                <div className="text-sm">
                  Streak: <span className="font-bold text-yellow-300">{streak}</span>
                </div>
              </div>
              
              <motion.div 
                className="text-center p-6 text-4xl md:text-5xl font-bold"
                key={`${firstNumber}-${operation}-${secondNumber}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <span>{firstNumber}</span>
                <span className="mx-4">{getOperationSymbol(operation)}</span>
                <span>{secondNumber}</span>
                <span className="mx-4">=</span>
                <span className="text-white">?</span>
              </motion.div>
              
              {!useMultipleChoice ? (
                <div className="mt-6">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="number" 
                      value={userAnswer}
                      onChange={e => setUserAnswer(e.target.value)}
                      className="w-full p-4 text-2xl text-center rounded-lg bg-white/20 backdrop-blur-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      placeholder="Enter your answer"
                    />
                    
                    <Button 
                      className="p-4 h-full aspect-square"
                      onClick={checkAnswer}
                      disabled={!userAnswer}
                    >
                      <ArrowRight className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 mt-6">
                  {options.map((option, index) => (
                    <Button 
                      key={index}
                      className={`p-4 text-xl ${
                        feedback && option === parseInt(userAnswer)
                          ? option === correctAnswer
                            ? "bg-green-600"
                            : "bg-red-600"
                          : ""
                      }`}
                      onClick={() => handleOptionSelect(option)}
                      disabled={feedback !== null}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              )}
              
              {feedback && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4"
                >
                  <Alert className={`${
                    feedback === "correct" 
                      ? "bg-green-600/20 border-green-600/50" 
                      : "bg-red-600/20 border-red-600/50"
                  }`}>
                    <AlertDescription className="flex items-center">
                      {feedback === "correct" ? (
                        <>
                          <Check className="mr-2 text-green-500" />
                          Correct! Great job.
                        </>
                      ) : (
                        <>
                          <X className="mr-2 text-red-500" />
                          Not quite. The answer is {correctAnswer}. Try again!
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={generateProblem}
                            className="ml-auto"
                          >
                            Next Problem
                          </Button>
                        </>
                      )}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-sm border-none shadow-xl">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-2 rounded-lg bg-white/10">
                  <div className="text-sm opacity-80">Correct</div>
                  <div className="font-bold text-xl text-green-300">{correctCount}</div>
                </div>
                
                <div className="text-center p-2 rounded-lg bg-white/10">
                  <div className="text-sm opacity-80">Incorrect</div>
                  <div className="font-bold text-xl text-red-300">{incorrectCount}</div>
                </div>
                
                <div className="text-center p-2 rounded-lg bg-white/10 col-span-2">
                  <div className="text-sm opacity-80">Accuracy</div>
                  <div className="font-bold text-xl">
                    {correctCount + incorrectCount > 0
                      ? Math.round((correctCount / (correctCount + incorrectCount)) * 100)
                      : 0}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex space-x-4">
            <Button 
              className="flex-1"
              variant="outline"
              onClick={generateProblem}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              New Problem
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card className="bg-white/10 backdrop-blur-sm border-none shadow-xl">
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Answer Method</h3>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="multiple-choice" 
                    checked={useMultipleChoice}
                    onCheckedChange={setUseMultipleChoice}
                  />
                  <Label htmlFor="multiple-choice">
                    Use multiple choice
                  </Label>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Available Operations</h3>
                <div className="flex flex-wrap gap-2">
                  {availableOperations.map((op, index) => (
                    <Badge key={index} variant="secondary" className="text-lg px-3 py-1">
                      {op}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm mt-2 opacity-80">
                  Operations available at this level. Unlock more by progressing in Arcade mode.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6">
        <Button 
          variant="outline" 
          className="bg-white/20"
          onClick={onExit}
        >
          Back to Menu
        </Button>
      </div>
    </div>
  );
};

export default PracticeMode;
