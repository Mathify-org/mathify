
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { 
  Calculator, 
  Target, 
  Clock, 
  Trophy, 
  Gamepad2, 
  Zap, 
  Star,
  BookOpen,
  Play,
  GraduationCap,
  Globe,
  Users
} from "lucide-react";

const mathGames = [
  {
    title: "Mental Maths Game",
    description: "Quick-fire mental arithmetic challenges to sharpen your calculation skills",
    icon: Calculator,
    path: "/mental-maths",
    difficulty: "Easy",
    color: "bg-blue-500"
  },
  {
    title: "Times Tables Master",
    description: "Master multiplication tables with interactive practice sessions",
    icon: Target,
    path: "/times-tables",
    difficulty: "Medium",
    color: "bg-green-500"
  },
  {
    title: "Math Facts Race",
    description: "Race against time to solve basic arithmetic problems",
    icon: Clock,
    path: "/math-facts",
    difficulty: "Easy",
    color: "bg-orange-500"
  },
  {
    title: "Shape Match",
    description: "Learn geometry by matching shapes and their properties",
    icon: Trophy,
    path: "/shape-match",
    difficulty: "Medium",
    color: "bg-purple-500"
  },
  {
    title: "Fraction Basics",
    description: "Interactive lessons and games to understand fractions",
    icon: Gamepad2,
    path: "/fraction-basics",
    difficulty: "Medium",
    color: "bg-pink-500"
  },
  {
    title: "Arithmetic Hero",
    description: "Become a math superhero by solving arithmetic challenges",
    icon: Zap,
    path: "/arithmetic-hero",
    difficulty: "Hard",
    color: "bg-red-500"
  },
  {
    title: "Target Takedown",
    description: "Strategic number game where you reach target values",
    icon: Target,
    path: "/target-takedown",
    difficulty: "Medium",
    color: "bg-indigo-500"
  },
  {
    title: "Math Warp",
    description: "Space adventure game with mathematical challenges",
    icon: Star,
    path: "/math-warp",
    difficulty: "Hard",
    color: "bg-yellow-500"
  }
];

const videoHubBoards = [
  {
    title: "A-Levels",
    description: "Pure Mathematics, Statistics, and Mechanics for AQA, Edexcel, and OCR exam boards",
    path: "/video-hub/alevels",
    color: "from-amber-500 to-orange-500",
    icon: GraduationCap,
    region: "UK"
  },
  {
    title: "IB Mathematics",
    description: "Analysis & Approaches and Applications & Interpretation for SL and HL",
    path: "/video-hub/ib",
    color: "from-blue-500 to-indigo-500",
    icon: Globe,
    region: "International"
  },
  {
    title: "GCSE Mathematics",
    description: "Foundation and Higher tier content for AQA, Edexcel, and OCR",
    path: "/video-hub/gcse",
    color: "from-green-500 to-emerald-500",
    icon: BookOpen,
    region: "UK"
  },
  {
    title: "US Common Core",
    description: "Grade 10 and Grade 12 mathematics following Common Core standards",
    path: "/video-hub/us",
    color: "from-red-500 to-rose-500",
    icon: Star,
    region: "United States"
  },
  {
    title: "Australian Curriculum",
    description: "Year 10 and Year 12 Essential, General, Methods, and Specialist Mathematics",
    path: "/video-hub/australian",
    color: "from-orange-500 to-amber-500",
    icon: Users,
    region: "Australia"
  },
  {
    title: "Canadian Curriculum",
    description: "Grade 10 Academic Mathematics and Grade 12 Calculus & Vectors",
    path: "/video-hub/canadian",
    color: "from-purple-500 to-violet-500",
    icon: GraduationCap,
    region: "Canada"
  },
  {
    title: "CBSE (India)",
    description: "Class 10 and Class 12 Mathematics following CBSE syllabus",
    path: "/video-hub/cbse",
    color: "from-teal-500 to-cyan-500",
    icon: BookOpen,
    region: "India"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      
      {/* Interactive Math Games Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Interactive Math Games
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Engage with mathematics through fun, interactive games designed to build skills and confidence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mathGames.map((game, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-2">
                  <div className={`w-16 h-16 ${game.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <game.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {game.title}
                  </CardTitle>
                  <Badge variant="outline" className="w-fit mx-auto">
                    {game.difficulty}
                  </Badge>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 mb-4 leading-relaxed">
                    {game.description}
                  </CardDescription>
                  <Button asChild className="w-full group-hover:bg-blue-600 transition-colors">
                    <Link to={game.path}>
                      Play Now
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Video Hub Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Curated Videos and Resources from the Internet for Secondary and High School Mathematics
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Access carefully curated video content from world-class educators across multiple curricula and exam boards. 
              Find the perfect resources for your specific educational pathway.
            </p>
            <div className="flex items-center justify-center mt-6 gap-2">
              <Play className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-semibold text-blue-600">From Top Educators Worldwide</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videoHubBoards.map((board, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${board.color}`}></div>
                <CardHeader className="text-center pb-2">
                  <div className={`w-16 h-16 bg-gradient-to-r ${board.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <board.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {board.title}
                  </CardTitle>
                  <Badge variant="secondary" className="w-fit mx-auto bg-gray-100 text-gray-700">
                    {board.region}
                  </Badge>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 mb-4 leading-relaxed h-12">
                    {board.description}
                  </CardDescription>
                  <Button asChild className="w-full group-hover:bg-blue-600 transition-colors">
                    <Link to={board.path}>
                      Explore Videos
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 rounded-full border border-blue-200">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <span className="text-blue-800 font-medium">More curricula and resources coming soon</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
