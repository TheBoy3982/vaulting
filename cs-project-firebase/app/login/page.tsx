
'use client'
import { useEffect, useState } from 'react'
import { authClient } from '@/lib/firebaseClient'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import Link from 'next/link'

export default function Login(){
  const auth = authClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'signin'|'signup'>('signin')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => { if (u) setMsg('Logged in!') })
  }, [])

  const submit = async () => {
    setMsg('')
    try{
      if (mode === 'signup') await createUserWithEmailAndPassword(auth, email, password)
      else await signInWithEmailAndPassword(auth, email, password)
      setMsg('Success!')
    }catch(e:any){ setMsg(e.message) }
  }

  return (
    <div className="max-w-md mx-auto card p-6">
      <h1 className="text-xl font-semibold mb-2">{mode==='signup'? 'Create account' : 'Login'}</h1>
      <label className="label">Email</label>
      <input className="input mb-3" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
      <label className="label">Password</label>
      <input className="input mb-4" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <div className="flex items-center gap-2">
        <button className="btn btn-primary" onClick={submit}>{mode==='signup'? 'Sign up' : 'Sign in'}</button>
        <button className="btn" onClick={()=>setMode(mode==='signup'?'signin':'signup')}>
          {mode==='signup'?'Have an account? Sign in':'New here? Sign up'}
        </button>
      </div>
      {msg && <p className="text-sm text-gray-400 mt-3">{msg}</p>}
      <p className="text-sm text-gray-500 mt-4">Back to <Link className="underline" href="/">home</Link></p>
    </div>
  )
}
