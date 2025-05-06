import { ShapeType } from "@/types/puzzleTypes";

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
  
  // Available shapes
  const shapes: ShapeType[] = ["circle", "square", "triangle", "hexagon", "star", "clock"];
  
  // Generate values for shapes (1-9)
  const shapeValues: Record<ShapeType, number> = {
    circle: Math.floor(random() * 9) + 1,
    square: Math.floor(random() * 9) + 1,
    triangle: Math.floor(random() * 9) + 1,
    hexagon: Math.floor(random() * 9) + 1,
    star: Math.floor(random() * 9) + 1,
    clock: Math.floor(random() * 9) + 1
  };
  
  // Generate operations for some shapes
  const operations: Record<ShapeType, string> = {
    circle: ["", "+", "-", "*", "/"][Math.floor(random() * 5)],
    square: ["", "+", "-", "*", "/"][Math.floor(random() * 5)],
    triangle: ["", "+", "-", "*", "/"][Math.floor(random() * 5)],
    hexagon: ["", "+", "-", "*", "/"][Math.floor(random() * 5)],
    star: ["", "+", "-", "*", "/"][Math.floor(random() * 5)],
    clock: ["", "+", "-", "*", "/"][Math.floor(random() * 5)],
  };
  
  // Make sure we have at least one operation
  let hasOperation = false;
  for (const op of Object.values(operations)) {
    if (op) {
      hasOperation = true;
      break;
    }
  }
  
  if (!hasOperation) {
    const randomShapeIndex = Math.floor(random() * shapes.length);
    operations[shapes[randomShapeIndex]] = ["+", "-", "*", "/"][Math.floor(random() * 4)];
  }
  
  // Select 4-6 shapes for today's puzzle
  const numberOfShapes = Math.floor(random() * 3) + 4; // 4-6 shapes
  const shuffledShapes = [...shapes].sort(() => random() - 0.5);
  const todaysShapes = shuffledShapes.slice(0, numberOfShapes);
  
  // Create a valid solution with these shapes
  const solution = createSolution(todaysShapes, shapeValues, operations);
  
  return {
    shapes: todaysShapes,
    solution: solution.equation,
    target: solution.result,
    shapeValues,
    operations,
  };
};

// Create a valid equation and calculate its result
const createSolution = (
  shapes: ShapeType[],
  values: Record<ShapeType, number>,
  operations: Record<ShapeType, string>
) => {
  // Keep only 3-4 shapes for the solution
  const solutionLength = Math.min(shapes.length - 1, Math.floor(Math.random() * 2) + 3);
  const solutionShapes = [...shapes].sort(() => Math.random() - 0.5).slice(0, solutionLength);
  
  // Build the equation
  let equation: ShapeType[] = [];
  let hasOperator = false;
  
  for (let i = 0; i < solutionShapes.length; i++) {
    const shape = solutionShapes[i];
    
    // Decide whether to use this shape as a number or operator
    if (operations[shape] && !hasOperator && i > 0) {
      equation.push(shape); // Use as an operator
      hasOperator = true;
    } else {
      // Use as a number
      equation.push(shape);
    }
  }
  
  // If no operator yet, replace a position with an operator
  if (!hasOperator && equation.length > 1) {
    for (let i = 1; i < equation.length; i++) {
      const shape = equation[i];
      if (operations[shape]) {
        // Swap positions to ensure operator is between two numbers
        const temp = equation[1];
        equation[1] = shape;
        equation[i] = temp;
        hasOperator = true;
        break;
      }
    }
  }
  
  // If still no operator, we'll just calculate the sum
  const result = evaluateEquation(equation, values, operations);
  
  return { equation, result };
};

// Evaluate an equation consisting of shapes
export const evaluateEquation = (
  equation: ShapeType[],
  values: Record<ShapeType, number>,
  operations: Record<ShapeType, string>
): number => {
  if (equation.length === 0) return 0;
  
  // Start with the first number
  let result = values[equation[0]];
  
  for (let i = 1; i < equation.length; i++) {
    const shape = equation[i];
    const op = operations[shape];
    
    if (op) {
      // This is an operator
      i++;
      if (i < equation.length) {
        const nextValue = values[equation[i]];
        
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
            if (nextValue !== 0) {
              result /= nextValue;
            }
            break;
        }
      }
    } else {
      // This is a number, use addition by default
      result += values[shape];
    }
  }
  
  return Math.round(result * 100) / 100; // Round to 2 decimal places
};

// Check user's guess against solution and provide feedback
export const checkGuess = (
  guess: ShapeType[],
  solution: ShapeType[]
): ("correct" | "wrong-position" | "incorrect")[] => {
  const result: ("correct" | "wrong-position" | "incorrect")[] = Array(guess.length).fill("incorrect");
  const solutionUsed = Array(solution.length).fill(false);
  
  // First pass: find exact matches
  for (let i = 0; i < guess.length; i++) {
    if (i < solution.length && guess[i] === solution[i]) {
      result[i] = "correct";
      solutionUsed[i] = true;
    }
  }
  
  // Second pass: find partial matches (right shape, wrong position)
  for (let i = 0; i < guess.length; i++) {
    if (result[i] === "incorrect") {
      for (let j = 0; j < solution.length; j++) {
        if (!solutionUsed[j] && guess[i] === solution[j]) {
          result[i] = "wrong-position";
          solutionUsed[j] = true;
          break;
        }
      }
    }
  }
  
  return result;
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
