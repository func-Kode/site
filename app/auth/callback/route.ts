import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const origin = url.origin

  console.log('=== AUTH CALLBACK START ===');
  console.log('Auth callback - URL:', url.href);
  console.log('Auth callback - Code:', code ? `present (${code.substring(0, 10)}...)` : 'missing');

  // Handle missing code
  if (!code) {
    console.error('No authorization code received')
    return NextResponse.redirect(`${origin}/auth/login?error=no_code`)
  }

  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)
  if (error || !data.session) {
    console.error('Code exchange failed:', error?.message || 'No session returned');
    return NextResponse.redirect(`${origin}/auth/login?error=exchange_failed`)
  }

  console.log('✅ Session created successfully:', {
    userId: data.session.user.id,
    email: data.session.user.email,
    provider: data.session.user.app_metadata?.provider
  });

  console.log('=== AUTH CALLBACK SUCCESS - REDIRECTING ===');
  return NextResponse.redirect(`${origin}/dashboard`)
}
