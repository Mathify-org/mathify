
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const Hero = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 py-10 md:py-24">
      {/* Decorative math symbols */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-[10%] left-[5%] text-6xl">+</div>
        <div className="absolute top-[45%] left-[15%] text-5xl">÷</div>
        <div className="absolute top-[20%] left-[80%] text-7xl">-</div>
        <div className="absolute top-[70%] left-[75%] text-6xl">×</div>
        <div className="absolute top-[80%] left-[25%] text-5xl">=</div>
        <div className="absolute top-[30%] left-[45%] text-7xl">π</div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-center">
          <div className={`md:w-1/2 text-center ${isMobile ? "mb-6" : ""}`}>
            <div className="relative mb-4 md:mb-6">
              {/* Stunning main title with enhanced styling */}
              <div className="relative">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mt-2 md:mt-0 relative z-10">
                  <span className="inline-block bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent drop-shadow-2xl font-extrabold tracking-tight">
                    Fun and interactive ways to<br className="hidden sm:block" /> learn Mathematics.
                  </span>
                </h1>
                {/* Subtle glow effect behind text */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-yellow-200/20 to-white/20 blur-xl -z-10 transform scale-110"></div>
              </div>
              
              {/* Enhanced "Free and Open-Source" badge */}
              <div className="inline-block mt-4 md:mt-6 relative">
                <div className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 p-0.5 rounded-2xl shadow-2xl">
                  <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 px-6 py-3 rounded-2xl backdrop-blur-sm">
                    <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent tracking-wide">
                      Free and Open-Source
                    </span>
                  </div>
                </div>
                {/* Subtle pulse glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-300/30 via-teal-300/30 to-cyan-300/30 rounded-2xl blur-lg animate-pulse -z-10"></div>
              </div>
            </div>
            
            <p className="text-white/90 text-base md:text-xl mb-6 md:mb-8 max-w-xl mx-auto px-3 md:px-0">
              Mathify is your destination for mastering primary, secondary, higher and advanced mathematics. Made for all ages and skill levels.
            </p>
          </div>
          
          <div className="md:w-1/2 flex justify-center items-center">
            <div className="relative w-64 h-64 md:w-96 md:h-96 -mt-0 -ml-1 md:-mt-6 md:-ml-8">
              <img 
                src="/lovable-uploads/471e55df-9e2d-4051-b312-93edbd1dc0f0.png" 
                alt="Mathify Logo" 
                className="w-full h-full object-contain"
              />
              <div className="absolute -inset-4 bg-white/30 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
          <path fill="#f8fafc" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,229.3C672,245,768,267,864,261.3C960,256,1056,224,1152,208C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default Hero;
