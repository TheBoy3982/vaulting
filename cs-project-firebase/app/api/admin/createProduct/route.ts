
import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDB } from '@/lib/firebaseAdmin'

export async function POST(req: NextRequest){
  const auth = req.headers.get('authorization') || ''
  const idToken = auth.startsWith('Bearer ') ? auth.slice(7) : null
  if (!idToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  let uid: string
  try{
    const decoded = await adminAuth.verifyIdToken(idToken)
    uid = decoded.uid
  }catch{
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  // simple admin check via profiles doc
  const prof = await adminDB.collection('profiles').doc(uid).get()
  if (!prof.exists || prof.data()?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }

  const body = await req.json()
  const { title, slug, description, priceCents, isPublished, imageUrl, filePath } = body
  if (!title || !slug || !description || !priceCents) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const doc = await adminDB.collection('products').add({
    title, slug, description,
    priceCents: Number(priceCents),
    isPublished: Boolean(isPublished),
    imageUrl: imageUrl || null,
    filePath: filePath || null,
    createdAt: new Date()
  })

  return NextResponse.json({ id: doc.id })
}
