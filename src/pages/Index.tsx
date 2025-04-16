
import GameMascot from "@/components/GameMascot";
import SoilLandscape from "@/components/SoilLandscape";
import QuizSection from "@/components/QuizSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sun to-accent p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-soil">
          Soil Erosion and Conservation
        </h1>
        
        <GameMascot message="Hi! I'm Wiggles! Let's learn about soil erosion and how to prevent it!" />
        
        <div className="grid gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Your Conservation Sandbox</h2>
            <SoilLandscape />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">Test Your Knowledge</h2>
            <QuizSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
