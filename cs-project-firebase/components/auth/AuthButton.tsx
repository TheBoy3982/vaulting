
'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { authClient } from '@/lib/firebaseClient'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'

export function AuthButton(){
  const [user, setUser] = useState<User|null>(null)

  useEffect(() => {
    const auth = authClient()
    return onAuthStateChanged(auth, setUser)
  }, [])

  if (!user) return <Link href="/login" className="btn btn-primary">Login</Link>
  return <button className="btn" onClick={() => signOut(authClient())}>Logout</button>
}
