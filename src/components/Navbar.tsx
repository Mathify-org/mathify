
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Calculator, Users, Gamepad2, Video, BookOpen, User, LogOut, LogIn, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const primaryGames = [
  { name: 'Mental Maths', path: '/mental-maths', icon: '🧠' },
  { name: 'Times Tables', path: '/times-tables', icon: '✖️' },
  { name: 'Math Facts Race', path: '/math-facts', icon: '🏁' },
  { name: 'Shape Match', path: '/shape-match', icon: '🔺' },
  { name: 'Fraction Basics', path: '/fraction-basics', icon: '½' },
  { name: 'Fraction Simplify', path: '/fraction-simplify', icon: '🔢' }
];

const practicalGames = [
  { name: 'Family Trees', path: '/family-builder', icon: '👨‍👩‍👧‍👦' },
  { name: 'Tax Calculator', path: '/tax-calculator', icon: '💰' },
  { name: 'Unit Converter', path: '/unit-converter', icon: '📏' }
];

const secondaryGames = [
  { name: 'Time Master', path: '/time-master', icon: '⏰' },
  { name: 'Money Counter', path: '/money-counter', icon: '💸' },
  { name: 'Geometry Master', path: '/geometry-master', icon: '📐' },
  { name: 'Math Intuition', path: '/math-intuition', icon: '🔮' },
  { name: 'Math Everyday', path: '/math-everyday', icon: '🏠' },
  { name: 'Arithmetic Hero', path: '/arithmetic-hero', icon: '🦸' },
  { name: 'Target Takedown', path: '/target-takedown', icon: '🎯' },
  { name: 'Algebra Adventure', path: '/algebra-adventure', icon: '🗡️' },
  { name: 'Math Warp', path: '/math-warp', icon: '🚀' }
];

const videoHubs = [
  { name: 'A-Levels', path: '/video-hub/alevels', flag: '🇬🇧' },
  { name: 'IB', path: '/video-hub/ib', flag: '🌍' },
  { name: 'GCSE', path: '/video-hub/gcse', flag: '🇬🇧' },
  { name: 'US System', path: '/video-hub/us', flag: '🇺🇸' },
  { name: 'Australian', path: '/video-hub/australian', flag: '🇦🇺' },
  { name: 'Canadian', path: '/video-hub/canadian', flag: '🇨🇦' },
  { name: 'CBSE (India)', path: '/video-hub/cbse', flag: '🇮🇳' }
];

const Navbar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showPracticalPopup, setShowPracticalPopup] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Calculator className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Mathify</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                {/* Games Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-700 hover:text-blue-600">
                    <Gamepad2 className="w-4 h-4 mr-2" />
                    Games
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[800px] grid-cols-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          Primary Games
                        </h4>
                        <div className="space-y-2">
                          {primaryGames.map((game) => (
                            <NavigationMenuLink key={game.path} asChild>
                              <Link
                                to={game.path}
                                className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              >
                                <span className="mr-2">{game.icon}</span>
                                {game.name}
                              </Link>
                            </NavigationMenuLink>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                          <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                          Secondary Games
                        </h4>
                        <div className="space-y-2">
                          {secondaryGames.slice(0, 6).map((game) => (
                            <NavigationMenuLink key={game.path} asChild>
                              <Link
                                to={game.path}
                                className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              >
                                <span className="mr-2">{game.icon}</span>
                                {game.name}
                              </Link>
                            </NavigationMenuLink>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                          More Games
                        </h4>
                        <div className="space-y-2">
                          {secondaryGames.slice(6).map((game) => (
                            <NavigationMenuLink key={game.path} asChild>
                              <Link
                                to={game.path}
                                className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              >
                                <span className="mr-2">{game.icon}</span>
                                {game.name}
                              </Link>
                            </NavigationMenuLink>
                          ))}
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Video Hub Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-700 hover:text-blue-600">
                    <Video className="w-4 h-4 mr-2" />
                    Video Hub
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[400px] grid-cols-2">
                      {videoHubs.map((hub) => (
                        <NavigationMenuLink key={hub.path} asChild>
                          <Link
                            to={hub.path}
                            className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          >
                            <span className="mr-2">{hub.flag}</span>
                            {hub.name}
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild variant="ghost">
                  <Link to="/auth">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div className="flex items-center">
                      <Calculator className="h-6 w-6 text-blue-600" />
                      <span className="ml-2 text-lg font-bold text-gray-900">Mathify</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 py-4 space-y-4">
                    {/* Primary Games */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                        <Gamepad2 className="w-4 h-4 mr-2" />
                        Primary Games
                      </h3>
                      <div className="space-y-1">
                        {primaryGames.map((game) => (
                          <Link
                            key={game.path}
                            to={game.path}
                            onClick={() => setIsOpen(false)}
                            className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                              isActive(game.path)
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                            }`}
                          >
                            <span className="mr-2">{game.icon}</span>
                            {game.name}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Practical Skills */}
                    <div>
                      <button
                        onClick={() => setShowPracticalPopup(true)}
                        className="w-full text-left text-sm font-semibold text-gray-900 mb-3 flex items-center hover:text-blue-600 transition-colors"
                      >
                        <Wrench className="w-4 h-4 mr-2" />
                        Practical Skills
                      </button>
                    </div>

                    {/* Secondary Games */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                        <BookOpen className="w-4 h-4 mr-2" />
                        More Games
                      </h3>
                      <div className="space-y-1">
                        {secondaryGames.map((game) => (
                          <Link
                            key={game.path}
                            to={game.path}
                            onClick={() => setIsOpen(false)}
                            className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                              isActive(game.path)
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                            }`}
                          >
                            <span className="mr-2">{game.icon}</span>
                            {game.name}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Video Hubs */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                        <Video className="w-4 h-4 mr-2" />
                        Video Hub
                      </h3>
                      <div className="space-y-1">
                        {videoHubs.map((hub) => (
                          <Link
                            key={hub.path}
                            to={hub.path}
                            onClick={() => setIsOpen(false)}
                            className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                              isActive(hub.path)
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                            }`}
                          >
                            <span className="mr-2">{hub.flag}</span>
                            {hub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* User section */}
                  <div className="border-t pt-4">
                    {user ? (
                      <div className="space-y-2">
                        <Link
                          to="/profile"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <User className="w-4 h-4 mr-3" />
                          Profile
                        </Link>
                        <button
                          onClick={() => {
                            handleSignOut();
                            setIsOpen(false);
                          }}
                          className="flex items-center w-full px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Sign out
                        </button>
                      </div>
                    ) : (
                      <Link
                        to="/auth"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <LogIn className="w-4 h-4 mr-3" />
                        Sign In
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Practical Skills Popup */}
      <AnimatePresence>
        {showPracticalPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPracticalPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Wrench className="w-5 h-5 mr-2 text-blue-600" />
                Practical Skills
              </h3>
              <p className="text-gray-600 mb-6">
                Build real-world mathematical skills with these interactive tools
              </p>
              <div className="space-y-3">
                {practicalGames.map((game) => (
                  <Link
                    key={game.path}
                    to={game.path}
                    onClick={() => {
                      setShowPracticalPopup(false);
                      setIsOpen(false);
                    }}
                    className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-lg transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-lg mr-3 group-hover:scale-105 transition-transform">
                      {game.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{game.name}</div>
                      <div className="text-sm text-gray-600">
                        {game.name === 'Family Trees' && 'Build and analyze family structures'}
                        {game.name === 'Tax Calculator' && 'Learn about income taxes and deductions'}
                        {game.name === 'Unit Converter' && 'Master unit conversions and measurements'}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
