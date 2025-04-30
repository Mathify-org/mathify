
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Bird, Bug, Cat } from "lucide-react";
import AnimalQuiz from "@/components/AnimalQuiz";
import AnimalLearning from "@/components/AnimalLearning";

const AnimalsGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [showLearning, setShowLearning] = useState(true);

  const startQuiz = () => {
    setShowLearning(false);
    setGameStarted(true);
    toast.success("Let's test your knowledge about animals!");
  };

  const returnToLearning = () => {
    setShowLearning(true);
    setGameStarted(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 pb-10">
      <div className="container mx-auto py-10 px-4">
        <nav className="mb-8 flex justify-between items-center">
          <Link to="/">
            <Button variant="outline" className="hover:scale-105 transition-transform">
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
            Animal Kingdom Explorer
          </h1>
          {gameStarted ? (
            <Button 
              onClick={returnToLearning} 
              variant="outline" 
              className="hover:scale-105 transition-transform"
            >
              Back to Learning
            </Button>
          ) : (
            <div className="w-28">{/* Placeholder for layout balance */}</div>
          )}
        </nav>

        <div className="max-w-6xl mx-auto">
          {showLearning ? (
            <>
              <div className="text-center mb-10">
                <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
                  Learn about the amazing world of animals, insects, and birds before testing your knowledge!
                </p>
              </div>

              <AnimalLearning />

              <motion.div 
                className="mt-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button 
                  onClick={startQuiz} 
                  className="text-lg px-8 py-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all"
                >
                  Start Quiz Challenge!
                </Button>
              </motion.div>
            </>
          ) : (
            <AnimalQuiz />
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimalsGame;
