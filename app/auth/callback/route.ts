import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')

  console.log('=== AUTH CALLBACK START ===');
  console.log('Auth callback - URL:', requestUrl.href);
  console.log('Auth callback - Code:', code ? `present (${code.substring(0, 10)}...)` : 'missing');
  console.log('Auth callback - Error:', error);
  console.log('Environment check - URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'present' : 'missing');
  console.log('Environment check - Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'present' : 'missing');

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error detected:', error)
    return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=oauth_error&details=${encodeURIComponent(error)}`)
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
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, {
                ...options,
                httpOnly: false,
                secure: true,
                sameSite: 'lax',
                path: '/'
              })
            })
          } catch (cookieError) {
            console.warn('Cookie setting error:', cookieError);
          }
        },
      },
    }
  )

  try {
    // Exchange code for session
    console.log('Attempting to exchange code for session...');
    const exchangeResult = await supabase.auth.exchangeCodeForSession(code)
    console.log('Exchange result:', {
      hasData: !!exchangeResult.data,
      hasSession: !!exchangeResult.data?.session,
      hasUser: !!exchangeResult.data?.session?.user,
      hasError: !!exchangeResult.error,
      errorMessage: exchangeResult.error?.message
    });
    
    if (exchangeResult.error) {
      console.error('Code exchange failed:', exchangeResult.error.message, exchangeResult.error);
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=exchange_failed&details=${encodeURIComponent(exchangeResult.error.message)}`)
    }
    
    if (!exchangeResult.data?.session) {
      console.error('No session returned after code exchange');
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=no_session`)
    }

    const { session, user } = exchangeResult.data;
    console.log('Session created successfully:', {
      userId: user.id,
      email: user.email,
      provider: user.app_metadata?.provider,
      hasMetadata: !!user.user_metadata,
      sessionId: session?.access_token ? 'present' : 'missing'
    });

    // Skip profile creation for now to test if that's the issue
    console.log('Skipping profile creation - redirecting directly to dashboard...');
    
    // Create response with proper cookie handling
    console.log('=== AUTH CALLBACK SUCCESS - REDIRECTING ===');
    const response = NextResponse.redirect(`${requestUrl.origin}/dashboard`)
    
    // Clear any existing auth cookies first
    const allCookies = cookieStore.getAll()
    console.log('Found cookies:', allCookies.map(c => c.name));
    
    // Clear old auth cookies first
    allCookies.forEach(cookie => {
      if (cookie.name.startsWith('sb-')) {
        response.cookies.delete(cookie.name)
        console.log(`🧹 Cleared old cookie: ${cookie.name}`);
      }
    })
    
    // Set fresh session cookies with explicit configuration
    allCookies.forEach(cookie => {
      if (cookie.name.startsWith('sb-')) {
        response.cookies.set(cookie.name, cookie.value, {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 7 days
          domain: process.env.NODE_ENV === 'production' ? '.funckode.com' : undefined
        })
        console.log(`🍪 Set fresh cookie: ${cookie.name}`);
      }
    })
    
    return response

  } catch (err) {
    console.error('Auth callback exception:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Exception stack:', err instanceof Error ? err.stack : 'No stack');
    return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=server_error&details=${encodeURIComponent(errorMessage)}`)
  }
}
