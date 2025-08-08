import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const next = requestUrl.searchParams.get('next') || '/dashboard'

  if (error) {
    return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=${encodeURIComponent(error)}`)
  }

  if (!code) {
    // In case the middleware forwarded params differently (e.g., code in search), just go login
    return NextResponse.redirect(`${requestUrl.origin}/auth/login`)
  }

  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  try {
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    if (exchangeError || !data?.session) {
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=exchange_failed`)
    }

    // Profile bootstrap and onboarding check
    const { data: userRes } = await supabase.auth.getUser()
    const user = userRes?.user

    if (user) {
      const githubUsername = user.user_metadata?.user_name 
        || user.user_metadata?.preferred_username 
        || user.user_metadata?.github_username 
        || null
      const displayName = user.user_metadata?.full_name 
        || user.user_metadata?.name 
        || (user.email ? user.email.split('@')[0] : null)
      const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || null

      const { data: existingProfile } = await supabase
        .from('users')
        .select('id, is_onboarded')
        .eq('id', user.id)
        .maybeSingle()

      let isOnboarded = existingProfile?.is_onboarded ?? false

      if (!existingProfile) {
        await supabase.from('users').insert({
          id: user.id,
          github_username: githubUsername,
          display_name: displayName,
          avatar_url: avatarUrl,
          is_onboarded: false,
        })
        isOnboarded = false
      }

      const defaultPath = isOnboarded ? '/dashboard' : '/onboard'
      const redirectPath = next || defaultPath
      return NextResponse.redirect(`${requestUrl.origin}${redirectPath}`)
    }

    return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=no_user`)
  } catch (err) {
    console.error('Auth callback exception:', err)
    return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=exception`)
  }
}
