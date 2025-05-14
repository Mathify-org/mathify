
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ open, onClose }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-bold text-purple-700">How to Play Shape Explorer</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X />
          </Button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <h4 className="font-bold text-lg mb-2">Game Overview</h4>
            <p className="text-slate-700">
              Shape Explorer is a geometry adventure where you'll explore different islands, 
              each focused on a specific geometric concept. Complete challenges to earn stars 
              and unlock new areas of the map!
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-2">How to Play</h4>
            <ol className="list-decimal pl-5 space-y-2 text-slate-700">
              <li>Click on an island on the map to view its challenges.</li>
              <li>Select a challenge to begin playing.</li>
              <li>Complete the challenge by following the instructions.</li>
              <li>Earn up to 3 stars based on your speed and accuracy.</li>
              <li>Unlock new islands by completing challenges on the current ones.</li>
            </ol>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-2">Challenge Types</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 mr-2">
                  sort
                </span>
                <span className="text-slate-700">Sort shapes into different categories based on their properties.</span>
              </li>
              <li className="flex items-center">
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 mr-2">
                  match
                </span>
                <span className="text-slate-700">Match shapes with their correct names or properties.</span>
              </li>
              <li className="flex items-center">
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 mr-2">
                  measure
                </span>
                <span className="text-slate-700">Estimate or measure angles in various shapes.</span>
              </li>
              <li className="flex items-center">
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800 mr-2">
                  build
                </span>
                <span className="text-slate-700">Create 3D shapes from their 2D nets by dragging and rotating pieces.</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-2">Tips for Success</h4>
            <ul className="list-disc pl-5 space-y-2 text-slate-700">
              <li>Complete challenges quickly to earn more stars.</li>
              <li>Try to get all challenges on an island right the first time.</li>
              <li>Read the fun facts after completing challenges to learn more about geometry.</li>
              <li>Your progress is automatically saved, so you can continue your adventure anytime.</li>
            </ul>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-xl">
            <h4 className="font-bold text-lg mb-2 text-purple-700">Example Challenge</h4>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="bg-white p-3 rounded-lg shadow-md">
                <div className="flex items-center justify-center gap-3 p-2">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                    <div className="w-12 h-12 bg-blue-500 rounded"></div>
                  </div>
                  <div className="text-2xl font-bold text-blue-500">→</div>
                  <div className="space-y-2">
                    <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Square</div>
                    <div className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">Circle</div>
                  </div>
                </div>
              </div>
              <div className="text-slate-700 md:flex-1">
                <p className="font-medium">In this example sorting challenge:</p>
                <p className="mt-1">Drag the shape to the correct category based on its properties.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t p-4 flex justify-end">
          <Button onClick={onClose}>Got it!</Button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
