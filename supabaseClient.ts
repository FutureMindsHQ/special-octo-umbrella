import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Used from Client Components ('use client'). Safe to expose — this is the
// public anon key, protected by Row Level Security policies in supabase/schema.sql.
export const supabase = createClient(url, anonKey);
