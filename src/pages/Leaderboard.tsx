import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Trophy, Medal, Crown, Star, Flame, Target, Zap, TrendingUp, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AdBanner from '@/components/AdBanner';

interface UserRanking {
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  totalXp: number;
  gamesPlayed: number;
  currentLevel: number;
  rank: number;
}

const gameOptions = [
  { value: 'all', label: 'All Games' },
  { value: 'mental-maths', label: 'Mental Maths' },
  { value: 'times-tables', label: 'Times Tables' },
  { value: 'math-facts-race', label: 'Math Facts Race' },
  { value: 'fraction-simplify', label: 'Fraction Master' },
  { value: 'geometry-master', label: 'Geometry Master' },
  { value: 'algebra-adventure', label: 'Algebra Adventure' },
  { value: 'target-takedown', label: 'Target Takedown' },
  { value: 'math-warp', label: 'Math Warp' },
  { value: 'arithmetic-hero', label: 'Arithmetic Hero' },
  { value: 'memorizing-pi', label: 'Memorizing Pi' },
  { value: 'memorizing-euler', label: "Memorizing Euler's" },
  { value: 'memorizing-phi', label: 'Memorizing Phi' },
  { value: 'shape-explorer', label: 'Shape Explorer' },
];

const ITEMS_PER_PAGE = 50;

// Get the start date for time period filtering
const getStartDateForPeriod = (period: 'weekly' | 'monthly' | 'all-time'): Date | null => {
  const now = new Date();
  switch (period) {
    case 'weekly':
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - 7);
      weekStart.setHours(0, 0, 0, 0);
      return weekStart;
    case 'monthly':
      const monthStart = new Date(now);
      monthStart.setDate(now.getDate() - 30);
      monthStart.setHours(0, 0, 0, 0);
      return monthStart;
    case 'all-time':
      return null;
  }
};

const Leaderboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rankings, setRankings] = useState<UserRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodFilter, setPeriodFilter] = useState<'weekly' | 'monthly' | 'all-time'>('all-time');
  const [gameFilter, setGameFilter] = useState('all');
  const [userRank, setUserRank] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when filters change
    loadLeaderboard();
  }, [periodFilter, gameFilter]);

  useEffect(() => {
    loadLeaderboard();
  }, [currentPage]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      let formattedRankings: UserRanking[] = [];
      const startDate = getStartDateForPeriod(periodFilter);

      if (gameFilter === 'all' && periodFilter === 'all-time') {
        // ALL GAMES + ALL TIME: Show all public profiles, ranked by total_xp from user_progress
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, display_name, avatar_url, is_public')
          .eq('is_public', true)
          .or('username.neq.null,display_name.neq.null');

        if (profilesError) {
          console.error('Error loading profiles:', profilesError);
          setRankings([]);
          return;
        }

        const validProfiles = (profiles || []).filter((p: any) => 
          (p.username && p.username.trim() !== '') || 
          (p.display_name && p.display_name.trim() !== '')
        );

        setTotalUsers(validProfiles.length);

        if (validProfiles.length === 0) {
          setRankings([]);
          setLoading(false);
          return;
        }

        const profileIds = validProfiles.map((p: any) => p.id);

        const { data: progressData } = await supabase
          .from('user_progress')
          .select('user_id, total_xp, games_played, current_level')
          .in('user_id', profileIds);

        const progressMap = new Map<string, { totalXp: number; gamesPlayed: number; currentLevel: number }>();
        (progressData || []).forEach((p: any) => {
          progressMap.set(p.user_id, {
            totalXp: p.total_xp || 0,
            gamesPlayed: p.games_played || 0,
            currentLevel: p.current_level || 1,
          });
        });

        // Build ALL rankings first
        const allRankings = validProfiles
          .map((profile: any) => {
            const progress = progressMap.get(profile.id);
            return {
              userId: profile.id,
              username: profile.username || 'anonymous',
              displayName: profile.display_name || profile.username || 'Player',
              avatarUrl: profile.avatar_url || null,
              totalXp: progress?.totalXp || 0,
              gamesPlayed: progress?.gamesPlayed || 0,
              currentLevel: progress?.currentLevel || 1,
              rank: 0,
            };
          })
          .sort((a, b) => b.totalXp - a.totalXp)
          .map((entry, index) => ({ ...entry, rank: index + 1 }));

        // Find user's rank from full list
        if (user) {
          const userEntry = allRankings.find(r => r.userId === user.id);
          setUserRank(userEntry?.rank || null);
        }

        // Paginate
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        formattedRankings = allRankings.slice(startIndex, startIndex + ITEMS_PER_PAGE);

      } else {
        // SPECIFIC GAME or TIME-FILTERED: Aggregate from game_sessions with date filtering
        let query = supabase
          .from('game_sessions')
          .select('user_id, xp_earned, score, completed_at');

        // Apply game filter
        if (gameFilter !== 'all') {
          query = query.eq('game_id', gameFilter);
        }

        // Apply time period filter
        if (startDate) {
          query = query.gte('completed_at', startDate.toISOString());
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error loading game leaderboard:', error);
          setRankings([]);
          return;
        }

        // Aggregate by user
        const userStats = new Map<string, { totalXp: number; gamesPlayed: number }>();
        (data || []).forEach((session: any) => {
          const existing = userStats.get(session.user_id) || { totalXp: 0, gamesPlayed: 0 };
          userStats.set(session.user_id, {
            totalXp: existing.totalXp + (session.xp_earned || 0),
            gamesPlayed: existing.gamesPlayed + 1,
          });
        });

        const userIds = Array.from(userStats.keys());

        if (userIds.length === 0) {
          setRankings([]);
          setTotalUsers(0);
          setUserRank(null);
          setLoading(false);
          return;
        }

        // Fetch profiles for these users (only public ones)
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, username, display_name, avatar_url, is_public')
          .in('id', userIds)
          .eq('is_public', true);

        if (profileError) {
          console.error('Error loading profiles:', profileError);
          setRankings([]);
          return;
        }

        const publicUserIds = new Set((profiles || []).map((p: any) => p.id));

        // Fetch levels from user_progress
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('user_id, current_level')
          .in('user_id', userIds);

        const levelMap = new Map<string, number>();
        (progressData || []).forEach((p: any) => levelMap.set(p.user_id, p.current_level));

        // Build ALL rankings (only for public users)
        const allRankings = Array.from(userStats.entries())
          .filter(([userId]) => publicUserIds.has(userId))
          .sort((a, b) => b[1].totalXp - a[1].totalXp)
          .map(([userId, stats], index) => {
            const profile = profiles?.find((p: any) => p.id === userId);
            return {
              userId,
              username: profile?.username || 'anonymous',
              displayName: profile?.display_name || profile?.username || 'Player',
              avatarUrl: profile?.avatar_url || null,
              totalXp: stats.totalXp,
              gamesPlayed: stats.gamesPlayed,
              currentLevel: levelMap.get(userId) || 1,
              rank: index + 1,
            };
          });

        setTotalUsers(allRankings.length);

        // Find user's rank from full list
        if (user) {
          const userEntry = allRankings.find(r => r.userId === user.id);
          setUserRank(userEntry?.rank || null);
        }

        // Paginate
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        formattedRankings = allRankings.slice(startIndex, startIndex + ITEMS_PER_PAGE);
      }

      setRankings(formattedRankings);
    } catch (err) {
      console.error('Error in loadLeaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadgeClass = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-black shadow-lg shadow-yellow-500/30';
      case 2:
        return 'bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 text-gray-800 shadow-lg shadow-gray-400/30';
      case 3:
        return 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white shadow-lg shadow-amber-600/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          {user && (
            <Link to="/profile">
              <Button variant="outline" size="sm">
                My Profile
              </Button>
            </Link>
          )}
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 p-8 mb-8 shadow-2xl">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 left-4 w-16 h-16 border-4 border-white rounded-full animate-pulse"></div>
            <div className="absolute top-8 right-8 w-8 h-8 bg-white rounded-full animate-bounce"></div>
            <div className="absolute bottom-6 left-12 w-10 h-10 border-4 border-white transform rotate-45 animate-spin" style={{ animationDuration: '8s' }}></div>
            <div className="absolute bottom-4 right-4 w-12 h-12 bg-white transform rotate-12 animate-pulse"></div>
          </div>
          
          <div className="relative z-10 text-center text-white">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="h-12 w-12 drop-shadow-lg" />
              <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg">Leaderboard</h1>
              <Trophy className="h-12 w-12 drop-shadow-lg" />
            </div>
            <p className="text-white/90 text-lg">See how you rank against other Mathify learners!</p>
            
            {userRank && (
              <div className="mt-6 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                <Star className="h-5 w-5" />
                <span className="font-bold">Your Rank: #{userRank}</span>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Time Period</label>
                <Tabs value={periodFilter} onValueChange={(v) => setPeriodFilter(v as any)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="weekly" className="gap-1">
                      <Flame className="h-4 w-4" />
                      Weekly
                    </TabsTrigger>
                    <TabsTrigger value="monthly" className="gap-1">
                      <TrendingUp className="h-4 w-4" />
                      Monthly
                    </TabsTrigger>
                    <TabsTrigger value="all-time" className="gap-1">
                      <Crown className="h-4 w-4" />
                      All Time
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="w-full sm:w-48">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Game</label>
                <Select value={gameFilter} onValueChange={setGameFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select game" />
                  </SelectTrigger>
                  <SelectContent>
                    {gameOptions.map((game) => (
                      <SelectItem key={game.value} value={game.value}>
                        {game.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard Table */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-amber-100 to-yellow-100">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-amber-600" />
                {periodFilter === 'weekly' ? 'This Week\'s Top Players' : 
                 periodFilter === 'monthly' ? 'This Month\'s Top Players' : 
                 'All-Time Top Players'}
              </div>
              {totalUsers > 0 && (
                <div className="flex items-center gap-1 text-sm font-normal text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {totalUsers.toLocaleString()} players
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading rankings...</p>
              </div>
            ) : rankings.length === 0 ? (
              <div className="p-8 text-center">
                <Trophy className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  {periodFilter !== 'all-time' || gameFilter !== 'all' 
                    ? 'No players found for these filters!' 
                    : 'No players on the leaderboard yet!'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {periodFilter !== 'all-time' 
                    ? 'Try selecting a different time period or game.' 
                    : 'Be the first to play and claim the top spot!'}
                </p>
                <Link to="/" className="mt-4 inline-block">
                  <Button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                    Start Playing
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="divide-y">
                  {rankings.map((player, index) => (
                    <motion.div
                      key={player.userId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                    >
                      <Link
                        to={player.username !== 'anonymous' ? `/u/${player.username}` : '#'}
                        className={`flex items-center gap-4 p-4 transition-colors hover:bg-muted/50 ${
                          player.userId === user?.id ? 'bg-amber-50/50 border-l-4 border-amber-500' : ''
                        } ${player.rank <= 3 ? 'bg-gradient-to-r from-amber-50/50 to-transparent' : ''} ${
                          player.username !== 'anonymous' ? 'cursor-pointer' : 'cursor-default'
                        }`}
                        onClick={(e) => {
                          if (player.username === 'anonymous') {
                            e.preventDefault();
                          }
                        }}
                      >
                        {/* Rank */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getRankBadgeClass(player.rank)}`}>
                          {getRankIcon(player.rank)}
                        </div>

                        {/* Avatar */}
                        <Avatar className="h-10 w-10 ring-2 ring-muted">
                          <AvatarImage src={player.avatarUrl || undefined} alt={player.displayName} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-sm font-bold">
                            {player.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>

                        {/* Player Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground truncate">
                              {player.displayName}
                            </span>
                            {player.userId === user?.id && (
                              <Badge variant="secondary" className="text-xs">You</Badge>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">@{player.username}</span>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-6 text-sm">
                          <div className="text-center hidden sm:block">
                            <div className="font-bold text-foreground">{player.gamesPlayed}</div>
                            <div className="text-muted-foreground text-xs">Games</div>
                          </div>
                          <div className="text-center hidden sm:block">
                            <div className="font-bold text-purple-600">Lvl {player.currentLevel}</div>
                            <div className="text-muted-foreground text-xs">Level</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-amber-600 flex items-center gap-1">
                              <Zap className="h-4 w-4" />
                              {player.totalXp.toLocaleString()}
                            </div>
                            <div className="text-muted-foreground text-xs">XP</div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between p-4 border-t bg-muted/30">
                    <p className="text-sm text-muted-foreground">
                      Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, totalUsers)} of {totalUsers}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="gap-1"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum: number;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(pageNum)}
                              className="w-8 h-8 p-0"
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="gap-1"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Ad Banner */}
        <div className="mt-6">
          <AdBanner />
        </div>

        {/* Call to Action */}
        {!user && (
          <Card className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold mb-2">Want to appear on the leaderboard?</h3>
              <p className="text-white/80 mb-4">Sign up and start playing to track your progress and compete with others!</p>
              <Link to="/auth">
                <Button className="bg-white text-purple-600 hover:bg-white/90">
                  Sign Up Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
