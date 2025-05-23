
import { 
  PlayerProgress, 
  LevelConfig,
  MathProblem,
  Achievement,
  OperationType,
  GameMode,
  PowerupType,
  GameState
} from "@/types/arithmeticHero";

// Level configurations
export const levels: LevelConfig[] = [
  {
    id: 1,
    name: "Rookie Hero",
    description: "Addition with two-digit + one-digit (no regrouping)",
    minDigits: [1, 1],
    maxDigits: [2, 1],
    allowNegative: false,
    speed: 8000, // 8 seconds to fall
    speedIncrease: 200,
    numEquationsPerWave: 5,
    unlockThreshold: 300,
    operations: ["+"]
  },
  {
    id: 2,
    name: "Rising Star",
    description: "Addition and subtraction with two-digit numbers",
    minDigits: [2, 1],
    maxDigits: [2, 2],
    allowNegative: false,
    speed: 7000,
    speedIncrease: 250,
    numEquationsPerWave: 6,
    unlockThreshold: 600,
    operations: ["+", "-"]
  },
  {
    id: 3,
    name: "Math Defender",
    description: "Addition, subtraction and multiplication",
    minDigits: [2, 2],
    maxDigits: [3, 2],
    allowNegative: false,
    speed: 6000,
    speedIncrease: 300,
    numEquationsPerWave: 7,
    unlockThreshold: 1000,
    operations: ["+", "-", "×"]
  },
  {
    id: 4,
    name: "Number Captain",
    description: "All operations including simple division",
    minDigits: [2, 1],
    maxDigits: [3, 2],
    allowNegative: false,
    speed: 5500,
    speedIncrease: 350,
    numEquationsPerWave: 8,
    unlockThreshold: 1500,
    operations: ["+", "-", "×", "÷"]
  },
  {
    id: 5,
    name: "Arithmetic Master",
    description: "Advanced multi-digit arithmetic with power-ups",
    minDigits: [2, 2],
    maxDigits: [3, 3],
    allowNegative: true, // Allow negative numbers at highest level
    speed: 5000,
    speedIncrease: 400,
    numEquationsPerWave: 10,
    unlockThreshold: Infinity, // Last level
    operations: ["+", "-", "×", "÷"]
  },
];

// List of achievements
const achievements: Achievement[] = [
  {
    id: "firstCorrect",
    name: "First Zap!",
    description: "Answer your first equation correctly",
    isUnlocked: false,
    icon: "zap"
  },
  {
    id: "streak10",
    name: "On Fire!",
    description: "Get a streak of 10 correct answers",
    isUnlocked: false,
    icon: "fire"
  },
  {
    id: "streak20",
    name: "Lightning Fingers",
    description: "Get a streak of 20 correct answers",
    isUnlocked: false,
    icon: "lightning-bolt"
  },
  {
    id: "level2Unlock",
    name: "Rising Star",
    description: "Unlock Level 2",
    isUnlocked: false,
    icon: "star"
  },
  {
    id: "level3Unlock",
    name: "Math Defender",
    description: "Unlock Level 3",
    isUnlocked: false,
    icon: "shield"
  },
  {
    id: "level4Unlock",
    name: "Number Captain",
    description: "Unlock Level 4",
    isUnlocked: false,
    icon: "star"
  },
  {
    id: "level5Unlock",
    name: "Arithmetic Master",
    description: "Unlock Level 5",
    isUnlocked: false,
    icon: "award"
  },
  {
    id: "correct100",
    name: "Century Club",
    description: "Answer 100 equations correctly",
    isUnlocked: false,
    icon: "medal"
  },
  {
    id: "correct500",
    name: "Big Brain",
    description: "Answer 500 equations correctly",
    isUnlocked: false,
    icon: "medal"
  }
];

// Default player progress
const defaultPlayerProgress: PlayerProgress = {
  highScores: {
    arcade: [0, 0, 0, 0, 0], // One for each level
    challenge: 0
  },
  unlockedLevels: 1, // Start with only level 1 unlocked
  totalCorrectAnswers: 0,
  longestStreak: 0,
  achievements: JSON.parse(JSON.stringify(achievements)),
  pendingAchievements: [],
  avatarItems: {
    cape: "default",
    mask: "default",
    color: "blue",
    emblem: "lightning"
  },
  unlockedItems: ["default-cape", "default-mask", "blue-color", "lightning-emblem"]
};

// Utility functions
const generateRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to generate a random number with specific number of digits
export const generateNumberWithDigits = (minDigits: number, maxDigits: number): number => {
  const min = Math.pow(10, minDigits - 1);
  const max = Math.pow(10, maxDigits) - 1;
  return generateRandomNumber(min, max);
};

// Calculate result based on operation
const calculateResult = (first: number, second: number, operation: OperationType): number => {
  switch (operation) {
    case "+":
      return first + second;
    case "-":
      return first - second;
    case "×":
      return first * second;
    case "÷":
      return Math.floor(first / second); // Integer division for simplicity
    default:
      return 0;
  }
};

// Game service
export const gameService = {
  // Initialize game data
  initializeGameData: (): void => {
    const savedProgress = localStorage.getItem("arithmeticHeroProgress");
    
    if (!savedProgress) {
      localStorage.setItem("arithmeticHeroProgress", JSON.stringify(defaultPlayerProgress));
    } else {
      // Check for and convert existing AdditionHero data if present
      const oldProgress = localStorage.getItem("additionHeroProgress");
      if (oldProgress && !savedProgress) {
        localStorage.setItem("arithmeticHeroProgress", oldProgress);
      }
    }
  },

  // Get player progress
  getPlayerProgress: (): PlayerProgress => {
    const savedProgress = localStorage.getItem("arithmeticHeroProgress");
    return savedProgress ? JSON.parse(savedProgress) : defaultPlayerProgress;
  },

  // Save player progress
  savePlayerProgress: (progress: PlayerProgress): void => {
    localStorage.setItem("arithmeticHeroProgress", JSON.stringify(progress));
  },

  // Get pending achievements
  getPendingAchievements: (): Achievement[] => {
    const progress = gameService.getPlayerProgress();
    return progress.pendingAchievements;
  },

  // Clear pending achievements
  clearPendingAchievements: (): void => {
    const progress = gameService.getPlayerProgress();
    progress.pendingAchievements = [];
    gameService.savePlayerProgress(progress);
  },

  // Generate problems based on level
  generateProblems: (level: number, count: number): MathProblem[] => {
    const levelConfig = levels.find(l => l.id === level) || levels[0];
    
    return Array.from({ length: count }).map((_, index) => {
      // Select a random operation from the available operations for this level
      const operation = levelConfig.operations[Math.floor(Math.random() * levelConfig.operations.length)];
      
      // Generate first number based on level config
      let firstNumber = generateNumberWithDigits(
        levelConfig.minDigits[0], 
        levelConfig.maxDigits[0]
      );
      
      // Generate second number based on level config
      let secondNumber = generateNumberWithDigits(
        levelConfig.minDigits[1], 
        levelConfig.maxDigits[1]
      );
      
      // Special handling for different operations
      if (operation === "-" && !levelConfig.allowNegative) {
        // Ensure first number is >= second number to avoid negative results
        if (firstNumber < secondNumber) {
          [firstNumber, secondNumber] = [secondNumber, firstNumber];
        }
      }
      
      if (operation === "÷") {
        // Make sure division results in a whole number by working backwards
        // First generate a small divisor
        secondNumber = Math.max(2, secondNumber % 12 || 2);
        // Then calculate a dividend that works with this divisor
        firstNumber = secondNumber * generateRandomNumber(2, Math.min(20, Math.pow(10, levelConfig.maxDigits[0]) / secondNumber));
      }
      
      // Calculate correct answer based on operation
      const correctAnswer = calculateResult(firstNumber, secondNumber, operation);
      
      // Include power-ups at higher levels
      const isPowerup = level >= 3 && Math.random() < 0.1;
      const powerupTypes: ["slowMotion", "doublePoints", "shield", "multiZap"] = 
        ["slowMotion", "doublePoints", "shield", "multiZap"];
      
      return {
        id: `problem-${Date.now()}-${index}`,
        firstNumber,
        secondNumber,
        operation,
        correctAnswer,
        position: {
          x: 10 + Math.random() * 80, // Random x position between 10-90%
          y: -10 // Start above screen
        },
        speed: levelConfig.speed - (level * 100), // Adjust speed based on level
        isSolved: false,
        isPowerup,
        powerupType: isPowerup ? powerupTypes[Math.floor(Math.random() * powerupTypes.length)] : undefined
      };
    });
  },

  // Generate multiple choice options for a problem
  generateOptions: (correctAnswer: number, count: number = 4): number[] => {
    const options = [correctAnswer];
    
    // Add incorrect options
    while (options.length < count) {
      // Generate close but incorrect answers
      let incorrectOption: number;
      
      if (Math.random() < 0.5) {
        // Random change within +/- 10 or +/- 20% of answer, whichever is greater
        const range = Math.max(10, Math.abs(Math.floor(correctAnswer * 0.2)));
        incorrectOption = correctAnswer + (Math.floor(Math.random() * 2 * range) - range);
        
        // Ensure it's not the correct answer
        if (incorrectOption === correctAnswer) {
          incorrectOption += 1;
        }
      } else {
        // Common mistake: off-by-one or swapped digits
        const correctStr = Math.abs(correctAnswer).toString();
        const digits = correctStr.split('');
        
        if (Math.random() < 0.5 && digits.length > 1) {
          // Swap two adjacent digits
          const pos = Math.floor(Math.random() * (digits.length - 1));
          [digits[pos], digits[pos + 1]] = [digits[pos + 1], digits[pos]];
        } else {
          // Change a single digit
          const pos = Math.floor(Math.random() * digits.length);
          const newDigit = (parseInt(digits[pos]) + Math.floor(Math.random() * 9) + 1) % 10;
          digits[pos] = newDigit.toString();
        }
        
        incorrectOption = parseInt(digits.join(''));
        // Apply same sign as correct answer
        if (correctAnswer < 0) incorrectOption = -incorrectOption;
      }
      
      // Don't add duplicates and ensure reasonably sized numbers
      if (!options.includes(incorrectOption) && Math.abs(incorrectOption) < 10000) {
        options.push(incorrectOption);
      }
    }
    
    // Shuffle options
    return options.sort(() => Math.random() - 0.5);
  },

  // Update high scores
  updateHighScore: (mode: GameMode, level: number, score: number): boolean => {
    try {
      // Get existing progress data
      const progress = gameService.getPlayerProgress();
      let isNewHighScore = false;

      // Update high scores based on game mode
      if (mode === "arcade") {
        // Ensure the level exists in the array
        while (progress.highScores.arcade.length < level) {
          progress.highScores.arcade.push(0);
        }

        // Check if this is a new high score for this level
        if (score > progress.highScores.arcade[level - 1]) {
          progress.highScores.arcade[level - 1] = score;
          isNewHighScore = true;
        }
      } else if (mode === "challenge") {
        // Update challenge high score if better
        if (score > progress.highScores.challenge) {
          progress.highScores.challenge = score;
          isNewHighScore = true;
        }
      } 
      // Practice mode doesn't update high scores, but we need to handle it
      // to avoid the type error

      // Save updated progress
      gameService.savePlayerProgress(progress);
      return isNewHighScore;
    } catch (err) {
      console.error("Failed to update high score:", err);
      return false;
    }
  },

  // Check if level should unlock and update progress
  checkLevelProgress: (level: number, score: number): boolean => {
    const levelConfig = levels.find(l => l.id === level);
    if (!levelConfig) return false;
    
    const progress = gameService.getPlayerProgress();
    const nextLevel = level + 1;
    
    // If this is the current highest unlocked level and score meets threshold
    if (nextLevel <= levels.length && 
        progress.unlockedLevels < nextLevel && 
        score >= levelConfig.unlockThreshold) {
      progress.unlockedLevels = nextLevel;
      gameService.savePlayerProgress(progress);
      
      // Unlock achievement for this level
      const achievementId = `level${nextLevel}Unlock`;
      gameService.unlockAchievement(achievementId);
      
      return true;
    }
    
    return false;
  },

  // Update total correct answers
  updateTotalCorrectAnswers: (count: number): void => {
    const progress = gameService.getPlayerProgress();
    progress.totalCorrectAnswers += count;
    gameService.savePlayerProgress(progress);
    
    // Check achievements
    if (progress.totalCorrectAnswers >= 1 && progress.totalCorrectAnswers < count + 1) {
      gameService.unlockAchievement("firstCorrect");
    }
    if (progress.totalCorrectAnswers >= 100 && progress.totalCorrectAnswers - count < 100) {
      gameService.unlockAchievement("correct100");
    }
    if (progress.totalCorrectAnswers >= 500 && progress.totalCorrectAnswers - count < 500) {
      gameService.unlockAchievement("correct500");
    }
  },

  // Update longest streak
  updateLongestStreak: (streak: number): void => {
    const progress = gameService.getPlayerProgress();
    
    if (streak > progress.longestStreak) {
      progress.longestStreak = streak;
      gameService.savePlayerProgress(progress);
      
      // Check achievements
      if (streak >= 10) {
        gameService.unlockAchievement("streak10");
      }
      if (streak >= 20) {
        gameService.unlockAchievement("streak20");
      }
    }
  },

  // Unlock an achievement
  unlockAchievement: (id: string): void => {
    const progress = gameService.getPlayerProgress();
    const achievement = progress.achievements.find(a => a.id === id);
    
    if (achievement && !achievement.isUnlocked) {
      achievement.isUnlocked = true;
      
      // Add to pending achievements to show notification later
      progress.pendingAchievements.push({...achievement});
      
      gameService.savePlayerProgress(progress);
    }
  },

  // Get all achievements
  getAchievements: (): Achievement[] => {
    const progress = gameService.getPlayerProgress();
    return progress.achievements;
  },

  // Get unlocked avatar items
  getUnlockedItems: (): string[] => {
    const progress = gameService.getPlayerProgress();
    return progress.unlockedItems;
  },

  // Unlock a new avatar item
  unlockItem: (itemId: string): void => {
    const progress = gameService.getPlayerProgress();
    if (!progress.unlockedItems.includes(itemId)) {
      progress.unlockedItems.push(itemId);
      gameService.savePlayerProgress(progress);
    }
  },

  // Update avatar items
  updateAvatar: (avatar: { cape?: string, mask?: string, color?: string, emblem?: string }): void => {
    const progress = gameService.getPlayerProgress();
    progress.avatarItems = {...progress.avatarItems, ...avatar};
    gameService.savePlayerProgress(progress);
  },

  // Get current avatar
  getAvatar: (): { cape: string, mask: string, color: string, emblem: string } => {
    const progress = gameService.getPlayerProgress();
    return progress.avatarItems;
  },
  
  // Export generateNumberWithDigits to the service object
  generateNumberWithDigits,
  
  // Export calculateResult function
  calculateResult
};
