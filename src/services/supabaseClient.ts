import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ydqgtgfanaqqtbajwvlt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkcWd0Z2ZhbmFxcXRiYWp3dmx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NzI4OTMsImV4cCI6MjA2ODQ0ODg5M30.Yvii-fOMAg7rEubyft292jJmtChqDrvQ5-I8yaOKLqI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
