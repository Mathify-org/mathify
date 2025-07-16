
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeftRight, Calculator, BookOpen, Trophy, ArrowLeft, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface Conversion {
  from: string;
  to: string;
  factor: number;
  offset?: number;
  description: string;
}

interface Category {
  name: string;
  conversions: Conversion[];
  icon: string;
  color: string;
}

const categories: Category[] = [
  {
    name: 'Length',
    icon: '📏',
    color: 'bg-blue-500',
    conversions: [
      { from: 'meters', to: 'feet', factor: 3.28084, description: 'Meters to Feet' },
      { from: 'kilometers', to: 'miles', factor: 0.621371, description: 'Kilometers to Miles' },
      { from: 'inches', to: 'centimeters', factor: 2.54, description: 'Inches to Centimeters' },
      { from: 'yards', to: 'meters', factor: 0.9144, description: 'Yards to Meters' }
    ]
  },
  {
    name: 'Weight',
    icon: '⚖️',
    color: 'bg-green-500',
    conversions: [
      { from: 'kilograms', to: 'pounds', factor: 2.20462, description: 'Kilograms to Pounds' },
      { from: 'grams', to: 'ounces', factor: 0.035274, description: 'Grams to Ounces' },
      { from: 'tons', to: 'kilograms', factor: 1000, description: 'Tons to Kilograms' }
    ]
  },
  {
    name: 'Temperature',
    icon: '🌡️',
    color: 'bg-red-500',
    conversions: [
      { from: 'Celsius', to: 'Fahrenheit', factor: 1.8, offset: 32, description: 'Celsius to Fahrenheit' },
      { from: 'Fahrenheit', to: 'Celsius', factor: 0.5556, offset: -17.78, description: 'Fahrenheit to Celsius' },
      { from: 'Celsius', to: 'Kelvin', factor: 1, offset: 273.15, description: 'Celsius to Kelvin' },
      { from: 'Kelvin', to: 'Celsius', factor: 1, offset: -273.15, description: 'Kelvin to Celsius' }
    ]
  },
  {
    name: 'Volume',
    icon: '🥤',
    color: 'bg-purple-500',
    conversions: [
      { from: 'liters', to: 'gallons', factor: 0.264172, description: 'Liters to Gallons' },
      { from: 'milliliters', to: 'fluid ounces', factor: 0.033814, description: 'Milliliters to Fluid Ounces' },
      { from: 'cups', to: 'milliliters', factor: 236.588, description: 'Cups to Milliliters' }
    ]
  }
];

const quizQuestions = [
  { question: 'Convert 10 meters to feet', answer: 32.8084, unit: 'feet', tolerance: 0.1 },
  { question: 'Convert 5 kilometers to miles', answer: 3.10686, unit: 'miles', tolerance: 0.1 },
  { question: 'Convert 100 Celsius to Fahrenheit', answer: 212, unit: '°F', tolerance: 1 },
  { question: 'Convert 2 kilograms to pounds', answer: 4.40924, unit: 'pounds', tolerance: 0.1 },
  { question: 'Convert 500 milliliters to fluid ounces', answer: 16.907, unit: 'fl oz', tolerance: 0.5 }
];

const UnitConverter: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<'learn' | 'convert' | 'quiz'>('learn');
  const [selectedCategory, setSelectedCategory] = useState<Category>(categories[0]);
  const [selectedConversion, setSelectedConversion] = useState<Conversion>(categories[0].conversions[0]);
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState('');
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const { toast } = useToast();

  const performConversion = () => {
    const input = parseFloat(inputValue);
    if (isNaN(input)) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid number",
        variant: "destructive"
      });
      return;
    }

    let convertedValue;
    if (selectedConversion.offset) {
      convertedValue = (input * selectedConversion.factor) + selectedConversion.offset;
    } else {
      convertedValue = input * selectedConversion.factor;
    }

    setResult(convertedValue.toFixed(4));
  };

  const submitQuizAnswer = () => {
    const userAnswer = parseFloat(quizAnswer);
    const correctAnswer = quizQuestions[currentQuizIndex].answer;
    const tolerance = quizQuestions[currentQuizIndex].tolerance;
    
    const isCorrect = Math.abs(userAnswer - correctAnswer) <= tolerance;
    
    if (isCorrect) {
      setScore(score + 1);
      toast({
        title: "Correct! 🎉",
        description: `Great job! The answer is ${correctAnswer}`,
      });
    } else {
      toast({
        title: "Try Again",
        description: `The correct answer is ${correctAnswer}`,
        variant: "destructive"
      });
    }
    
    setShowQuizResult(true);
    
    setTimeout(() => {
      if (currentQuizIndex < quizQuestions.length - 1) {
        setCurrentQuizIndex(currentQuizIndex + 1);
        setQuizAnswer('');
        setShowQuizResult(false);
      } else {
        setQuizCompleted(true);
      }
    }, 2000);
  };

  const resetQuiz = () => {
    setCurrentQuizIndex(0);
    setScore(0);
    setQuizAnswer('');
    setShowQuizResult(false);
    setQuizCompleted(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Unit Converter Master
          </h1>
          <p className="text-lg text-gray-600">
            Learn, convert, and master unit conversions!
          </p>
        </div>

        {/* Mode Selection */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-2 shadow-lg">
            <div className="flex gap-2">
              {(['learn', 'convert', 'quiz'] as const).map((mode) => (
                <Button
                  key={mode}
                  onClick={() => setCurrentMode(mode)}
                  variant={currentMode === mode ? "default" : "ghost"}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    currentMode === mode 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                      : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  {mode === 'learn' && <BookOpen className="mr-2 h-4 w-4" />}
                  {mode === 'convert' && <Calculator className="mr-2 h-4 w-4" />}
                  {mode === 'quiz' && <Trophy className="mr-2 h-4 w-4" />}
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Learn Mode */}
          {currentMode === 'learn' && (
            <motion.div
              key="learn"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {categories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-2 border-indigo-200 hover:border-indigo-400 transition-all duration-300 hover:shadow-xl">
                    <CardHeader className="text-center pb-3">
                      <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-3 text-2xl`}>
                        {category.icon}
                      </div>
                      <CardTitle className="text-xl text-indigo-800">{category.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {category.conversions.map((conversion, idx) => (
                          <div key={idx} className="bg-gray-50 rounded-lg p-3">
                            <div className="text-sm font-medium text-gray-700 mb-1">
                              {conversion.description}
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>{conversion.from}</span>
                              <ArrowLeftRight className="h-3 w-3" />
                              <span>{conversion.to}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Convert Mode */}
          {currentMode === 'convert' && (
            <motion.div
              key="convert"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="border-2 border-indigo-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-center text-indigo-800">
                    Unit Converter
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Category Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Category
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map((category) => (
                          <Button
                            key={category.name}
                            onClick={() => {
                              setSelectedCategory(category);
                              setSelectedConversion(category.conversions[0]);
                              setResult('');
                            }}
                            variant={selectedCategory.name === category.name ? "default" : "outline"}
                            className="h-12"
                          >
                            <span className="mr-2">{category.icon}</span>
                            {category.name}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Conversion Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Conversion
                      </label>
                      <div className="space-y-2">
                        {selectedCategory.conversions.map((conversion, idx) => (
                          <Button
                            key={idx}
                            onClick={() => {
                              setSelectedConversion(conversion);
                              setResult('');
                            }}
                            variant={selectedConversion === conversion ? "default" : "outline"}
                            className="w-full justify-start h-auto p-3"
                          >
                            <div>
                              <div className="font-medium">{conversion.description}</div>
                              <div className="text-xs opacity-70">
                                {conversion.from} → {conversion.to}
                              </div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Conversion Input */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Enter value in {selectedConversion.from}
                        </label>
                        <Input
                          type="number"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="Enter value"
                          className="text-lg"
                        />
                      </div>
                      <Button
                        onClick={performConversion}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-8"
                      >
                        Convert
                      </Button>
                    </div>

                    {result && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-lg p-4 border-2 border-indigo-200"
                      >
                        <div className="text-center">
                          <div className="text-sm text-gray-600 mb-1">Result</div>
                          <div className="text-2xl font-bold text-indigo-600">
                            {result} {selectedConversion.to}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Quiz Mode */}
          {currentMode === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="border-2 border-indigo-200 shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl text-indigo-800">
                      Conversion Quiz
                    </CardTitle>
                    <Badge variant="outline" className="text-indigo-600">
                      {score}/{quizQuestions.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {!quizCompleted ? (
                    <div>
                      <div className="mb-6">
                        <Badge variant="outline" className="mb-4">
                          Question {currentQuizIndex + 1} of {quizQuestions.length}
                        </Badge>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                          {quizQuestions[currentQuizIndex].question}
                        </h3>
                        <div className="flex gap-3">
                          <Input
                            type="number"
                            value={quizAnswer}
                            onChange={(e) => setQuizAnswer(e.target.value)}
                            placeholder="Enter your answer"
                            className="flex-1"
                            disabled={showQuizResult}
                          />
                          <Button
                            onClick={submitQuizAnswer}
                            disabled={!quizAnswer || showQuizResult}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600"
                          >
                            Submit
                          </Button>
                        </div>
                      </div>

                      {showQuizResult && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-center p-4 rounded-lg border"
                        >
                          <div className="text-lg font-semibold">
                            {Math.abs(parseFloat(quizAnswer) - quizQuestions[currentQuizIndex].answer) <= quizQuestions[currentQuizIndex].tolerance ? (
                              <div className="text-green-600">
                                <Check className="inline h-5 w-5 mr-2" />
                                Correct!
                              </div>
                            ) : (
                              <div className="text-red-600">
                                <X className="inline h-5 w-5 mr-2" />
                                Incorrect
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-6xl mb-4">🏆</div>
                      <h3 className="text-2xl font-bold text-indigo-600 mb-4">
                        Quiz Complete!
                      </h3>
                      <p className="text-lg text-gray-700 mb-6">
                        You scored {score} out of {quizQuestions.length}
                      </p>
                      <Button
                        onClick={resetQuiz}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600"
                      >
                        Try Again
                      </Button>
                    </div>
                  )}
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
