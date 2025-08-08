import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  // Override auth settings for local development
  const authConfig = process.env.NEXT_PUBLIC_SITE_URL 
    ? {
        auth: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
        }
      }
    : {}

  return createBrowserClient(supabaseUrl, supabaseKey, authConfig)
}
