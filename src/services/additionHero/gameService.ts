import { 
  PlayerProgress, 
  LevelConfig,
  MathProblem,
  Achievement
} from "@/types/additionHero";

// Level configurations
export const levels: LevelConfig[] = [
  {
    id: 1,
    name: "Rookie Hero",
    description: "Two-digit + one-digit (no regrouping)",
    minDigits: [1, 1],
    maxDigits: [2, 1],
    allowNegative: false,
    speed: 8000, // 8 seconds to fall
    speedIncrease: 200,
    numEquationsPerWave: 5,
    unlockThreshold: 300
  },
  {
    id: 2,
    name: "Rising Star",
    description: "Two-digit + two-digit (with/without regrouping)",
    minDigits: [2, 1],
    maxDigits: [2, 2],
    allowNegative: false,
    speed: 7000,
    speedIncrease: 250,
    numEquationsPerWave: 6,
    unlockThreshold: 600
  },
  {
    id: 3,
    name: "Math Defender",
    description: "Three-digit + two-digit (with regrouping)",
    minDigits: [2, 2],
    maxDigits: [3, 2],
    allowNegative: false,
    speed: 6000,
    speedIncrease: 300,
    numEquationsPerWave: 7,
    unlockThreshold: 1000
  },
  {
    id: 4,
    name: "Number Captain",
    description: "Three-digit + three-digit",
    minDigits: [3, 2],
    maxDigits: [3, 3],
    allowNegative: false,
    speed: 5500,
    speedIncrease: 350,
    numEquationsPerWave: 8,
    unlockThreshold: 1500
  },
  {
    id: 5,
    name: "Addition Master",
    description: "Multi-digit addition with power-ups",
    minDigits: [2, 2],
    maxDigits: [3, 3],
    allowNegative: false,
    speed: 5000,
    speedIncrease: 400,
    numEquationsPerWave: 10,
    unlockThreshold: Infinity // Last level
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
    name: "Addition Master",
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

// Export this function so it's available to components
export const generateNumberWithDigits = (minDigits: number, maxDigits: number): number => {
  const min = Math.pow(10, minDigits - 1);
  const max = Math.pow(10, maxDigits) - 1;
  return generateRandomNumber(min, max);
};

// Game service
export const gameService = {
  // Initialize game data
  initializeGameData: (): void => {
    const savedProgress = localStorage.getItem("additionHeroProgress");
    
    if (!savedProgress) {
      localStorage.setItem("additionHeroProgress", JSON.stringify(defaultPlayerProgress));
    }
  },

  // Get player progress
  getPlayerProgress: (): PlayerProgress => {
    const savedProgress = localStorage.getItem("additionHeroProgress");
    return savedProgress ? JSON.parse(savedProgress) : defaultPlayerProgress;
  },

  // Save player progress
  savePlayerProgress: (progress: PlayerProgress): void => {
    localStorage.setItem("additionHeroProgress", JSON.stringify(progress));
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
      const firstNumber = generateNumberWithDigits(
        levelConfig.minDigits[0], 
        levelConfig.maxDigits[0]
      );
      
      const secondNumber = generateNumberWithDigits(
        levelConfig.minDigits[1], 
        levelConfig.maxDigits[1]
      );
      
      // Include power-ups at higher levels
      const isPowerup = level >= 3 && Math.random() < 0.1;
      const powerupTypes: ["slowMotion", "doublePoints", "shield", "multiZap"] = 
        ["slowMotion", "doublePoints", "shield", "multiZap"];
      
      return {
        id: `problem-${Date.now()}-${index}`,
        firstNumber,
        secondNumber,
        operation: "+",
        correctAnswer: firstNumber + secondNumber,
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
        // Random change within +/- 10
        incorrectOption = correctAnswer + (Math.floor(Math.random() * 20) - 10);
        
        // Ensure it's not the correct answer
        if (incorrectOption === correctAnswer) {
          incorrectOption += 1;
        }
      } else {
        // Common mistake: off-by-one or swapped digits
        const correctStr = correctAnswer.toString();
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
      }
      
      // Don't add duplicates
      if (!options.includes(incorrectOption) && incorrectOption > 0) {
        options.push(incorrectOption);
      }
    }
    
    // Shuffle options
    return options.sort(() => Math.random() - 0.5);
  },

  // Update high scores
  updateHighScore: (mode: "arcade" | "challenge", level: number, score: number): boolean => {
    const progress = gameService.getPlayerProgress();
    let isNewHighScore = false;
    
    if (mode === "arcade") {
      if (score > (progress.highScores.arcade[level - 1] || 0)) {
        progress.highScores.arcade[level - 1] = score;
        isNewHighScore = true;
      }
    } else if (mode === "challenge") {
      if (score > progress.highScores.challenge) {
        progress.highScores.challenge = score;
        isNewHighScore = true;
      }
    }
    
    gameService.savePlayerProgress(progress);
    return isNewHighScore;
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
  
  // Add generateNumberWithDigits to the service object
  generateNumberWithDigits
};
