
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { adminDB } from '@/lib/firebaseAdmin'

export async function POST(req: NextRequest){
  const sig = req.headers.get('stripe-signature') || ''
  const body = await req.text()
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' as any })
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const product_id = session.metadata?.product_id
    const user_id = session.metadata?.user_id
    if (product_id && user_id) {
      await adminDB.collection('purchases').add({
        userId: user_id,
        productId: product_id,
        stripeSessionId: session.id,
        createdAt: new Date()
      })
    }
  }
  return NextResponse.json({ received: true })
}
