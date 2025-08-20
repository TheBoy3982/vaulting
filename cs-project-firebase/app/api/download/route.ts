
import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDB, adminBucket } from '@/lib/firebaseAdmin'

export async function POST(req: NextRequest){
  const form = await req.formData()
  const path = String(form.get('path') || '')
  if (!path) return NextResponse.json({ error: 'Missing path' }, { status: 400 })

  const auth = req.headers.get('authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  let uid = ''
  try { uid = (await adminAuth.verifyIdToken(token)).uid } catch { return NextResponse.json({ error: 'Invalid token' }, { status: 401 }) }

  // find product by file path
  const snap = await adminDB.collection('products').where('filePath', '==', path).limit(1).get()
  if (snap.empty) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const prodId = snap.docs[0].id

  // ensure user owns purchase
  const own = await adminDB.collection('purchases').where('userId','==',uid).where('productId','==',prodId).limit(1).get()
  if (own.empty) return NextResponse.json({ error: 'No access' }, { status: 403 })

  // sign download URL (valid 60s)
  const file = adminBucket.file(path)
  const [url] = await file.getSignedUrl({ action: 'read', expires: Date.now() + 60*1000 })
  return NextResponse.redirect(url)
}
