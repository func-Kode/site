import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function AuthDebugPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session }, error } = await supabase.auth.getSession()
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Auth Debug Page</h1>
      <p><strong>Has Session:</strong> {session ? 'Yes' : 'No'}</p>
      {session && (
        <>
          <p><strong>User ID:</strong> {session.user.id}</p>
          <p><strong>Email:</strong> {session.user.email}</p>
          <p><strong>Provider:</strong> {session.user.app_metadata?.provider}</p>
          <p><strong>Expires At:</strong> {new Date(session.expires_at! * 1000).toLocaleString()}</p>
        </>
      )}
      {error && <p className="text-red-600">{error.message}</p>}
      <div className="mt-6 space-x-4">
        <Link href="/auth/login" className="bg-blue-500 text-white px-4 py-2 rounded inline-block">Login</Link>
        <Link href="/dashboard" className="bg-green-500 text-white px-4 py-2 rounded inline-block">Dashboard</Link>
        <Link href="/" className="bg-gray-500 text-white px-4 py-2 rounded inline-block">Go Home</Link>
      </div>
    </div>
  )
}
