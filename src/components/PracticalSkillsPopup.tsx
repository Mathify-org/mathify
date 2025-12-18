
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { Wallet, TrendingUp, Ruler, BarChart3 } from "lucide-react";

interface PracticalSkillsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const PracticalSkillsPopup = ({ isOpen, onClose }: PracticalSkillsPopupProps) => {
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
    },
    {
      id: "data-analysis",
      title: "Data Analysis Suite",
      description: "Create beautiful charts, graphs and data visualizations with interactive tools",
      path: "/data-analysis",
      icon: <BarChart3 className="h-8 w-8" />,
      gradient: "from-blue-500 via-indigo-500 to-purple-500"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white border-0">
        <DialogHeader>
          <DialogTitle className="text-2xl md:text-3xl font-bold text-center mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Practical Skills
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {practicalSkills.map((skill) => (
            <Link 
              key={skill.id} 
              to={skill.path} 
              onClick={onClose}
              className="group block"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 h-full">
                <div className={`w-16 h-16 bg-gradient-to-r ${skill.gradient} rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <div className="text-white">
                    {skill.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 text-center group-hover:text-cyan-200 transition-colors">
                  {skill.title}
                </h3>
                
                <p className="text-white/80 text-sm text-center leading-relaxed mb-4">
                  {skill.description}
                </p>
                
                <div className={`mt-4 mx-auto w-fit px-4 py-2 bg-gradient-to-r ${skill.gradient} rounded-lg text-white font-medium text-sm hover:shadow-lg transition-all duration-300 group-hover:scale-105`}>
                  Start Learning
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-white/60 text-sm">
            Build practical skills for real-world success
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PracticalSkillsPopup;
