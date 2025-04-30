
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Bird, Bug, Cat } from "lucide-react";
import AnimalQuiz from "@/components/AnimalQuiz";
import AnimalLearning from "@/components/AnimalLearning";
import EcosystemGame from "@/components/EcosystemGame";

const AnimalsGame = () => {
  const [activeGame, setActiveGame] = useState<"learning" | "quiz" | "ecosystem">("learning");

  const startQuiz = () => {
    setActiveGame("quiz");
    toast.success("Let's test your knowledge about animals!");
  };

  const startEcosystemGame = () => {
    setActiveGame("ecosystem");
    toast.success("Welcome to the Ecosystem Balance Challenge!");
  };

  const returnToLearning = () => {
    setActiveGame("learning");
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
          {activeGame !== "learning" ? (
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
          {activeGame === "learning" && (
            <>
              <div className="text-center mb-10">
                <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
                  Learn about the amazing world of animals, insects, and birds before testing your knowledge or trying the ecosystem challenge!
                </p>
              </div>

              <AnimalLearning />

              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button 
                    onClick={startQuiz} 
                    className="text-lg px-8 py-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all w-full md:w-auto"
                  >
                    Start Quiz Challenge!
                  </Button>
                </motion.div>

                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button 
                    onClick={startEcosystemGame} 
                    className="text-lg px-8 py-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all w-full md:w-auto"
                  >
                    Play Ecosystem Challenge!
                  </Button>
                </motion.div>
              </div>
            </>
          )}

          {activeGame === "quiz" && (
            <AnimalQuiz />
          )}

          {activeGame === "ecosystem" && (
            <EcosystemGame />
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimalsGame;
