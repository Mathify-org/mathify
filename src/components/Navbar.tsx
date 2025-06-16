
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User, Home, Phone, HelpCircle, Gamepad2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import GamePopup from "./GamePopup";
import SecondaryMathsPopup from "./SecondaryMathsPopup";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isGamePopupOpen, setIsGamePopupOpen] = useState(false);
  const [isSecondaryPopupOpen, setIsSecondaryPopupOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user, loading } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const openGamePopup = () => {
    setIsGamePopupOpen(true);
    closeMenu();
  };

  const openSecondaryPopup = () => {
    setIsSecondaryPopupOpen(true);
    closeMenu();
  };

  const navLinks = [
    { name: "Home", path: "/", icon: <Home className="h-5 w-5" /> },
    { name: "Contact", path: "/contact", icon: <Phone className="h-5 w-5" /> },
    { name: "FAQ", path: "/faq", icon: <HelpCircle className="h-5 w-5" /> },
  ];

  const getInitials = () => {
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <>
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
                        Sign In
                      </Button>
                    </Link>
                  )
                )}
              </div>
            )}
          </div>

          {/* Stunning Mobile menu */}
          {isMobile && isMenuOpen && (
            <div className="mt-4 pb-4 space-y-2 animate-fade-in">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 space-y-3">
                {/* Home */}
                <Link 
                  to="/"
                  className="flex items-center gap-4 text-white hover:bg-white/20 px-4 py-3 rounded-xl transition-all duration-300"
                  onClick={closeMenu}
                >
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Home className="h-5 w-5" />
                  </div>
                  <span className="font-medium">Home</span>
                </Link>

                {/* Games */}
                <button 
                  onClick={openGamePopup}
                  className="w-full flex items-center gap-4 text-white hover:bg-white/20 px-4 py-3 rounded-xl transition-all duration-300"
                >
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                    <Gamepad2 className="h-5 w-5" />
                  </div>
                  <span className="font-medium">Games</span>
                </button>

                {/* Secondary Maths */}
                <button 
                  onClick={openSecondaryPopup}
                  className="w-full flex items-center gap-4 text-white hover:bg-white/20 px-4 py-3 rounded-xl transition-all duration-300"
                >
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <span className="font-medium">Secondary Maths</span>
                </button>

                {/* Contact */}
                <Link 
                  to="/contact"
                  className="flex items-center gap-4 text-white hover:bg-white/20 px-4 py-3 rounded-xl transition-all duration-300"
                  onClick={closeMenu}
                >
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Phone className="h-5 w-5" />
                  </div>
                  <span className="font-medium">Contact</span>
                </Link>

                {/* FAQ */}
                <Link 
                  to="/faq"
                  className="flex items-center gap-4 text-white hover:bg-white/20 px-4 py-3 rounded-xl transition-all duration-300"
                  onClick={closeMenu}
                >
                  <div className="p-2 bg-white/20 rounded-lg">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <span className="font-medium">FAQ</span>
                </Link>

                {/* User Profile/Auth */}
                {!loading && (
                  <div className="pt-2 border-t border-white/20">
                    {user ? (
                      <Link 
                        to="/profile"
                        className="flex items-center gap-4 text-white hover:bg-white/20 px-4 py-3 rounded-xl transition-all duration-300"
                        onClick={closeMenu}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-white text-purple-600 font-semibold text-sm">
                            {getInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">Profile</span>
                      </Link>
                    ) : (
                      <Link 
                        to="/auth" 
                        onClick={closeMenu}
                        className="block"
                      >
                        <Button className="w-full bg-white text-purple-600 hover:bg-white/90 rounded-xl py-3">
                          Sign In
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Popups */}
      <GamePopup 
        isOpen={isGamePopupOpen} 
        onClose={() => setIsGamePopupOpen(false)} 
      />
      <SecondaryMathsPopup 
        isOpen={isSecondaryPopupOpen} 
        onClose={() => setIsSecondaryPopupOpen(false)} 
      />
    </>
  );
};

export default Navbar;
