
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/471e55df-9e2d-4051-b312-93edbd1dc0f0.png" 
              alt="Mathify Logo" 
              className="h-10 w-10"
            />
            <span className="font-bold text-2xl tracking-tight">Mathify</span>
          </Link>

          {/* Mobile menu button */}
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMenu} 
              className="text-white hover:bg-white/20"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          )}

          {/* Desktop menu */}
          {!isMobile && (
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-white hover:text-white/80 font-medium">Home</Link>
              <Link to="#grade-levels" className="text-white hover:text-white/80 font-medium">Grade Levels</Link>
              <Link to="#general-skills" className="text-white hover:text-white/80 font-medium">General Skills</Link>
              <Button className="bg-white text-purple-600 hover:bg-white/90">Sign Up</Button>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {isMobile && isMenuOpen && (
          <div className="mt-4 pb-4 space-y-3 animate-fade-in">
            <Link 
              to="/" 
              className="block py-2 px-4 text-center rounded-md bg-white/10 hover:bg-white/20"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="#grade-levels" 
              className="block py-2 px-4 text-center rounded-md bg-white/10 hover:bg-white/20"
              onClick={() => setIsMenuOpen(false)}
            >
              Grade Levels
            </Link>
            <Link 
              to="#general-skills" 
              className="block py-2 px-4 text-center rounded-md bg-white/10 hover:bg-white/20"
              onClick={() => setIsMenuOpen(false)}
            >
              General Skills
            </Link>
            <Button className="w-full bg-white text-purple-600 hover:bg-white/90">Sign Up</Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
