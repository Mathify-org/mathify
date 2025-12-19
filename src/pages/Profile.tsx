import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, User, Save, LogOut, Settings, Trophy, BarChart3, Clock, AtSign, Check, X, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGameProgress } from '@/hooks/useGameProgress';
import ProgressDashboard from '@/components/profile/ProgressDashboard';
import AchievementsDisplay from '@/components/profile/AchievementsDisplay';
import RecentActivity from '@/components/profile/RecentActivity';
import AvatarUpload from '@/components/profile/AvatarUpload';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  date_of_birth: string | null;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const { progress, achievements, loading: progressLoading } = useGameProgress();
  const [profile, setProfile] = useState<Profile>({
    id: '',
    first_name: '',
    last_name: '',
    email: '',
    date_of_birth: '',
    display_name: '',
    username: '',
    avatar_url: null,
  });
  const [originalUsername, setOriginalUsername] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadProfile();
  }, [user, navigate]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setOriginalUsername(data.username);
      } else {
        setProfile({
          id: user.id,
          first_name: '',
          last_name: '',
          email: user.email || '',
          date_of_birth: '',
          display_name: '',
          username: '',
          avatar_url: null,
        });
        setOriginalUsername(null);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Validate username format
  const validateUsername = (username: string): string | null => {
    if (!username) return null;
    if (username.length < 3) return 'Username must be at least 3 characters';
    if (username.length > 20) return 'Username must be 20 characters or less';
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Only letters, numbers, and underscores allowed';
    return null;
  };

  // Check if username is available
  const checkUsernameAvailability = async (username: string) => {
    if (!username || username === originalUsername) {
      setUsernameAvailable(null);
      setUsernameError(null);
      return;
    }

    const formatError = validateUsername(username);
    if (formatError) {
      setUsernameError(formatError);
      setUsernameAvailable(false);
      return;
    }

    setCheckingUsername(true);
    setUsernameError(null);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username.toLowerCase())
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setUsernameAvailable(false);
        setUsernameError('This username is already taken');
      } else {
        setUsernameAvailable(true);
        setUsernameError(null);
      }
    } catch (error) {
      console.error('Error checking username:', error);
    } finally {
      setCheckingUsername(false);
    }
  };

  // Debounced username check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (profile.username && profile.username !== originalUsername) {
        checkUsernameAvailability(profile.username);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [profile.username, originalUsername]);

  const handleSave = async () => {
    if (!user) return;

    // Validate username before saving
    if (profile.username && profile.username !== originalUsername) {
      const formatError = validateUsername(profile.username);
      if (formatError) {
        toast({
          title: "Invalid Username",
          description: formatError,
          variant: "destructive",
        });
        return;
      }
      if (usernameAvailable === false) {
        toast({
          title: "Username Unavailable",
          description: "Please choose a different username",
          variant: "destructive",
        });
        return;
      }
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          date_of_birth: profile.date_of_birth,
          display_name: profile.display_name,
          username: profile.username?.toLowerCase() || originalUsername,
        });

      if (error) {
        if (error.code === '23505') {
          throw new Error('This username is already taken');
        }
        throw error;
      }

      setOriginalUsername(profile.username?.toLowerCase() || null);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const displayName = profile.display_name || profile.first_name || user?.email?.split('@')[0] || 'Learner';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8">
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
          <Button
            onClick={handleSignOut}
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Profile Header Card */}
        <Card className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 p-6 text-white">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 ring-4 ring-white/30 shadow-lg">
                <AvatarImage src={profile.avatar_url || undefined} alt={displayName} />
                <AvatarFallback className="bg-white/20 backdrop-blur-sm text-white text-2xl font-bold">
                  {displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || <User className="h-10 w-10" />}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {displayName}!</h1>
                {profile.username && (
                  <p className="text-white/90 font-medium">@{profile.username}</p>
                )}
                <p className="text-white/70 text-sm">{user?.email}</p>
                {progress && (
                  <div className="flex items-center gap-4 mt-2">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                      Level {progress.currentLevel}
                    </span>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                      {progress.totalXp.toLocaleString()} XP
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="progress" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="progress" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Progress</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="gap-2">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Achievements</span>
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="gap-2">
              <Trophy className="h-4 w-4 text-amber-500" />
              <span className="hidden sm:inline">Leaderboard</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Activity</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Progress Tab */}
          <TabsContent value="progress">
            {progressLoading ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="animate-pulse">Loading your progress...</div>
                </CardContent>
              </Card>
            ) : progress ? (
              <ProgressDashboard progress={progress} />
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <BarChart3 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-4">Start playing games to track your progress!</p>
                  <Link to="/">
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      Browse Games
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            {user && (
              <AchievementsDisplay 
                userId={user.id} 
                userAchievements={achievements} 
              />
            )}
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard">
            <Card>
              <CardContent className="p-8 text-center">
                <Trophy className="w-16 h-16 mx-auto text-amber-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">View the Leaderboard</h3>
                <p className="text-muted-foreground mb-4">See how you rank against other Mathify players!</p>
                <Link to="/leaderboard">
                  <Button className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white">
                    Go to Leaderboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            {user && <RecentActivity userId={user.id} />}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-purple-500" />
                  Profile Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Upload Section */}
                <div className="flex justify-center pb-4 border-b">
                  <AvatarUpload
                    userId={user?.id || ''}
                    currentAvatarUrl={profile.avatar_url}
                    displayName={displayName}
                    onAvatarChange={(url) => setProfile({ ...profile, avatar_url: url })}
                  />
                </div>
                {/* Username Field */}
                <div>
                  <Label htmlFor="username" className="flex items-center gap-2">
                    <AtSign className="w-4 h-4" />
                    Username
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="username"
                      value={profile.username || ''}
                      onChange={(e) => {
                        const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                        setProfile({ ...profile, username: value });
                      }}
                      placeholder="Choose a unique username"
                      maxLength={20}
                      className={`pr-10 ${
                        usernameError ? 'border-red-500 focus:ring-red-500' : 
                        usernameAvailable === true ? 'border-green-500 focus:ring-green-500' : ''
                      }`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {checkingUsername && (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                      {!checkingUsername && usernameAvailable === true && (
                        <Check className="h-4 w-4 text-green-500" />
                      )}
                      {!checkingUsername && usernameAvailable === false && (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  {usernameError && (
                    <p className="text-sm text-red-500 mt-1">{usernameError}</p>
                  )}
                  {usernameAvailable === true && (
                    <p className="text-sm text-green-500 mt-1">Username is available!</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    3-20 characters, letters, numbers, and underscores only
                  </p>
                </div>

                <div>
                  <Label htmlFor="display_name">Display Name</Label>
                  <Input
                    id="display_name"
                    value={profile.display_name || ''}
                    onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                    placeholder="Choose a display name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={profile.first_name || ''}
                      onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={profile.last_name || ''}
                      onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email || ''}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="Enter your email"
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Email cannot be changed
                  </p>
                </div>

                <div>
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={profile.date_of_birth || ''}
                    onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
                  />
                </div>

                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 hover:opacity-90"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
