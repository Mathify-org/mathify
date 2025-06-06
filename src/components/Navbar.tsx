
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user, loading } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
    { name: "FAQ", path: "/faq" },
  ];

  const getInitials = () => {
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/471e55df-9e2d-4051-b312-93edbd1dc0f0.png" 
              alt="Mathify Logo" 
              className="h-8 w-8 md:h-10 md:w-10"
            />
            <span className="font-bold text-xl md:text-2xl tracking-tight">Mathify</span>
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
            <div className="flex items-center space-x-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className="text-white hover:text-white/80 px-3 py-2"
                >
                  {link.name}
                </Link>
              ))}
              
              {!loading && (
                user ? (
                  <Link to="/profile">
                    <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity">
                      <AvatarFallback className="bg-white text-purple-600 font-semibold">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                ) : (
                  <Link to="/auth">
                    <Button className="bg-white text-purple-600 hover:bg-white/90">
                      Sign Up
                    </Button>
                  </Link>
                )
              )}
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {isMobile && isMenuOpen && (
          <div className="mt-4 pb-4 space-y-3 animate-fade-in">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path}
                className="block text-white hover:bg-white/10 px-3 py-2 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            {!loading && (
              user ? (
                <Link 
                  to="/profile"
                  className="flex items-center space-x-2 text-white hover:bg-white/10 px-3 py-2 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-white text-purple-600 font-semibold text-sm">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <span>Profile</span>
                </Link>
              ) : (
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-white text-purple-600 hover:bg-white/90">
                    Sign Up
                  </Button>
                </Link>
              )
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
