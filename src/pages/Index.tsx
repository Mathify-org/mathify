import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import GameMascot from "@/components/GameMascot";

const Index = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-6">Soil Education Platform</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {/* Mental Maths Game Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Mental Maths Challenge</CardTitle>
            <CardDescription>Test your math skills with quick calculations</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Practice addition, subtraction, multiplication and division with our fun, timed challenge!</p>
          </CardContent>
          <CardFooter>
            <Link to="/maths">
              <Button>Play Now</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Soil Erosion Simulator</CardTitle>
            <CardDescription>Learn about soil erosion through simulation</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Explore how different factors affect soil erosion in this interactive simulator.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline">Coming Soon</Button>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Plant Growth Lab</CardTitle>
            <CardDescription>Virtual plant growing experiment</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Grow virtual plants and learn about factors affecting plant growth.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline">Coming Soon</Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mt-8">
        <GameMascot message="Welcome to the Soil Education Platform! Choose an activity to begin learning." />
      </div>
    </div>
  );
};

export default Index;
