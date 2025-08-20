
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { adminAuth, adminDB } from '@/lib/firebaseAdmin'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' as any })

export async function POST(req: NextRequest){
  const auth = req.headers.get('authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) return NextResponse.json({ error: 'Login required' }, { status: 401 })
  let uid = ''
  try{
    const dec = await adminAuth.verifyIdToken(token)
    uid = dec.uid
  }catch{
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  const { productId } = await req.json()
  if (!productId) return NextResponse.json({ error: 'Missing productId' }, { status: 400 })

  const doc = await adminDB.collection('products').doc(productId).get()
  if (!doc.exists) return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  const product = doc.data() as any

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: product.title },
        unit_amount: product.priceCents
      },
      quantity: 1
    }],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/downloads?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`,
    metadata: { product_id: doc.id, user_id: uid }
  })

  return NextResponse.json({ url: session.url })
}
