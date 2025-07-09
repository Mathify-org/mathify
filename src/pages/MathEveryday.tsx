
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Home, BookOpen, Heart, Star, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MathCard {
  id: number;
  title: string;
  situation: string;
  mathConcept: string;
  realExample: string;
  funFact: string;
  icon: string;
  gradient: string;
  bgImage: string;
}

const MathEveryday = () => {
  const [currentCard, setCurrentCard] = useState(0);
  
  const mathCards: MathCard[] = [
    {
      id: 1,
      title: "Cooking & Baking",
      situation: "When Mom makes cookies, she uses math everywhere!",
      mathConcept: "Fractions & Measuring",
      realExample: "1/2 cup of flour + 1/4 cup of sugar = delicious cookies! We measure ingredients and follow recipes.",
      funFact: "Did you know? Doubling a recipe means multiplying every ingredient by 2!",
      icon: "👩‍🍳",
      gradient: "from-orange-400 via-red-400 to-pink-500",
      bgImage: "bg-[radial-gradient(ellipse_at_top,rgba(255,154,158,0.3),transparent_50%)]"
    },
    {
      id: 2,
      title: "Shopping Adventures",
      situation: "Every trip to the store is a math adventure!",
      mathConcept: "Addition & Money",
      realExample: "If candy costs $2 and juice costs $3, you need $5 total. Count your coins and bills!",
      funFact: "Cashiers use math to give you the right change back!",
      icon: "🛒",
      gradient: "from-green-400 via-emerald-400 to-teal-500",
      bgImage: "bg-[radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.3),transparent_50%)]"
    },
    {
      id: 3,
      title: "Building & Creating",
      situation: "Building blocks, LEGO, and crafts all use math!",
      mathConcept: "Shapes & Patterns",
      realExample: "A square has 4 equal sides. A triangle has 3. We use these shapes to build amazing things!",
      funFact: "Architects use geometry to design buildings that won't fall down!",
      icon: "🏗️",
      gradient: "from-blue-400 via-purple-400 to-indigo-500",
      bgImage: "bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.3),transparent_50%)]"
    },
    {
      id: 4,
      title: "Time & Schedules",
      situation: "Every day runs on time and numbers!",
      mathConcept: "Time & Counting",
      realExample: "School starts at 8:00 AM and ends at 3:00 PM. That's 7 hours of learning!",
      funFact: "There are 60 seconds in a minute and 60 minutes in an hour!",
      icon: "⏰",
      gradient: "from-yellow-400 via-amber-400 to-orange-500",
      bgImage: "bg-[radial-gradient(ellipse_at_top_right,rgba(251,191,36,0.3),transparent_50%)]"
    },
    {
      id: 5,
      title: "Sports & Games",
      situation: "Every sport and game is full of math!",
      mathConcept: "Scoring & Statistics",
      realExample: "In basketball, a free throw = 1 point, regular shot = 2 points, three-pointer = 3 points!",
      funFact: "Soccer fields are rectangles, and the goal is exactly 8 yards wide!",
      icon: "⚽",
      gradient: "from-purple-400 via-pink-400 to-rose-500",
      bgImage: "bg-[radial-gradient(ellipse_at_bottom_left,rgba(236,72,153,0.3),transparent_50%)]"
    },
    {
      id: 6,
      title: "Nature & Animals",
      situation: "Math is everywhere in the natural world!",
      mathConcept: "Patterns & Counting",
      realExample: "Flowers often have 5 petals, bees make hexagonal honeycombs, and snowflakes have 6 sides!",
      funFact: "A cat has 4 legs, 2 eyes, and 1 tail. That's 7 body parts to count!",
      icon: "🌸",
      gradient: "from-emerald-400 via-green-400 to-lime-500",
      bgImage: "bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.3),transparent_50%)]"
    },
    {
      id: 7,
      title: "Art & Creativity",
      situation: "Artists use math to create beautiful things!",
      mathConcept: "Symmetry & Patterns",
      realExample: "Butterflies have symmetrical wings - both sides match perfectly! We can draw symmetrical art too.",
      funFact: "The Mona Lisa uses mathematical proportions to look so beautiful!",
      icon: "🎨",
      gradient: "from-cyan-400 via-blue-400 to-indigo-500",
      bgImage: "bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.3),transparent_50%)]"
    },
    {
      id: 8,
      title: "Transportation",
      situation: "Getting from place to place needs math!",
      mathConcept: "Distance & Speed",
      realExample: "If your friend lives 3 blocks away and you walk 1 block per minute, it takes 3 minutes to get there!",
      funFact: "Car speedometers measure how fast you're going in miles per hour!",
      icon: "🚗",
      gradient: "from-red-400 via-pink-400 to-purple-500",
      bgImage: "bg-[radial-gradient(ellipse_at_bottom,rgba(239,68,68,0.3),transparent_50%)]"
    },
    {
      id: 9,
      title: "Music & Rhythm",
      situation: "Music is made of mathematical patterns!",
      mathConcept: "Patterns & Fractions",
      realExample: "Songs have beats: 1-2-3-4, 1-2-3-4. Notes can be whole, half, or quarter notes!",
      funFact: "Piano keys follow a pattern that repeats every 12 keys!",
      icon: "🎵",
      gradient: "from-violet-400 via-purple-400 to-fuchsia-500",
      bgImage: "bg-[radial-gradient(ellipse_at_center,rgba(167,139,250,0.3),transparent_50%)]"
    },
    {
      id: 10,
      title: "Growing Up",
      situation: "We measure how we grow and change!",
      mathConcept: "Measurement & Comparison",
      realExample: "Every year you get taller! We measure height in feet and inches, weight in pounds.",
      funFact: "You were once tiny enough to fit in your parent's hands!",
      icon: "📏",
      gradient: "from-rose-400 via-pink-400 to-red-500",
      bgImage: "bg-[radial-gradient(ellipse_at_top_left,rgba(244,63,94,0.3),transparent_50%)]"
    }
  ];

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % mathCards.length);
  };

  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + mathCards.length) % mathCards.length);
  };

  const card = mathCards[currentCard];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-xl">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Math in Everyday Life
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-slate-600 mb-4">
            Discover the amazing ways we use math every single day!
          </p>
          <div className="flex items-center justify-center gap-2 text-yellow-500">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-6 w-6 fill-current" />
            ))}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-2">
            {mathCards.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentCard 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Main Card */}
        <div className="relative mb-8">
          <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden transform transition-all duration-500 hover:scale-[1.02]">
            <div className={`bg-gradient-to-r ${card.gradient} p-1`}>
              <div className={`bg-white rounded-lg relative overflow-hidden ${card.bgImage}`}>
                <CardContent className="p-8 md:p-12">
                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4 text-6xl opacity-20">
                    {card.icon}
                  </div>
                  <div className="absolute bottom-4 left-4 opacity-10">
                    <Sparkles className="h-16 w-16 text-purple-500" />
                  </div>
                  
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-r ${card.gradient} rounded-2xl flex items-center justify-center text-3xl shadow-lg`}>
                        {card.icon}
                      </div>
                      <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
                          {card.title}
                        </h2>
                        <div className={`w-24 h-1 bg-gradient-to-r ${card.gradient} rounded-full mt-2`}></div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-6">
                      {/* Situation */}
                      <div className={`bg-gradient-to-r ${card.gradient} bg-opacity-10 p-6 rounded-2xl`}>
                        <h3 className="text-xl font-bold text-slate-700 mb-3 flex items-center gap-2">
                          <Heart className="h-5 w-5 text-red-500" />
                          The Situation
                        </h3>
                        <p className="text-lg text-slate-600 leading-relaxed">
                          {card.situation}
                        </p>
                      </div>

                      {/* Math Concept */}
                      <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-6 rounded-2xl">
                        <h3 className="text-xl font-bold text-blue-700 mb-3 flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                          Math Concept: {card.mathConcept}
                        </h3>
                        <p className="text-lg text-slate-600 leading-relaxed">
                          {card.realExample}
                        </p>
                      </div>

                      {/* Fun Fact */}
                      <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-2xl">
                        <h3 className="text-xl font-bold text-orange-700 mb-3 flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-yellow-500" />
                          Amazing Fun Fact!
                        </h3>
                        <p className="text-lg text-slate-600 leading-relaxed">
                          {card.funFact}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={prevCard}
            size="lg"
            className={`bg-gradient-to-r ${card.gradient} hover:opacity-90 text-white border-0 px-8 py-4 rounded-2xl shadow-lg transform hover:scale-105 transition-all`}
          >
            <ChevronLeft className="mr-2 h-6 w-6" />
            Previous
          </Button>

          <div className="text-center">
            <div className="text-sm text-slate-500 mb-1">Card</div>
            <div className="text-2xl font-bold text-slate-700">
              {currentCard + 1} of {mathCards.length}
            </div>
          </div>

          <Button
            onClick={nextCard}
            size="lg"
            className={`bg-gradient-to-r ${card.gradient} hover:opacity-90 text-white border-0 px-8 py-4 rounded-2xl shadow-lg transform hover:scale-105 transition-all`}
          >
            Next
            <ChevronRight className="ml-2 h-6 w-6" />
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center">
          <Link to="/">
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg hover:bg-purple-50">
              <Home className="mr-2 h-6 w-6" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Floating Action */}
        <div className="fixed bottom-6 right-6">
          <Button
            onClick={nextCard}
            className={`w-16 h-16 rounded-full bg-gradient-to-r ${card.gradient} hover:opacity-90 text-white border-0 shadow-2xl transform hover:scale-110 transition-all`}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MathEveryday;
