
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { Bird, Bug, Cat, ArrowRight, Check, CircleCheck, CircleX, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import GameCompletionHandler from "@/components/GameCompletionHandler";

interface QuizItem {
  id: number;
  image: string;
  name: string;
  type: "animal" | "insect" | "bird";
}

const quizItems: QuizItem[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
    name: "Cat",
    type: "animal"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1498936178812-4b2e558d2937",
    name: "Bee",
    type: "insect"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1441057206919-63d19fac2369",
    name: "Penguin",
    type: "bird"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1485833077593-4278bba3f11f",
    name: "Deer",
    type: "animal"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1517022812141-23620dba5c23",
    name: "Sheep",
    type: "animal"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1518877593221-1f28583780b4",
    name: "Whale",
    type: "animal"
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1",
    name: "Kitten",
    type: "animal"
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1501286353178-1ec871814838",
    name: "Monkey",
    type: "animal"
  },
  {
    id: 9,
    image: "https://images.unsplash.com/photo-1444464666168-49d633b86797",
    name: "Eagle",
    type: "bird"
  },
  {
    id: 10,
    image: "https://images.unsplash.com/photo-1579210777452-3ff074542e42",
    name: "Parrot",
    type: "bird"
  },
  {
    id: 11,
    image: "https://images.unsplash.com/photo-1480044965905-02098d419e96",
    name: "Robin",
    type: "bird"
  },
  {
    id: 12,
    image: "https://images.unsplash.com/photo-1554490828-442467b562ff",
    name: "Butterfly",
    type: "insect"
  },
  {
    id: 13,
    image: "https://images.unsplash.com/photo-1452570053594-1b985d6ea890",
    name: "Ladybug",
    type: "insect"
  },
  {
    id: 14,
    image: "https://images.unsplash.com/photo-1574950578143-858c6fc58922",
    name: "Spider",
    type: "insect"
  },
  {
    id: 15,
    image: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef3",
    name: "Lion",
    type: "animal"
  }
];

const encouragingMessages = [
  "Fantastic job! 🌟",
  "You're amazing! 🎉",
  "Brilliant! 🚀",
  "Super smart! 🧠",
  "You're a star! ⭐",
  "Incredible work! 👏",
  "Excellent! 🏆",
  "You got it right! 🙌",
  "Outstanding! 💫",
  "Wonderful! 🎯"
];

const AnimalQuiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [quizComplete, setQuizComplete] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [shuffledQuestions, setShuffledQuestions] = useState<QuizItem[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(5);
  const [timerActive, setTimerActive] = useState(true);
  const [showCompletion, setShowCompletion] = useState(false);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);

  // Initialize with shuffled questions
  useEffect(() => {
    const shuffled = [...quizItems].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    setGameStartTime(Date.now());
  }, []);

  // Timer effect
  useEffect(() => {
    if (!timerActive || showFeedback) return;
    
    const timer = setTimeout(() => {
      if (timeRemaining > 0) {
        setTimeRemaining(prev => prev - 1);
      } else {
        // Time's up, treat as wrong answer
        handleTimeUp();
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeRemaining, timerActive, showFeedback]);

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  const handleTimeUp = () => {
    setTimerActive(false);
    setShowFeedback(true);
    setFeedbackMessage(`Time's up! This is a ${currentQuestion?.type}.`);
    toast.error("Time's up! Try to answer faster next time.");
    
    // Move to next question after a short delay
    setTimeout(() => moveToNextQuestion(), 2000);
  };

  const moveToNextQuestion = useCallback(() => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowFeedback(false);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setTimeRemaining(5);
      setTimerActive(true);
    } else {
      setQuizComplete(true);
      setShowCompletion(true);
    }
  }, [currentQuestionIndex, shuffledQuestions.length]);

  const checkAnswer = (answer: string) => {
    setTimerActive(false);
    const correct = answer === currentQuestion?.type;
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setScore(score + 1);
      const randomMessage = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
      setFeedbackMessage(randomMessage);
      
      // Confetti celebration for correct answers
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      toast.success(randomMessage);
    } else {
      setFeedbackMessage(`Oops! That's not right. This is a ${currentQuestion?.type}.`);
      toast.error(`It's actually a ${currentQuestion?.type}. Try again next time!`);
    }
    
    // Move to next question after a short delay
    setTimeout(() => moveToNextQuestion(), 2000);
  };

  const restartQuiz = () => {
    // Shuffle questions again
    const shuffled = [...quizItems].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    
    // Reset quiz state
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizComplete(false);
    setShowFeedback(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setTimeRemaining(5);
    setTimerActive(true);
    setShowCompletion(false);
    setGameStartTime(Date.now());
    
    toast.info("Let's play again!");
  };

  const handlePlayAgain = () => {
    setShowCompletion(false);
    restartQuiz();
  };

  const handleExitGame = () => {
    setShowCompletion(false);
    setQuizComplete(false);
    // Reset to initial state
    const shuffled = [...quizItems].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowFeedback(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setTimeRemaining(5);
    setTimerActive(true);
  };

  const getTimeSpent = () => {
    if (!gameStartTime) return 0;
    return Math.round((Date.now() - gameStartTime) / 1000);
  };

  // Calculate progress percentage
  const progress = ((currentQuestionIndex) / shuffledQuestions.length) * 100;

  if (quizComplete && !showCompletion) {
    return (
      <motion.div 
        className="text-center py-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-10 rounded-xl max-w-md mx-auto mb-8">
          <p className="text-2xl font-bold text-purple-800 mb-2">Your Score</p>
          <p className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            {score} / {shuffledQuestions.length}
          </p>
          <p className="mt-4 text-gray-700">
            {score === shuffledQuestions.length 
              ? "Perfect score! You're an animal expert!" 
              : "Great job! Keep learning about animals, insects, and birds!"}
          </p>
        </div>
        <Button 
          onClick={restartQuiz}
          className="text-lg px-6 py-5 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all"
        >
          Play Again
        </Button>
      </motion.div>
    );
  }
  
  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
          <span>Question {currentQuestionIndex + 1} of {shuffledQuestions.length}</span>
          <span>Score: {score}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="relative mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-medium">What type of creature is this?</h3>
              <div className="flex items-center gap-1 bg-purple-100 px-3 py-1 rounded-full text-purple-700">
                <Timer className="animate-pulse" size={18} />
                <span className="font-bold">{timeRemaining}</span>
              </div>
            </div>
            <div className="aspect-video max-h-[400px] overflow-hidden rounded-xl shadow-lg mb-6">
              <img 
                src={currentQuestion.image}
                alt={`Quiz item ${currentQuestionIndex + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-center text-xl mb-8">{currentQuestion.name}</p>
          </motion.div>
        </AnimatePresence>

        {/* Feedback message overlay */}
        <AnimatePresence>
          {showFeedback && isCorrect && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="bg-green-100 bg-opacity-90 p-8 rounded-2xl shadow-lg text-center">
                <CircleCheck className="mx-auto mb-4 text-green-500" size={60} />
                <h3 className="text-3xl font-bold text-green-700 mb-2">{feedbackMessage}</h3>
              </div>
            </motion.div>
          )}

          {showFeedback && !isCorrect && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="bg-red-100 bg-opacity-90 p-8 rounded-2xl shadow-lg text-center">
                <CircleX className="mx-auto mb-4 text-red-500" size={60} />
                <h3 className="text-2xl font-bold text-red-700 mb-2">{feedbackMessage}</h3>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            className={cn(
              "w-full py-8 text-lg font-medium flex flex-col gap-2 rounded-xl transition-colors",
              selectedAnswer === "animal" && isCorrect === true ? "bg-green-500 hover:bg-green-600" : 
              selectedAnswer === "animal" && isCorrect === false ? "bg-red-500 hover:bg-red-600" : 
              "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            )}
            disabled={showFeedback}
            onClick={() => checkAnswer("animal")}
          >
            <Cat size={36} />
            <span>Animal</span>
          </Button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            className={cn(
              "w-full py-8 text-lg font-medium flex flex-col gap-2 rounded-xl transition-colors",
              selectedAnswer === "insect" && isCorrect === true ? "bg-green-500 hover:bg-green-600" : 
              selectedAnswer === "insect" && isCorrect === false ? "bg-red-500 hover:bg-red-600" : 
              "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            )}
            disabled={showFeedback}
            onClick={() => checkAnswer("insect")}
          >
            <Bug size={36} />
            <span>Insect</span>
          </Button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            className={cn(
              "w-full py-8 text-lg font-medium flex flex-col gap-2 rounded-xl transition-colors",
              selectedAnswer === "bird" && isCorrect === true ? "bg-green-500 hover:bg-green-600" : 
              selectedAnswer === "bird" && isCorrect === false ? "bg-red-500 hover:bg-red-600" : 
              "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            )}
            disabled={showFeedback}
            onClick={() => checkAnswer("bird")}
          >
            <Bird size={36} />
            <span>Bird</span>
          </Button>
        </motion.div>
      </div>

      {/* Game Completion Handler */}
      {showCompletion && (
        <GameCompletionHandler
          gameId="animal-quiz"
          gameName="Animal Kingdom Quiz"
          score={score * 10}
          correctAnswers={score}
          totalQuestions={shuffledQuestions.length}
          difficulty="easy"
          timeSpentSeconds={getTimeSpent()}
          onPlayAgain={handlePlayAgain}
          onClose={handleExitGame}
        />
      )}
    </div>
  );
};

export default AnimalQuiz;
