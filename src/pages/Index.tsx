import React from "react";
import Hero from "@/components/Hero";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Heart, BookOpen, GamepadIcon, Zap, Calculator, Wallet, Ruler, TrendingUp, Gauge } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
        title: "Shape Match",
        description: "Learn to identify different shapes and count their sides",
        path: "/shape-match"
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
        title: "Fraction Basics",
        description: "Master fractions with simple and clear exercises",
        path: "/fraction-basics"
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
    id: "math-everyday",
    title: "Math in Everyday Life",
    description: "Discover how we use mathematics in our daily lives through beautiful interactive cards",
    path: "/math-everyday",
    color: "bg-gradient-to-r from-purple-600 to-pink-600"
  },
  {
    id: "math-intuition",
    title: "Math Intuition Test",
    description: "Test your mathematical thinking with fun yes/no questions and instant feedback",
    path: "/math-intuition",
    color: "bg-gradient-to-r from-purple-500 to-indigo-600"
  },
  {
    id: "mental-maths",
    title: "Mental Maths Challenge",
    description: "Test your mental math skills with quick calculations",
    path: "/mental-maths",
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
    id: "shape-match",
    title: "Shape Match",
    description: "Learn to identify shapes and count their sides",
    path: "/shape-match", 
    color: "bg-gradient-to-r from-emerald-500 to-cyan-600"
  },
  {
    id: "fraction-master",
    title: "Fraction Master",
    description: "Master fractions with addition, subtraction, and multiplication",
    path: "/fraction-simplify",
    color: "bg-gradient-to-r from-rose-500 to-purple-600"
  },
  {
    id: "time-master",
    title: "Time Master",
    description: "Learn to tell time and work with dates and clocks",
    path: "/time-master",
    color: "bg-gradient-to-r from-blue-500 to-indigo-600"
  },
  {
    id: "money-counter",
    title: "Money Counter",
    description: "Practice counting coins and bills with fun challenges",
    path: "/money-counter",
    color: "bg-gradient-to-r from-green-500 to-emerald-600"
  },
  {
    id: "geometry-master",
    title: "Geometry Master",
    description: "Master area, perimeter, and volume calculations",
    path: "/geometry-master",
    color: "bg-gradient-to-r from-indigo-500 to-purple-600"
  },
  {
    id: "algebra-adventure",
    title: "Algebra Adventure",
    description: "Master basic algebra with fun, colorful challenges",
    path: "/algebra-adventure",
    color: "bg-gradient-to-r from-indigo-500 to-purple-600"
  },
  {
    id: "target-takedown",
    title: "Target Takedown",
    description: "Hit number targets by combining tiles strategically",
    path: "/target-takedown",
    color: "bg-gradient-to-r from-pink-500 to-pink-600"
  },
  {
    id: "memorizing-numbers",
    title: "Memorizing Pi (π)",
    description: "Test your memory by memorizing digits of π progressively",
    path: "/memorizing-numbers",
    color: "bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-600"
  },
  {
    id: "memorizing-euler",
    title: "Memorizing Euler's (e)",
    description: "Challenge yourself with Euler's number memory game",
    path: "/memorizing-euler",
    color: "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600"
  },
  {
    id: "memorizing-phi",
    title: "Memorizing Phi (φ)",
    description: "Learn the Golden Ratio digits by heart",
    path: "/memorizing-phi",
    color: "bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-600"
  }
];


const practicalSkills = [
  {
    id: "budget-builder",
    title: "Budget Builder",
    description: "Learn to allocate money wisely with fun budgeting challenges",
    path: "/budget-builder",
    icon: <Wallet className="h-8 w-8" />,
    gradient: "from-emerald-500 via-teal-500 to-cyan-500"
  },
  {
    id: "tax-calculator",
    title: "Tax Calculator",
    description: "Learn about taxes and finances with an interactive income calculator",
    path: "/tax-calculator",
    icon: <TrendingUp className="h-8 w-8" />,
    gradient: "from-violet-500 via-purple-500 to-pink-500"
  },
  {
    id: "unit-converter",
    title: "Unit Converter",
    description: "Master real-world unit conversions with interactive lessons and quizzes",
    path: "/unit-converter",
    icon: <Ruler className="h-8 w-8" />,
    gradient: "from-orange-500 via-amber-500 to-yellow-500"
  }
];

const miniPhysics = [
  {
    id: "newtons-laws",
    title: "Newton's Three Laws",
    description: "Master the fundamental principles of motion and force through interactive questions",
    path: "/newtons-laws",
    icon: <Zap className="h-8 w-8" />,
    gradient: "from-blue-500 via-purple-500 to-pink-500"
  },
  {
    id: "push-pull-forces",
    title: "Push & Pull Forces",
    description: "Explore the fundamental forces that move our world with visual demonstrations",
    path: "/push-pull-forces",
    icon: <Zap className="h-8 w-8" />,
    gradient: "from-orange-500 via-pink-500 to-purple-500"
  },
  {
    id: "motion-mastery",
    title: "Motion Mastery",
    description: "Master speed, distance, and time calculations with the motion formula triangle",
    path: "/motion-mastery",
    icon: <Gauge className="h-8 w-8" />,
    gradient: "from-cyan-500 via-blue-500 to-indigo-500"
  }
];

const Index = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('game_id')
        .eq('user_id', user.id);

      if (error) throw error;

      setFavorites(data?.map(fav => fav.game_id) || []);
    } catch (error: any) {
      console.error('Error loading favorites:', error);
    }
  };

  const toggleFavorite = async (gameId: string) => {
    if (!user) return;

    try {
      const isFavorited = favorites.includes(gameId);

      if (isFavorited) {
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('game_id', gameId);

        if (error) throw error;

        setFavorites(favorites.filter(id => id !== gameId));
        toast({
          title: "Removed from favorites",
          description: "Game removed from your favorites",
        });
      } else {
        const { error } = await supabase
          .from('user_favorites')
          .insert({
            user_id: user.id,
            game_id: gameId
          });

        if (error) throw error;

        setFavorites([...favorites, gameId]);
        toast({
          title: "Added to favorites",
          description: "Game added to your favorites",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Hero />
      
      {/* Updated Mathify Description Section */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-6 left-6 w-12 h-12 border-3 border-white rounded-full animate-pulse"></div>
            <div className="absolute top-12 right-8 w-6 h-6 bg-white rounded-full animate-bounce"></div>
            <div className="absolute bottom-8 left-12 w-8 h-8 border-3 border-white transform rotate-45 animate-spin"></div>
            <div className="absolute bottom-6 right-6 w-7 h-7 bg-white transform rotate-12 animate-pulse"></div>
            <div className="absolute top-1/2 left-1/3 w-4 h-4 bg-white rounded-full animate-ping"></div>
            <div className="absolute top-1/3 right-1/4 w-10 h-10 border-3 border-white rounded transform rotate-45 animate-bounce"></div>
          </div>
          
          <div className="relative z-10 p-6 md:p-10 text-center text-white">
            <h2 className="text-2xl md:text-4xl font-extrabold mb-4 leading-tight">
              Resources and Learning
            </h2>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-8">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 md:p-5 border border-white/20 hover:bg-white/25 transition-all duration-300">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mb-3 mx-auto">
                  <BookOpen className="h-6 w-6 md:h-7 md:w-7 text-white" />
                </div>
                <h3 className="text-base md:text-lg font-bold mb-2">Curated Resources</h3>
                <p className="text-white/90 text-xs md:text-sm">
                  Hand-picked educational content from top educators across the web
                </p>
              </div>
              
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 md:p-5 border border-white/20 hover:bg-white/25 transition-all duration-300">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center mb-3 mx-auto">
                  <Zap className="h-6 w-6 md:h-7 md:w-7 text-white" />
                </div>
                <h3 className="text-base md:text-lg font-bold mb-2">Practice & Revision</h3>
                <p className="text-white/90 text-xs md:text-sm">
                  Comprehensive tools for secondary mathematics practice and exam preparation
                </p>
              </div>
              
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 md:p-5 border border-white/20 hover:bg-white/25 transition-all duration-300">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center mb-3 mx-auto">
                  <GamepadIcon className="h-6 w-6 md:h-7 md:w-7 text-white" />
                </div>
                <h3 className="text-base md:text-lg font-bold mb-2">Learning Games</h3>
                <p className="text-white/90 text-xs md:text-sm">
                  Interactive games that make primary mathematics fun and engaging
                </p>
              </div>
              
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 md:p-5 border border-white/20 hover:bg-white/25 transition-all duration-300">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center mb-3 mx-auto">
                  <Heart className="h-6 w-6 md:h-7 md:w-7 text-white" />
                </div>
                <h3 className="text-base md:text-lg font-bold mb-2">Completely Free</h3>
                <p className="text-white/90 text-xs md:text-sm">
                  Access all features and content without any cost or subscription
                </p>
              </div>
            </div>
            
            <div className="mt-8">
              <div className="w-24 h-1 bg-gradient-to-r from-white/50 to-purple-200/50 mx-auto rounded-full"></div>
            </div>
          </div>
        </div>
      </section>


      {/* Games Section */}
      <section id="general-skills" className="py-10 md:py-16 bg-gradient-to-b from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-16">
            <div className="relative max-w-4xl mx-auto">
              <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
                <CardContent className="p-8 md:p-12 text-white relative">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 left-4 w-8 h-8 border-2 border-white rounded-full"></div>
                    <div className="absolute top-8 right-8 w-4 h-4 bg-white rounded-full"></div>
                    <div className="absolute bottom-6 left-8 w-6 h-6 border-2 border-white transform rotate-45"></div>
                    <div className="absolute bottom-4 right-4 w-5 h-5 bg-white transform rotate-12"></div>
                    <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-white rounded-full"></div>
                    <div className="absolute top-1/3 right-1/3 w-7 h-7 border-2 border-white rounded transform rotate-45"></div>
                  </div>
                  
                  <div className="relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent leading-tight pb-2">
                      Games for Primary Maths
                    </h2>
                    <p className="text-lg md:text-2xl mb-4 md:mb-6 text-purple-100 max-w-3xl mx-auto leading-relaxed">
                      Perfect for kindergarten and primary school students learning fundamental mathematical concepts through fun, engaging games.
                    </p>
                    <div className="w-32 h-1 bg-gradient-to-r from-white to-purple-200 mx-auto rounded-full"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {generalSkills.map((skill) => (
              <Card key={skill.id} className="overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1 border-0 relative">
                <div className={`h-2 md:h-4 ${skill.color}`}></div>
                <CardContent className="p-4 md:p-6 bg-white relative">
                  <h3 className="font-bold text-lg md:text-2xl mb-2 md:mb-3 line-clamp-1">{skill.title}</h3>
                  <p className="text-slate-600 mb-3 md:mb-5 text-sm md:text-lg line-clamp-2">{skill.description}</p>
                  <div className="flex items-end justify-between">
                    <Link 
                      to={skill.path} 
                      className={`inline-flex items-center px-3 py-1 md:px-4 md:py-2 rounded-lg ${skill.color} text-white font-medium text-sm md:text-base hover:opacity-90 transition-opacity`}
                    >
                      Play Now
                      <svg className="ml-1 md:ml-2 w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </Link>
                    {user && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(skill.id)}
                        className="p-2 h-auto hover:bg-red-50 rounded-full"
                      >
                        <Heart 
                          className={`h-6 w-6 md:h-7 md:w-7 transition-all duration-200 ${favorites.includes(skill.id) 
                            ? 'fill-red-500 text-red-500 scale-110' 
                            : 'text-gray-400 hover:text-red-500 hover:scale-105'
                          }`} 
                        />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* New Practical Skill-Building Section */}
          <div className="mt-12 md:mt-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight pb-2">
                Practical Skill-Building
              </h3>
              <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
                Real-world skills that make learning meaningful and applicable to daily life
              </p>
            </div>

            <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative">
              <CardContent className="p-8 md:p-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                  {practicalSkills.map((skill, index) => (
                    <div key={skill.id} className="group">
                      <Link to={skill.path} className="block">
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 h-full">
                          <div className={`w-16 h-16 bg-gradient-to-r ${skill.gradient} rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                            <div className="text-white">
                              {skill.icon}
                            </div>
                          </div>
                          
                          <h4 className="text-xl md:text-2xl font-bold text-white mb-3 text-center group-hover:text-cyan-200 transition-colors">
                            {skill.title}
                          </h4>
                          
                          <p className="text-white/80 text-sm md:text-base text-center leading-relaxed mb-4">
                            {skill.description}
                          </p>
                          
                          <div className={`mt-4 mx-auto w-fit px-4 py-2 bg-gradient-to-r ${skill.gradient} rounded-lg text-white font-medium text-sm hover:shadow-lg transition-all duration-300 group-hover:scale-105`}>
                            Start Learning
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
                
                {/* Decorative bottom section */}
                <div className="mt-8 text-center">
                  <div className="inline-flex items-center space-x-2 text-white/60 text-sm">
                    <Calculator className="h-4 w-4" />
                    <span>Build practical skills for real-world success</span>
                    <Calculator className="h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mini-Physics Section */}
          <div className="mt-12 md:mt-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight pb-2">
                Mini-Physics
              </h3>
              <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
                Explore essential physics principles through interactive, beautifully designed games
              </p>
            </div>

            <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 relative">
              <CardContent className="p-8 md:p-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                  {miniPhysics.map((game) => (
                    <div key={game.id} className="group">
                      <Link to={game.path} className="block">
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 h-full">
                          <div className={`w-16 h-16 bg-gradient-to-r ${game.gradient} rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                            <div className="text-white">
                              {game.icon}
                            </div>
                          </div>
                          
                          <h4 className="text-xl md:text-2xl font-bold text-white mb-3 text-center group-hover:text-blue-200 transition-colors">
                            {game.title}
                          </h4>
                          
                          <p className="text-white/80 text-sm md:text-base text-center leading-relaxed mb-4">
                            {game.description}
                          </p>
                          
                          <div className={`mt-4 mx-auto w-fit px-4 py-2 bg-gradient-to-r ${game.gradient} rounded-lg text-white font-medium text-sm hover:shadow-lg transition-all duration-300 group-hover:scale-105`}>
                            Play Game
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 text-center">
                  <div className="inline-flex items-center space-x-2 text-white/60 text-sm">
                    <Zap className="h-4 w-4" />
                    <span>Master physics fundamentals through interactive learning</span>
                    <Zap className="h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Data Analysis Suite Section */}
      <section className="py-10 md:py-16 bg-gradient-to-b from-emerald-50 to-cyan-50 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h3 className="text-2xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent leading-tight pb-2">
              Data Analysis Suite
            </h3>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
              Create stunning visualizations, explore data patterns, and master statistics through interactive charts and graphs
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <Link to="/data-analysis" className="block group">
              <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02]">
                <CardContent className="p-8 md:p-12 relative">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-8 left-8 w-16 h-16">
                      <svg viewBox="0 0 100 100" className="w-full h-full text-white">
                        <rect x="20" y="60" width="15" height="30" fill="currentColor" />
                        <rect x="40" y="40" width="15" height="50" fill="currentColor" />
                        <rect x="60" y="20" width="15" height="70" fill="currentColor" />
                      </svg>
                    </div>
                    <div className="absolute top-8 right-16 w-16 h-16">
                      <svg viewBox="0 0 100 100" className="w-full h-full text-white">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="4" />
                        <path d="M50 10 A40 40 0 0 1 90 50 Z" fill="currentColor" />
                        <path d="M90 50 A40 40 0 0 0 70 85 Z" fill="currentColor" opacity="0.7" />
                      </svg>
                    </div>
                    <div className="absolute bottom-8 left-16 w-12 h-12">
                      <svg viewBox="0 0 100 100" className="w-full h-full text-white">
                        <polyline points="10,80 30,60 50,70 70,40 90,50" fill="none" stroke="currentColor" strokeWidth="4" />
                        <circle cx="30" cy="60" r="3" fill="currentColor" />
                        <circle cx="50" cy="70" r="3" fill="currentColor" />
                        <circle cx="70" cy="40" r="3" fill="currentColor" />
                      </svg>
                    </div>
                  </div>

                  <div className="relative z-10 text-white">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                      <div className="text-center lg:text-left">
                        <h4 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-cyan-200 transition-colors">
                          Interactive Data Visualization
                        </h4>
                        <p className="text-lg md:text-xl text-white/90 mb-6 leading-relaxed">
                          Discover the power of data through beautiful, interactive charts and graphs. Create bar charts, line graphs, pie charts, scatter plots, and frequency tables with ease.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-cyan-300 rounded-full"></div>
                            <span>Bar Charts</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-cyan-300 rounded-full"></div>
                            <span>Line Graphs</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-cyan-300 rounded-full"></div>
                            <span>Pie Charts</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-cyan-300 rounded-full"></div>
                            <span>Scatter Plots</span>
                          </div>
                        </div>

                        <div className="inline-flex items-center space-x-2 bg-white/20 rounded-full px-6 py-3 group-hover:bg-white/30 transition-all duration-300">
                          <span className="font-semibold">Explore Data Analysis</span>
                          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>

                      <div className="relative">
                        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/30 group-hover:bg-white/30 transition-all duration-300">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/10 rounded-lg p-4 text-center">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg mx-auto mb-2 flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                              </div>
                              <span className="text-xs">Charts</span>
                            </div>
                            <div className="bg-white/10 rounded-lg p-4 text-center">
                              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg mx-auto mb-2 flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                                </svg>
                              </div>
                              <span className="text-xs">Pie Charts</span>
                            </div>
                            <div className="bg-white/10 rounded-lg p-4 text-center">
                              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg mx-auto mb-2 flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                </svg>
                              </div>
                              <span className="text-xs">Line Graphs</span>
                            </div>
                            <div className="bg-white/10 rounded-lg p-4 text-center">
                              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-lg mx-auto mb-2 flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2m-6 4h6" />
                                </svg>
                              </div>
                              <span className="text-xs">Tables</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
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
