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
    onClose();
    // Use setTimeout to ensure the overlay closes before scrolling
    setTimeout(() => {
      onNavigate(sectionId);
    }, 100);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Desktop: Full-screen overlay */}
          <div className="hidden md:flex fixed inset-0 z-[9999] items-center justify-center">
            {/* Beautiful gradient backdrop - fully opaque */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              onClick={onClose}
            >
              {/* Base gradient layer */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-rose-500 to-purple-600" />
              {/* Secondary gradient overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-400/50 via-pink-500/30 to-indigo-600/50" />
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-yellow-300/20 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-fuchsia-400/20 via-transparent to-transparent" />
            </motion.div>
            
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="relative z-10 w-full max-w-5xl mx-4"
            >
              <div className="relative bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-indigo-900/95 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                {/* Decorative glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 rounded-3xl blur-xl -z-10" />
                
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        Choose Your Path
                      </h3>
                      <p className="text-white/60 text-sm">Select a category to explore</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:rotate-90"
                  >
                    <X className="h-5 w-5 text-white" />
                  </button>
                </div>

                {/* Section Cards Grid - Desktop */}
                <div className="grid grid-cols-4 gap-6">
                  {sections.map((section, index) => {
                    const Icon = section.icon;
                    return (
                      <motion.button
                        key={section.id}
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}
                        onClick={() => handleSectionClick(section.id)}
                        className={`group relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-2xl ${section.hoverGlow}`}
                      >
                        {/* Card Background */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-90 group-hover:opacity-100 transition-opacity duration-300`} />
                        
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%]" 
                             style={{ transition: 'transform 0.6s ease-in-out, opacity 0.3s' }} />
                        
                        {/* Content */}
                        <div className="relative z-10">
                          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                          
                          <h4 className="font-bold text-white text-lg mb-2">
                            {section.title}
                          </h4>
                          
                          <p className="text-white/80 text-sm leading-relaxed mb-4">
                            {section.description}
                          </p>
                          
                          {/* Arrow indicator */}
                          <div className="flex items-center gap-2 text-white/80 text-sm font-medium group-hover:text-white transition-colors">
                            <span>Explore</span>
                            <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Mobile: Inline expanding panel (unchanged) */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden md:hidden"
          >
            <div className="relative mt-6">
              {/* Decorative background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10 rounded-3xl blur-xl" />
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-4 border border-white/20 shadow-2xl"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
                    <h3 className="text-lg font-bold text-white">
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

                {/* Section Cards Grid - Mobile */}
                <div className="grid grid-cols-2 gap-3">
                  {sections.map((section, index) => {
                    const Icon = section.icon;
                    return (
                      <motion.button
                        key={section.id}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.15 + index * 0.08, duration: 0.4 }}
                        onClick={() => handleSectionClick(section.id)}
                        className={`group relative overflow-hidden rounded-2xl p-4 text-left transition-all duration-300 hover:scale-105 hover:shadow-2xl ${section.hoverGlow}`}
                      >
                        {/* Card Background */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-80 group-hover:opacity-100 transition-opacity duration-300`} />
                        
                        {/* Content */}
                        <div className="relative z-10">
                          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          
                          <h4 className="font-bold text-white text-sm mb-1 line-clamp-1">
                            {section.title}
                          </h4>
                          
                          <p className="text-white/80 text-xs line-clamp-2 leading-relaxed">
                            {section.description}
                          </p>
                          
                          {/* Arrow indicator */}
                          <div className="mt-2 flex items-center gap-1 text-white/70 text-xs font-medium group-hover:text-white transition-colors">
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
        </>
      )}
    </AnimatePresence>
  );
};

export default GetStartedFlow;
