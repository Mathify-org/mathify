import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Zap, Trophy, Flame, TrendingUp, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SignUpPromptProps {
  score: number;
  onDismiss: () => void;
}

const features = [
  { icon: TrendingUp, text: 'Track your progress over time', color: 'text-blue-500' },
  { icon: Zap, text: 'Earn XP and level up', color: 'text-purple-500' },
  { icon: Trophy, text: 'Unlock achievements', color: 'text-amber-500' },
  { icon: Flame, text: 'Build daily streaks', color: 'text-orange-500' },
  { icon: Star, text: 'Compete on leaderboards', color: 'text-green-500' },
];

export const SignUpPrompt: React.FC<SignUpPromptProps> = ({ score, onDismiss }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 rounded-2xl p-6 border border-primary/20"
    >
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4"
        >
          <Trophy className="w-8 h-8 text-primary" />
        </motion.div>
        
        <h3 className="text-xl font-bold text-foreground mb-2">
          Great Score: {score}!
        </h3>
        <p className="text-muted-foreground">
          Sign up to save your progress and unlock more features
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.text}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            className="flex items-center gap-3"
          >
            <div className={`w-8 h-8 rounded-lg bg-muted flex items-center justify-center ${feature.color}`}>
              <feature.icon className="w-4 h-4" />
            </div>
            <span className="text-sm text-foreground">{feature.text}</span>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-3">
        <Button
          onClick={() => navigate('/auth')}
          className="flex-1 bg-primary hover:bg-primary/90"
        >
          Sign Up Free
        </Button>
        <Button
          onClick={onDismiss}
          variant="outline"
          className="flex-1"
        >
          Maybe Later
        </Button>
      </div>
    </motion.div>
  );
};
