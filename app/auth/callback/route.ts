import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const next = requestUrl.searchParams.get('next') || '/dashboard'

  console.log('Auth callback - Code:', code, 'Error:', error, 'Next:', next)

  if (error) {
    console.error('OAuth error in callback:', error)
    return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=${error}`)
  }

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    try {
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      console.log('Exchange result:', { data: !!data.session, error: exchangeError })
      
      if (exchangeError) {
        console.error('Error exchanging code for session:', exchangeError)
        return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=exchange_failed`)
      }

      // Ensure user profile exists and route based on onboarding status
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

        const { data: existingProfile, error: profileErr } = await supabase
          .from('users')
          .select('id, is_onboarded')
          .eq('id', user.id)
          .maybeSingle()

        if (profileErr) {
          console.warn('Profile fetch warning:', profileErr)
        }

        let isOnboarded = existingProfile?.is_onboarded ?? false

        if (!existingProfile) {
          const { error: insertErr } = await supabase.from('users').insert({
            id: user.id,
            github_username: githubUsername,
            display_name: displayName,
            avatar_url: avatarUrl,
            is_onboarded: false,
          })
          if (insertErr) {
            console.warn('Profile insert warning:', insertErr)
          }
          isOnboarded = false
        }

        // If a next param is present, prefer it after onboarding state check
        const defaultPath = isOnboarded ? '/dashboard' : '/onboard'
        const redirectPath = next || defaultPath
        return NextResponse.redirect(`${requestUrl.origin}${redirectPath}`)
      }
    } catch (error) {
      console.error('Exception during code exchange:', error)
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=exception`)
    }
  }

  // Fallback URL to redirect to after sign in process completes
  return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
}
