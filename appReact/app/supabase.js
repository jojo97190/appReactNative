import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://ufmnbwsmubqkpgbkuuwy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmbW5id3NtdWJxa3BnYmt1dXd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MDM1NjMsImV4cCI6MjA3NDM3OTU2M30.pacMs_25dlPQJL2BZMZITZcR8PYiVcw4M20zwGrfbvE';
export const supabase = createClient(supabaseUrl, supabaseKey);