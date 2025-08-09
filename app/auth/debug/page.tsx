import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function AuthDebugPage() {
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
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )
  
  const { data: { session }, error } = await supabase.auth.getSession()
  
  // Debug cookie information
  const allCookies = cookieStore.getAll()
  const authCookies = allCookies.filter(cookie => cookie.name.startsWith('sb-'))
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Auth Debug Page</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Session Status</h2>
          <p><strong>Has Session:</strong> {session ? 'Yes' : 'No'}</p>
          {session && (
            <>
              <p><strong>User ID:</strong> {session.user.id}</p>
              <p><strong>Email:</strong> {session.user.email}</p>
              <p><strong>Provider:</strong> {session.user.app_metadata?.provider}</p>
              <p><strong>Expires At:</strong> {new Date(session.expires_at! * 1000).toLocaleString()}</p>
            </>
          )}
          {error && (
            <p className="text-red-600"><strong>Error:</strong> {error.message}</p>
          )}
        </div>
        
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Cookie Debug</h2>
          <p><strong>Total Cookies:</strong> {allCookies.length}</p>
          <p><strong>Auth Cookies:</strong> {authCookies.length}</p>
          {authCookies.length > 0 && (
            <div className="mt-2">
              <h3 className="font-semibold">Auth Cookie Names:</h3>
              <ul className="list-disc list-inside">
                {authCookies.map((cookie, index) => (
                  <li key={index}>
                    {cookie.name} ({cookie.value.length} chars)
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 space-x-4">
        <Link href="/auth/login" className="bg-blue-500 text-white px-4 py-2 rounded inline-block">Go to Login</Link>
        <Link href="/dashboard" className="bg-green-500 text-white px-4 py-2 rounded inline-block">Go to Dashboard</Link>
        <Link href="/" className="bg-gray-500 text-white px-4 py-2 rounded inline-block">Go Home</Link>
      </div>
    </div>
  )
}
