import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';

interface XPGainDisplayProps {
  xp: number;
  show: boolean;
}

export const XPGainDisplay: React.FC<XPGainDisplayProps> = ({ xp, show }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed bottom-24 right-8 z-50"
        >
          <motion.div
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-full shadow-lg"
            animate={{
              boxShadow: [
                '0 0 20px rgba(139, 92, 246, 0.5)',
                '0 0 40px rgba(139, 92, 246, 0.8)',
                '0 0 20px rgba(139, 92, 246, 0.5)',
              ],
            }}
            transition={{ duration: 1, repeat: 2 }}
          >
            <Zap className="w-5 h-5" />
            <span className="font-bold text-lg">+{xp} XP</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
