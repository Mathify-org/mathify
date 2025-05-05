
import React from "react";

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 py-16 md:py-28">
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
          <div className="md:w-1/2 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Fun and interactive ways to learn Mathematics.<br />Free and Open-Source.
            </h1>
            <p className="text-white/90 text-lg md:text-xl mb-8 max-w-xl mx-auto">
              Mathify makes learning math fun and engaging with games designed for all ages and skill levels.
            </p>
          </div>
          
          <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center items-center md:justify-end">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <img 
                src="/lovable-uploads/471e55df-9e2d-4051-b312-93edbd1dc0f0.png" 
                alt="Mathify Logo" 
                className="w-full h-full object-contain"
                style={{ transform: "translateY(10px)" }}
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
