import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import MentalMathsGame from "./pages/MentalMathsGame";
import TimesTablesMaster from "./pages/TimesTablesMaster";
import MathFactsRace from "./pages/MathFactsRace";
import ShapeMatch from "./pages/ShapeMatch";
import FractionBasics from "./pages/FractionBasics";
import FractionSimplify from "./pages/FractionSimplify";
import ArithmeticHero from "./pages/ArithmeticHero";
import TargetTakedown from "./pages/TargetTakedown";
import AlgebraAdventure from "./pages/AlgebraAdventure";
import ALevelsVideoHub from "./pages/ALevelsVideoHub";
import IBVideoHub from "./pages/IBVideoHub";
import GCSEVideoHub from "./pages/GCSEVideoHub";
import USVideoHub from "./pages/USVideoHub";
import AustralianVideoHub from "./pages/AustralianVideoHub";
import CanadianVideoHub from "./pages/CanadianVideoHub";
import CBSEVideoHub from "./pages/CBSEVideoHub";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import MathWarp from "./pages/MathWarp";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import TimeMaster from "./pages/TimeMaster";
import MoneyCounter from "./pages/MoneyCounter";
import GeometryMaster from "./pages/GeometryMaster";
import MathIntuition from "./pages/MathIntuition";
import MathEveryday from "./pages/MathEveryday";
import FamilyBuilder from "./pages/FamilyBuilder";
import TaxCalculator from "./pages/TaxCalculator";
import UnitConverter from "./pages/UnitConverter";

// ScrollToTop component that will trigger on route changes
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <ScrollToTop />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/mental-maths" element={<MentalMathsGame />} />
                <Route path="/times-tables" element={<TimesTablesMaster />} />
                <Route path="/math-facts" element={<MathFactsRace />} />
                <Route path="/shape-match" element={<ShapeMatch />} />
                <Route path="/fraction-basics" element={<FractionBasics />} />
                <Route path="/fraction-simplify" element={<FractionSimplify />} />
                <Route path="/time-master" element={<TimeMaster />} />
                <Route path="/money-counter" element={<MoneyCounter />} />
                <Route path="/geometry-master" element={<GeometryMaster />} />
                <Route path="/math-intuition" element={<MathIntuition />} />
                <Route path="/math-everyday" element={<MathEveryday />} />
                <Route path="/family-builder" element={<FamilyBuilder />} />
                <Route path="/tax-calculator" element={<TaxCalculator />} />
                <Route path="/unit-converter" element={<UnitConverter />} />
                <Route path="/arithmetic-hero" element={<ArithmeticHero />} />
                <Route path="/target-takedown" element={<TargetTakedown />} />
                <Route path="/algebra-adventure" element={<AlgebraAdventure />} />
                <Route path="/math-warp" element={<MathWarp />} />
                <Route path="/video-hub/alevels" element={<ALevelsVideoHub />} />
                <Route path="/video-hub/ib" element={<IBVideoHub />} />
                <Route path="/video-hub/gcse" element={<GCSEVideoHub />} />
                <Route path="/video-hub/us" element={<USVideoHub />} />
                <Route path="/video-hub/australian" element={<AustralianVideoHub />} />
                <Route path="/video-hub/canadian" element={<CanadianVideoHub />} />
                <Route path="/video-hub/cbse" element={<CBSEVideoHub />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
