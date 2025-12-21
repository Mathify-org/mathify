import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, Trophy, Zap, Flame, Target, Star, Crown, Medal,
  BarChart3, Clock, Award, Sparkles, TrendingUp, BookOpen, Lock,
  User, Calendar, GamepadIcon
} from 'lucide-react';
import { calculateLevel, getLevelProgress } from '@/services/progressService';

interface UserProfileData {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  is_public: boolean;
}

interface UserProgressData {
  total_xp: number;
  current_level: number;
  games_played: number;
  total_correct_answers: number;
  total_questions_answered: number;
  current_streak: number;
  longest_streak: number;
  unique_games_played: string[];
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked_at: string;
}

interface GameSession {
  id: string;
  game_id: string;
  score: number;
  xp_earned: number;
  completed_at: string;
}

const gameNames: Record<string, string> = {
  'mental-maths': 'Mental Maths',
  'times-tables': 'Times Tables',
  'math-facts': 'Math Facts',
  'fraction-simplify': 'Fractions',
  'target-takedown': 'Target Takedown',
  'algebra-adventure': 'Algebra',
  'geometry-master': 'Geometry',
  'arithmetic-hero': 'Arithmetic Hero',
  'math-warp': 'Math Warp',
};

const iconMap: Record<string, React.ReactNode> = {
  'trophy': <Trophy className="w-5 h-5" />,
  'star': <Star className="w-5 h-5" />,
  'zap': <Zap className="w-5 h-5" />,
  'flame': <Flame className="w-5 h-5" />,
  'target': <Target className="w-5 h-5" />,
  'award': <Award className="w-5 h-5" />,
  'medal': <Medal className="w-5 h-5" />,
  'crown': <Crown className="w-5 h-5" />,
  'sparkles': <Sparkles className="w-5 h-5" />,
};

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [progress, setProgress] = useState<UserProgressData | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [recentGames, setRecentGames] = useState<GameSession[]>([]);
  const [leaderboardRank, setLeaderboardRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    if (username) {
      loadUserProfile();
    }
  }, [username]);

  const loadUserProfile = async () => {
    setLoading(true);
    try {
      // Fetch profile by username
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url, created_at, is_public')
        .eq('username', username?.toLowerCase())
        .single();

      if (profileError || !profileData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      // Check if profile is private and not the current user
      if (!profileData.is_public && profileData.id !== user?.id) {
        setIsPrivate(true);
        setProfile(profileData);
        setLoading(false);
        return;
      }

      setProfile(profileData);

      // Fetch user progress
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', profileData.id)
        .single();

      if (progressData) {
        setProgress(progressData);
      }

      // Fetch achievements
      const { data: achievementsData } = await supabase
        .from('user_achievements')
        .select(`
          achievement_id,
          unlocked_at,
          achievements (id, name, description, icon)
        `)
        .eq('user_id', profileData.id)
        .order('unlocked_at', { ascending: false })
        .limit(6);

      if (achievementsData) {
        setAchievements(achievementsData.map((a: any) => ({
          id: a.achievements.id,
          name: a.achievements.name,
          description: a.achievements.description,
          icon: a.achievements.icon,
          unlocked_at: a.unlocked_at,
        })));
      }

      // Fetch recent games
      const { data: gamesData } = await supabase
        .from('game_sessions')
        .select('id, game_id, score, xp_earned, completed_at')
        .eq('user_id', profileData.id)
        .order('completed_at', { ascending: false })
        .limit(5);

      if (gamesData) {
        setRecentGames(gamesData);
      }

      // Calculate leaderboard rank
      const { data: rankData } = await supabase
        .from('user_progress')
        .select('user_id, total_xp')
        .order('total_xp', { ascending: false });

      if (rankData) {
        const rank = rankData.findIndex(r => r.user_id === profileData.id) + 1;
        setLeaderboardRank(rank > 0 ? rank : null);
      }

    } catch (err) {
      console.error('Error loading profile:', err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin mx-auto" />
            <Sparkles className="w-8 h-8 text-purple-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="mt-6 text-purple-600 font-medium">Loading profile...</p>
        </motion.div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md px-4"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center mx-auto mb-6">
            <User className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">User Not Found</h1>
          <p className="text-gray-600 mb-6">
            The user @{username} doesn't exist or hasn't set up their profile yet.
          </p>
          <Button onClick={() => navigate('/leaderboard')} className="bg-gradient-to-r from-purple-500 to-pink-500">
            View Leaderboard
          </Button>
        </motion.div>
      </div>
    );
  }

  if (isPrivate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md px-4"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-12 h-12 text-purple-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Private Profile</h1>
          <p className="text-gray-600 mb-6">
            @{profile?.username} has chosen to keep their profile private.
          </p>
          <Button onClick={() => navigate('/leaderboard')} className="bg-gradient-to-r from-purple-500 to-pink-500">
            View Leaderboard
          </Button>
        </motion.div>
      </div>
    );
  }

  const displayName = profile?.display_name || profile?.username || 'Player';
  const levelProgress = progress ? getLevelProgress(progress.total_xp) : { current: 0, needed: 100, percentage: 0 };
  const accuracy = progress && progress.total_questions_answered > 0
    ? Math.round((progress.total_correct_answers / progress.total_questions_answered) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            size="sm"
            className="gap-2 bg-white/80 backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </motion.div>

        {/* Profile Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="overflow-hidden border-0 shadow-2xl mb-8">
            {/* Background Banner */}
            <div className="h-32 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 relative overflow-hidden">
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-4 left-8 w-20 h-20 border-4 border-white/40 rounded-full" />
                <div className="absolute top-2 right-12 w-12 h-12 bg-white/20 rounded-full animate-pulse" />
                <div className="absolute bottom-4 left-1/3 w-16 h-16 border-4 border-white/30 transform rotate-45" />
                <div className="absolute bottom-2 right-1/4 w-8 h-8 bg-white/30 rounded-full" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="relative px-6 pb-6">
              {/* Avatar */}
              <div className="absolute -top-16 left-6">
                <Avatar className="w-32 h-32 ring-4 ring-white shadow-2xl">
                  <AvatarImage src={profile?.avatar_url || undefined} alt={displayName} />
                  <AvatarFallback className="bg-gradient-to-br from-violet-400 to-fuchsia-500 text-white text-4xl font-bold">
                    {displayName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* User Info */}
              <div className="pt-20 md:pt-4 md:pl-36">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">{displayName}</h1>
                    <p className="text-gray-500 font-medium">@{profile?.username}</p>
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Joined {profile?.created_at ? formatDate(profile.created_at) : 'recently'}
                      </span>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex gap-3">
                    {leaderboardRank && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
                        {leaderboardRank === 1 ? <Crown className="w-5 h-5 text-yellow-500" /> :
                         leaderboardRank === 2 ? <Medal className="w-5 h-5 text-gray-400" /> :
                         leaderboardRank === 3 ? <Medal className="w-5 h-5 text-amber-600" /> :
                         <Trophy className="w-5 h-5 text-amber-500" />}
                        <span className="font-bold text-amber-700">#{leaderboardRank}</span>
                      </div>
                    )}
                    {progress && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                        <Zap className="w-5 h-5 text-purple-500" />
                        <span className="font-bold text-purple-700">Level {progress.current_level}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        {progress && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {[
              { label: 'Total XP', value: progress.total_xp.toLocaleString(), icon: <Zap className="w-5 h-5" />, color: 'from-yellow-400 to-orange-500', bg: 'bg-yellow-50' },
              { label: 'Games Played', value: progress.games_played, icon: <GamepadIcon className="w-5 h-5" />, color: 'from-blue-400 to-indigo-500', bg: 'bg-blue-50' },
              { label: 'Current Streak', value: `${progress.current_streak} days`, icon: <Flame className="w-5 h-5" />, color: 'from-orange-400 to-red-500', bg: 'bg-orange-50' },
              { label: 'Accuracy', value: `${accuracy}%`, icon: <Target className="w-5 h-5" />, color: 'from-green-400 to-emerald-500', bg: 'bg-green-50' },
            ].map((stat, i) => (
              <Card key={stat.label} className={`${stat.bg} border-0 shadow-lg hover:shadow-xl transition-shadow`}>
                <CardContent className="p-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-white mb-3`}>
                    {stat.icon}
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}

        {/* Level Progress */}
        {progress && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="mb-8 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white border-0 shadow-xl overflow-hidden">
              <CardContent className="p-6 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-white/80 text-sm font-medium">Current Level</p>
                      <h2 className="text-5xl font-bold">{progress.current_level}</h2>
                    </div>
                    <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                      <Star className="w-10 h-10 text-yellow-300" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-white/90">
                      <span>Progress to Level {progress.current_level + 1}</span>
                      <span>{levelProgress.current} / {levelProgress.needed} XP</span>
                    </div>
                    <div className="w-full bg-white/30 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${levelProgress.percentage}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full bg-white rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Tabs for Achievements and Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs defaultValue="achievements" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm">
              <TabsTrigger value="achievements" className="gap-2">
                <Trophy className="h-4 w-4" />
                Achievements
              </TabsTrigger>
              <TabsTrigger value="activity" className="gap-2">
                <Clock className="h-4 w-4" />
                Recent Activity
              </TabsTrigger>
            </TabsList>

            {/* Achievements Tab */}
            <TabsContent value="achievements">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    Achievements ({achievements.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {achievements.length === 0 ? (
                    <div className="text-center py-8">
                      <Trophy className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                      <p className="text-gray-500">No achievements unlocked yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {achievements.map((achievement, i) => (
                        <motion.div
                          key={achievement.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200"
                        >
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-white flex-shrink-0">
                            {iconMap[achievement.icon] || <Trophy className="w-5 h-5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-800 truncate">{achievement.name}</h4>
                            <p className="text-sm text-gray-600 truncate">{achievement.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-500" />
                    Recent Games
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentGames.length === 0 ? (
                    <div className="text-center py-8">
                      <GamepadIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                      <p className="text-gray-500">No games played yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentGames.map((game, i) => (
                        <motion.div
                          key={game.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white">
                              <Target className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800">
                                {gameNames[game.game_id] || game.game_id}
                              </h4>
                              <p className="text-sm text-gray-500">
                                Score: {game.score}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-yellow-600 font-semibold">
                              <Zap className="w-4 h-4" />
                              +{game.xp_earned} XP
                            </div>
                            <p className="text-xs text-gray-400">{formatTimeAgo(game.completed_at)}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Games Explored */}
        {progress && progress.unique_games_played && progress.unique_games_played.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-500" />
                  Games Explored ({progress.unique_games_played.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {progress.unique_games_played.map((gameId) => (
                    <Badge
                      key={gameId}
                      variant="secondary"
                      className="px-3 py-1 bg-purple-100 text-purple-700 hover:bg-purple-200"
                    >
                      {gameNames[gameId] || gameId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;