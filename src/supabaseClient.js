
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pjfwfplkjqlybdqjjzhc.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqZndmcGxranFseWJkcWpqemhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ0NDE0MTUsImV4cCI6MjA0MDAxNzQxNX0.1OMKdGyPbdMt7LdXDI5xzFImrBHwOqWHer5fhmV5xkM'; // Replace with your Supabase Key

export const supabase = createClient(supabaseUrl, supabaseKey);
