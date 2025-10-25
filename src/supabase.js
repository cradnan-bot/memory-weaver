import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug logging for production deployment
console.log('Supabase Config Debug:')
console.log('URL exists:', !!supabaseUrl)
console.log('Key exists:', !!supabaseAnonKey)
console.log('URL value:', supabaseUrl)
console.log('Key starts with:', supabaseAnonKey?.substring(0, 10) + '...')

// Provide better error handling for missing environment variables
if (!supabaseUrl || supabaseUrl === 'your-supabase-url') {
    console.error('Missing VITE_SUPABASE_URL environment variable')
    throw new Error('Missing VITE_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey || supabaseAnonKey === 'your-supabase-anon-key') {
    console.error('Missing VITE_SUPABASE_ANON_KEY environment variable')
    throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)