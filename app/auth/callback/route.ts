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

  // Create a response object to capture cookie changes
  const response = NextResponse.redirect(`${requestUrl.origin}/dashboard`)

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
          cookiesToSet.forEach(({ name, value, options }) => {
            // Set cookies on both the cookie store and the response
            cookieStore.set(name, value, options)
            response.cookies.set(name, value, options)
            console.log(`🍪 Set cookie: ${name}`);
          })
        },
      },
    }
  )

  try {
    // Exchange code for session
    console.log('Attempting to exchange code for session...');
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (exchangeError) {
      console.error('Code exchange failed:', exchangeError.message);
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=exchange_failed&details=${encodeURIComponent(exchangeError.message)}`)
    }
    
    if (!data?.session) {
      console.error('No session returned after code exchange');
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=no_session`)
    }

    const { user } = data;
    console.log('✅ Session created successfully:', {
      userId: user.id,
      email: user.email,
      provider: user.app_metadata?.provider
    });

    console.log('=== AUTH CALLBACK SUCCESS - REDIRECTING ===');
    return response

  } catch (err) {
    console.error('Auth callback exception:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=server_error&details=${encodeURIComponent(errorMessage)}`)
  }
}
