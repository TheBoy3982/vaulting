
'use client'
import Link from 'next/link'
import { AuthButton } from './auth/AuthButton'

export default function Navbar(){
  return (
    <div className="flex items-center justify-between py-3">
      <Link href="/" className="flex items-center gap-2 font-semibold">
        <span className="inline-block w-3 h-3 rounded-full"
              style={{background:"radial-gradient(circle at 30% 30%, #7c87ff, #60e1ff)"}} />
        OnePage <span className="text-gray-400">Shop</span>
      </Link>
      <div className="flex items-center gap-3">
        <Link className="btn" href="/products">Products</Link>
        <Link className="btn" href="/downloads">My Downloads</Link>
        <Link className="btn" href="/admin">Admin</Link>
        <AuthButton />
      </div>
    </div>
  )
}
