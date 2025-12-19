import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, User } from 'lucide-react';
import { useLeaderboard } from '@/hooks/useProgressTracking';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface LeaderboardProps {
  gameId: string;
  gameName: string;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ gameId, gameName }) => {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'all_time'>('all_time');
  const { data: entries, isLoading } = useLeaderboard(gameId, period);
  const { user } = useAuth();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-amber-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-500/30';
      case 2:
        return 'bg-gradient-to-r from-gray-400/20 to-gray-300/20 border-gray-400/30';
      case 3:
        return 'bg-gradient-to-r from-amber-700/20 to-amber-600/20 border-amber-700/30';
      default:
        return 'bg-muted/50 border-transparent';
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Trophy className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-foreground">{gameName}</h3>
          <p className="text-sm text-muted-foreground">Leaderboard</p>
        </div>
      </div>

      <Tabs value={period} onValueChange={(v) => setPeriod(v as any)}>
        <TabsList className="w-full mb-4">
          <TabsTrigger value="daily" className="flex-1">Today</TabsTrigger>
          <TabsTrigger value="weekly" className="flex-1">This Week</TabsTrigger>
          <TabsTrigger value="all_time" className="flex-1">All Time</TabsTrigger>
        </TabsList>

        <TabsContent value={period} className="mt-0">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted/50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : entries && entries.length > 0 ? (
            <div className="space-y-2">
              {entries.map((entry, index) => (
                <motion.div
                  key={entry.userId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-4 p-4 rounded-xl border ${getRankStyle(entry.rank)} ${
                    user?.id === entry.userId ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <div className="w-8 flex justify-center">
                    {getRankIcon(entry.rank)}
                  </div>
                  
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {entry.displayName}
                      {user?.id === entry.userId && (
                        <span className="ml-2 text-xs text-primary">(You)</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {entry.gamesPlayed} games played
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-foreground">{entry.highScore.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{entry.totalXp} XP</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No entries yet. Be the first!</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
