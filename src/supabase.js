import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Provide better error handling for missing environment variables
if (!supabaseUrl || supabaseUrl === 'your-supabase-url') {
    console.error('Missing VITE_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey || supabaseAnonKey === 'your-supabase-anon-key') {
    console.error('Missing VITE_SUPABASE_ANON_KEY environment variable')
}

// Use fallback values for development if env vars are missing
const fallbackUrl = supabaseUrl || 'https://lpqvnthejbrmwqyjiskn.supabase.co'
const fallbackKey = supabaseAnonKey || 'placeholder-key'

export const supabase = createClient(fallbackUrl, fallbackKey)