
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { Bird, Bug, Cat, ArrowRight, Check, CircleCheck, CircleX } from "lucide-react";
import { cn } from "@/lib/utils";

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
    image: "https://images.unsplash.com/photo-1501286353178-1ec881214838",
    name: "Monkey",
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

  // Initialize with shuffled questions
  useEffect(() => {
    const shuffled = [...quizItems].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
  }, []);

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  const checkAnswer = (answer: string) => {
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
    setTimeout(() => {
      if (currentQuestionIndex < shuffledQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setShowFeedback(false);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setQuizComplete(true);
      }
    }, 2000);
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
    
    toast.info("Let's play again!");
  };

  // Calculate progress percentage
  const progress = ((currentQuestionIndex) / shuffledQuestions.length) * 100;

  if (quizComplete) {
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
            <h3 className="text-2xl font-medium text-center mb-6">What type of creature is this?</h3>
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
    </div>
  );
};

export default AnimalQuiz;
