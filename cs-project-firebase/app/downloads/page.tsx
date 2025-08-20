
import Link from 'next/link'
import { cookies } from 'next/headers'
import { adminAuth, adminDB } from '@/lib/firebaseAdmin'
import { headers } from 'next/headers'

export default async function Downloads(){
  // We can't read Firebase client auth here; offer login CTA and fetch purchases on the client would be another way.
  // Simpler: ask user to be logged in and fetch via an API route; for now we show CTA to login.
  return (
    <div className="card p-6">
      <h1 className="text-xl font-semibold mb-2">Your Downloads</h1>
      <p className="text-gray-400 mb-4">Please login to view your purchases.</p>
      <Link className="btn btn-primary" href="/login">Login</Link>
    </div>
  )
}
