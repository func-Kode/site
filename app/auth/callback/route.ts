import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')

  console.log('Auth callback - URL:', requestUrl.href);
  console.log('Auth callback - Code:', code ? 'present' : 'missing');
  console.log('Auth callback - Error:', error);

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
    console.log('Exchanging code for session...');
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (exchangeError) {
      console.error('Code exchange failed:', exchangeError.message, exchangeError);
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=exchange_failed&details=${encodeURIComponent(exchangeError.message)}`)
    }
    
    if (!data?.session) {
      console.error('No session returned after code exchange');
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=no_session`)
    }

    console.log('Session created successfully for user:', data.session.user.id);
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

    console.log('Creating/checking user profile for:', user.id);

    // Check if user profile exists
    const { data: existingProfile, error: selectError } = await supabase
      .from('users')
      .select('id, is_onboarded')
      .eq('id', user.id)
      .maybeSingle()

    if (selectError) {
      console.error('Error checking existing profile:', selectError.message);
      // Continue anyway, try to create profile
    }

    if (!existingProfile) {
      console.log('Creating new user profile...');
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
        console.error('Profile creation failed:', insertError.message, insertError);
        // Continue anyway, user can still access the app
      } else {
        console.log('User profile created successfully');
      }
    } else {
      console.log('User profile already exists');
    }

    // Always redirect to dashboard after successful login
    console.log('Redirecting to dashboard...');
    return NextResponse.redirect(`${requestUrl.origin}/dashboard`)

  } catch (err) {
    console.error('Auth callback exception:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=server_error&details=${encodeURIComponent(errorMessage)}`)
  }
}
