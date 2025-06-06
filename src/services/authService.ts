
import { supabase } from '@/integrations/supabase/client';

export const authService = {
  async signInWithMagicLink(email: string) {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}`,
      },
    });
    return { error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async updateProfile(updates: { first_name?: string; last_name?: string; date_of_birth?: string }) {
    const { error } = await supabase.auth.updateUser({
      data: updates
    });
    return { error };
  }
};
