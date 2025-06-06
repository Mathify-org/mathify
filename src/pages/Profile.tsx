
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, User, Save, LogOut } from 'lucide-react';

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  date_of_birth: string | null;
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    id: '',
    first_name: '',
    last_name: '',
    email: '',
    date_of_birth: '',
  });

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
      } else {
        // If no profile exists, create one with basic info
        setProfile({
          id: user.id,
          first_name: '',
          last_name: '',
          email: user.email || '',
          date_of_birth: '',
        });
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

  const handleSave = async () => {
    if (!user) return;

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
        });

      if (error) throw error;

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>

          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
            <p className="text-gray-600">Manage your personal information</p>
          </div>

          <div className="space-y-6">
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
              />
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
              {saving ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
