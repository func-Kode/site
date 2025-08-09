import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error)
    return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=oauth_error`)
  }

  // Handle missing code
  if (!code) {
    console.error('No authorization code received')
    return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=no_code`)
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component context - ignore
          }
        },
      },
    }
  )

  try {
    // Exchange code for session
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (exchangeError || !data?.session) {
      console.error('Code exchange failed:', exchangeError)
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=exchange_failed`)
    }

    const user = data.session.user

    // Create or update user profile
    const githubUsername = user.user_metadata?.user_name 
      || user.user_metadata?.preferred_username 
      || null
    const displayName = user.user_metadata?.full_name 
      || user.user_metadata?.name 
      || githubUsername
      || 'Developer'
    const avatarUrl = user.user_metadata?.avatar_url || null

    // Check if user profile exists
    const { data: existingProfile } = await supabase
      .from('users')
      .select('id, is_onboarded')
      .eq('id', user.id)
      .maybeSingle()

    if (!existingProfile) {
      // Create new user profile
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          github_username: githubUsername,
          display_name: displayName,
          avatar_url: avatarUrl,
          bio: '',
          skills: '',
          role_preference: '',
          interests: '',
          is_onboarded: false,
        })

      if (insertError) {
        console.error('Profile creation failed:', insertError)
        // Continue anyway, user can still access the app
      }
    }

    // Always redirect to dashboard after successful login
    return NextResponse.redirect(`${requestUrl.origin}/dashboard`)

  } catch (err) {
    console.error('Auth callback exception:', err)
    return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=server_error`)
  }
}
