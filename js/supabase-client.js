const SUPABASE_URL = 'https://dqocwxkwvmhuvdgztlob.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxb2N3eGt3dm1odXZkZ3p0bG9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1MDgwNDcsImV4cCI6MjEwMjA4NDA0N30.WIZTO7ubpiZ7r5DLqlPuwzlWx0oe3_n2HmmuFqp6Vh0';

// Initialize the Supabase Client
window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
