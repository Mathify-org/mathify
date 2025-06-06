
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = 'https://dmktoqbagvtuwdlzvmec.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRta3RvcWJhZ3Z0dXdkbHp2bWVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxNjc0NDgsImV4cCI6MjA2NDc0MzQ0OH0.vaYlaxELiCV8qyXdvC-B1LrjZ6xdoPgOMXFO6OVeIsM';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
