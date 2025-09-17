import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Ruler, RotateCw, CheckCircle, XCircle, Lightbulb, Trophy, Target, Zap, Star, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

type ConversionCategory = {
  name: string;
  icon: React.ReactNode;
  conversions: {
    from: string;
    to: string;
    factor: number;
    description: string;
    offset?: number;
  }[];
};

const conversionCategories: ConversionCategory[] = [
  {
    name: "Length",
    icon: <Ruler className="h-5 w-5" />,
    conversions: [
      { from: "meters", to: "feet", factor: 3.28084, description: "1 meter = 3.28 feet" },
      { from: "kilometers", to: "miles", factor: 0.621371, description: "1 km = 0.62 miles" },
      { from: "inches", to: "centimeters", factor: 2.54, description: "1 inch = 2.54 cm" },
      { from: "yards", to: "meters", factor: 0.9144, description: "1 yard = 0.91 meters" }
    ]
  },
  {
    name: "Weight",
    icon: <span className="text-lg">⚖️</span>,
    conversions: [
      { from: "kilograms", to: "pounds", factor: 2.20462, description: "1 kg = 2.20 lbs" },
      { from: "grams", to: "ounces", factor: 0.035274, description: "1 g = 0.035 oz" },
      { from: "tons", to: "kilograms", factor: 1000, description: "1 ton = 1000 kg" },
      { from: "pounds", to: "kilograms", factor: 0.453592, description: "1 lb = 0.45 kg" }
    ]
  },
  {
    name: "Temperature",
    icon: <span className="text-lg">🌡️</span>,
    conversions: [
      { from: "Celsius", to: "Fahrenheit", factor: 1.8, description: "°F = (°C × 1.8) + 32", offset: 32 },
      { from: "Fahrenheit", to: "Celsius", factor: 0.5556, description: "°C = (°F - 32) × 0.56", offset: -32 },
      { from: "Celsius", to: "Kelvin", factor: 1, description: "K = °C + 273.15", offset: 273.15 },
      { from: "Kelvin", to: "Celsius", factor: 1, description: "°C = K - 273.15", offset: -273.15 }
    ]
  }
];

const realWorldExamples = [
  {
    title: "Cooking & Baking",
    examples: [
      "Recipe calls for 250ml but you have cups? That's about 1 cup!",
      "Oven temperature 180°C = 356°F for perfect cookies",
      "500g flour = about 1.1 pounds for bread making"
    ],
    icon: "👨‍🍳"
  },
  {
    title: "Travel & Geography",
    examples: [
      "Speed limit 100 km/h = 62 mph on highways",
      "Mount Everest: 8,848m = 29,029 feet tall",
      "Marathon distance: 42.2km = 26.2 miles"
    ],
    icon: "✈️"
  },
  {
    title: "Sports & Fitness",
    examples: [
      "Olympic pool: 50m = 164 feet long",
      "Basketball player 2m tall = 6.6 feet",
      "Running 5K = 3.1 miles distance"
    ],
    icon: "🏃‍♂️"
  }
];

// Metric conversion data for the interactive game
const metricGameData = {
  length: {
    name: "Length",
    icon: "📏",
    color: "from-blue-500 to-cyan-500",
    units: [
      { name: "mm", fullName: "millimeters", factor: 1, visual: "•", color: "bg-blue-200" },
      { name: "cm", fullName: "centimeters", factor: 10, visual: "▬", color: "bg-blue-300" },
      { name: "m", fullName: "meters", factor: 1000, visual: "█", color: "bg-blue-400" },
      { name: "km", fullName: "kilometers", factor: 1000000, visual: "■", color: "bg-blue-500" }
    ]
  },
  weight: {
    name: "Weight", 
    icon: "⚖️",
    color: "from-green-500 to-emerald-500",
    units: [
      { name: "mg", fullName: "milligrams", factor: 1, visual: "•", color: "bg-green-200" },
      { name: "g", fullName: "grams", factor: 1000, visual: "▬", color: "bg-green-300" },
      { name: "kg", fullName: "kilograms", factor: 1000000, visual: "█", color: "bg-green-400" }
    ]
  },
  capacity: {
    name: "Capacity",
    icon: "🥤", 
    color: "from-purple-500 to-violet-500",
    units: [
      { name: "ml", fullName: "milliliters", factor: 1, visual: "💧", color: "bg-purple-200" },
      { name: "l", fullName: "liters", factor: 1000, visual: "🧴", color: "bg-purple-400" }
    ]
  }
};

const UnitConverter = () => {
  const [mode, setMode] = useState<'learn' | 'convert' | 'quiz' | 'metric-game'>('learn');
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState<string>('');
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  
  // Metric game state
  const [gameCategory, setGameCategory] = useState<keyof typeof metricGameData>('length');
  const [gameLevel, setGameLevel] = useState(1);
  const [gameScore, setGameScore] = useState(0);
  const [currentChallenge, setCurrentChallenge] = useState<any>(null);
  const [gameInput, setGameInput] = useState('');
  const [gameStreaks, setGameStreaks] = useState(0);
  const [showGameResult, setShowGameResult] = useState(false);
  const [draggedValue, setDraggedValue] = useState<number | null>(null);
  const [dropZoneActive, setDropZoneActive] = useState<string | null>(null);
  
  const { toast } = useToast();

  const generateQuizQuestion = () => {
    const category = conversionCategories[Math.floor(Math.random() * conversionCategories.length)];
    const conversion = category.conversions[Math.floor(Math.random() * category.conversions.length)];
    const value = Math.floor(Math.random() * 100) + 1;
    
    return {
      question: `Convert ${value} ${conversion.from} to ${conversion.to}`,
      answer: conversion.offset 
        ? value * conversion.factor + conversion.offset
        : value * conversion.factor,
      category: category.name,
      value,
      conversion
    };
  };

  const [quizQuestion, setQuizQuestion] = useState(generateQuizQuestion());

  const convert = () => {
    const category = conversionCategories[selectedCategory];
    const conversion = category.conversions[0]; // Using first conversion for simplicity
    const input = parseFloat(inputValue);
    
    if (isNaN(input)) {
      setResult('Please enter a valid number');
      return;
    }

    const converted = conversion.offset 
      ? input * conversion.factor + conversion.offset
      : input * conversion.factor;
    
    setResult(`${input} ${conversion.from} = ${converted.toFixed(2)} ${conversion.to}`);
  };

  const checkQuizAnswer = () => {
    const userAnswer = parseFloat(quizAnswer);
    const correctAnswer = quizQuestion.answer;
    const tolerance = Math.abs(correctAnswer * 0.05); // 5% tolerance
    
    const isCorrect = Math.abs(userAnswer - correctAnswer) <= tolerance;
    
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      toast({
        title: "Correct! 🎉",
        description: `The answer is ${correctAnswer.toFixed(2)}`,
      });
    } else {
      toast({
        title: "Not quite right 😊",
        description: `The correct answer is ${correctAnswer.toFixed(2)}`,
        variant: "destructive"
      });
    }
    
    setShowQuizResult(true);
    setTimeout(() => {
      setShowQuizResult(false);
      setQuizAnswer('');
      setCurrentQuiz(prev => prev + 1);
      setQuizQuestion(generateQuizQuestion());
    }, 2000);
  };

  // Generate metric game challenge
  const generateMetricChallenge = () => {
    const category = metricGameData[gameCategory];
    const fromUnit = category.units[Math.floor(Math.random() * category.units.length)];
    const toUnit = category.units[Math.floor(Math.random() * category.units.length)];
    
    if (fromUnit.name === toUnit.name) {
      return generateMetricChallenge(); // Regenerate if same unit
    }
    
    const baseValue = Math.floor(Math.random() * 100) + 1;
    const correctAnswer = (baseValue * fromUnit.factor) / toUnit.factor;
    
    return {
      question: `Convert ${baseValue} ${fromUnit.name} to ${toUnit.name}`,
      fromValue: baseValue,
      fromUnit,
      toUnit,
      correctAnswer,
      category: category.name
    };
  };

  // Initialize first challenge
  useEffect(() => {
    if (mode === 'metric-game' && !currentChallenge) {
      setCurrentChallenge(generateMetricChallenge());
    }
  }, [mode, gameCategory]);

  // Check metric game answer
  const checkMetricAnswer = () => {
    if (!currentChallenge) return;
    
    const userAnswer = parseFloat(gameInput);
    const tolerance = Math.abs(currentChallenge.correctAnswer * 0.02); // 2% tolerance
    const isCorrect = Math.abs(userAnswer - currentChallenge.correctAnswer) <= tolerance;
    
    if (isCorrect) {
      const points = Math.max(100 - (gameLevel * 5), 50);
      setGameScore(prev => prev + points);
      setGameStreaks(prev => prev + 1);
      
      toast({
        title: "🎉 Perfect!",
        description: `+${points} points! Streak: ${gameStreaks + 1}`,
      });
      
      // Level up every 5 correct answers
      if ((gameScore + points) > gameLevel * 500) {
        setGameLevel(prev => prev + 1);
        toast({
          title: "🚀 Level Up!",
          description: `Welcome to Level ${gameLevel + 1}!`,
        });
      }
    } else {
      setGameStreaks(0);
      toast({
        title: "🎯 Close!",
        description: `Answer: ${currentChallenge.correctAnswer.toFixed(2)} ${currentChallenge.toUnit.name}`,
        variant: "destructive"
      });
    }
    
    setShowGameResult(true);
    setTimeout(() => {
      setShowGameResult(false);
      setGameInput('');
      setCurrentChallenge(generateMetricChallenge());
    }, 1500);
  };

  // Handle drag and drop for visual conversions
  const handleDragStart = (value: number) => {
    setDraggedValue(value);
  };

  const handleDragOver = (e: React.DragEvent, unitName: string) => {
    e.preventDefault();
    setDropZoneActive(unitName);
  };

  const handleDragLeave = () => {
    setDropZoneActive(null);
  };

  const handleDrop = (e: React.DragEvent, targetUnit: any) => {
    e.preventDefault();
    setDropZoneActive(null);
    
    if (draggedValue && currentChallenge) {
      const convertedValue = (draggedValue * currentChallenge.fromUnit.factor) / targetUnit.factor;
      setGameInput(convertedValue.toString());
    }
    setDraggedValue(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="hover:bg-white/20 p-2 rounded-lg transition-colors">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold flex items-center gap-3">
                  <Ruler className="h-8 w-8" />
                  Unit Converter
                </h1>
                <p className="text-orange-100 text-lg">Master real-world unit conversions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Mode Selection */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-2 shadow-lg border-2 border-orange-200">
            {['learn', 'convert', 'quiz', 'metric-game'].map((m) => (
              <Button
                key={m}
                variant={mode === m ? "default" : "ghost"}
                onClick={() => setMode(m as any)}
                className={`mx-1 capitalize ${
                  mode === m 
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white' 
                    : 'hover:bg-orange-50'
                }`}
              >
                {m === 'learn' && <Lightbulb className="h-4 w-4 mr-2" />}
                {m === 'convert' && <RotateCw className="h-4 w-4 mr-2" />}
                {m === 'quiz' && <Trophy className="h-4 w-4 mr-2" />}
                {m === 'metric-game' && <Target className="h-4 w-4 mr-2" />}
                {m === 'metric-game' ? 'Metric Challenge' : m}
              </Button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {mode === 'learn' && (
            <motion.div
              key="learn"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Real World Examples */}
              <div className="grid md:grid-cols-3 gap-6">
                {realWorldExamples.map((example, index) => (
                  <Card key={index} className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-orange-400 to-amber-400 text-white rounded-t-lg">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <span className="text-2xl">{example.icon}</span>
                        {example.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <ul className="space-y-3">
                        {example.examples.map((ex, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{ex}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Conversion Categories */}
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl">Common Conversions</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    {conversionCategories.map((category, index) => (
                      <div key={index} className="space-y-4">
                        <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800">
                          {category.icon}
                          {category.name}
                        </h3>
                        <div className="space-y-2">
                          {category.conversions.map((conv, i) => (
                            <div key={i} className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-lg">
                              <div className="font-medium text-gray-800">{conv.description}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {mode === 'convert' && (
            <motion.div
              key="convert"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <RotateCw className="h-6 w-6" />
                    Interactive Converter
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <Label className="text-lg font-semibold mb-4 block">Select Category:</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {conversionCategories.map((category, index) => (
                        <Button
                          key={index}
                          variant={selectedCategory === index ? "default" : "outline"}
                          onClick={() => setSelectedCategory(index)}
                          className={`p-4 h-auto ${
                            selectedCategory === index 
                              ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white' 
                              : 'hover:bg-green-50'
                          }`}
                        >
                          <div className="text-center">
                            <div className="mb-1">{category.icon}</div>
                            <div className="text-sm">{category.name}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="input" className="text-lg font-semibold mb-2 block">
                      Enter Value:
                    </Label>
                    <Input
                      id="input"
                      type="number"
                      placeholder="Enter number to convert"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="text-lg p-4 border-2 focus:border-green-500"
                    />
                  </div>

                  <Button 
                    onClick={convert} 
                    className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white text-lg py-3"
                    disabled={!inputValue}
                  >
                    Convert Now
                  </Button>

                  {result && (
                    <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-lg border-2 border-green-200">
                      <div className="text-xl font-bold text-green-800 text-center">
                        {result}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {mode === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Trophy className="h-6 w-6" />
                    Conversion Quiz
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-lg font-semibold text-gray-700">
                      Question {currentQuiz + 1} • Score: {quizScore}/{currentQuiz + (showQuizResult ? 1 : 0)}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg mb-6 text-center">
                    <div className="text-xl font-bold text-gray-800 mb-4">
                      {quizQuestion.question}
                    </div>
                    <div className="text-sm text-gray-600">
                      Category: {quizQuestion.category}
                    </div>
                  </div>

                  {!showQuizResult ? (
                    <div className="space-y-4">
                      <Input
                        type="number"
                        placeholder="Enter your answer"
                        value={quizAnswer}
                        onChange={(e) => setQuizAnswer(e.target.value)}
                        className="text-lg p-4 border-2 focus:border-purple-500 text-center"
                      />
                      <Button 
                        onClick={checkQuizAnswer}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white text-lg py-3"
                        disabled={!quizAnswer}
                      >
                        Submit Answer
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">
                        {Math.abs(parseFloat(quizAnswer) - quizQuestion.answer) <= Math.abs(quizQuestion.answer * 0.05) ? '🎉' : '😊'}
                      </div>
                      <div className="text-lg font-semibold">
                        {Math.abs(parseFloat(quizAnswer) - quizQuestion.answer) <= Math.abs(quizQuestion.answer * 0.05) 
                          ? 'Correct!' 
                          : 'Good try!'}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {mode === 'metric-game' && (
            <motion.div
              key="metric-game"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              {/* Game Header */}
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                <div className={`bg-gradient-to-r ${metricGameData[gameCategory].color} text-white p-6`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{metricGameData[gameCategory].icon}</span>
                      <div>
                        <h2 className="text-2xl font-bold">Metric Challenge</h2>
                        <p className="text-white/90">{metricGameData[gameCategory].name} Conversions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">{gameScore}</div>
                      <div className="text-white/90">Points</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5" />
                        <span>Level {gameLevel}</span>
                      </div>
                      {gameStreaks > 0 && (
                        <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                          <Zap className="h-4 w-4" />
                          <span>{gameStreaks} streak!</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Category Selection */}
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(metricGameData).map(([key, category]) => (
                      <Button
                        key={key}
                        variant={gameCategory === key ? "default" : "outline"}
                        onClick={() => {
                          setGameCategory(key as keyof typeof metricGameData);
                          setCurrentChallenge(null); // Will regenerate in useEffect
                        }}
                        className={`h-20 ${
                          gameCategory === key 
                            ? `bg-gradient-to-r ${category.color} text-white` 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-1">{category.icon}</div>
                          <div className="font-semibold">{category.name}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Game Challenge */}
              {currentChallenge && (
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <h3 className="text-3xl font-bold text-gray-800 mb-4">
                        {currentChallenge.question}
                      </h3>
                      <div className="text-lg text-gray-600">
                        Drag the value or type your answer
                      </div>
                    </div>

                    {/* Visual Conversion Area */}
                    <div className="grid grid-cols-2 gap-8 mb-8">
                      {/* From Unit */}
                      <div className="text-center">
                        <div className="text-lg font-semibold mb-4">From:</div>
                        <motion.div
                          className={`${currentChallenge.fromUnit.color} p-6 rounded-xl shadow-lg cursor-move`}
                          draggable
                          onDragStart={() => handleDragStart(currentChallenge.fromValue)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="text-4xl mb-2">{currentChallenge.fromUnit.visual}</div>
                          <div className="text-2xl font-bold">
                            {currentChallenge.fromValue} {currentChallenge.fromUnit.name}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {currentChallenge.fromUnit.fullName}
                          </div>
                        </motion.div>
                      </div>

                      {/* To Unit */}
                      <div className="text-center">
                        <div className="text-lg font-semibold mb-4">To:</div>
                        <motion.div
                          className={`${currentChallenge.toUnit.color} p-6 rounded-xl shadow-lg border-4 ${
                            dropZoneActive === currentChallenge.toUnit.name 
                              ? 'border-yellow-400 border-dashed' 
                              : 'border-transparent'
                          }`}
                          onDragOver={(e) => handleDragOver(e, currentChallenge.toUnit.name)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, currentChallenge.toUnit)}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="text-4xl mb-2">{currentChallenge.toUnit.visual}</div>
                          <div className="text-lg font-semibold">
                            ? {currentChallenge.toUnit.name}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {currentChallenge.toUnit.fullName}
                          </div>
                        </motion.div>
                      </div>
                    </div>

                    {/* Answer Input */}
                    {!showGameResult ? (
                      <div className="space-y-4">
                        <div className="flex justify-center gap-4">
                          <Input
                            type="number"
                            placeholder="Your answer"
                            value={gameInput}
                            onChange={(e) => setGameInput(e.target.value)}
                            className="text-2xl p-4 border-2 focus:border-blue-500 text-center max-w-xs"
                          />
                          <div className="flex items-center text-xl font-semibold text-gray-700">
                            {currentChallenge.toUnit.name}
                          </div>
                        </div>
                        
                        <div className="flex justify-center">
                          <Button 
                            onClick={checkMetricAnswer}
                            className={`bg-gradient-to-r ${metricGameData[gameCategory].color} text-white text-lg px-8 py-3`}
                            disabled={!gameInput}
                          >
                            <CheckCircle className="h-5 w-5 mr-2" />
                            Check Answer
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <motion.div 
                          className="text-6xl mb-4"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          {Math.abs(parseFloat(gameInput) - currentChallenge.correctAnswer) <= Math.abs(currentChallenge.correctAnswer * 0.02) ? '🎉' : '🎯'}
                        </motion.div>
                        <div className="text-2xl font-bold">
                          {Math.abs(parseFloat(gameInput) - currentChallenge.correctAnswer) <= Math.abs(currentChallenge.correctAnswer * 0.02) 
                            ? 'Perfect!' 
                            : 'Keep trying!'}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Unit Reference Guide */}
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Quick Reference - {metricGameData[gameCategory].name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {metricGameData[gameCategory].units.map((unit, index) => (
                      <div key={unit.name} className={`${unit.color} p-4 rounded-lg text-center`}>
                        <div className="text-2xl mb-1">{unit.visual}</div>
                        <div className="font-bold">{unit.name}</div>
                        <div className="text-xs text-gray-600">{unit.fullName}</div>
                        {index > 0 && (
                          <div className="text-xs mt-1 text-gray-700">
                            ×{unit.factor / metricGameData[gameCategory].units[index-1].factor}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UnitConverter;
