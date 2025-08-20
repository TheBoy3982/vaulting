
'use client'
import { useState } from 'react'
import { getIdToken, onAuthStateChanged } from 'firebase/auth'
import { authClient } from '@/lib/firebaseClient'

export default function CheckoutButton({ productId }: { productId: string }){
  const [loading, setLoading] = useState(false)

  const go = async () => {
    const auth = authClient()
    const user = auth.currentUser
    if (!user) { window.location.href = '/login'; return }
    const token = await getIdToken(user, true)
    setLoading(true)
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ productId })
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    else setLoading(false)
  }

  return <button className="btn btn-primary" disabled={loading} onClick={go}>Buy Now</button>
}
