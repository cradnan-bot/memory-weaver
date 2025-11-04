import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug logging for production deployment
console.log('Supabase Config Debug:')
console.log('URL exists:', !!supabaseUrl)
console.log('Key exists:', !!supabaseAnonKey)

// Provide better error handling for missing environment variables
if (!supabaseUrl || supabaseUrl === 'your-supabase-project-url') {
    console.error('⚠️  MISSING SUPABASE CONFIGURATION')
    console.error('Please create .env file with your Supabase credentials:')
    console.error('1. Copy .env.template to .env')
    console.error('2. Add your Supabase URL and anon key')
    console.error('3. Restart the development server')
}

if (!supabaseAnonKey || supabaseAnonKey === 'your-supabase-anon-key') {
    console.error('⚠️  MISSING SUPABASE ANON KEY')
    console.error('Please add VITE_SUPABASE_ANON_KEY to your .env file')
}

// Create client with fallback for development
export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key'
)