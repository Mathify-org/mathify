
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import MentalMathsGame from "./pages/MentalMathsGame";
import TimesTablesMaster from "./pages/TimesTablesMaster";
import MathFactsRace from "./pages/MathFactsRace";
import ShapeExplorer from "./pages/ShapeExplorer";
import FractionFrenzy from "./pages/FractionFrenzy";
import ArithmeticHero from "./pages/ArithmeticHero";
import TargetTakedown from "./pages/TargetTakedown";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";

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
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <ScrollToTop />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/maths" element={<MentalMathsGame />} />
              <Route path="/times-tables" element={<TimesTablesMaster />} />
              <Route path="/math-facts" element={<MathFactsRace />} />
              <Route path="/shape-explorer" element={<ShapeExplorer />} />
              <Route path="/fraction-frenzy" element={<FractionFrenzy />} />
              <Route path="/arithmetic-hero" element={<ArithmeticHero />} />
              <Route path="/target-takedown" element={<TargetTakedown />} />
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
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
