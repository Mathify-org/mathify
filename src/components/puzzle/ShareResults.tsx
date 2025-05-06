
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generateShareText } from "@/utils/dailyPuzzleUtils";

interface ShareResultsProps {
  guesses: number;
  maxGuesses: number;
  won: boolean;
  streak: number;
}

const ShareResults: React.FC<ShareResultsProps> = ({ guesses, maxGuesses, won, streak }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const shareText = generateShareText(guesses, maxGuesses, won, streak);
    
    // Try to use the Web Share API
    if (navigator.share) {
      navigator.share({
        title: "Daily Math Puzzle Results",
        text: shareText,
      }).catch(() => {
        // Fallback to clipboard copy
        copyToClipboard(shareText);
      });
    } else {
      // Fallback to clipboard copy
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Results copied to clipboard!");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      toast.error("Could not copy results");
    });
  };

  return (
    <div className="mt-4 text-center">
      <Button
        onClick={handleShare}
        className={`bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg shadow-md transition-all`}
      >
        {copied ? "Copied!" : "Share Results"} 
      </Button>
      <p className="text-sm text-gray-500 mt-2">Share your results with friends</p>
    </div>
  );
};

export default ShareResults;
