import React from "react";
import Hero from "@/components/Hero";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Heart, BookOpen, GamepadIcon, Zap } from "lucide-react";
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

const videoCurricula = [
  {
    id: "alevels",
    label: "A-Levels (All Boards)",
    color: "from-yellow-400 via-amber-400 to-orange-400",
    iconBg: "bg-gradient-to-tr from-yellow-300 via-yellow-400 to-amber-400",
    path: "/video-hub/alevels"
  },
  {
    id: "ib",
    label: "IB Mathematics",
    color: "from-pink-300 via-pink-400 to-amber-400",
    iconBg: "bg-gradient-to-tr from-pink-300 to-amber-400",
    path: "/video-hub/ib"
  },
  {
    id: "gcse",
    label: "GCSEs (All Boards)",
    color: "from-yellow-200 via-yellow-400 to-yellow-700",
    iconBg: "bg-gradient-to-tr from-yellow-200 to-yellow-500",
    path: "/video-hub/gcse"
  },
  {
    id: "us",
    label: "US High School Math",
    color: "from-orange-200 via-orange-400 to-pink-500",
    iconBg: "bg-gradient-to-tr from-orange-200 to-pink-400",
    path: "/video-hub/us"
  },
  {
    id: "australian",
    label: "Australian Curriculum",
    color: "from-green-300 via-emerald-400 to-teal-500",
    iconBg: "bg-gradient-to-tr from-green-300 to-teal-400",
    path: "/video-hub/australian"
  },
  {
    id: "canadian",
    label: "Canadian Curriculum",
    color: "from-red-300 via-pink-400 to-purple-500",
    iconBg: "bg-gradient-to-tr from-red-300 to-purple-400",
    path: "/video-hub/canadian"
  },
  {
    id: "cbse",
    label: "CBSE (India)",
    color: "from-blue-300 via-indigo-400 to-purple-500",
    iconBg: "bg-gradient-to-tr from-blue-300 to-purple-400",
    path: "/video-hub/cbse"
  },
  {
    id: "past-papers",
    label: "Past Exam Papers",
    color: "from-slate-300 via-gray-400 to-slate-500",
    iconBg: "bg-gradient-to-tr from-slate-300 to-gray-400",
    path: "#",
    comingSoon: true
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

      {/* Video Hub Section */}
      <section
        id="video-hub"
        className="py-12 md:py-20 bg-gradient-to-b from-yellow-50 via-amber-50 to-orange-100"
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-8 md:mb-12 animate-fade-in">
            <h2 className="font-extrabold text-3xl md:text-5xl mb-3 text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-400 drop-shadow-lg pb-2 leading-tight">
              Secondary and High School Mathematics
            </h2>
            <p className="text-yellow-900 text-lg md:text-2xl mx-auto max-w-2xl mb-4 font-medium">
              A hand-selected set of outstanding, comprehensive, and in-depth math videos—
              <span className="font-bold text-amber-700"> created by top educators on YouTube and other platforms</span>.
              All linked content belongs to the original creators.
            </p>
            <div className="mx-auto w-32 h-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 mb-2"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videoCurricula.map((curric) => (
              <div
                key={curric.id}
                className={`
                  rounded-3xl shadow-xl border-4 border-yellow-200 relative bg-white glass-morphism
                  transition-transform duration-200 hover:scale-105 hover:shadow-2xl group
                  animate-fade-in
                `}
                style={{
                  background:
                    "linear-gradient(120deg, #fffbe7 70%, #ffe5a6 100%)"
                }}
              >
                <div className={`absolute -top-7 left-1/2 -translate-x-1/2 rounded-full ${curric.iconBg} p-3 shadow-lg border-2 border-white`}>
                  <svg width="40" height="40" fill="none">
                    <circle cx="20" cy="20" r="16" fill="#fbbf24" fillOpacity="0.68" />
                    <circle cx="20" cy="20" r="12" fill="#fff7ae" />
                  </svg>
                </div>
                <div className="pt-12 pb-8 px-6 md:px-8 min-h-[240px] flex flex-col">
                  <h3 className="font-extrabold text-xl md:text-2xl mb-2 text-amber-600 text-center drop-shadow-sm">
                    {curric.label}
                  </h3>
                  <div className="w-16 h-1 bg-gradient-to-r from-amber-300 to-yellow-400 mx-auto rounded-full mb-3"></div>
                  <div className="flex-1 flex items-center justify-center mb-4">
                    <div className="rounded-2xl overflow-hidden shadow-inner w-full h-44 bg-gradient-to-tr from-yellow-100 to-amber-100 flex items-center justify-center">
                      <span className="text-5xl md:text-6xl text-yellow-400 opacity-50">
                        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                          <circle cx="30" cy="30" r="28" stroke="#f59e42" strokeWidth="4" fill="#fff9db" />
                          <polygon points="26,20 44,30 26,40" fill="#f59e42" />
                        </svg>
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-700 text-sm md:text-base text-center mb-4">
                    {curric.comingSoon 
                      ? "Comprehensive collection of past examination papers from major exam boards worldwide. Access previous years' questions for effective revision."
                      : "Comprehensive collections of high-quality videos by leading educators. Embedded videos tailored for every major math exam and topic."
                    }
                  </p>
                  {curric.comingSoon ? (
                    <div className="mt-auto w-full text-lg py-2 font-bold rounded-xl bg-gradient-to-r from-slate-400 to-gray-500 text-white shadow text-center">
                      Coming Soon
                    </div>
                  ) : (
                    <Link
                      to={curric.path}
                      className={`mt-auto w-full text-lg py-2 font-bold rounded-xl bg-gradient-to-r ${curric.color} text-white shadow 
                        transition-all hover:scale-105 hover:shadow-lg text-center block`}
                    >
                      Explore Videos
                    </Link>
                  )}
                </div>
                <div className="absolute right-5 top-5">
                  <svg width="38" height="38" fill="none">
                    <circle cx="19" cy="19" r="19" fill="#fff9db" />
                  </svg>
                </div>
                <div className="absolute left-4 bottom-4 w-8 h-8 bg-gradient-to-br from-amber-300 to-yellow-100 rounded-full opacity-60"></div>
                <div className="absolute right-6 bottom-2 w-10 h-10 bg-gradient-to-bl from-yellow-100 to-orange-100 rounded-full opacity-50"></div>
              </div>
            ))}
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
