import React from "react";
import Hero from "@/components/Hero";
import GradeLevel from "@/components/GradeLevel";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

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
        path: "#"
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
        description: "Master fractions with interactive visual games",
        path: "#"
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
    path: "#",
    color: "bg-gradient-to-r from-green-400 to-blue-500"
  },
  {
    id: "math-facts",
    title: "Math Facts Race",
    description: "Race against time to answer math facts quickly",
    path: "#", 
    color: "bg-gradient-to-r from-purple-500 to-indigo-500"
  },
  {
    id: "number-sense",
    title: "Number Sense Builder",
    description: "Develop intuition for numbers and their relationships",
    path: "#",
    color: "bg-gradient-to-r from-cyan-500 to-blue-500"
  },
  {
    id: "math-puzzles",
    title: "Daily Math Puzzles",
    description: "Solve a new mathematical puzzle each day",
    path: "#", 
    color: "bg-gradient-to-r from-rose-500 to-orange-500"
  },
  {
    id: "quick-calc",
    title: "Quick Calculator",
    description: "Improve estimation and mental calculation skills",
    path: "#",
    color: "bg-gradient-to-r from-teal-400 to-green-500"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Hero />
      
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Features That Make Learning Fun</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Discover why Mathify is the perfect platform for learners of all ages to improve their math skills.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-500 rounded-2xl flex items-center justify-center mb-4 text-white font-bold text-2xl">
              1
            </div>
            <h3 className="text-xl font-bold mb-2">Adaptive Learning</h3>
            <p className="text-slate-600">
              Games adjust to your skill level, making learning both challenging and enjoyable.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mb-4 text-white font-bold text-2xl">
              2
            </div>
            <h3 className="text-xl font-bold mb-2">Progress Tracking</h3>
            <p className="text-slate-600">
              Monitor improvement over time with detailed statistics and achievement badges.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mb-4 text-white font-bold text-2xl">
              3
            </div>
            <h3 className="text-xl font-bold mb-2">Reward System</h3>
            <p className="text-slate-600">
              Earn points, unlock new levels, and compete with friends to stay motivated.
            </p>
          </div>
        </div>
      </section>
      
      <section id="grade-levels" className="py-16 bg-gradient-to-b from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Math Games By Grade Level</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Explore age-appropriate math games designed specifically for different educational stages.
            </p>
          </div>
          
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-white/70">
                <TabsTrigger value="all" className="px-6">All Levels</TabsTrigger>
                <TabsTrigger value="elementary" className="px-6">Elementary</TabsTrigger>
                <TabsTrigger value="middle" className="px-6">Middle School</TabsTrigger>
                <TabsTrigger value="high" className="px-6">High School</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="space-y-8 animate-fade-in">
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
      
      <section id="general-skills" className="py-16 bg-gradient-to-b from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">General Skills Games</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Improve core mathematical abilities that are essential across all grade levels.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {generalSkills.map((skill) => (
              <Card key={skill.id} className="overflow-hidden hover:shadow-lg transition-shadow border-0">
                <div className={`h-3 ${skill.color}`}></div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-2">{skill.title}</h3>
                  <p className="text-slate-600 mb-4">{skill.description}</p>
                  <Link 
                    to={skill.path} 
                    className="inline-flex items-center text-purple-600 font-medium hover:text-purple-800"
                  >
                    Play Now
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Make Math Fun?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already improving their math skills through interactive games.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Index;
