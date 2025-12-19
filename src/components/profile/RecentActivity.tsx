import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { progressService } from '@/services/progressService';
import { Clock, Trophy, Target, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RecentActivityProps {
  userId: string;
}

interface GameSession {
  id: string;
  game_id: string;
  score: number;
  correct_answers: number;
  total_questions: number;
  accuracy: number;
  xp_earned: number;
  completed_at: string;
}

const gameNames: Record<string, string> = {
  'mental-maths': 'Mental Maths Challenge',
  'times-tables': 'Times Tables Master',
  'math-facts': 'Math Facts Race',
  'shape-match': 'Shape Match',
  'fraction-basics': 'Fraction Basics',
  'fraction-simplify': 'Fraction Master',
  'target-takedown': 'Target Takedown',
  'algebra-adventure': 'Algebra Adventure',
  'time-master': 'Time Master',
  'money-counter': 'Money Counter',
  'geometry-master': 'Geometry Master',
  'math-intuition': 'Math Intuition',
  'arithmetic-hero': 'Arithmetic Hero',
  'math-warp': 'Math Warp'
};

const gamePaths: Record<string, string> = {
  'mental-maths': '/mental-maths',
  'times-tables': '/times-tables',
  'math-facts': '/math-facts',
  'shape-match': '/shape-match',
  'fraction-basics': '/fraction-basics',
  'fraction-simplify': '/fraction-simplify',
  'target-takedown': '/target-takedown',
  'algebra-adventure': '/algebra-adventure',
  'time-master': '/time-master',
  'money-counter': '/money-counter',
  'geometry-master': '/geometry-master',
  'math-intuition': '/math-intuition',
  'arithmetic-hero': '/arithmetic-hero',
  'math-warp': '/math-warp'
};

const RecentActivity: React.FC<RecentActivityProps> = ({ userId }) => {
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSessions = async () => {
      const data = await progressService.getRecentSessions(userId, 10);
      setSessions(data);
      setLoading(false);
    };
    loadSessions();
  }, [userId]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-pulse">Loading activity...</div>
        </CardContent>
      </Card>
    );
  }

  if (sessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-500" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <Target className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">No games played yet!</p>
          <Link 
            to="/"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Start Playing
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-500" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link 
                to={gamePaths[session.game_id] || '/'}
                className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                      {gameNames[session.game_id] || session.game_id}
                    </h4>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        {session.score} pts
                      </span>
                      <span>{session.correct_answers}/{session.total_questions} correct</span>
                      {session.accuracy && (
                        <span className={session.accuracy >= 80 ? 'text-green-600' : ''}>
                          {session.accuracy}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-1 text-yellow-600 font-semibold">
                    <Zap className="w-4 h-4" />
                    +{session.xp_earned} XP
                  </div>
                  <p className="text-xs text-gray-400">{formatTimeAgo(session.completed_at)}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
