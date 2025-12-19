import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Clock, CheckCircle, XCircle, RotateCcw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import GameCompletionHandler from '@/components/GameCompletionHandler';

type Difficulty = 'easy' | 'medium' | 'hard' | 'advanced';
type GameState = 'menu' | 'playing' | 'finished';
type QuestionType = 'simplify' | 'add' | 'subtract' | 'multiply' | 'convert' | 'compare' | 'wordproblem';

interface Question {
  type: QuestionType;
  // For simplification
  numerator?: number;
  denominator?: number;
  simplifiedNumerator?: number;
  simplifiedDenominator?: number;
  // For addition/subtraction/multiplication
  fraction1Num?: number;
  fraction1Den?: number;
  fraction2Num?: number;
  fraction2Den?: number;
  resultNum?: number;
  resultDen?: number;
  operation?: '+' | '-' | '×';
  // For conversions
  wholeNumber?: number;
  mixedWhole?: number;
  mixedNum?: number;
  mixedDen?: number;
  conversionType?: 'improper-to-mixed' | 'mixed-to-improper' | 'proper-identify';
  // For comparisons
  comparisonOp?: '<' | '>' | '=';
  comparisonAnswer?: string;
  // For word problems
  wordProblem?: string;
  wordProblemChoices?: string[];
  wordProblemAnswer?: number;
}

const FractionSimplify = () => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [advancedSubMode, setAdvancedSubMode] = useState<'all' | 'convert' | 'compare' | 'wordproblem'>('all');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [totalTimeLeft, setTotalTimeLeft] = useState(180); // 3 minutes
  const [userNumerator, setUserNumerator] = useState('');
  const [userDenominator, setUserDenominator] = useState('');
  const [userWhole, setUserWhole] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [showSubModeSelector, setShowSubModeSelector] = useState(false);
  const [showCompletionHandler, setShowCompletionHandler] = useState(false);
  const gameStartTime = useRef<number>(Date.now());

  const totalQuestions = 10;

  // Generate GCD function
  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  // Generate LCM function
  const lcm = (a: number, b: number): number => {
    return (a * b) / gcd(a, b);
  };

  // Simplify fraction
  const simplifyFraction = (num: number, den: number) => {
    const divisor = gcd(Math.abs(num), Math.abs(den));
    return {
      numerator: num / divisor,
      denominator: den / divisor
    };
  };

  // Generate questions based on difficulty and type
  const generateQuestion = (): Question => {
    const questionTypes: QuestionType[] = difficulty === 'advanced' 
      ? (advancedSubMode === 'all' ? ['convert', 'compare', 'wordproblem'] : [advancedSubMode])
      : ['simplify', 'add', 'subtract', 'multiply'];
    const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    if (questionType === 'simplify') {
      let numerator: number, denominator: number;
      
      switch (difficulty) {
        case 'easy':
          // Much simpler fractions for easy mode
          numerator = Math.floor(Math.random() * 12) + 2;
          denominator = Math.floor(Math.random() * 12) + 2;
          break;
        case 'medium':
          numerator = Math.floor(Math.random() * 50) + 5;
          denominator = Math.floor(Math.random() * 50) + 5;
          break;
        case 'hard':
          numerator = Math.floor(Math.random() * 100) + 10;
          denominator = Math.floor(Math.random() * 100) + 10;
          break;
      }

      // Ensure the fraction can be simplified
      const commonFactor = difficulty === 'easy' ? Math.floor(Math.random() * 3) + 2 : Math.floor(Math.random() * 5) + 2;
      numerator *= commonFactor;
      denominator *= commonFactor;

      const divisor = gcd(numerator, denominator);
      return {
        type: 'simplify',
        numerator,
        denominator,
        simplifiedNumerator: numerator / divisor,
        simplifiedDenominator: denominator / divisor
      };
    } else if (questionType === 'multiply') {
      // Multiplication of fractions
      let f1Num: number, f1Den: number, f2Num: number, f2Den: number;
      
      switch (difficulty) {
        case 'easy':
          f1Num = Math.floor(Math.random() * 5) + 1;
          f1Den = Math.floor(Math.random() * 5) + 2;
          f2Num = Math.floor(Math.random() * 5) + 1;
          f2Den = Math.floor(Math.random() * 5) + 2;
          break;
        case 'medium':
          f1Num = Math.floor(Math.random() * 10) + 1;
          f1Den = Math.floor(Math.random() * 10) + 2;
          f2Num = Math.floor(Math.random() * 10) + 1;
          f2Den = Math.floor(Math.random() * 10) + 2;
          break;
        case 'hard':
          f1Num = Math.floor(Math.random() * 15) + 1;
          f1Den = Math.floor(Math.random() * 15) + 2;
          f2Num = Math.floor(Math.random() * 15) + 1;
          f2Den = Math.floor(Math.random() * 15) + 2;
          break;
      }

      const resultNum = f1Num * f2Num;
      const resultDen = f1Den * f2Den;
      const simplified = simplifyFraction(resultNum, resultDen);

      return {
        type: 'multiply',
        fraction1Num: f1Num,
        fraction1Den: f1Den,
        fraction2Num: f2Num,
        fraction2Den: f2Den,
        operation: '×',
        resultNum: simplified.numerator,
        resultDen: simplified.denominator
      };
    } else if (questionType === 'convert') {
      // Conversion questions
      const conversionTypes: ('improper-to-mixed' | 'mixed-to-improper' | 'proper-identify')[] = 
        ['improper-to-mixed', 'mixed-to-improper', 'proper-identify'];
      const convType = conversionTypes[Math.floor(Math.random() * conversionTypes.length)];
      
      if (convType === 'improper-to-mixed') {
        // Generate improper fraction
        const wholeNum = Math.floor(Math.random() * 5) + 1;
        const mixedNum = Math.floor(Math.random() * 8) + 1;
        const mixedDen = Math.floor(Math.random() * 8) + 2;
        const improperNum = wholeNum * mixedDen + mixedNum;
        
        return {
          type: 'convert',
          conversionType: 'improper-to-mixed',
          numerator: improperNum,
          denominator: mixedDen,
          mixedWhole: wholeNum,
          mixedNum: mixedNum,
          mixedDen: mixedDen
        };
      } else if (convType === 'mixed-to-improper') {
        // Generate mixed number
        const wholeNum = Math.floor(Math.random() * 5) + 1;
        const mixedNum = Math.floor(Math.random() * 8) + 1;
        const mixedDen = Math.floor(Math.random() * 8) + 2;
        const improperNum = wholeNum * mixedDen + mixedNum;
        
        return {
          type: 'convert',
          conversionType: 'mixed-to-improper',
          mixedWhole: wholeNum,
          mixedNum: mixedNum,
          mixedDen: mixedDen,
          numerator: improperNum,
          denominator: mixedDen
        };
      } else {
        // Identify proper/improper
        const isProper = Math.random() > 0.5;
        const num = Math.floor(Math.random() * 12) + 1;
        const den = isProper ? num + Math.floor(Math.random() * 8) + 1 : Math.floor(Math.random() * num) + 1;
        
        return {
          type: 'convert',
          conversionType: 'proper-identify',
          numerator: num,
          denominator: den,
          comparisonAnswer: isProper ? 'proper' : 'improper'
        };
      }
    } else if (questionType === 'compare') {
      // Comparison questions
      const useSameDen = Math.random() > 0.5;
      let f1Num: number, f1Den: number, f2Num: number, f2Den: number;
      
      if (useSameDen) {
        // Same denominators - compare numerators
        const den = Math.floor(Math.random() * 10) + 2;
        f1Num = Math.floor(Math.random() * 15) + 1;
        f2Num = Math.floor(Math.random() * 15) + 1;
        f1Den = den;
        f2Den = den;
      } else {
        // Different denominators
        f1Num = Math.floor(Math.random() * 12) + 1;
        f1Den = Math.floor(Math.random() * 12) + 2;
        f2Num = Math.floor(Math.random() * 12) + 1;
        f2Den = Math.floor(Math.random() * 12) + 2;
      }
      
      const val1 = f1Num / f1Den;
      const val2 = f2Num / f2Den;
      let compOp: '<' | '>' | '=' = '=';
      
      if (Math.abs(val1 - val2) < 0.001) compOp = '=';
      else if (val1 < val2) compOp = '<';
      else compOp = '>';
      
      return {
        type: 'compare',
        fraction1Num: f1Num,
        fraction1Den: f1Den,
        fraction2Num: f2Num,
        fraction2Den: f2Den,
        comparisonOp: compOp,
        comparisonAnswer: compOp
      };
    } else if (questionType === 'wordproblem') {
      // Word problems
      const problems = [
        {
          text: "Sarah ate 2/5 of a pizza. Her brother ate 1/5 of the same pizza. What fraction of the pizza did they eat together?",
          choices: ["3/5", "2/5", "3/10", "1/5"],
          answer: 0,
          resultNum: 3,
          resultDen: 5
        },
        {
          text: "A recipe calls for 3/4 cup of sugar. If you want to make half the recipe, how much sugar do you need?",
          choices: ["3/8", "1/2", "1/4", "3/2"],
          answer: 0,
          resultNum: 3,
          resultDen: 8
        },
        {
          text: "John ran 5/8 of a mile. Maria ran 3/4 of a mile. Who ran farther?",
          choices: ["John", "Maria", "Same distance", "Can't tell"],
          answer: 1,
          resultNum: 3,
          resultDen: 4
        },
        {
          text: "A water bottle is 2/3 full. After drinking some water, it's now 1/3 full. What fraction of the bottle did you drink?",
          choices: ["1/3", "1/2", "2/3", "1/6"],
          answer: 0,
          resultNum: 1,
          resultDen: 3
        },
        {
          text: "A garden is divided into 8 equal sections. If 5 sections have flowers, what fraction of the garden has flowers?",
          choices: ["5/8", "3/8", "5/3", "8/5"],
          answer: 0,
          resultNum: 5,
          resultDen: 8
        },
        {
          text: "Tom has 7/2 cups of flour. How many whole cups is that?",
          choices: ["2", "3", "3 and 1/2", "4"],
          answer: 1,
          mixedWhole: 3,
          mixedNum: 1,
          mixedDen: 2
        }
      ];
      
      const problem = problems[Math.floor(Math.random() * problems.length)];
      
      return {
        type: 'wordproblem',
        wordProblem: problem.text,
        wordProblemChoices: problem.choices,
        wordProblemAnswer: problem.answer,
        resultNum: problem.resultNum,
        resultDen: problem.resultDen,
        mixedWhole: problem.mixedWhole,
        mixedNum: problem.mixedNum,
        mixedDen: problem.mixedDen
      };
    } else {
      // Addition or subtraction
      let f1Num: number, f1Den: number, f2Num: number, f2Den: number;
      
      if (difficulty === 'easy') {
        // For easy mode, use same denominators
        const commonDen = [2, 3, 4, 5, 6, 8, 10][Math.floor(Math.random() * 7)];
        f1Den = commonDen;
        f2Den = commonDen;
        f1Num = Math.floor(Math.random() * (commonDen - 1)) + 1;
        f2Num = Math.floor(Math.random() * (commonDen - 1)) + 1;
        
        // For subtraction, ensure first fraction is larger
        if (questionType === 'subtract' && f1Num < f2Num) {
          [f1Num, f2Num] = [f2Num, f1Num];
        }
      } else {
        switch (difficulty) {
          case 'medium':
            f1Num = Math.floor(Math.random() * 20) + 1;
            f1Den = Math.floor(Math.random() * 20) + 2;
            f2Num = Math.floor(Math.random() * 20) + 1;
            f2Den = Math.floor(Math.random() * 20) + 2;
            break;
          case 'hard':
            f1Num = Math.floor(Math.random() * 30) + 1;
            f1Den = Math.floor(Math.random() * 30) + 2;
            f2Num = Math.floor(Math.random() * 30) + 1;
            f2Den = Math.floor(Math.random() * 30) + 2;
            break;
        }
      }

      const operation = questionType === 'add' ? '+' : '-';
      let resultNum: number, resultDen: number;

      if (difficulty === 'easy') {
        // Same denominators - simple calculation
        resultDen = f1Den;
        if (operation === '+') {
          resultNum = f1Num + f2Num;
        } else {
          resultNum = f1Num - f2Num;
        }
      } else {
        // Different denominators - need common denominator
        const commonDen = lcm(f1Den, f2Den);
        const adjustedF1Num = f1Num * (commonDen / f1Den);
        const adjustedF2Num = f2Num * (commonDen / f2Den);
        
        if (operation === '+') {
          resultNum = adjustedF1Num + adjustedF2Num;
        } else {
          resultNum = adjustedF1Num - adjustedF2Num;
          // Ensure positive result for simplicity
          if (resultNum < 0) {
            resultNum = Math.abs(resultNum);
          }
        }
        resultDen = commonDen;
      }

      const simplified = simplifyFraction(resultNum, resultDen);

      return {
        type: questionType,
        fraction1Num: f1Num,
        fraction1Den: f1Den,
        fraction2Num: f2Num,
        fraction2Den: f2Den,
        operation,
        resultNum: simplified.numerator,
        resultDen: simplified.denominator
      };
    }
    
    // Fallback for any other cases
    return generateQuestion();
  };

  // Start game
  const startGame = (selectedDifficulty: Difficulty) => {
    if (selectedDifficulty === 'advanced') {
      setDifficulty(selectedDifficulty);
      setShowSubModeSelector(true);
      return;
    }
    
    setDifficulty(selectedDifficulty);
    setGameState('playing');
    setScore(0);
    setQuestionIndex(0);
    setStreak(0);
    setTimeLeft(60);
    setTotalTimeLeft(180);
    setCurrentQuestion(generateQuestion());
    setUserNumerator('');
    setUserDenominator('');
    setUserWhole('');
    setFeedback(null);
  };
  
  const startAdvancedGame = (subMode: 'all' | 'convert' | 'compare' | 'wordproblem') => {
    setAdvancedSubMode(subMode);
    setGameState('playing');
    setScore(0);
    setQuestionIndex(0);
    setStreak(0);
    setTimeLeft(60);
    setTotalTimeLeft(180);
    setShowSubModeSelector(false);
    // Need to set difficulty first, then generate
    setTimeout(() => {
      setCurrentQuestion(generateQuestion());
    }, 0);
    setUserNumerator('');
    setUserDenominator('');
    setUserWhole('');
    setFeedback(null);
  };

  // Check answer - Updated to accept any equivalent fraction and advanced modes
  const checkAnswer = (choiceIndex?: number, comparisonChoice?: string) => {
    if (currentQuestion?.type === 'wordproblem' && choiceIndex !== undefined) {
      const isCorrect = choiceIndex === currentQuestion.wordProblemAnswer;
      
      if (isCorrect) {
        setScore(score + 1);
        setStreak(streak + 1);
        setBestStreak(Math.max(bestStreak, streak + 1));
        setFeedback('correct');
        confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
      } else {
        setStreak(0);
        setFeedback('incorrect');
      }
      
      setTimeout(nextQuestion, 1500);
      return;
    }
    
    if (currentQuestion?.type === 'compare' && comparisonChoice) {
      const isCorrect = comparisonChoice === currentQuestion.comparisonAnswer;
      
      if (isCorrect) {
        setScore(score + 1);
        setStreak(streak + 1);
        setBestStreak(Math.max(bestStreak, streak + 1));
        setFeedback('correct');
        confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
      } else {
        setStreak(0);
        setFeedback('incorrect');
      }
      
      setTimeout(nextQuestion, 1500);
      return;
    }
    
    if (currentQuestion?.type === 'convert' && currentQuestion.conversionType === 'proper-identify') {
      const isCorrect = userNumerator === currentQuestion.comparisonAnswer;
      
      if (isCorrect) {
        setScore(score + 1);
        setStreak(streak + 1);
        setBestStreak(Math.max(bestStreak, streak + 1));
        setFeedback('correct');
        confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
      } else {
        setStreak(0);
        setFeedback('incorrect');
      }
      
      setUserNumerator('');
      setTimeout(nextQuestion, 1500);
      return;
    }
    
    if (!currentQuestion || !userNumerator || !userDenominator) return;

    const userNum = parseInt(userNumerator);
    const userDen = parseInt(userDenominator);
    
    if (userDen === 0 && currentQuestion.type !== 'convert') {
      setStreak(0);
      setFeedback('incorrect');
      setTimeout(nextQuestion, 1500);
      return;
    }
    
    let isCorrect = false;
    
    if (currentQuestion.type === 'convert') {
      if (currentQuestion.conversionType === 'improper-to-mixed') {
        // userWhole = whole number, userNumerator = numerator, userDenominator = denominator
        const userWholeNum = parseInt(userWhole);
        isCorrect = userWholeNum === currentQuestion.mixedWhole && 
                   userNum === currentQuestion.mixedNum &&
                   userDen === currentQuestion.mixedDen;
      } else if (currentQuestion.conversionType === 'mixed-to-improper') {
        isCorrect = userNum === currentQuestion.numerator && 
                   userDen === currentQuestion.denominator;
      }
    } else if (currentQuestion.type === 'simplify') {
      // Accept any equivalent fraction, not just simplified
      const expectedNum = currentQuestion.simplifiedNumerator!;
      const expectedDen = currentQuestion.simplifiedDenominator!;
      
      // Check if fractions are equivalent: a/b = c/d if a*d = b*c
      isCorrect = userNum * expectedDen === userDen * expectedNum;
    } else {
      // For other operations, also accept equivalent fractions
      const expectedNum = currentQuestion.resultNum!;
      const expectedDen = currentQuestion.resultDen!;
      
      // Check if fractions are equivalent: a/b = c/d if a*d = b*c
      isCorrect = userNum * expectedDen === userDen * expectedNum;
    }
    
    if (isCorrect) {
      setScore(score + 1);
      setStreak(streak + 1);
      setBestStreak(Math.max(bestStreak, streak + 1));
      setFeedback('correct');
      
      // Celebration effect
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.6 }
      });
    } else {
      setStreak(0);
      setFeedback('incorrect');
    }

    setTimeout(nextQuestion, 1500);
  };

  // Next question
  const nextQuestion = () => {
    if (questionIndex + 1 >= totalQuestions || totalTimeLeft <= 0) {
      setGameState('finished');
      if (score >= 7) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } else {
      setQuestionIndex(questionIndex + 1);
      setCurrentQuestion(generateQuestion());
      setUserNumerator('');
      setUserDenominator('');
      setUserWhole('');
      setFeedback(null);
      setTimeLeft(60);
    }
  };

  // Timer effects
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0 && totalTimeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        setTotalTimeLeft(totalTimeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setStreak(0);
      setFeedback('incorrect');
      setTimeout(nextQuestion, 1500);
    } else if (totalTimeLeft === 0 && gameState === 'playing') {
      setGameState('finished');
    }
  }, [timeLeft, totalTimeLeft, gameState]);

  // Handle Enter key
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && gameState === 'playing' && userNumerator && userDenominator) {
        checkAnswer();
      }
    };
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [gameState, userNumerator, userDenominator]);

  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case 'easy': return 'from-green-400 to-emerald-500';
      case 'medium': return 'from-yellow-400 to-orange-500';
      case 'hard': return 'from-red-400 to-pink-500';
      case 'advanced': return 'from-purple-500 via-indigo-500 to-blue-500';
    }
  };

  const getPerformanceMessage = () => {
    const percentage = (score / totalQuestions) * 100;
    if (percentage >= 90) return "🌟 Amazing! You're a fraction master!";
    if (percentage >= 70) return "🎉 Great job! Keep practicing!";
    if (percentage >= 50) return "👍 Good effort! You're improving!";
    return "💪 Keep trying! Practice makes perfect!";
  };

  const renderQuestion = () => {
    if (!currentQuestion) return null;
    
    if (currentQuestion.type === 'convert') {
      if (currentQuestion.conversionType === 'improper-to-mixed') {
        return (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-8 text-gray-800">Convert this improper fraction to a mixed number:</h2>
            <div className="inline-block">
              <div className="text-6xl font-bold text-indigo-600 border-b-4 border-indigo-600 px-4 pb-2">
                {currentQuestion.numerator}
              </div>
              <div className="text-6xl font-bold text-indigo-600 px-4 pt-2">
                {currentQuestion.denominator}
              </div>
            </div>
            <p className="text-gray-600 mt-6">Enter as: whole number, then numerator, then denominator</p>
          </div>
        );
      } else if (currentQuestion.conversionType === 'mixed-to-improper') {
        return (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-8 text-gray-800">Convert this mixed number to an improper fraction:</h2>
            <div className="flex items-center justify-center gap-4">
              <div className="text-6xl font-bold text-indigo-600">{currentQuestion.mixedWhole}</div>
              <div className="inline-block">
                <div className="text-4xl font-bold text-indigo-600 border-b-4 border-indigo-600 px-3 pb-1">
                  {currentQuestion.mixedNum}
                </div>
                <div className="text-4xl font-bold text-indigo-600 px-3 pt-1">
                  {currentQuestion.mixedDen}
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-8 text-gray-800">Is this a proper or improper fraction?</h2>
            <div className="inline-block">
              <div className="text-6xl font-bold text-indigo-600 border-b-4 border-indigo-600 px-4 pb-2">
                {currentQuestion.numerator}
              </div>
              <div className="text-6xl font-bold text-indigo-600 px-4 pt-2">
                {currentQuestion.denominator}
              </div>
            </div>
          </div>
        );
      }
    } else if (currentQuestion.type === 'compare') {
      return (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-8 text-gray-800">Compare these fractions:</h2>
          <div className="flex items-center justify-center gap-6">
            <div className="inline-block">
              <div className="text-5xl font-bold text-indigo-600 border-b-4 border-indigo-600 px-3 pb-1">
                {currentQuestion.fraction1Num}
              </div>
              <div className="text-5xl font-bold text-indigo-600 px-3 pt-1">
                {currentQuestion.fraction1Den}
              </div>
            </div>
            <div className="text-5xl font-bold text-gray-400">?</div>
            <div className="inline-block">
              <div className="text-5xl font-bold text-indigo-600 border-b-4 border-indigo-600 px-3 pb-1">
                {currentQuestion.fraction2Num}
              </div>
              <div className="text-5xl font-bold text-indigo-600 px-3 pt-1">
                {currentQuestion.fraction2Den}
              </div>
            </div>
          </div>
          <p className="text-gray-600 mt-6">Choose: &lt;, &gt;, or =</p>
        </div>
      );
    } else if (currentQuestion.type === 'wordproblem') {
      return (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-8 text-gray-800">Solve this word problem:</h2>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl mb-6 border-2 border-indigo-200">
            <p className="text-lg text-gray-800 leading-relaxed">{currentQuestion.wordProblem}</p>
          </div>
        </div>
      );
    } else if (currentQuestion.type === 'simplify') {
      return (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-8 text-gray-800">Simplify this fraction:</h2>
          <div className="inline-block">
            <div className="text-6xl font-bold text-purple-600 border-b-4 border-purple-600 px-4 pb-2">
              {currentQuestion.numerator}
            </div>
            <div className="text-6xl font-bold text-purple-600 px-4 pt-2">
              {currentQuestion.denominator}
            </div>
          </div>
        </div>
      );
    } else {
      const operationText = currentQuestion.type === 'add' ? 'Add' : 
                           currentQuestion.type === 'subtract' ? 'Subtract' : 'Multiply';
      return (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-8 text-gray-800">
            {operationText} these fractions:
          </h2>
          <div className="flex items-center justify-center gap-6">
            <div className="inline-block">
              <div className="text-4xl font-bold text-purple-600 border-b-4 border-purple-600 px-3 pb-1">
                {currentQuestion.fraction1Num}
              </div>
              <div className="text-4xl font-bold text-purple-600 px-3 pt-1">
                {currentQuestion.fraction1Den}
              </div>
            </div>
            <div className="text-4xl font-bold text-gray-600">
              {currentQuestion.operation}
            </div>
            <div className="inline-block">
              <div className="text-4xl font-bold text-purple-600 border-b-4 border-purple-600 px-3 pb-1">
                {currentQuestion.fraction2Num}
              </div>
              <div className="text-4xl font-bold text-purple-600 px-3 pt-1">
                {currentQuestion.fraction2Den}
              </div>
            </div>
            <div className="text-4xl font-bold text-gray-600">=</div>
            <div className="text-4xl font-bold text-gray-400">?</div>
          </div>
        </div>
      );
    }
  };

  const getCorrectAnswer = () => {
    if (!currentQuestion) return '';
    
    if (currentQuestion.type === 'simplify') {
      return `${currentQuestion.simplifiedNumerator}/${currentQuestion.simplifiedDenominator}`;
    } else if (currentQuestion.type === 'convert') {
      if (currentQuestion.conversionType === 'improper-to-mixed') {
        return `${currentQuestion.mixedWhole} ${currentQuestion.mixedNum}/${currentQuestion.mixedDen}`;
      } else if (currentQuestion.conversionType === 'mixed-to-improper') {
        return `${currentQuestion.numerator}/${currentQuestion.denominator}`;
      } else if (currentQuestion.conversionType === 'proper-identify') {
        return currentQuestion.comparisonAnswer || '';
      }
    } else if (currentQuestion.type === 'compare') {
      return currentQuestion.comparisonAnswer || '';
    } else if (currentQuestion.type === 'wordproblem') {
      return currentQuestion.wordProblemChoices?.[currentQuestion.wordProblemAnswer || 0] || '';
    } else {
      return `${currentQuestion.resultNum}/${currentQuestion.resultDen}`;
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Fraction Master
          </h1>
          <p className="text-lg text-gray-600">Master fractions and become a math hero!</p>
        </div>

        {/* Menu State */}
        {gameState === 'menu' && !showSubModeSelector && (
          <div className="space-y-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Choose Your Challenge</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {(['easy', 'medium', 'hard', 'advanced'] as Difficulty[]).map((diff) => (
                    <Card key={diff} className="overflow-hidden hover:scale-105 transition-transform cursor-pointer border-0 shadow-lg">
                      <div className={`h-3 bg-gradient-to-r ${getDifficultyColor(diff)}`}></div>
                      <CardContent className="p-6 text-center">
                        <h3 className="text-xl font-bold mb-2 capitalize">{diff}</h3>
                        <p className="text-gray-600 mb-4 text-sm">
                          {diff === 'easy' && 'Simple fractions with same denominators'}
                          {diff === 'medium' && 'Medium fractions with different denominators'}
                          {diff === 'hard' && 'Complex fractions and operations'}
                          {diff === 'advanced' && 'Conversions, comparisons & word problems'}
                        </p>
                        <Button 
                          onClick={() => startGame(diff)}
                          className={`w-full bg-gradient-to-r ${getDifficultyColor(diff)} hover:scale-105 transition-transform text-white font-bold py-3`}
                        >
                          Start {diff.charAt(0).toUpperCase() + diff.slice(1)}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">How to Play</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p>• Work with fractions in any form</p>
                    <p>• Add, subtract, and multiply fractions</p>
                    <p>• 60 seconds per question</p>
                  </div>
                  <div>
                    <p>• 3 minutes total time limit</p>
                    <p>• 10 questions per game</p>
                    <p>• Build streaks for bonus points</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Advanced Sub-Mode Selector */}
        {showSubModeSelector && (
          <div className="space-y-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Advanced Mode</h2>
                  <p className="text-gray-600">Choose your challenge type</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                  <Card className="overflow-hidden hover:scale-105 transition-transform cursor-pointer border-0 shadow-lg">
                    <div className="h-3 bg-gradient-to-r from-purple-400 to-indigo-400"></div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2">🔄 All Types</h3>
                      <p className="text-gray-600 mb-4 text-sm">Mix of conversions, comparisons, and word problems</p>
                      <Button 
                        onClick={() => startAdvancedGame('all')}
                        className="w-full bg-gradient-to-r from-purple-400 to-indigo-400 hover:scale-105 transition-transform text-white font-bold py-3"
                      >
                        Start Mixed
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="overflow-hidden hover:scale-105 transition-transform cursor-pointer border-0 shadow-lg">
                    <div className="h-3 bg-gradient-to-r from-blue-400 to-cyan-400"></div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2">🔢 Conversions</h3>
                      <p className="text-gray-600 mb-4 text-sm">Proper, improper & mixed fractions only</p>
                      <Button 
                        onClick={() => startAdvancedGame('convert')}
                        className="w-full bg-gradient-to-r from-blue-400 to-cyan-400 hover:scale-105 transition-transform text-white font-bold py-3"
                      >
                        Start Conversions
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="overflow-hidden hover:scale-105 transition-transform cursor-pointer border-0 shadow-lg">
                    <div className="h-3 bg-gradient-to-r from-green-400 to-teal-400"></div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2">⚖️ Comparisons</h3>
                      <p className="text-gray-600 mb-4 text-sm">Compare like and unlike fractions</p>
                      <Button 
                        onClick={() => startAdvancedGame('compare')}
                        className="w-full bg-gradient-to-r from-green-400 to-teal-400 hover:scale-105 transition-transform text-white font-bold py-3"
                      >
                        Start Comparisons
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="overflow-hidden hover:scale-105 transition-transform cursor-pointer border-0 shadow-lg">
                    <div className="h-3 bg-gradient-to-r from-orange-400 to-pink-400"></div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2">📖 Word Problems</h3>
                      <p className="text-gray-600 mb-4 text-sm">Real-world fraction challenges</p>
                      <Button 
                        onClick={() => startAdvancedGame('wordproblem')}
                        className="w-full bg-gradient-to-r from-orange-400 to-pink-400 hover:scale-105 transition-transform text-white font-bold py-3"
                      >
                        Start Word Problems
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="text-center mt-6">
                  <Button
                    onClick={() => { setShowSubModeSelector(false); setDifficulty('easy'); }}
                    variant="outline"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    ← Back to Difficulty Selection
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Playing State */}
        {gameState === 'playing' && currentQuestion && (
          <div className="space-y-6">
            {/* Game HUD */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{score}</div>
                  <div className="text-sm text-gray-600">Score</div>
                </CardContent>
              </Card>
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{questionIndex + 1}/{totalQuestions}</div>
                  <div className="text-sm text-gray-600">Question</div>
                </CardContent>
              </Card>
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{streak}</div>
                  <div className="text-sm text-gray-600">Streak</div>
                </CardContent>
              </Card>
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{Math.floor(totalTimeLeft / 60)}:{(totalTimeLeft % 60).toString().padStart(2, '0')}</div>
                  <div className="text-sm text-gray-600">Time Left</div>
                </CardContent>
              </Card>
            </div>

            {/* Question Timer */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <span className="font-medium">Question Timer: {timeLeft}s</span>
                </div>
                <Progress value={(timeLeft / 60) * 100} className="h-2" />
              </CardContent>
            </Card>

            {/* Main Question */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-8 text-center">
                {renderQuestion()}

                {/* Answer Inputs based on question type */}
                {currentQuestion.type === 'wordproblem' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-6">
                    {currentQuestion.wordProblemChoices?.map((choice, idx) => (
                      <Button
                        key={idx}
                        onClick={() => checkAnswer(idx)}
                        disabled={feedback !== null}
                        className="bg-gradient-to-r from-indigo-400 to-purple-400 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-6 text-lg transition-all hover:scale-105"
                      >
                        {choice}
                      </Button>
                    ))}
                  </div>
                ) : currentQuestion.type === 'compare' ? (
                  <div className="flex items-center justify-center gap-6 mb-6">
                    {['<', '=', '>'].map((op) => (
                      <Button
                        key={op}
                        onClick={() => checkAnswer(undefined, op)}
                        disabled={feedback !== null}
                        className="bg-gradient-to-r from-indigo-400 to-purple-400 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-8 px-12 text-4xl transition-all hover:scale-110"
                      >
                        {op}
                      </Button>
                    ))}
                  </div>
                ) : currentQuestion.type === 'convert' && currentQuestion.conversionType === 'proper-identify' ? (
                  <div className="flex items-center justify-center gap-6 mb-6">
                    {['proper', 'improper'].map((type) => (
                      <Button
                        key={type}
                        onClick={() => { setUserNumerator(type); checkAnswer(); }}
                        disabled={feedback !== null}
                        className="bg-gradient-to-r from-indigo-400 to-purple-400 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-6 px-10 text-lg capitalize transition-all hover:scale-110"
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                ) : currentQuestion.type === 'convert' && currentQuestion.conversionType === 'improper-to-mixed' ? (
                  <>
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <div className="flex flex-col items-center">
                        <label className="text-sm text-gray-600 mb-1">Whole</label>
                        <input
                          type="number"
                          value={userWhole}
                          onChange={(e) => setUserWhole(e.target.value)}
                          className="w-20 h-16 text-2xl font-bold text-center border-2 border-indigo-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                          placeholder="?"
                          disabled={feedback !== null}
                        />
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <label className="text-sm text-gray-600 mb-1">Fraction</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={userNumerator}
                            onChange={(e) => setUserNumerator(e.target.value)}
                            className="w-16 h-14 text-xl font-bold text-center border-2 border-indigo-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                            placeholder="?"
                            disabled={feedback !== null}
                          />
                          <div className="text-3xl font-bold text-gray-400">/</div>
                          <input
                            type="number"
                            value={userDenominator}
                            onChange={(e) => setUserDenominator(e.target.value)}
                            className="w-16 h-14 text-xl font-bold text-center border-2 border-indigo-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                            placeholder="?"
                            disabled={feedback !== null}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      onClick={() => checkAnswer()}
                      disabled={!userWhole || !userNumerator || !userDenominator || feedback !== null}
                      className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:scale-105 transition-transform text-white font-bold px-8 py-3 text-lg"
                    >
                      Check Answer
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <input
                        type="number"
                        value={userNumerator}
                        onChange={(e) => setUserNumerator(e.target.value)}
                        className="w-20 h-16 text-2xl font-bold text-center border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none"
                        placeholder="?"
                        disabled={feedback !== null}
                      />
                      <div className="text-4xl font-bold text-gray-400">/</div>
                      <input
                        type="number"
                        value={userDenominator}
                        onChange={(e) => setUserDenominator(e.target.value)}
                        className="w-20 h-16 text-2xl font-bold text-center border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none"
                        placeholder="?"
                        disabled={feedback !== null}
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      onClick={() => checkAnswer()}
                      disabled={!userNumerator || !userDenominator || feedback !== null}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 transition-transform text-white font-bold px-8 py-3 text-lg"
                    >
                      Check Answer
                    </Button>
                  </>
                )}

                {/* Feedback */}
                {feedback && (
                  <div className={`mt-6 p-4 rounded-lg ${feedback === 'correct' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    <div className="flex items-center justify-center gap-2">
                      {feedback === 'correct' ? (
                        <>
                          <CheckCircle className="h-6 w-6" />
                          <span className="font-bold">Correct! Great job!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-6 w-6" />
                          <span className="font-bold">
                            Incorrect. Answer: {getCorrectAnswer()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Finished State */}
        {gameState === 'finished' && !showCompletionHandler && (
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <Trophy className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
                <h2 className="text-3xl font-bold mb-2 text-gray-800">Game Complete!</h2>
                <p className="text-xl text-gray-600">{getPerformanceMessage()}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-xl">
                  <div className="text-3xl font-bold">{score}/{totalQuestions}</div>
                  <div>Final Score</div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6 rounded-xl">
                  <div className="text-3xl font-bold">{bestStreak}</div>
                  <div>Best Streak</div>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-xl">
                  <div className="text-3xl font-bold">{Math.round((score / totalQuestions) * 100)}%</div>
                  <div>Accuracy</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => setShowCompletionHandler(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 transition-transform text-white font-bold px-8 py-3"
                >
                  View Results & XP
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {showCompletionHandler && (
          <GameCompletionHandler
            gameId="fraction-simplify"
            gameName="Fraction Simplify"
            score={score * 10}
            correctAnswers={score}
            totalQuestions={totalQuestions}
            timeSpentSeconds={Math.round((Date.now() - gameStartTime.current) / 1000)}
            difficulty={difficulty}
            onPlayAgain={() => {
              setShowCompletionHandler(false);
              gameStartTime.current = Date.now();
              startGame(difficulty);
            }}
            onClose={() => {
              setShowCompletionHandler(false);
              setGameState('menu');
            }}
          />
        )}

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link to="/" className="text-purple-600 hover:text-purple-800 font-medium">
            ← Back to Games
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FractionSimplify;
