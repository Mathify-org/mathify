import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GamepadIcon, Wallet, Zap, BarChart3, X, Sparkles } from "lucide-react";

interface GetStartedFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
}

const sections = [
  {
    id: "primary-maths",
    title: "Primary Maths",
    description: "Fun games for kindergarten & primary students",
    icon: GamepadIcon,
    gradient: "from-indigo-500 via-purple-500 to-pink-500",
    hoverGlow: "group-hover:shadow-purple-500/50",
  },
  {
    id: "practical-skills",
    title: "Practical Skills",
    description: "Real-world budgeting & unit conversions",
    icon: Wallet,
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    hoverGlow: "group-hover:shadow-teal-500/50",
  },
  {
    id: "mini-physics",
    title: "Mini-Physics",
    description: "Interactive physics fundamentals",
    icon: Zap,
    gradient: "from-blue-500 via-indigo-500 to-purple-500",
    hoverGlow: "group-hover:shadow-indigo-500/50",
  },
  {
    id: "data-analysis",
    title: "Data Analysis",
    description: "Charts, graphs & visualizations",
    icon: BarChart3,
    gradient: "from-orange-500 via-pink-500 to-rose-500",
    hoverGlow: "group-hover:shadow-pink-500/50",
  },
];

const GetStartedFlow: React.FC<GetStartedFlowProps> = ({ isOpen, onClose, onNavigate }) => {
  const handleSectionClick = (sectionId: string) => {
    onNavigate(sectionId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="overflow-hidden"
        >
          <div className="relative mt-6 md:mt-8">
            {/* Decorative background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10 rounded-3xl blur-xl" />
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-4 md:p-6 border border-white/20 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
                  <h3 className="text-lg md:text-xl font-bold text-white">
                    Choose Your Path
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:rotate-90"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>

              {/* Section Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {sections.map((section, index) => {
                  const Icon = section.icon;
                  return (
                    <motion.button
                      key={section.id}
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.15 + index * 0.08, duration: 0.4 }}
                      onClick={() => handleSectionClick(section.id)}
                      className={`group relative overflow-hidden rounded-2xl p-4 md:p-5 text-left transition-all duration-300 hover:scale-105 hover:shadow-2xl ${section.hoverGlow}`}
                    >
                      {/* Card Background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-80 group-hover:opacity-100 transition-opacity duration-300`} />
                      
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%]" 
                           style={{ transition: 'transform 0.6s ease-in-out, opacity 0.3s' }} />
                      
                      {/* Content */}
                      <div className="relative z-10">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                          <Icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                        </div>
                        
                        <h4 className="font-bold text-white text-sm md:text-base mb-1 line-clamp-1">
                          {section.title}
                        </h4>
                        
                        <p className="text-white/80 text-xs md:text-sm line-clamp-2 leading-relaxed">
                          {section.description}
                        </p>
                        
                        {/* Arrow indicator */}
                        <div className="mt-2 md:mt-3 flex items-center gap-1 text-white/70 text-xs font-medium group-hover:text-white transition-colors">
                          <span>Explore</span>
                          <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GetStartedFlow;
