import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CheckCircle, XCircle, Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Question {
  id: number;
  question: string;
  numerator: number;
  denominator: number;
  answer: string;
  type: "convert" | "simplify" | "add" | "subtract";
}

const FractionBasics = () => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);

  const generateQuestion = (): Question => {
    const types: Question["type"][] = ["convert", "simplify", "add", "subtract"];
    const type = types[Math.floor(Math.random() * types.length)];
    const id = Date.now();

    switch (type) {
      case "convert":
        const decimal = parseFloat((Math.random() * 0.9 + 0.1).toFixed(2));
        return {
          id,
          type,
          question: `Convert ${decimal} to a fraction`,
          numerator: 0,
          denominator: 0,
          answer: convertDecimalToFraction(decimal)
        };
      
      case "simplify":
        const num = Math.floor(Math.random() * 20) + 2;
        const den = Math.floor(Math.random() * 20) + 2;
        const gcd = findGCD(num, den);
        return {
          id,
          type,
          question: `Simplify ${num}/${den}`,
          numerator: num,
          denominator: den,
          answer: gcd === 1 ? `${num}/${den}` : `${num/gcd}/${den/gcd}`
        };
      
      case "add":
        const a1 = Math.floor(Math.random() * 5) + 1;
        const a2 = Math.floor(Math.random() * 5) + 1;
        const den1 = Math.floor(Math.random() * 8) + 2;
        const result = a1 + a2;
        return {
          id,
          type,
          question: `${a1}/${den1} + ${a2}/${den1} =`,
          numerator: result,
          denominator: den1,
          answer: `${result}/${den1}`
        };
      
      case "subtract":
        const b1 = Math.floor(Math.random() * 5) + 3;
        const b2 = Math.floor(Math.random() * 3) + 1;
        const den2 = Math.floor(Math.random() * 8) + 2;
        const result2 = b1 - b2;
        return {
          id,
          type,
          question: `${b1}/${den2} - ${b2}/${den2} =`,
          numerator: result2,
          denominator: den2,
          answer: `${result2}/${den2}`
        };
      
      default:
        return generateQuestion();
    }
  };

  const findGCD = (a: number, b: number): number => {
    return b === 0 ? a : findGCD(b, a % b);
  };

  const convertDecimalToFraction = (decimal: number): string => {
    const str = decimal.toString();
    const decimalPlaces = str.split('.')[1]?.length || 0;
    const denominator = Math.pow(10, decimalPlaces);
    const numerator = decimal * denominator;
    const gcd = findGCD(numerator, denominator);
    return `${numerator/gcd}/${denominator/gcd}`;
  };

  const parseUserFraction = (input: string): { numerator: number; denominator: number } | null => {
    const trimmed = input.trim();
    if (trimmed.includes('/')) {
      const parts = trimmed.split('/');
      if (parts.length === 2) {
        const num = parseInt(parts[0].trim());
        const den = parseInt(parts[1].trim());
        if (!isNaN(num) && !isNaN(den) && den !== 0) {
          return { numerator: num, denominator: den };
        }
      }
    }
    return null;
  };

  const areEquivalentFractions = (userFraction: { numerator: number; denominator: number }, correctAnswer: string): boolean => {
    const correctFraction = parseUserFraction(correctAnswer);
    if (!correctFraction) return false;

    // Reduce both fractions to their simplest form and compare
    const userGCD = findGCD(Math.abs(userFraction.numerator), Math.abs(userFraction.denominator));
    const correctGCD = findGCD(Math.abs(correctFraction.numerator), Math.abs(correctFraction.denominator));

    const userSimplified = {
      numerator: userFraction.numerator / userGCD,
      denominator: userFraction.denominator / userGCD
    };

    const correctSimplified = {
      numerator: correctFraction.numerator / correctGCD,
      denominator: correctFraction.denominator / correctGCD
    };

    return userSimplified.numerator === correctSimplified.numerator && 
           userSimplified.denominator === correctSimplified.denominator;
  };

  useEffect(() => {
    setCurrentQuestion(generateQuestion());
  }, []);

  const handleSubmit = () => {
    if (!currentQuestion || !userAnswer.trim()) return;

    let correct = false;
    
    // Check if user answer is a fraction
    const userFraction = parseUserFraction(userAnswer);
    if (userFraction) {
      correct = areEquivalentFractions(userFraction, currentQuestion.answer);
    } else {
      // Direct string comparison for non-fraction answers
      correct = userAnswer.trim() === currentQuestion.answer;
    }

    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(prev => prev + 1);
      toast.success("Correct!");
    } else {
      toast.error(`Incorrect. The answer was ${currentQuestion.answer}`);
    }
    
    setQuestionsAnswered(prev => prev + 1);
  };

  const nextQuestion = () => {
    setCurrentQuestion(generateQuestion());
    setUserAnswer("");
    setIsCorrect(null);
    setShowResult(false);
  };

  const resetGame = () => {
    setScore(0);
    setQuestionsAnswered(0);
    setUserAnswer("");
    setIsCorrect(null);
    setShowResult(false);
    setCurrentQuestion(generateQuestion());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex items-center">
          <Link to="/">
            <Button variant="ghost" size="icon" className="text-white mr-4 hover:bg-white/10">
              <ArrowLeft />
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">Fraction Basics</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Score Display */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center bg-white rounded-lg shadow-md px-6 py-3">
            <Star className="text-yellow-500 mr-2" />
            <span className="text-lg font-bold">Score: {score}/{questionsAnswered}</span>
          </div>
        </div>

        {/* Question Card */}
        <div className="max-w-md mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
              <CardTitle className="text-center text-xl">
                Question {questionsAnswered + 1}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {currentQuestion && (
                <>
                  <div className="text-center mb-6">
                    <p className="text-xl font-semibold mb-4">
                      {currentQuestion.question}
                    </p>
                  </div>

                  {!showResult ? (
                    <div className="space-y-4">
                      <Input
                        type="text"
                        placeholder="Enter your answer (e.g., 1/2)"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                        className="text-center text-lg"
                      />
                      <Button
                        onClick={handleSubmit}
                        disabled={!userAnswer.trim()}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                      >
                        Submit Answer
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className={cn(
                        "flex items-center justify-center p-4 rounded-lg",
                        isCorrect ? "bg-green-100" : "bg-red-100"
                      )}>
                        {isCorrect ? (
                          <CheckCircle className="text-green-600 mr-2" />
                        ) : (
                          <XCircle className="text-red-600 mr-2" />
                        )}
                        <span className={cn(
                          "font-semibold",
                          isCorrect ? "text-green-800" : "text-red-800"
                        )}>
                          {isCorrect ? "Correct!" : `Wrong! Answer: ${currentQuestion.answer}`}
                        </span>
                      </div>
                      <Button
                        onClick={nextQuestion}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                      >
                        Next Question
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Reset Button */}
          <div className="text-center mt-6">
            <Button
              onClick={resetGame}
              variant="outline"
              className="border-purple-300 text-purple-600 hover:bg-purple-50"
            >
              Reset Game
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FractionBasics;
