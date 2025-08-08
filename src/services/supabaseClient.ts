import { createClient } from '@supabase/supabase-js';

// Get Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ydqgtgfanaqqtbajwvlt.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkcWd0Z2ZhbmFxcXRiYWp3dmx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NzI4OTMsImV4cCI6MjA2ODQ0ODg5M30.Yvii-fOMAg7rEubyft292jJmtChqDrvQ5-I8yaOKLqI';

// Validate configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'titanhire-app'
    }
  }
});
