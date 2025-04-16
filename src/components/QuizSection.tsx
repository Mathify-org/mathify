
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X, Award, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// New situation-based questions
const questions = [
  {
    question: "A farmer notices water runoff on a sloped field after heavy rain. Which conservation method would be most effective?",
    options: [
      "Plant rows of crops up and down the slope", 
      "Plow across the slope following contour lines", 
      "Remove all vegetation to improve water flow", 
      "Create a concrete channel for water runoff"
    ],
    correct: 1,
    explanation: "Contour plowing across the slope creates natural barriers that slow water runoff and reduce erosion."
  },
  {
    question: "After logging operations in a mountainous area, what's the most important immediate action to prevent soil erosion?",
    options: [
      "Replant trees as soon as possible", 
      "Build roads for better access", 
      "Apply chemical treatments to the soil", 
      "Use heavy machinery to level the area"
    ],
    correct: 0,
    explanation: "Replanting trees quickly helps stabilize the soil with new root systems and provides cover from rain impact."
  },
  {
    question: "A community garden is being planned on a slight slope. Which design would best prevent soil erosion?",
    options: [
      "Create terraces for planting", 
      "Install drainage pipes", 
      "Remove all rocks from the soil", 
      "Plant only one type of vegetable"
    ],
    correct: 0,
    explanation: "Terraces create level platforms that reduce the slope's steepness and slow water runoff."
  },
  {
    question: "A coastal community is experiencing beach erosion. Which approach would be most sustainable?",
    options: [
      "Build a concrete seawall", 
      "Restore natural dune systems and plant beach grass", 
      "Import sand yearly to replace losses", 
      "Restrict all access to the beach"
    ],
    correct: 1,
    explanation: "Natural dune systems with beach grass provide flexible protection that can adapt to changing conditions."
  },
  {
    question: "After a wildfire in a forested area, what method would help prevent severe soil erosion until vegetation regrows?",
    options: [
      "Apply mulch to exposed soil", 
      "Dig trenches to channel water flow", 
      "Pave affected areas", 
      "Use chemical soil hardeners"
    ],
    correct: 0,
    explanation: "Mulch protects exposed soil from rain impact, slows water runoff, and provides nutrients as it decomposes."
  },
  {
    question: "A farmer wants to convert a forest area to farmland. Which approach would minimize soil erosion?",
    options: [
      "Clear-cut all trees at once", 
      "Use agroforestry techniques to integrate trees with crops", 
      "Remove all undergrowth first", 
      "Burn the area to clear vegetation quickly"
    ],
    correct: 1,
    explanation: "Agroforestry maintains tree cover while allowing farming, preserving root systems that hold soil in place."
  },
  {
    question: "A construction site is located near a stream. What should be installed before construction begins?",
    options: [
      "Drainage pipes directing runoff to the stream", 
      "Silt fences to trap sediment", 
      "Concrete channels for efficient drainage", 
      "Chemical soil treatments"
    ],
    correct: 1,
    explanation: "Silt fences filter sediment from runoff water, preventing it from entering and polluting the stream."
  },
  {
    question: "Heavy rainfall is causing erosion in a suburban yard. Which landscaping approach would best address this?",
    options: [
      "Create a rain garden with native plants", 
      "Install a concrete patio covering most of the yard", 
      "Direct all rainwater to the street drain", 
      "Remove all plants and replace with gravel"
    ],
    correct: 0,
    explanation: "Rain gardens absorb and filter rainwater, reducing runoff while providing habitat with native plants."
  },
  {
    question: "A vineyard on a hillside is experiencing soil erosion. Which method would best address this while maintaining grape production?",
    options: [
      "Plow up and down the slope", 
      "Plant cover crops between vine rows", 
      "Remove all other vegetation", 
      "Apply chemical soil sealants"
    ],
    correct: 1,
    explanation: "Cover crops between vine rows protect soil from rain impact, improve soil structure, and reduce runoff."
  },
  {
    question: "A cattle ranch is showing signs of overgrazing and soil erosion. What management practice would help restore the land?",
    options: [
      "Increase the number of cattle", 
      "Implement rotational grazing", 
      "Remove all fencing", 
      "Apply more fertilizer"
    ],
    correct: 1,
    explanation: "Rotational grazing allows vegetation to recover between grazing periods, maintaining ground cover that protects soil."
  }
];

const QuizSection = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [animateCorrect, setAnimateCorrect] = useState(false);

  // Reset animation states when moving to next question
  useEffect(() => {
    setAnswered(null);
    setShowExplanation(false);
    setAnimateCorrect(false);
  }, [currentQuestion]);

  const handleAnswer = (selectedIndex: number) => {
    setAnswered(selectedIndex);
    
    if (selectedIndex === questions[currentQuestion].correct) {
      setScore((prev) => prev + 1);
      setAnimateCorrect(true);
    }
    
    setShowExplanation(true);
  };

  const moveToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 90) return "Amazing! You're a soil conservation expert!";
    if (percentage >= 70) return "Great job! You know a lot about soil conservation.";
    if (percentage >= 50) return "Good effort! You've learned the basics of soil conservation.";
    return "Keep learning about soil conservation. Try again to improve your score!";
  };

  const getScoreColor = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 70) return "text-green-500";
    if (percentage >= 50) return "text-yellow-600";
    return "text-orange-500";
  };

  return (
    <Card className="p-6 bg-accent/20">
      {!showResult ? (
        <div className="space-y-4">
          {/* Progress bar */}
          <div className="w-full bg-gray-200 h-2 rounded overflow-hidden">
            <div 
              className="bg-blue-500 h-full transition-all duration-500 ease-out"
              style={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">
              Question {currentQuestion + 1} of {questions.length}
            </h3>
            <span className="font-medium">Score: {score}/{currentQuestion + (answered !== null ? 1 : 0)}</span>
          </div>
          
          <div className="text-lg font-medium mb-4">{questions[currentQuestion].question}</div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className={`text-lg py-8 relative ${
                  answered === null ? "hover:bg-gray-100" : 
                  index === questions[currentQuestion].correct ? "border-2 border-green-500" : 
                  answered === index && index !== questions[currentQuestion].correct ? "border-2 border-red-500" : ""
                } ${animateCorrect && index === questions[currentQuestion].correct ? "animate-pulse bg-green-100" : ""}`}
                onClick={() => answered === null && handleAnswer(index)}
                disabled={answered !== null}
              >
                {option}
                
                {/* Show check or x mark after answering */}
                {answered !== null && index === questions[currentQuestion].correct && (
                  <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
                {answered === index && index !== questions[currentQuestion].correct && (
                  <div className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1">
                    <X className="h-4 w-4 text-white" />
                  </div>
                )}
              </Button>
            ))}
          </div>

          {/* Explanation section */}
          {showExplanation && (
            <div className={`mt-4 p-4 rounded-lg ${answered === questions[currentQuestion].correct ? "bg-green-100" : "bg-amber-100"} transition-all duration-300 animate-fade-in`}>
              <p className="font-medium">
                {answered === questions[currentQuestion].correct ? "Correct!" : "Not quite right."}
              </p>
              <p className="mt-1">{questions[currentQuestion].explanation}</p>
              <Button 
                className="mt-3 flex items-center gap-2" 
                onClick={moveToNextQuestion}
              >
                {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"} <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center space-y-6 py-8">
          <div className="flex justify-center">
            <div className="relative inline-block">
              <Award className={`h-24 w-24 ${getScoreColor()} animate-bounce`} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-white">{score}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-3xl font-bold">
              Quiz Complete!
            </h3>
            <p className="text-xl">
              You got <span className="font-bold">{score}</span> out of <span className="font-bold">{questions.length}</span> correct!
            </p>
            <p className={`text-lg ${getScoreColor()}`}>
              {getScoreMessage()}
            </p>
            
            {/* Score progress bar */}
            <div className="w-full max-w-md mx-auto mt-4">
              <Progress value={(score / questions.length) * 100} className="h-4" />
            </div>
          </div>

          <Button
            size="lg"
            onClick={() => {
              setCurrentQuestion(0);
              setScore(0);
              setShowResult(false);
              setAnswered(null);
            }}
            className="mt-6"
          >
            Try Again
          </Button>
        </div>
      )}
    </Card>
  );
};

export default QuizSection;
