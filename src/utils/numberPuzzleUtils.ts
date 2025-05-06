
import { NumberType, OperationType, ShapeType } from "@/types/puzzleTypes";

// Function to generate a unique seed based on the date
export const generateDailySeed = (): number => {
  const today = new Date();
  return (
    today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  );
};

// Simple pseudo-random number generator using seed
export const seededRandom = (seed: number): (() => number) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

// Generate a daily puzzle
export const generateDailyPuzzle = () => {
  const seed = generateDailySeed();
  const random = seededRandom(seed);
  
  // Generate available numbers (1-9)
  const availableNumbers: NumberType[] = [];
  const usedNumbers: Record<number, boolean> = {};
  
  // Generate 5-7 unique numbers
  const numCount = Math.floor(random() * 3) + 5; // 5-7 numbers
  
  while (availableNumbers.length < numCount) {
    const num = Math.floor(random() * 9) + 1 as NumberType;
    if (!usedNumbers[num]) {
      availableNumbers.push(num);
      usedNumbers[num] = true;
    }
  }
  
  // Available operations
  const availableOperations: OperationType[] = ["+", "-", "*", "/"];
  
  // Create a valid solution
  const solution = createSolution(availableNumbers, availableOperations, random);
  
  return {
    availableNumbers,
    availableOperations,
    solution: solution.equation,
    target: solution.result,
  };
};

// Create a valid equation and calculate its result
const createSolution = (
  availableNumbers: NumberType[],
  availableOperations: OperationType[],
  random: () => number
) => {
  // Keep only 3-4 numbers for the solution
  const valueCount = Math.min(availableNumbers.length, Math.floor(random() * 2) + 3);
  const shuffledNumbers = [...availableNumbers].sort(() => random() - 0.5);
  const solutionValues = shuffledNumbers.slice(0, valueCount);
  
  // Build operations
  const solutionOperations: (OperationType | null)[] = [];
  for (let i = 0; i < solutionValues.length - 1; i++) {
    const opIndex = Math.floor(random() * availableOperations.length);
    solutionOperations.push(availableOperations[opIndex]);
  }
  
  // Calculate result
  const result = evaluateEquation(solutionValues, solutionOperations);
  
  return { 
    equation: {
      values: solutionValues,
      operations: solutionOperations
    }, 
    result 
  };
};

// Evaluate an equation
export const evaluateEquation = (
  values: NumberType[],
  operations: (OperationType | null)[]
): number => {
  if (values.length === 0) return 0;
  
  // Start with the first number
  let result = values[0];
  
  for (let i = 0; i < operations.length; i++) {
    const op = operations[i];
    const nextValue = values[i + 1];
    
    if (!nextValue) continue;
    
    switch (op) {
      case "+":
        result += nextValue;
        break;
      case "-":
        result -= nextValue;
        break;
      case "*":
        result *= nextValue;
        break;
      case "/":
        // Prevent division by zero
        if (nextValue !== 0 as NumberType) { // Fix here: compare with 0 as NumberType
          result /= nextValue;
          // Round to 2 decimal places to prevent floating point issues
          result = Math.round(result * 100) / 100;
        }
        break;
    }
  }
  
  return result;
};

// Check user's guess against solution and provide feedback
export const checkGuess = (
  values: NumberType[],
  operations: (OperationType | null)[],
  solutionValues: NumberType[],
  solutionOperations: (OperationType | null)[]
): ("correct" | "wrong-position" | "incorrect")[] => {
  const feedback: ("correct" | "wrong-position" | "incorrect")[] = [];
  const solutionValuesUsed = Array(solutionValues.length).fill(false);
  const solutionOperationsUsed = Array(solutionOperations.length).fill(false);
  
  // Check values
  for (let i = 0; i < values.length; i++) {
    if (i < solutionValues.length && values[i] === solutionValues[i]) {
      feedback.push("correct");
      solutionValuesUsed[i] = true;
    } else {
      let foundMatch = false;
      for (let j = 0; j < solutionValues.length; j++) {
        if (!solutionValuesUsed[j] && values[i] === solutionValues[j]) {
          feedback.push("wrong-position");
          solutionValuesUsed[j] = true;
          foundMatch = true;
          break;
        }
      }
      if (!foundMatch) {
        feedback.push("incorrect");
      }
    }
  }
  
  // Check operations
  for (let i = 0; i < operations.length; i++) {
    if (i < solutionOperations.length && operations[i] === solutionOperations[i]) {
      feedback.push("correct");
      solutionOperationsUsed[i] = true;
    } else {
      let foundMatch = false;
      for (let j = 0; j < solutionOperations.length; j++) {
        if (!solutionOperationsUsed[j] && operations[i] === solutionOperations[j]) {
          feedback.push("wrong-position");
          solutionOperationsUsed[j] = true;
          foundMatch = true;
          break;
        }
      }
      if (!foundMatch) {
        feedback.push("incorrect");
      }
    }
  }
  
  return feedback;
};

// Function to get time until next puzzle
export const getTimeToNextPuzzle = (): string => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const diff = tomorrow.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// Generate share text
export const generateShareText = (
  guesses: number,
  maxGuesses: number,
  won: boolean,
  streak: number
): string => {
  const date = new Date().toLocaleDateString();
  const result = won ? 
    `I solved today's Math Puzzle in ${guesses}/${maxGuesses} tries!` : 
    `Today's Math Puzzle stumped me!`;
  
  return `Daily Math Puzzle - ${date}\n\n${result}\nCurrent streak: ${streak}\n\nPlay at mathify.lovableproject.com`;
};
