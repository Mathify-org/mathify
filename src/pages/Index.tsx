
import GameMascot from "@/components/GameMascot";
import QuizSection from "@/components/QuizSection";
import SoilErosionGame from "@/components/SoilErosionGame";
import SoilTypingGame from "@/components/SoilTypingGame";
import SoilCrossword from "@/components/SoilCrossword";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sun to-accent p-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <h1 className="text-4xl font-bold text-center text-soil">
          Soil Erosion and Conservation
        </h1>
        
        <GameMascot message="Hi! I'm Wiggles! Let's learn about soil erosion and how to prevent it!" />
        
        <div className="grid gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">Protect Your Soil!</h2>
            <SoilErosionGame />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">Test Your Knowledge</h2>
            <QuizSection />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="mr-2">Speed Typing Challenge</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">New!</span>
            </h2>
            <SoilTypingGame />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="mr-2">Soil Conservation Crossword</span>
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">New!</span>
            </h2>
            <SoilCrossword />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
