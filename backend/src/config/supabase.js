import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://ichogtsktsvmeyiyyoem.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljaG9ndHNra3RzdXZlaXl5b2VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwMTM1NDMsImV4cCI6MjA2MTU4OTU0M30.W-jvFNLqCIXfH0NH2XHwf6NHfIZH-QP2X8iT1VH7xqQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
