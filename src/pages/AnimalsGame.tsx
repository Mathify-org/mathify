import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import AnimalLearning from "@/components/AnimalLearning";

const AnimalsGame = () => {
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
          <div className="w-28">{/* Placeholder for layout balance */}</div>
        </nav>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
              Learn about the amazing world of animals, insects, and birds!
            </p>
          </div>

          <AnimalLearning />
        </div>
      </div>
    </div>
  );
};

export default AnimalsGame;
