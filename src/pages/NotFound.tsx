
import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex items-center justify-center py-16 md:py-24 px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="text-center max-w-md">
        <h1 className="text-6xl md:text-8xl font-bold text-purple-600 mb-4">404</h1>
        <p className="text-xl md:text-2xl text-gray-700 mb-6">Oops! We couldn't find the page you're looking for.</p>
        <p className="text-gray-500 mb-8">The page you requested doesn't exist or has been moved.</p>
        <Link to="/">
          <Button className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 hover:opacity-90 transition-opacity">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
