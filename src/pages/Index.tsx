
import React from "react";
import Hero from "@/components/Hero";
import GradeLevel from "@/components/GradeLevel";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const gradeLevels = [
  {
    id: "elementary",
    title: "Elementary School",
    ageRange: "Ages 5-10",
    description: "Foundational math learning through playful games designed for young learners.",
    gradient: "bg-gradient-to-r from-blue-500 to-cyan-400",
    games: [
      {
        id: "counting",
        title: "Counting Adventure",
        description: "Learn to count with animated characters and fun challenges",
        path: "#"
      },
      {
        id: "shapes",
        title: "Shape Explorer",
        description: "Discover geometric shapes through interactive puzzles",
        path: "/shape-explorer"
      },
      {
        id: "addition",
        title: "Addition Heroes",
        description: "Master addition with engaging superhero-themed challenges",
        path: "#"
      },
      {
        id: "subtraction",
        title: "Subtraction Quest",
        description: "Practice subtraction in an exciting adventure game",
        path: "#"
      }
    ]
  },
  {
    id: "middle",
    title: "Middle School",
    ageRange: "Ages 11-13",
    description: "Engaging challenges to build pre-algebra and geometry skills for middle schoolers.",
    gradient: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400",
    games: [
      {
        id: "fractions",
        title: "Fraction Frenzy",
        description: "Master fractions with a fast-paced visual matching game",
        path: "/fraction-frenzy"
      },
      {
        id: "decimals",
        title: "Decimal Defenders",
        description: "Learn decimals by defending your kingdom from invaders",
        path: "#"
      },
      {
        id: "pre-algebra",
        title: "Pre-Algebra Puzzles",
        description: "Solve equations and prepare for algebra with fun puzzles",
        path: "#"
      },
      {
        id: "geometry",
        title: "Geometry Quest",
        description: "Explore angles, shapes and measurements in a 3D world",
        path: "#"
      }
    ]
  },
  {
    id: "high",
    title: "High School",
    ageRange: "Ages 14-18",
    description: "Advanced math challenges covering algebra, calculus, and statistics for teenagers.",
    gradient: "bg-gradient-to-r from-purple-600 to-blue-500",
    games: [
      {
        id: "algebra",
        title: "Algebra Arena",
        description: "Master algebraic concepts through competitive challenges",
        path: "#"
      },
      {
        id: "trigonometry",
        title: "Trigonometry Trials",
        description: "Conquer sine, cosine and tangent in exciting game formats",
        path: "#"
      },
      {
        id: "calculus",
        title: "Calculus Crusaders",
        description: "Learn derivatives and integrals through interactive missions",
        path: "#"
      },
      {
        id: "statistics",
        title: "Stats Showdown",
        description: "Apply statistical concepts in real-world scenarios",
        path: "#"
      }
    ]
  }
];

const generalSkills = [
  {
    id: "mental-maths",
    title: "Mental Maths Challenge",
    description: "Test your mental math skills with quick calculations",
    path: "/maths",
    color: "bg-gradient-to-r from-amber-500 to-pink-500"
  },
  {
    id: "times-tables",
    title: "Times Tables Master",
    description: "Perfect your multiplication tables with fun challenges",
    path: "/times-tables",
    color: "bg-gradient-to-r from-green-400 to-blue-500"
  },
  {
    id: "math-facts",
    title: "Math Facts Race",
    description: "Race against time to answer math facts quickly",
    path: "/math-facts",
    color: "bg-gradient-to-r from-purple-500 to-indigo-500"
  },
  {
    id: "shape-explorer",
    title: "Shape Explorer",
    description: "Discover the fascinating world of 2D geometric shapes",
    path: "/shape-explorer", 
    color: "bg-gradient-to-r from-indigo-500 to-purple-600"
  },
  {
    id: "fraction-basics",
    title: "Fraction Basics",
    description: "Master fraction fundamentals with simple exercises",
    path: "/fraction-basics",
    color: "bg-gradient-to-r from-pink-500 to-orange-400"
  },
  {
    id: "target-takedown",
    title: "Target Takedown",
    description: "Hit number targets by combining tiles strategically",
    path: "/target-takedown",
    color: "bg-gradient-to-r from-pink-500 to-pink-600"
  }
];

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Hero />
      
      <section className="container mx-auto px-4 py-10 md:py-16">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">Features That Make Learning Fun</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-xl px-2">
            Discover why Mathify is the perfect platform for learners of all ages to improve their math skills.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-5 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="w-14 h-14 md:w-20 md:h-20 bg-gradient-to-r from-purple-600 to-indigo-500 rounded-2xl flex items-center justify-center mb-3 md:mb-6 text-white font-bold text-xl md:text-3xl shadow-md">
              1
            </div>
            <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-3">Adaptive Learning</h3>
            <p className="text-slate-700 text-sm md:text-lg">
              Games adjust to your skill level, making learning both challenging and enjoyable.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-pink-100 to-rose-100 p-5 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="w-14 h-14 md:w-20 md:h-20 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mb-3 md:mb-6 text-white font-bold text-xl md:text-3xl shadow-md">
              2
            </div>
            <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-3">Progress Tracking</h3>
            <p className="text-slate-700 text-sm md:text-lg">
              Monitor improvement over time with detailed statistics and achievement badges.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-5 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="w-14 h-14 md:w-20 md:h-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mb-3 md:mb-6 text-white font-bold text-xl md:text-3xl shadow-md">
              3
            </div>
            <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-3">Reward System</h3>
            <p className="text-slate-700 text-sm md:text-lg">
              Earn points, unlock new levels, and compete with friends to stay motivated.
            </p>
          </div>
        </div>
      </section>
      
      <section id="grade-levels" className="py-10 md:py-16 bg-gradient-to-b from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">Math Games By Grade Level</h2>
            <p className="text-slate-600 max-w-2xl mx-auto px-2 text-sm md:text-base">
              Explore age-appropriate math games designed specifically for different educational stages.
            </p>
          </div>
          
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-center mb-5 md:mb-8 overflow-x-auto pb-2">
              <TabsList className="bg-white/70 p-1">
                <TabsTrigger value="all" className="px-2 py-1 md:px-6 text-xs md:text-base whitespace-nowrap">All Levels</TabsTrigger>
                <TabsTrigger value="elementary" className="px-2 py-1 md:px-6 text-xs md:text-base whitespace-nowrap">Elementary</TabsTrigger>
                <TabsTrigger value="middle" className="px-2 py-1 md:px-6 text-xs md:text-base whitespace-nowrap">Middle School</TabsTrigger>
                <TabsTrigger value="high" className="px-2 py-1 md:px-6 text-xs md:text-base whitespace-nowrap">High School</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="space-y-5 md:space-y-8 animate-fade-in">
              {gradeLevels.map((level) => (
                <GradeLevel
                  key={level.id}
                  title={level.title}
                  ageRange={level.ageRange}
                  description={level.description}
                  games={level.games}
                  gradient={level.gradient}
                />
              ))}
            </TabsContent>
            
            {gradeLevels.map((level) => (
              <TabsContent key={level.id} value={level.id} className="animate-fade-in">
                <GradeLevel
                  title={level.title}
                  ageRange={level.ageRange}
                  description={level.description}
                  games={level.games}
                  gradient={level.gradient}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
      
      <section id="general-skills" className="py-10 md:py-16 bg-gradient-to-b from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">General Skills Games</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg md:text-2xl mb-3 md:mb-4 px-2">
              Improve core mathematical abilities that are essential across all grade levels.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-6 md:mb-8 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {generalSkills.map((skill) => (
              <Card key={skill.id} className="overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1 border-0">
                <div className={`h-2 md:h-4 ${skill.color}`}></div>
                <CardContent className="p-4 md:p-6 bg-white">
                  <h3 className="font-bold text-lg md:text-2xl mb-2 md:mb-3 line-clamp-1">{skill.title}</h3>
                  <p className="text-slate-600 mb-3 md:mb-5 text-sm md:text-lg line-clamp-2">{skill.description}</p>
                  <Link 
                    to={skill.path} 
                    className={`inline-flex items-center px-3 py-1 md:px-4 md:py-2 rounded-lg ${skill.color} text-white font-medium text-sm md:text-base hover:opacity-90 transition-opacity`}
                  >
                    Play Now
                    <svg className="ml-1 md:ml-2 w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-10 md:py-16 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-6">Ready to Make Math Fun?</h2>
          <p className="text-base md:text-xl opacity-90 mb-4 md:mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already improving their math skills through interactive games.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Index;
